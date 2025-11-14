import {
  clearCurrentUserId,
  getCurrentUserId,
  getForceNoCache,
  setCurrentUserId,
  setForceNoCache,
} from "../../store.js";
import { safeNavigate } from "../../router.js";

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
      pin: pin,
    });

    setCurrentUserId(data.user.id);
    console.log("login success");
    console.log(getCurrentUserId());

    return data;
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
  } catch (err) {
    console.warn("Error en logout (probablemente sin endpoint):", err);
  } finally {
    clearCurrentUserId();
    safeNavigate("login");
  }
}

export async function validateToken() {
  try {
    const res = await fetch(`${API_BASE}/auth/validate`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return false; // token inválid

    return await res.json();
  } catch (err) {
    console.error("Error validando token:", err);
    return false;
  }
}

// Función helper para peticiones GET con cookie
async function fetchGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
  });

  await handleAuthError(res);

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error al obtener ${path}`);
  return data;
}

// Función helper para POST/PUT con cookie
async function fetchSend(path, method, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  await handleAuthError(res);

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
    if (muscleGroupsCache) return muscleGroupsCache;
    return [];
  }
}

// ---------------------
// POSTs, PUTs, DELETEs
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
    "PUT",
    updatedData
  );
}

export async function updateRoutineSet(routineId, setId, updatedData) {
  return await fetchSend(
    `/users/${getCurrentUserId()}/routines/${routineId}/sets/${setId}`,
    "PUT",
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
    safeNavigate("login");
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

