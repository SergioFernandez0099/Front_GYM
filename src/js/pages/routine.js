import { applyCSS } from "../../utils/helpers";
import {
  openEditableRoutineCard,
  RoutineDayCard,
} from "../components/routine-day-card";
import { getCurrentUserId } from "../store";
import { fetchRoutineDays } from "./services/api"; // asegúrate de la ruta correcta
// import { getCurrentUserId } from "../../utils/auth"; // si usas JWT

export async function Routine() {
  applyCSS(
    "/src/styles/routine.css",
    "/src/styles/components/routine-day-card.css",
    "/src/styles/components/routine-set-card.css",
    "/src/styles/components/routine-form.css"
  );

  const routineContainer = document.createElement("div");
  routineContainer.className = "routine-container";

  const section = document.createElement("section");
  section.className = "routine-list-container";

  const routineList = document.createElement("div");
  routineList.className = "routine-list";

  section.appendChild(routineList);
  routineContainer.appendChild(section);

  // 🔹 Obtener userId
  const userId = getCurrentUserId();
  if (!userId) {
    routineList.textContent = "Usuario no logueado";
    return routineContainer;
  }

  try {
    // 🔹 Traer rutinas desde la API
    const routineDays = await fetchRoutineDays(userId);

    // 🔹 Renderizar cada rutina
    routineDays.forEach((day) => {
      routineList.appendChild(RoutineDayCard(day)); // asumiendo que tu API devuelve { id, name }
    });
  } catch (error) {
    console.error("Error cargando rutinas:", error);
    routineList.textContent = "No se pudieron cargar las rutinas.";
  }

  // 🔹 Botón para añadir nueva rutina
  const addArticle = RoutineDayCard("add");
  addArticle.addEventListener("click", () => {
    const existingNewDay = routineList.querySelector("[data-new-day]");

    if (existingNewDay) {
      existingNewDay.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    const newArticle = RoutineDayCard("new");
    routineList.insertBefore(newArticle, addArticle);
    openEditableRoutineCard(newArticle);
  });
  routineList.appendChild(addArticle);

  // await new Promise((resolve) => setTimeout(resolve, 4000));

  return routineContainer;
}
