import {getEditingCard, RoutineSetCard,} from "../components/routine-set-card";
import {fetchRoutineSets} from "../services/api";
import {showSnackbar} from "../components/snackbar.js";
import {safeNavigate} from "../router.js";
import {createExerciseSort} from "../modals/exercise-sort.js";
import {shakeEffect} from "../../utils/helpers.js";

let setData = []

export async function RoutineSet(routineId) {
    const routineSetContainer = document.createElement("div");
    routineSetContainer.className = "routine-container";

    const orderButton = document.createElement("button");
    orderButton.className = "train-sess-card-general-options-list";
    orderButton.innerHTML = `
        <img src="/icons/list.svg" alt="Icono de listado" class="orderIcon">
        Ordenar ejercicios
    `;

    routineSetContainer.appendChild(orderButton);


    const section = document.createElement("section");
    section.className = "routine-list-container";

    const routineList = document.createElement("div");
    routineList.className = "routine-list";
    routineList.style.gridTemplateColumns = "repeat(auto-fill, minmax(19rem, 1fr))";
    section.appendChild(routineList);

    routineSetContainer.appendChild(section);

    let exercisesSort;
    try {
        setData = await fetchRoutineSets(routineId);
        const exercisesData = setData.map(item => item.exercise)
        if (exercisesData.length !== 0) {
            exercisesSort = createExerciseSort(exercisesData, routineId)
        }
    } catch (error) {
        showSnackbar("error", "Error al cargar los sets");
        safeNavigate("/error");
        return null;
    }

    // Si tienes muchos sets y quieres crearlos todos en paralelo (sin esperar uno por uno):
    const cards = await Promise.all(setData.map(set => RoutineSetCard(set, routineId)));
    cards.forEach(card => routineList.appendChild(card));

    // Solo las add son asincronas
    const addArticle = await RoutineSetCard("add", routineId);

    const addArticleButton = addArticle.querySelector(".addButton");

    routineList.appendChild(addArticle);

    addArticleButton.addEventListener("click", async () => {
        const existingNewSet = routineList.querySelector("[data-new-set]");
        if (existingNewSet) {
            existingNewSet.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            return;
        }

        const editingSet = getEditingCard()
        if (editingSet) {
            editingSet.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            return;
        }

        const newSet = {
            isNew: true,
            exerciseId: null,
            series: null,
            repetitions: null,
            description: null
        };
        const newArticle = await RoutineSetCard(newSet, routineId);
        routineList.insertBefore(newArticle, addArticle);

        newArticle.scrollIntoView({behavior: "smooth", block: "center"});
    });

    orderButton.addEventListener("click", () => {
        if (exercisesSort) exercisesSort.show();
        else shakeEffect(orderButton)
    })

    return routineSetContainer;
}

export function getSet(setId) {
    return setData.find(set => Number(set.id) === Number(setId));
}

