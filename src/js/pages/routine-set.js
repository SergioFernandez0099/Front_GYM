import { findImageByName } from "../../utils/helpers";
import {
  closeAccordion,
  closeEditableCard,
  openAccordion,
  RoutineSetCard,
  showEditableCard,
} from "../components/routine-set-card";
import { toggleEditIcon } from "../../utils/helpers";

const defaultSet = [
  { name: "Press Banca", series: 3, reps: 12 },
  { name: "Press inclinado", series: 3, reps: 10 },
  { name: "Press militar", series: 3, reps: 10 },
  { name: "Elevaciones laterales", series: 3, reps: 10 },
  { name: "Fondos de tríceps", series: 3, reps: 8 },
  { name: "Extensión de tríceps", series: 3, reps: 10 },
];

const options = [
  "Press Banca",
  "Press militar",
  "Hack squat",
  "Extensión de cuádriceps",
  "Femoral tumbado",
  "Curl martillo",
];

export function RoutineSet(set = defaultSet) {
  const routineSetContainer = document.createElement("div");
  routineSetContainer.className = "routine-container";

  const section = document.createElement("section");
  section.className = "routine-list-container";

  const routineList = document.createElement("div");
  routineList.className = "routine-list";
  routineList.style.gridTemplateColumns =
    "repeat(auto-fill, minmax(19rem, 1fr))";
  section.appendChild(routineList);

  set.forEach((exercise) => {
    routineList.appendChild(RoutineSetCard(exercise));
  });

  const addArticle = RoutineSetCard("add");

  const addArticleButton = addArticle.querySelector(".addButton");

  if (document.activeElement) {
    document.activeElement.blur();
  }

  addArticleButton.addEventListener("click", () => {
    const existingNewSet = routineList.querySelector("[data-new-set]");

    if (existingNewSet) {
      existingNewSet.classList.remove("fade-in-up");
      existingNewSet.style.animation = "none";

      void existingNewSet.offsetWidth;

      existingNewSet.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => {
        existingNewSet.style.animation = "";
      }, 600);

      existingNewSet.scrollIntoView({ behavior: "smooth", block: "center" });

      return;
    }

    const newArticle = RoutineSetCard("new");

    routineList.insertBefore(newArticle, addArticle);

    newArticle.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  routineList.appendChild(addArticle);

  routineSetContainer.appendChild(section);

  return routineSetContainer;
}
