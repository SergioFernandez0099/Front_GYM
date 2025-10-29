import { applyCSS } from "../../utils/helpers";

export function RoutineSetCard(exercise) {
  applyCSS(
    "/src/styles/routine.css",
    "/src/styles/components/routine-day-card.css",
    "/src/styles/components/routine-set-card.css",
    "/src/styles/components/routine-form.css"
  );

  const article = document.createElement("article");
  if (exercise === "add") {
    article.className = "routine-set-add-card";
    article.innerHTML = `
    <div class="button-container">
      <div class="addButton">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>
  `;
  } else {
    article.className = "routine-set-card";
    article.innerHTML = `
    <div class="routine-set-options">
      <div class="icon-container icon-container-edit fade-toggle">
        <img src="/assets/icons/edit.svg" alt="Añadir" class="editIcon">
      </div>
      <div class="icon-container icon-container-trash fade-toggle">
        <img src="/assets/icons/trash.svg" alt="Cerrar" class="trashIcon">
      </div>
      <div class="icon-container icon-container-arrow ">
        <img src="/assets/icons/arrow_down.svg" alt="Añadir" class="arrowIcon">
      </div>
    </div>
    <div class="default-card">
      <div class="routine-set-image-container">
          <img src="/assets/images/exercises/legs/hack-squat-800_rd.png" alt="" class="routine-set-image" />
      </div>
      <div class="routine-set-info">
          <h2 class="routine-set-title">${exercise.name}</h2>
                <div class="routine-details">
              <p class="routine-set-text">Series: ${exercise.series}3</p>
              <p class="routine-set-text">Reps: ${exercise.reps}</p>
          </div>
      </div>
    </div>
    <div class="description">
      <label for="description-text" class="routine-set-text">Descripción:</label>
        <textarea id="description-text" name="descripcion" rows="4" cols="50"
          placeholder="Escribe solo texto plano aquí"
          oninput="this.value = this.value.replace(/<[^>]*>?/gm, '')"
          >
        </textarea>
    </div>
  `;
  }

  const editButton = article.querySelector(".icon-container-edit");
  const trashButton = article.querySelector(".icon-container-trash");
  const arrowButton = article.querySelector(".icon-container-arrow");
  const arrowIcon = article.querySelector(".arrowIcon");
  const description = article.querySelector(".description");


  if (arrowButton) {
    arrowButton.addEventListener("click", () => {
      trashButton.classList.toggle("visible");
      editButton.classList.toggle("visible");
      if (article.classList.contains("accordion")) {
        article.classList.remove("accordion");
        arrowIcon.classList.remove("rotate-180");
        description.style.height = "0rem";
      } else {
        article.classList.add("accordion");
        description.style.height = "100%";
        arrowIcon.classList.add("rotate-180");
        description.style.display = "block";
      }
    });
  }

  if (editButton) {
    editButton.addEventListener("click", () => {
      
    });
  }

  if (trashButton) {
    trashButton.addEventListener("click", () => {
      
    });
  }

  return article;
}
