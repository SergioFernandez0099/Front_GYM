import { router } from "../router";
import { toggleEditIcon } from "../../utils/helpers";

export function RoutineDayCard(day, series = 3, reps = 10) {
  const article = document.createElement("article");

  if (day === "add") {
    article.className = "routine-day-add-card";
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
    article.className = "routine-day-card";
    article.innerHTML = `
    <div class="routine-day-options">
      <div class="icon-container icon-container-trash fade-toggle">
        <img src="/assets/icons/trash.svg" alt="Icono de borrar" class="trashIcon">
      </div> 
      <div class="icon-container icon-container-edit" data-editable="false">
        <img src="/assets/icons/edit.svg" alt="Icono de edición" class="editIcon">
      </div>
    </div>
    <div class="routine-info">
        <h2 id="titleDayInput" class="routine-day-title" contenteditable="false" spellcheck="false">${day}</h2>
    </div>
    <div class="routine-day-image-container">
        <img src="/assets/images/routine_card2.jpg" alt="Imagen de fondo en un gimnasio" class="routine-image" />
    </div>
  `;
    setUpDayCard(article);
  }
  return article;
}

function setUpDayCard(article,day="3") {
  article.addEventListener("click", () => {
    router.navigate(`/routine/set/1`);
  });

  const inputTitle = article.querySelector("#titleDayInput");
  const editButton = article.querySelector(".icon-container-edit");
  const trashButton = article.querySelector(".icon-container-trash");

  inputTitle.addEventListener("click", (event) => {
    if (editButton.dataset.editable === "true") {
      event.stopPropagation();
    }
  });

  inputTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputTitle.blur();
      inputTitle.setAttribute("contenteditable", "false");
    }
  });

  editButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (editButton.dataset.editable === "true") {
      closeEditableRoutineCard(article);
    } else {
      openEditableRoutineCard(article);
    }
  });

  trashButton.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

export function closeEditableRoutineCard(article) {
  const editButton = article.querySelector(".icon-container-edit");
  const editIcon = article.querySelector(".editIcon");
  const inputTitle = article.querySelector("#titleDayInput");
  const trashButton = article.querySelector(".icon-container-trash");

  inputTitle.setAttribute("contenteditable", "false");
  toggleEditIcon("edit", editIcon, editButton, "1.45rem", "1.85rem");
  trashButton.classList.remove("visible");
}

export function openEditableRoutineCard(article) {
  const editButton = article.querySelector(".icon-container-edit");
  const editIcon = article.querySelector(".editIcon");
  const inputTitle = article.querySelector("#titleDayInput");
  const trashButton = article.querySelector(".icon-container-trash");

  trashButton.classList.add("visible");
  toggleEditIcon("tick", editIcon, editButton, "1.45rem", "1.85rem");
  inputTitle.setAttribute("contenteditable", "true");
  inputTitle.focus();
}
