import {RoutineSetCard,} from "../components/routine-set-card";
import {fetchRoutineSets} from "./services/api";

export async function RoutineSet({userId, routineId}) {
    const routineSetContainer = document.createElement("div");
    routineSetContainer.className = "routine-container";

    const section = document.createElement("section");
    section.className = "routine-list-container";

    const routineList = document.createElement("div");
    routineList.className = "routine-list";
    routineList.style.gridTemplateColumns = "repeat(auto-fill, minmax(19rem, 1fr))";
    section.appendChild(routineList);

    routineSetContainer.appendChild(section);

    const setData = await fetchRoutineSets(userId, routineId);

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
        const newArticle = await RoutineSetCard("new", routineId);
        routineList.insertBefore(newArticle, addArticle);

        newArticle.scrollIntoView({behavior: "smooth", block: "center"});
    });


    return routineSetContainer;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}