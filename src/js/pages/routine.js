import {attachRoutineDayCardEvents, handleAddRoutine, RoutineDayCard} from "../components/routine-day-card";
import {fetchRoutineDays} from "../services/api";
import {showSnackbar} from "../components/snackbar.js";
import {safeNavigate} from "../router.js";

let routineDays;

export async function Routine() {

    const routineContainer = document.createElement("div");
    routineContainer.className = "routine-container";

    const section = document.createElement("section");
    section.className = "routine-list-container";

    const routineList = document.createElement("div");
    routineList.className = "routine-list";

    section.appendChild(routineList);
    routineContainer.appendChild(section);

    try {
        routineDays = await fetchRoutineDays();
        const fragment = document.createDocumentFragment();

        routineDays.forEach(day => {
            const dayCard = RoutineDayCard(day);
            attachRoutineDayCardEvents(dayCard, day);
            fragment.appendChild(dayCard);
        });

        routineList.appendChild(fragment);
    } catch (error) {
        showSnackbar("error", "Error cargando rutinas");
        safeNavigate("/error");
        return null;
    }

    const addCard = RoutineDayCard("add");
    addCard.addEventListener("click", () => handleAddRoutine(routineList));
    routineList.appendChild(addCard);

    return routineContainer;
}

export function getRoutineDays() {
    return routineDays
}

export function getRoutineDay(id) {
    return routineDays.find(day => day.id === Number(id));
}