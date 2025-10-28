import { applyCSS } from "../../utils/helpers";
import { RoutineSetCard } from "../components/routine-set-card";

const defaultSet = [
  { name: "Press banca", series: 3, reps: 12 },
  { name: "Press inclinado", series: 3, reps: 10 },
  { name: "Press militar", series: 3, reps: 10 },
  { name: "Elevaciones laterales", series: 3, reps: 10 },
  { name: "Fondos de tríceps", series: 3, reps: 8 },
  { name: "Extensión de tríceps", series: 3, reps: 10 },
];

export function RoutineSet(set = defaultSet) {

  const routineSetContainer = document.createElement("div");
  routineSetContainer.className = "routine-container";

  // const filtersContainer = document.createElement("div");
  // filtersContainer.className = "filters-container";

  // filters.forEach((f) => {
  //   const p = document.createElement("p");
  //   p.className = "filter";
  //   p.textContent = f.name;
  //   p.dataset.muscle = f.value;

  //   p.addEventListener("click", () => {
  //     // quitar active de todos
  //     filtersContainer
  //       .querySelectorAll(".filter")
  //       .forEach((f2) => f2.classList.remove("active"));
  //     // añadir active al pulsado
  //     p.classList.add("active");

  //     // Acción específica
  //     handleFilter(f.value);
  //   });

  //   filtersContainer.appendChild(p);
  // });

  // exercisesContainer.appendChild(filtersContainer);

  const section = document.createElement("section");
  section.className = "routine-list-container";

  const exerciseList = document.createElement("div");
  exerciseList.className = "routine-list";

  section.appendChild(exerciseList);

  set.forEach((exercise) => {
    exerciseList.appendChild(RoutineSetCard(exercise));
  });
    exerciseList.appendChild(RoutineSetCard("add"));
  

  routineSetContainer.appendChild(section);

  return routineSetContainer;
}
