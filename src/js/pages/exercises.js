import {adjustAppHeight} from "../../utils/helpers";
import {ExerciseCard} from "../components/exercise-card";
import {fetchExercises, fetchMuscleGroups} from "../services/api";
import {showSnackbar} from "../components/snackbar.js";
import {safeNavigate} from "../router.js";

export async function Exercises() {

    const exercisesContainer = document.createElement("div");
    exercisesContainer.className = "exercises-container";

    const filtersContainer = document.createElement("div");
    filtersContainer.className = "filters-container";

    let exercisesData;
    let muscleGroupsData;
    try {
        muscleGroupsData = await fetchMuscleGroups();
        exercisesData = await fetchExercises();
    } catch (error) {
        showSnackbar("error", "Error al cargar los ejercicios")
        safeNavigate("/error");
        return null;
    }

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

    // Evento para que cuando se llegue al final del scroll haga scroll en el body
    exerciseList.addEventListener('wheel', (event) => {
        // importante: este listener debe registrarse con { passive: false } (ver abajo)
        if (event.ctrlKey || event.metaKey) return;

        const scrollTop = exerciseList.scrollTop;
        const scrollHeight = exerciseList.scrollHeight;
        const clientHeight = exerciseList.clientHeight;

        const atTop = scrollTop <= 0;
        const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1; // tolerancia 1px

        // Si estamos en el límite y el usuario sigue intentando scrollear en esa dirección,
        // prevenimos el comportamiento por defecto y aplicamos scroll al documento.
        if ((atBottom && event.deltaY > 0) || (atTop && event.deltaY < 0)) {
            event.preventDefault(); // necesita listener non-passive
            // usa scrollingElement para compatibilidad (document.documentElement o body)
            const doc = document.scrollingElement || document.documentElement || document.body;
            // mueve el documento por deltaY (puedes cambiar behavior a 'auto' si prefieres)
            doc.scrollBy({
                top: event.deltaY,
                left: 0,
                behavior: 'auto'
            });
        }
    }, {passive: false});

    section.appendChild(exerciseList);

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
    let firstVisibleCard = null;

    exerciseCards.forEach((card) => {
        const cardMuscleGroup = card.getAttribute("data-muscle-group");
        if (muscleGroup === "Todos" || cardMuscleGroup === muscleGroup) {
            card.style.display = "flex";

            if (!firstVisibleCard) {
                firstVisibleCard = card;
            }
        } else {
            card.style.display = "none";
        }
    });

    if (firstVisibleCard) {
        firstVisibleCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
    adjustAppHeight();
}
