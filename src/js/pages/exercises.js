import {applyCSS} from "../../utils/helpers";
import {ExerciseCard} from "../components/exercise-card";
import {fetchExercises, fetchMuscleGroups} from "./services/api";

const filters = [
    {name: "Pecho", value: "pecho"},
    {name: "Espalda", value: "espalda"},
    {name: "Hombro", value: "hombro"},
    {name: "Bíceps", value: "biceps"},
    {name: "Tríceps", value: "triceps"},
    {name: "Cuádriceps", value: "cuadriceps"},
    {name: "Isquios", value: "isquios"},
    {name: "Glúteo", value: "gluteo"},
    {name: "Gemelo", value: "gemelo"},
    {name: "Adductor", value: "adductor"},
    {name: "Abductor", value: "abductor"},
    {name: "Abdomen", value: "abdomen"},
];

export async function Exercises() {
    applyCSS(
        "/src/styles/exercises.css",
        "/src/styles/components/exercise-card.css"
    );

    const exercisesContainer = document.createElement("div");
    exercisesContainer.className = "exercises-container";

    const filtersContainer = document.createElement("div");
    filtersContainer.className = "filters-container";

    const muscleGroupsData = await fetchMuscleGroups();

    muscleGroupsData.forEach((muscleGroup) => {
        const p = document.createElement("p");
        p.className = "filter";
        p.textContent = muscleGroup.name;

        p.addEventListener("click", () => {
            const isActive = p.classList.contains("active");

            // quitar active de todos
            filtersContainer
                .querySelectorAll(".filter")
                .forEach((filter) => filter.classList.remove("active"));
            if (!isActive) {
                // añadir active solo si no estaba activo antes
                p.classList.add("active");
                handleFilter(muscleGroup.name);
            } else {
                // si ya estaba activo, mostramos todos
                handleFilter("Todos");
            }
        });
        filtersContainer.appendChild(p);
    });

    exercisesContainer.appendChild(filtersContainer);

    const section = document.createElement("section");
    section.className = "exercise-list-container";

    const exerciseList = document.createElement("div");
    exerciseList.className = "exercise-list";

    section.appendChild(exerciseList);

    const exercisesData = await fetchExercises();

    exercisesData.forEach((exercise) => {
        exerciseList.appendChild(ExerciseCard(exercise));
    });

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

function handleFilter(muscleGroup) {
    const exerciseCards = document.querySelectorAll(".exercise-card");
    exerciseCards.forEach((card) => {
        const cardMuscleGroup = card.getAttribute("data-muscle-group");
        if (muscleGroup === "Todos" || cardMuscleGroup === muscleGroup) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}
