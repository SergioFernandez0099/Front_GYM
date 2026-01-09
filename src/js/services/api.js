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
    }catch(error) {
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

// ---------------------
// GETs sin cache para rutinas
// ---------------------

export async function fetchRoutineSets(routineId) {
    return await fetchGet(`/users/${getCurrentUserId()}/routines/${routineId}/sets`);
}

export async function fetchRoutineDays() {
    return await fetchGet(`/users/${getCurrentUserId()}/routines`);
}

async function handleAuthError(res) {
    if (res.status === 401 || res.status === 403) {
        console.warn("Sesión expirada o no autorizada. Redirigiendo al login...");
        clearCurrentUserId();
        safeNavigate("error");
        throw new Error("No autorizado");
    }
}

// ---------------------
// GETs sin cache para sesiones de entrenamiento
// ---------------------

export async function fetchTrainingSessions() {
    return await fetchGet(`/users/${getCurrentUserId()}/sessions`);
}

export async function fetchTrainingSession(sessionId) {
    return await fetchGet(`/users/${getCurrentUserId()}/sessions/${sessionId}`);
}


