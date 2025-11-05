const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchExercises() {
  try {
    const response = await fetch(`${API_BASE}/exercises`);
    if (!response.ok) {
      throw new Error(`Error al obtener los ejercicios: ${response.statusText}`);
    }
    const data = await response.json();
    return data; // devuelve un array de sets
  } catch (error) {
    console.error(error);
    return []; // retornar array vacío en caso de error
  }
}

export async function fetchRoutineSets(userId, routineId) {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}/routines/${routineId}`);
    if (!response.ok) {
      throw new Error(`Error al obtener los sets: ${response.statusText}`);
    }
    const data = await response.json();
    return data; // devuelve un array de sets
  } catch (error) {
    console.error(error);
    return []; // retornar array vacío en caso de error
  }
}

export async function fetchRoutineDays(userId) {
  try {
  const response = await fetch(`${API_BASE}/users/${userId}/routines`);
    if (!response.ok) {
      throw new Error(`Error al obtener los días: ${response.statusText}`);
    }
    const data = await response.json();
    
    return data; // devuelve un array de sets
  } catch (error) {
    console.error(error);
    return []; // retornar array vacío en caso de error
  }
}