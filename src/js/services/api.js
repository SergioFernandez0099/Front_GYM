import {
    clearCurrentUserId,
    getCurrentUserId,
    getForceNoCache,
    setConnected,
    setCurrentUserId,
    setForceNoCache,
} from "../store.js";
import {safeNavigate} from "../router.js";

const API_BASE = import.meta.env.VITE_API_BASE;
const CACHE_TTL = 40000; // 40 seg

let exercisesCache = null;
let exercisesCacheTimestamp = 0;

let muscleGroupsCache = null;
let muscleGroupsCacheTimestamp = 0;

// Cache para sesiones de entrenamiento
let trainingSessionsCache = null;
let trainingSessionsCacheTimestamp = 0;

// Cache para sesiones individuales
const trainingSessionCache = new Map(); // key: sessionId, value: { data, timestamp }

// Cache para rutinas
let routineDaysCache = null;
let routineDaysCacheTimestamp = 0;

// Cache para sets de rutinas individuales
const routineSetsCache = new Map(); // key: routineId, value: { data, timestamp }

export async function login(name, pin) {
    try {
        const result = await fetchSend("/auth/login", "POST", {
            name: name,
            pin: pin,
        });
        setCurrentUserId(result.user.id);

        return result;
    } catch (error) {
        console.error("Login fallido:", error);
        throw error;
    }
}

export async function logout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

    } catch (error) {
        console.warn("Error en logout: ", error);
        throw error;
    } finally {
        clearCurrentUserId();
        safeNavigate("login");
    }
}


// Función helper para peticiones GET con cookie
async function fetchGet(path) {
    try {
        const result = await fetch(`${API_BASE}${path}`, {
            credentials: "include",
        });

        await handleAuthError(result);

        if (!result.ok) {
            const errorBody = await result.json().catch(() => null);
            throw {
                status: result.status,
                body: errorBody,
            }
        }
        return (await result.json()).message;
    } catch (error) {
        // Error de red: servidor caído, ERR_CONNECTION_REFUSED, etc.
        setConnected(false);
        throw error;
    }
}

// Función helper para POST/PUT/PATCH con cookie
async function fetchSend(path, method, body) {
    try {
        const result = await fetch(`${API_BASE}${path}`, {
            method,
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify(body),
        });

        await handleAuthError(result);

        if (!result.ok) {
            const errorBody = await result.json().catch(() => null);
            throw {
                status: result.status,
                body: errorBody,
            }
        }

        return (await result.json()).message;
    } catch (error) {
        setConnected(false);
        throw error;
    }
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
        return exercisesCache || [];
    }
}

export async function fetchMuscleGroups() {
    const now = Date.now();
    const force = getForceNoCache();

    if (force) {
        muscleGroupsCache = null;
        muscleGroupsCacheTimestamp = 0;
    }

    if (
        !force &&
        muscleGroupsCache &&
        now - muscleGroupsCacheTimestamp < CACHE_TTL
    ) {
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
        throw new Error("")

        // return muscleGroupsCache || [];
    }
}

export async function fetchTrainingSessions() {
    const now = Date.now();
    const force = getForceNoCache();

    if (force) {
        trainingSessionsCache = null;
        trainingSessionsCacheTimestamp = 0;
    }

    if (!force && trainingSessionsCache && now - trainingSessionsCacheTimestamp < CACHE_TTL) {
        return trainingSessionsCache;
    }

    try {
        const data = await fetchGet(`/users/${getCurrentUserId()}/sessions`);
        trainingSessionsCache = data;
        trainingSessionsCacheTimestamp = now;
        setForceNoCache(false);
        return data;
    } catch (error) {
        console.error(error);
        return trainingSessionsCache || [];
    }
}


export async function fetchTrainingSession(sessionId) {
    const now = Date.now();
    const force = getForceNoCache();

    if (force) {
        trainingSessionCache.delete(sessionId);
    }

    const cached = trainingSessionCache.get(sessionId);
    if (!force && cached && now - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    try {
        const data = await fetchGet(`/users/${getCurrentUserId()}/sessions/${sessionId}`);
        trainingSessionCache.set(sessionId, {data, timestamp: now});
        setForceNoCache(false);
        return data;
    } catch (error) {
        console.error(error);
        return cached?.data || null;
    }
}

export async function fetchRoutineDays() {
    const now = Date.now();
    const force = getForceNoCache();

    if (force) {
        routineDaysCache = null;
        routineDaysCacheTimestamp = 0;
    }

    if (!force && routineDaysCache && now - routineDaysCacheTimestamp < CACHE_TTL) {
        return routineDaysCache;
    }

    try {
        const data = await fetchGet(`/users/${getCurrentUserId()}/routines`);
        routineDaysCache = data;
        routineDaysCacheTimestamp = now;
        setForceNoCache(false);
        return data;
    } catch (error) {
        console.error(error);
        return routineDaysCache || [];
    }
}

export async function fetchRoutineSets(routineId) {
    const now = Date.now();
    const force = getForceNoCache();

    if (force) {
        routineSetsCache.delete(routineId);
    }

    const cached = routineSetsCache.get(routineId);
    if (!force && cached && now - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    try {
        const data = await fetchGet(`/users/${getCurrentUserId()}/routines/${routineId}/sets`);
        routineSetsCache.set(routineId, {data, timestamp: now});
        setForceNoCache(false);
        return data;
    } catch (error) {
        console.error(error);
        return cached?.data || [];
    }
}

// ---------------------
// POSTs, PUTs, DELETEs, PATCHs
// ---------------------

export async function createRoutine(routineData) {
    return await fetchSend(`/users/${getCurrentUserId()}/routines`, "POST", routineData);
}

export async function createRoutineSet(routineId, setData) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/routines/${routineId}/sets`,
        "POST",
        setData
    );
}

export async function updateRoutine(routineId, updatedData) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/routines/${routineId}`,
        "PATCH",
        updatedData
    );
}

export async function updateRoutineSet(routineId, setId, updatedData) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/routines/${routineId}/sets/${setId}`,
        "PATCH",
        updatedData
    );
}

export async function deleteRoutine(routineId) {
    return await fetchSend(`/users/${getCurrentUserId()}/routines/${routineId}`, "DELETE");
}

export async function deleteRoutineSet(routineId, setId) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/routines/${routineId}/sets/${setId}`,
        "DELETE"
    );
}

export async function createTrainingSession(setData) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/sessions`,
        "POST",
        setData
    );
}

export async function deleteTrainingSession(sessionId) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/sessions/${sessionId}`,
        "DELETE",
    );
}

export async function createTrainingSessionExercise(sessionId, setData) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/sessions/${sessionId}/exercises`,
        "POST",
        setData
    );
}

export async function deleteTrainingSessionExercise(sessionId, exerciseInSessionId) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/sessions/${sessionId}/exercises/${exerciseInSessionId}`,
        "DELETE",
    );
}

export async function createTrainingSessionSerie(sessionId, exerciseInSessionId) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/sessions/${sessionId}/exercises/${exerciseInSessionId}/series`,
        "POST"
    );
}

export async function updateTrainingSession(sessionId, exerciseInSessionId, uptData) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/sessions/${sessionId}/exercises/${exerciseInSessionId}`,
        "PATCH",
        uptData
    );
}

export async function updateTrainingSessionExerciseOrder(sessionId, uptData) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/sessions/${sessionId}/exercises/order`,
        "PATCH",
        uptData
    );
}


export async function deleteTrainingSessionSerie(sessionId, exerciseInSessionId, serieId) {
    return await fetchSend(
        `/users/${getCurrentUserId()}/sessions/${sessionId}/exercises/${exerciseInSessionId}/series/${serieId}`,
        "DELETE",
    );
}

// Funciones

export async function validateToken() {
    try {
        const result = await fetch(`${API_BASE}/auth/validate`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        });

        if (!result.ok) return false; // token inválid

        return await result.json();
    } catch (error) {
        console.error("Error validando token:", error);
        return false;
    }
}

async function handleAuthError(res) {
    if (res.status === 401 || res.status === 403) {
        console.warn("Sesión expirada o no autorizada. Redirigiendo al login...");
        clearCurrentUserId();
        safeNavigate("error");
        throw new Error("No autorizado");
    }
}


