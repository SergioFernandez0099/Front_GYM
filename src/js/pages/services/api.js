const API_BASE = import.meta.env.VITE_API_BASE;

const EXERCISES_CACHE_TTL = 40000; // 40 seg
let exercisesCache = null;
let exercisesCacheTimestamp = 0;

// GETs

export async function fetchExercises() {
    const now = Date.now();

    // Retornar cache si aún es válido
    if (exercisesCache && (now - exercisesCacheTimestamp < EXERCISES_CACHE_TTL)) {
        return exercisesCache;
    }

    // Fetch desde la API
    try {
        const response = await fetch(`${API_BASE}/exercises`);
        if (!response.ok) throw new Error(`Error al obtener los ejercicios: ${response.statusText}`);

        const data = await response.json();

        console.log("Ejercicios")
        // Guardar en cache
        exercisesCache = data;
        exercisesCacheTimestamp = now;

        return data;
    } catch (error) {
        console.error(error);

        // fallback: retornar cache aunque esté stale
        if (exercisesCache) return exercisesCache;

        return [];
    }
}

export async function fetchMuscleGroups() {
  try {
    const response = await fetch(`${API_BASE}/muscleGroups`);
    if (!response.ok)
      throw new Error(
        `Error al obtener los grupos musculares: ${response.statusText}`
      );
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchRoutineSets(userId, routineId) {
  try {
    const response = await fetch(
      `${API_BASE}/users/${userId}/routines/${routineId}/sets`
    );
    if (!response.ok)
      throw new Error(`Error al obtener los sets: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchRoutineDays(userId) {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}/routines`);
    if (!response.ok)
      throw new Error(`Error al obtener los días: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return []; // retornar array vacío en caso de error
  }
}

// POSTs

export async function createRoutine(userId, routineData) {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}/routines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(routineData), // { name }
    });
    if (!response.ok)
      throw new Error(`Error al crear rutina: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createRoutineSet(userId, routineId, setData) {
  try {
    const response = await fetch(
      `${API_BASE}/users/${userId}/routines/${routineId}/sets`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setData), // { exerciseId, series, repetitions, description }
      }
    );
    if (!response.ok)
      throw new Error(`Error al crear set: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// PUTs

export async function updateRoutine(userId, routineId, updatedData) {
  try {
    const response = await fetch(
      `${API_BASE}/users/${userId}/routines/${routineId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData), // { name?, description? }
      }
    );
    if (!response.ok)
      throw new Error(`Error al actualizar rutina: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Actualizar un set
export async function updateRoutineSet(userId, routineId, setId, updatedData) {
  try {
    const response = await fetch(
      `${API_BASE}/users/${userId}/routines/${routineId}/sets/${setId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData), // { series?, repetitions?, description?, exerciseId? }
      }
    );
    if (!response.ok)
      throw new Error(`Error al actualizar set: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// DELETEs

export async function deleteRoutine(userId, routineId) {
  try {
    const response = await fetch(
      `${API_BASE}/users/${userId}/routines/${routineId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok)
      throw new Error(`Error al eliminar rutina: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Eliminar un set
export async function deleteRoutineSet(userId, routineId, setId) {
  try {
    const response = await fetch(
      `${API_BASE}/users/${userId}/routines/${routineId}/sets/${setId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok)
      throw new Error(`Error al eliminar set: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
