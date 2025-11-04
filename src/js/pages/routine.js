import { applyCSS } from "../../utils/helpers";
import {
  openEditableRoutineCard,
  RoutineDayCard,
} from "../components/routine-day-card";

const routine = ["Pecho", "Espalda", "Cuádriceps", "Isquios"];

export function Routine() {
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

  routine.forEach((day) => {
    routineList.appendChild(RoutineDayCard(day));
  });

  const addArticle = RoutineDayCard("add");
  routineList.appendChild(addArticle);

  addArticle.addEventListener("click", () => {
    const newArticle = RoutineDayCard("Nuevo");
    routineList.insertBefore(newArticle, addArticle);
    openEditableRoutineCard(newArticle);
  });

  routineContainer.appendChild(section);

  return routineContainer;
}
