import { RoutineSetCard } from "../components/routine-set-card";

const defaultSet = [
  { name: "Press Banca", series: 3, reps: 12 },
  { name: "Press inclinado", series: 3, reps: 10 },
  { name: "Press militar", series: 3, reps: 10 },
  { name: "Elevaciones laterales", series: 3, reps: 10 },
  { name: "Fondos de tríceps", series: 3, reps: 8 },
  { name: "Extensión de tríceps", series: 3, reps: 10 },
];

export function RoutineSet(set = defaultSet) {
  const routineSetContainer = document.createElement("div");
  routineSetContainer.className = "routine-container";

  const section = document.createElement("section");
  section.className = "routine-list-container";

  const exerciseList = document.createElement("div");
  exerciseList.className = "routine-list";

  section.appendChild(exerciseList);

  set.forEach((exercise) => {
    exerciseList.appendChild(RoutineSetCard(exercise));
  });

  const addArticle = RoutineSetCard("add");
  exerciseList.appendChild(addArticle);

  const addArticleButton = addArticle.querySelector(".addButton");

  if (document.activeElement) {
    document.activeElement.blur();
  }

  addArticleButton.addEventListener("click", () => {
   const newArticle = RoutineSetCard("new");

    exerciseList.insertBefore(newArticle, addArticle);

    const editButton = newArticle.querySelector(".icon-container-edit");
    const trashButton = newArticle.querySelector(".icon-container-trash");
    const arrowIcon = newArticle.querySelector(".arrowIcon");
    const description = newArticle.querySelector(".description");
    const seriesInput = newArticle.querySelector("#series");
    const repsInput = newArticle.querySelector("#reps");

    newArticle.classList.add("accordion");

    if (description) {
      description.style.height = "100%";
      description.style.display = "flex";
    }
    if (arrowIcon) {
      arrowIcon.classList.add("rotate-180");
    }
    if (arrowIcon) {
      trashButton.classList.add("visible");
    }
    if (editButton) {
      editButton.classList.add("visible");
    }
    if (seriesInput) {
      seriesInput.removeAttribute("readonly");
      seriesInput.classList.add("editable");
    }
    if (repsInput) {
      repsInput.removeAttribute("readonly");
      repsInput.classList.add("editable");
    }
    newArticle.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  routineSetContainer.appendChild(section);

  return routineSetContainer;
}
