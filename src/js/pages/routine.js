import { applyCSS } from "../../utils/helpers";
import { RoutineDayCard, attachRoutineDayCardEvents, handleAddRoutine } from "../components/routine-day-card";
import { getCurrentUserId } from "../store";
import { fetchRoutineDays } from "./services/api";

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

    const userId = getCurrentUserId();
    if (!userId) {
        routineList.textContent = "Usuario no logueado";
        return routineContainer;
    }

    try {
        const routineDays = await fetchRoutineDays(userId);
        const fragment = document.createDocumentFragment();

        routineDays.forEach(day => {
            const dayCard = RoutineDayCard(day);
            attachRoutineDayCardEvents(dayCard, day);
            fragment.appendChild(dayCard);
        });

        routineList.appendChild(fragment);
    } catch (error) {
        console.error("Error cargando rutinas:", error);
        routineList.textContent = "No se pudieron cargar las rutinas.";
    }

    const addCard = RoutineDayCard("add");
    addCard.addEventListener("click", () => handleAddRoutine(routineList));
    routineList.appendChild(addCard);

    return routineContainer;
}
