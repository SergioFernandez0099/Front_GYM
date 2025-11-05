import {
  guardarSet,
  RoutineSetCard,
} from "../components/routine-set-card";
import { fetchRoutineSets } from "./services/api";

export async function RoutineSet({ userId, routineId }) {
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

  setData.forEach((set) => {
    routineList.appendChild(RoutineSetCard(set));
  });

  const addArticle = RoutineSetCard("add");
  const addArticleButton = addArticle.querySelector(".addButton");

  addArticleButton.addEventListener("click", () => {
    const existingNewSet = routineList.querySelector("[data-new-set]");
    if (existingNewSet) {
      guardarSet(existingNewSet);
      return;
    }
    const newArticle = RoutineSetCard("new");
    routineList.insertBefore(newArticle, addArticle);
    newArticle.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  routineList.appendChild(addArticle);

  return routineSetContainer;
}
