import { applyCSS } from "../../utils/helpers";
import { RoutineDayCard } from "../components/routine-day-card";

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

  const filtersContainer = document.createElement("div");
  filtersContainer.className = "filters-container";

  routineContainer.appendChild(filtersContainer);

  const section = document.createElement("section");
  section.className = "routine-list-container";

  const routineList = document.createElement("div");
  routineList.className = "routine-list";

  section.appendChild(routineList);

  routine.forEach((day) => {
    routineList.appendChild(RoutineDayCard(day));
  });
  routineList.appendChild(RoutineDayCard("add"));

  routineContainer.appendChild(section);

  return routineContainer;
}
