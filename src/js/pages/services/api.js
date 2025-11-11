import {getCurrentUserId, getForceNoCache, setCurrentUserId, setForceNoCache} from "../../store.js";

const API_BASE = import.meta.env.VITE_API_BASE;
const CACHE_TTL = 40000; // 40 seg

let exercisesCache = null;
let exercisesCacheTimestamp = 0;

let muscleGroupsCache = null;
let muscleGroupsCacheTimestamp = 0;

export async function login(name, pin) {
    try {
        const data = await fetchSend("/auth/login", "POST", {
            name: name,
            pin: pin
        });


        setCurrentUserId(data.user.id);
        console.log("login success");
        console.log(getCurrentUserId())

        // Guardamos los datos en el store
        // setUser(data); // data puede ser { user, token } o como lo devuelva tu backend

        return data;
    } catch (error) {
        console.error("Login fallido:", error);
        throw error; // lanzar error para que lo manejes en la UI
    }
}

// Función helper para peticiones GET con cookie
async function fetchGet(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: "include", // ✅ envía cookie HttpOnly automáticamente
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Error al obtener ${path}`);
    return data;
}

// Función helper para POST/PUT con cookie
async function fetchSend(path, method, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Error en ${method} ${path}`);
    return data;
}

// ---------------------
// GETs con cache
// ---------------------

export async function fetchExercises() {
    const now = Date.now();
    const force = getForceNoCache();

    if (force) {
        exercisesCache = null;
        exercisesCacheTimestamp = 0;
    }

    if (!force && exercisesCache && now - exercisesCacheTimestamp < CACHE_TTL) {
        return exercisesCache;
    }

    try {
        const data = await fetchGet("/exercises");
        exercisesCache = data;
        exercisesCacheTimestamp = now;
        setForceNoCache(false);
        return data;
    } catch (error) {
        console.error(error);
        if (exercisesCache) return exercisesCache;
        return [];
    }
}

export async function fetchMuscleGroups() {
    const now = Date.now();
    const force = getForceNoCache();

    if (force) {
        muscleGroupsCache = null;
        muscleGroupsCacheTimestamp = 0;
    }

    if (!force && muscleGroupsCache && now - muscleGroupsCacheTimestamp < CACHE_TTL) {
        return muscleGroupsCache;
    }

    try {
        const data = await fetchGet("/muscleGroups");
        muscleGroupsCache = data;
        muscleGroupsCacheTimestamp = now;
        setForceNoCache(false);
        return data;
    } catch (error) {
        console.error(error);
        if (muscleGroupsCache) return muscleGroupsCache;
        return [];
    }
}

// ---------------------
// POSTs, PUTs, DELETEs
// ---------------------

export async function createRoutine(userId, routineData) {
    return await fetchSend(`/users/${userId}/routines`, "POST", routineData);
}

export async function createRoutineSet(userId, routineId, setData) {
    return await fetchSend(
        `/users/${userId}/routines/${routineId}/sets`,
        "POST",
        setData
    );
}

export async function updateRoutine(userId, routineId, updatedData) {
    return await fetchSend(
        `/users/${userId}/routines/${routineId}`,
        "PUT",
        updatedData
    );
}

export async function updateRoutineSet(userId, routineId, setId, updatedData) {
    return await fetchSend(
        `/users/${userId}/routines/${routineId}/sets/${setId}`,
        "PUT",
        updatedData
    );
}

export async function deleteRoutine(userId, routineId) {
    return await fetchSend(`/users/${userId}/routines/${routineId}`, "DELETE");
}

export async function deleteRoutineSet(userId, routineId, setId) {
    return await fetchSend(
        `/users/${userId}/routines/${routineId}/sets/${setId}`,
        "DELETE"
    );
}

// ---------------------
// GETs sin cache para rutinas
// ---------------------

export async function fetchRoutineSets(userId, routineId) {
    return await fetchGet(`/users/${userId}/routines/${routineId}/sets`);
}

export async function fetchRoutineDays(userId) {
    return await fetchGet(`/users/${userId}/routines`);
}
