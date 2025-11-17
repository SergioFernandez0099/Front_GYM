import {router} from "../router";
import {
    clearErrorBorder,
    glowEffect,
    openConfirmModal,
    shakeEffect,
    showErrorBorder,
    toggleEditIcon,
} from "../../utils/helpers";
import {validaYSanitiza} from "../../utils/validators";
import {createRoutine, deleteRoutine, updateRoutine} from "../services/api";

export function RoutineDayCard(day) {
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
      </div>`;
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
        <h2 id="titleDayInput" class="routine-day-title" contenteditable="false" spellcheck="false">${day.name}</h2>
      </div>
      <div class="routine-day-image-container">
        <img src="/assets/images/routine_card2.jpg" alt="Imagen de fondo en un gimnasio" class="routine-image" />
      </div>`;
    }

    article.classList.add("fade-in-up");
    setTimeout(() => {
        article.classList.remove("fade-in-up");
    }, 400);
    return article;
}

export function attachRoutineDayCardEvents(article, day) {
    if (day === "add") return;

    const elements = {
        inputTitle: article.querySelector("#titleDayInput"),
        editButton: article.querySelector(".icon-container-edit"),
        trashButton: article.querySelector(".icon-container-trash"),
    };

    article.addEventListener("click", () => router.navigate(`/routine/set/${day.id}`));

    elements.inputTitle.addEventListener("click", (e) => {
        if (elements.editButton.dataset.editable === "true") e.stopPropagation();
    });

    elements.inputTitle.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const saved = await saveDay(article, day, article.hasAttribute("data-new-day"));
            if (saved) {
                shakeEffect(article);
                article.scrollIntoView({behavior: "smooth", block: "center"});
            } else {
                elements.inputTitle.blur();
                elements.inputTitle.setAttribute("contenteditable", "false");
            }
        }
    });

    elements.inputTitle.addEventListener("input", () => {
        const {valid} = validaYSanitiza(elements.inputTitle.textContent);
        valid ? clearErrorBorder(elements.inputTitle) : showErrorBorder(elements.inputTitle);
    });

    elements.editButton.addEventListener("click", async (e) => {
        e.stopPropagation();
        const newCard = document.querySelector("[data-new-day]");
        if (newCard && newCard !== article) {
            shakeEffect(newCard);
            newCard.scrollIntoView({behavior: "smooth", block: "center"});
            return;
        }

        closeAllEditingCards(article);

        if (elements.editButton.dataset.editable === "true") {
            await saveDay(article, day, article.hasAttribute("data-new-day"));
        } else {
            openEditableRoutineCard(article);
        }
    });

    elements.trashButton.addEventListener("click", (e) => {
        e.stopPropagation();
        openConfirmModal("¿Eliminar set?", async () => {
            try {
                if (!day.id) {
                    article.classList.add("fade-out-inward");
                    setTimeout(() => article.remove(), 300);
                    return;
                }
                const result = await deleteRoutine(day.id);
                if (result) {
                    article.classList.add("fade-out-inward");
                    setTimeout(() => article.remove(), 300);
                } else shakeEffect(article);
            } catch (err) {
                console.error("Error al borrar set:", err);
                shakeEffect(article);
            }
        });
    });

    if (day.isNew) {
        article.setAttribute("data-new-day", "true");
        article.scrollIntoView({behavior: "smooth", block: "center"});
        requestAnimationFrame(() => elements.inputTitle.focus());
        setTimeout(() => closeAllEditingCards(article), 100);
    }
}

async function saveDay(article, day, isNew = false) {
    const inputTitle = article.querySelector("#titleDayInput");
    const {valid, sanitized} = validaYSanitiza(inputTitle.textContent, {allowSpecial: false, maxLength: 50});
    if (!valid) {
        showErrorBorder(inputTitle);
        return false;
    }

    const routineData = {name: sanitized};
    let result;

    try {
        result = isNew ? await createRoutine(routineData) : await updateRoutine(day.id, routineData);
    } catch (err) {
        console.error("Error guardando día:", err);
        shakeEffect(article);
        return false;
    }

    if (result) {
        inputTitle.textContent = sanitized;
        article.removeAttribute("data-new-day");
        closeEditableRoutineCard(article);
        glowEffect(article);
        Object.assign(day, result);
        delete day.isNew;
        return true;
    }

    shakeEffect(article);
    return false;
}

export function openEditableRoutineCard(article) {
    const editButton = article.querySelector(".icon-container-edit");
    const editIcon = article.querySelector(".editIcon");
    const inputTitle = article.querySelector("#titleDayInput");
    const trashButton = article.querySelector(".icon-container-trash");

    editButton.dataset.editable = "true";
    trashButton.classList.add("visible");
    toggleEditIcon("tick", editIcon, editButton, "1.45rem", "1.85rem");
    inputTitle.setAttribute("contenteditable", "true");
    inputTitle.focus();
}

export function closeEditableRoutineCard(article) {
    const editButton = article.querySelector(".icon-container-edit");
    const editIcon = article.querySelector(".editIcon");
    const inputTitle = article.querySelector("#titleDayInput");
    const trashButton = article.querySelector(".icon-container-trash");

    inputTitle.setAttribute("contenteditable", "false");
    editButton.dataset.editable = "false";
    trashButton.classList.remove("visible");
    toggleEditIcon("edit", editIcon, editButton, "1.45rem", "1.85rem");
}

function closeAllEditingCards(currentArticle) {
    const allCards = currentArticle.parentElement.querySelectorAll(".routine-day-card");
    allCards.forEach(card => {
        if (card !== currentArticle && card.querySelector(".icon-container-edit").dataset.editable === "true") {
            closeEditableRoutineCard(card);
        }
    });
}

export function handleAddRoutine(routineList) {
    const existingNewDay = routineList.querySelector("[data-new-day]");
    if (existingNewDay) {
        existingNewDay.scrollIntoView({behavior: "smooth", block: "center"});
        return;
    }

    const newDay = {isNew: true, name: ". . .", id: null};
    const newCard = RoutineDayCard(newDay);
    attachRoutineDayCardEvents(newCard, newDay);

    const addCard = routineList.querySelector(".routine-day-add-card");
    routineList.insertBefore(newCard, addCard);
    openEditableRoutineCard(newCard);
}
