import {
  closeAccordion,
  closeEditableCard,
  openAccordion,
  RoutineSetCard,
  showEditableCard,
  toogleEditIcon,
} from "../components/routine-set-card";

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
  routineList.appendChild(addArticle);

  const addArticleButton = addArticle.querySelector(".addButton");

  if (document.activeElement) {
    document.activeElement.blur();
  }

  addArticleButton.addEventListener("click", () => {
    const newArticle = RoutineSetCard("new");

    routineList.insertBefore(newArticle, addArticle);

    const editButton = newArticle.querySelector(".icon-container-edit");
    const trashButton = newArticle.querySelector(".icon-container-trash");
    const saveButtton = newArticle.querySelector(".icon-container-save");
    const arrowIcon = newArticle.querySelector(".arrowIcon");
    const description = newArticle.querySelector(".description");
    const seriesInput = newArticle.querySelector("#series");
    const repsInput = newArticle.querySelector("#reps");
    const titleInput = newArticle.querySelector("#titleInput");
    const suggestionBox = newArticle.querySelector("#suggestionBox");
    const textarea = newArticle.querySelector("#description-text");
    const editIcon = newArticle.querySelector(".editIcon");

    titleInput.focus();

    titleInput.addEventListener("input", () => {
      const query = titleInput.value.toLowerCase();
      suggestionBox.classList.add("visible");
      suggestionBox.innerHTML = ""; // Limpiar sugerencias anteriores

      if (query.length === 0) return;

      // Filtrar opciones que empiezan por el texto introducido
      const matches = options.filter((option) =>
        option.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        suggestionBox.textContent = matches[0];

        // Al hacer clic en la sugerencia, se rellena el input
        suggestionBox.addEventListener("click", () => {
          titleInput.value = matches[0];
          titleInput.style.border = "2px solid green";
          suggestionBox.classList.remove("visible");
          suggestionBox.innerHTML = "";
        });
      }
    });

    titleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        if (suggestionBox.textContent.trim() !== "") {
          const valorSugerido = suggestionBox.textContent;
          titleInput.value = valorSugerido;
          titleInput.style.border = "2px solid green";
          suggestionBox.classList.remove("visible");
          suggestionBox.innerHTML = "";
        }
      }
    });

    titleInput.addEventListener("blur", () => {
      setTimeout(() => {
        suggestionBox.classList.remove("visible");
      }, 100);
    });
    newArticle.classList.add("accordion");

    openAccordion(newArticle, description, arrowIcon, trashButton, editButton);
    showEditableCard(textarea, seriesInput, repsInput);

    editButton.style.display = "none";

    if (saveButtton) {
      saveButtton.classList.add("visible");
    }

    saveButtton.addEventListener("click", () => {
      // guardarSet(titleInput);
      if (!validarSet(titleInput)) {
        return;
      }
      cargarEjercicio(titleInput);

      newArticle.setAttribute("data-completa", "true");
      closeEditableCard(textarea, seriesInput, repsInput);
      saveButtton.classList.remove("visible");
      closeAccordion(
        newArticle,
        description,
        arrowIcon,
        trashButton,
        editButton
      );
      setTimeout(() => {
        saveButtton.style.display = "none";
        editButton.style.display = "flex";
      }, 100);
    });

    newArticle.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  routineSetContainer.appendChild(section);

  return routineSetContainer;
}

function validarSet(titleInput) {
  if (titleInput.value.trim() !== "") {
    return options.includes(titleInput);
  }
}

function cargarEjercicio(titleInput) {
  const h2 = document.createElement("h2");
  h2.textContent = titleInput.value.trim();
  h2.className = "routine-set-title";

  titleInput.parentNode.replaceChild(h2, titleInput);
}

function guardarSet(titleInput) {
  // Validar set
  // Petición
  // Cambiar vista
}
