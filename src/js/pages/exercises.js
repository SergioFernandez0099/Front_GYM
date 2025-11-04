import { applyCSS } from "../../utils/helpers";
import { ExerciseCard } from "../components/exercise-card";

const filters = [
  { name: "Pecho", value: "pecho" },
  { name: "Espalda", value: "espalda" },
  { name: "Hombro", value: "hombro" },
  { name: "Bíceps", value: "biceps" },
  { name: "Tríceps", value: "triceps" },
  { name: "Cuádriceps", value: "cuadriceps" },
  { name: "Isquios", value: "isquios" },
  { name: "Glúteo", value: "gluteo" },
  { name: "Gemelo", value: "gemelo" },
  { name: "Adductor", value: "adductor" },
  { name: "Abductor", value: "abductor" },
  { name: "Abdomen", value: "abdomen" },
];

export function Exercises() {
  applyCSS(
    "/src/styles/exercises.css",
    "/src/styles/components/exercise-card.css"
  );

  const exercisesContainer = document.createElement("div");
  exercisesContainer.className = "exercises-container";

  const filtersContainer = document.createElement("div");
  filtersContainer.className = "filters-container";

  filters.forEach((f) => {
    const p = document.createElement("p");
    p.className = "filter";
    p.textContent = f.name;
    p.dataset.muscle = f.value;

    p.addEventListener("click", () => {
      // quitar active de todos
      filtersContainer
        .querySelectorAll(".filter")
        .forEach((f2) => f2.classList.remove("active"));
      // añadir active al pulsado
      p.classList.add("active");

      // Acción específica
      handleFilter(f.value);
    });

    filtersContainer.appendChild(p);
  });

  exercisesContainer.appendChild(filtersContainer);

  const section = document.createElement("section");
  section.className = "exercise-list-container";

  const exerciseList = document.createElement("div");
  exerciseList.className = "exercise-list";

  section.appendChild(exerciseList);

  exerciseList.appendChild(ExerciseCard());
  exerciseList.appendChild(ExerciseCard());
  exerciseList.appendChild(ExerciseCard());
  exerciseList.appendChild(ExerciseCard());
  exerciseList.appendChild(ExerciseCard());
  exerciseList.appendChild(ExerciseCard());
  exerciseList.appendChild(ExerciseCard());
  exerciseList.appendChild(ExerciseCard());
  exerciseList.appendChild(ExerciseCard());
  exerciseList.appendChild(ExerciseCard());

  exercisesContainer.appendChild(section);

  function checkScroll() {
    setTimeout(() => {
      if (filtersContainer.scrollWidth <= filtersContainer.clientWidth) {
        filtersContainer.classList.add("no-scroll");
      } else {
        filtersContainer.classList.remove("no-scroll");
      }
    }, 100);
  }
  // Espera al siguiente frame para medir correctamente
  requestAnimationFrame(checkScroll);
  window.addEventListener("resize", checkScroll);
  window.addEventListener("load", checkScroll);

  return exercisesContainer;
}
