import { applyCSS, findImageByName, toggleEditIcon } from "../../utils/helpers";

const options = [
  "Press Banca",
  "Press militar",
  "Hack squat",
  "Extensión de cuádriceps",
  "Femoral tumbado",
  "Curl martillo",
];

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
  } else if (exercise === "new") {
    article.className = "routine-set-card";
    article.innerHTML = `
    <div class="routine-set-options">
      <div class="icon-container icon-container-edit fade-toggle" data-editable="false">
        <img src="/assets/icons/edit.svg" alt="Icono de edición" class="editIcon">
      </div>
      <div class="icon-container icon-container-trash fade-toggle">
        <img src="/assets/icons/trash.svg" alt="Icono de borrar" class="trashIcon">
      </div>
      <div class="icon-container icon-container-arrow ">
        <img src="/assets/icons/arrow_down.svg" alt="Icono de desplegable" class="arrowIcon">
      </div>
    </div>
    <div id="suggestionBox">Press Banca</div>
    <div class="default-card">
      <div class="routine-set-image-container">
          <img src="/assets/images/snorlax.png" alt="" class="routine-set-image" />
      </div>
      <div class="routine-set-info">
          <input id="titleInput" type="text" autocomplete="off" placeholder="Escribe..." enterkeyhint="done" class="routine-set-tittle">
                <div class="routine-details">
              <p class="routine-set-text">Series: 
              <input id="series" type="number" min="1" max="99" readonly placeholder="3" enterkeyhint="done"></p>
              <p class="routine-set-text">Reps:
              <input id="reps" type="number" min="1" max="99" readonly placeholder="8" enterkeyhint="done"></p>
          </div>
      </div>
    </div>
    <div class="description">
  <label for="description-text" class="routine-set-text">Descripción:</label>
  <textarea 
    id="description-text"
    name="descripcion"
    rows="4"
    cols="50"
    maxlength="148"
    readonly
    enterkeyhint="done"
    placeholder="Descripción del ejercicio"
    oninput="this.value = this.value.replace(/<[^>]*>?/gm, '')"></textarea>
</div>
  `;
    setUpSetCard(article);
    setUpSetNewCard(article);
  } else {
    article.className = "routine-set-card";
    article.innerHTML = `
    <div class="routine-set-options">
      <div class="icon-container icon-container-edit fade-toggle" data-editable="false">
        <img src="/assets/icons/edit.svg" alt="Icono de edición" class="editIcon">
      </div>
      <div class="icon-container icon-container-trash fade-toggle">
        <img src="/assets/icons/trash.svg" alt="Icono de borrar" class="trashIcon">
      </div>
      <div class="icon-container icon-container-arrow ">
        <img src="/assets/icons/arrow_down.svg" alt="Icono de desplegable" class="arrowIcon">
      </div>
    </div>
    <div class="default-card">
      <div class="routine-set-image-container">
          <img src="/assets/images/exercises/legs/hack-squat-800_rd.png" alt="" class="routine-set-image" />
      </div>
      <div class="routine-set-info">
          <h2 class="routine-set-title">${exercise.name}</h2>
                <div class="routine-details">
              <p class="routine-set-text">Series: 
              <input id="series" type="number" min="1" max="99" readonly enterkeyhint="done" value="${exercise.series}"></p>
              <p class="routine-set-text">Reps:
              <input id="reps" type="number" min="1" max="99" readonly enterkeyhint="done" value="${exercise.reps}"></p>
          </div>
      </div>
    </div>
    <div class="description">
  <label for="description-text" class="routine-set-text">Descripción:</label>
  <textarea 
    id="description-text"
    name="descripcion"
    rows="4"
    cols="50"
    maxlength="148"
    readonly
    enterkeyhint="done"
    placeholder="Descripción del ejercicio"
    oninput="this.value = this.value.replace(/<[^>]*>?/gm, '')"></textarea>
</div>
  `;
    setUpSetCard(article);
  }

  return article;
}

function setUpSetCard(article) {
  const editButton = article.querySelector(".icon-container-edit");
  const trashButton = article.querySelector(".icon-container-trash");
  const arrowButton = article.querySelector(".icon-container-arrow");
  const arrowIcon = article.querySelector(".arrowIcon");
  const description = article.querySelector(".description");
  const seriesInput = article.querySelector("#series");
  const repsInput = article.querySelector("#reps");
  const textarea = article.querySelector("#description-text");
  const editIcon = article.querySelector(".editIcon");

  if (arrowButton) {
    arrowButton.addEventListener("click", () => {
      if (article.hasAttribute("data-new-set")) {
        guardarSet(article);
      }

      // Valiamos que no haya una card nueva abierta
      const existe = document.querySelector("[data-new-set]") !== null;
      if (existe) {
        const newArticle = document.querySelector("[data-new-set]");
        guardarSet(newArticle);
        return;
      }

      closeAllOpenedCards(article);

      if (article.classList.contains("accordion")) {
        if (editButton.dataset.editable === "true") {
          closeEditableCard(textarea, seriesInput, repsInput);
          toggleEditIcon("edit", editIcon, editButton, "1.65rem", "2rem");
        }
        closeAccordion(
          article,
          description,
          arrowIcon,
          trashButton,
          editButton
        );
      } else {
        openAccordion(article, description, arrowIcon, trashButton, editButton);
      }
    });
  }

  if (editButton) {
    editButton.addEventListener("click", () => {
      if (editButton.dataset.editable === "false") {
        showEditableCard(textarea, seriesInput, repsInput);
        toggleEditIcon("tick", editIcon, editButton, "1.65rem", "2rem");
      } else {
        guardarSet(article);
      }
    });
  }

  if (seriesInput) {
    seriesInput.addEventListener("input", () => {
      inputActionSeriesYReps(seriesInput);
    });

    seriesInput.addEventListener("paste", (event) => {
      inputPasteActionSeriesYReps(event);
    });

    seriesInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        // Añadir validación de numero
        if (validarSeriesYReps(seriesInput)) {
          repsInput.focus();
        }
      }
    });
  }

  if (repsInput) {
    repsInput.addEventListener("input", () => {
      inputActionSeriesYReps(repsInput);
    });

    repsInput.addEventListener("paste", (event) => {
      inputPasteActionSeriesYReps(event);
    });

    repsInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        // Añadir validación de numero
        if (validarSeriesYReps(repsInput)) {
          textarea.focus();
        }
      }
    });
  }

  if (textarea) {
    textarea.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        guardarSet(article);
      }
    });
  }

  if (trashButton) {
    trashButton.addEventListener("click", () => {});
  }
}

function setUpSetNewCard(article) {
  const ad = article.parentElement;

  const suggestionBox = article.querySelector("#suggestionBox");
  const description = article.querySelector(".description");
  const arrowIcon = article.querySelector(".arrowIcon");
  const editButton = article.querySelector(".icon-container-edit");
  const repsInput = article.querySelector("#reps");
  const seriesInput = article.querySelector("#series");
  const textarea = article.querySelector("#description-text");
  const titleInput = article.querySelector("#titleInput");
  const trashButton = article.querySelector(".icon-container-trash");
  const editIcon = article.querySelector(".editIcon");

  article.classList.add("fade-in-up");

  article.setAttribute("data-new-set", "true");
  article.classList.add("accordion");

  openAccordion(article, description, arrowIcon, trashButton, editButton);
  toggleEditIcon("tick", editIcon, editButton, "1.65rem", "2rem");
  showEditableCard(textarea, seriesInput, repsInput);

  titleInput.addEventListener("input", () => {
    const query = titleInput.value.toLowerCase();
    suggestionBox.classList.add("visible");
    suggestionBox.innerHTML = "";

    if (query.length === 0) return;

    const matches = options.filter((option) =>
      option.toLowerCase().includes(query)
    );

    if (matches.length > 0) {
      suggestionBox.textContent = matches[0];

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
        seriesInput.focus();
      }
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
        seriesInput.focus();
      }
    }
  });

  titleInput.addEventListener("blur", () => {
    if (suggestionBox.classList.contains("visible")) {
      setTimeout(() => {
        suggestionBox.classList.remove("visible");
      }, 100);
    }
  });

  article.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => {
    closeAllOpenedCards(article);
  }, 100);

  setTimeout(() => {
    titleInput.focus();
  }, 300);
}

export function closeEditableCard(
  textarea,
  seriesInput,
  repsInput,
  editButton
) {
  if (editButton) editButton.dataset.editable = "false";

  if (seriesInput) {
    seriesInput.setAttribute("readonly", true);
    seriesInput.classList.remove("editable");
  }
  if (repsInput) {
    repsInput.setAttribute("readonly", true);
    repsInput.classList.remove("editable");
  }
  if (textarea) textarea.setAttribute("readonly", true);
}

export function showEditableCard(textarea, seriesInput, repsInput, editButton) {
  if (editButton) editButton.dataset.editable = "true";

  if (seriesInput) {
    seriesInput.removeAttribute("readonly");
    seriesInput.classList.add("editable");
  }
  if (repsInput) {
    repsInput.removeAttribute("readonly");
    repsInput.classList.add("editable");
  }
  if (textarea) textarea.removeAttribute("readonly");
}

export function openAccordion(
  article,
  description,
  arrowIcon,
  trashButton,
  editButton
) {
  article.classList.add("accordion");
  description.style.height = "100%";
  description.style.display = "flex";
  arrowIcon.classList.add("rotate-180");
  trashButton.classList.add("visible");
  editButton.classList.add("visible");
}

export function closeAccordion(
  article,
  description,
  arrowIcon,
  trashButton,
  editButton
) {
  article.classList.add("accordion");
  article.classList.remove("accordion");
  arrowIcon.classList.remove("rotate-180");
  description.style.height = "0rem";
  trashButton.classList.remove("visible");
  editButton.classList.remove("visible");
}

export function validarSet(article) {
  const titleInput = article.querySelector("#titleInput");
  const seriesInput = article.querySelector("#series");
  const repsInput = article.querySelector("#reps");

  let titleValid = true;
  const seriesValid = validarSeriesYReps(seriesInput);
  const repsValid = validarSeriesYReps(repsInput);

  if (titleInput) {
    titleValid = validarTitulo(titleInput);
  }

  return titleInput
    ? titleValid && seriesValid && repsValid
    : seriesValid && repsValid;
}

function validarTitulo(input) {
  const title = input.value.trim();
  if (title === "" || !options.includes(title)) {
    showErrorBorder(input);
    return false;
  }
  clearErrorBorder(input);
  return true;
}

function validarSeriesYReps(input) {
  const value = parseInt(input.value, 10);
  if (isNaN(value) || value < 1 || value > 99) {
    showErrorBorder(input);
    return false;
  }
  clearErrorBorder(input);
  return true;
}

async function cargarEjercicio(titleInput, image) {
  const nombre = titleInput.value.trim();

  const resultado = await findImageByName(nombre);

  image.classList.add("fade-out");
  setTimeout(() => {
    if (resultado) {
      image.src = resultado.url;
      image.alt = "Imagen de " + resultado.alt;
    } else {
      image.src = "/assets/images/snorlax.png";
      image.alt = "Imagen default";
    }

    // Cuando la nueva imagen se cargue, vuelve a mostrarla
    image.onload = () => {
      image.classList.remove("fade-out");
    };
  }, 200); // 200 ms para el efecto de salida

  const h2 = document.createElement("h2");
  h2.textContent = nombre;
  h2.className = "routine-set-title";

  titleInput.parentNode.replaceChild(h2, titleInput);
}

export function guardarSet(article) {
  // Verificar que ha habido cambios
  if (true) {
    const image = article.querySelector(".routine-set-image");
    const titleInput = article.querySelector("#titleInput");
    const editButton = article.querySelector(".icon-container-edit");
    const trashButton = article.querySelector(".icon-container-trash");
    const arrowIcon = article.querySelector(".arrowIcon");
    const description = article.querySelector(".description");
    const seriesInput = article.querySelector("#series");
    const repsInput = article.querySelector("#reps");
    const textarea = article.querySelector("#description-text");
    const editIcon = article.querySelector(".editIcon");

    // Validar set
    // Petición
    // Cambiar vista
    if (!validarSet(article)) {
      shakeEffect(article);
      article.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (article.hasAttribute("data-new-set")) {
      cargarEjercicio(titleInput, image);
      article.removeAttribute("data-new-set");
    }

    closeEditableCard(textarea, seriesInput, repsInput);
    closeAccordion(article, description, arrowIcon, trashButton, editButton);
    toggleEditIcon("edit", editIcon, editButton, "1.65rem", "2rem");
  } else {
    closeEditableCard(textarea, seriesInput, repsInput);
    closeAccordion(article, description, arrowIcon, trashButton, editButton);
    toggleEditIcon("edit", editIcon, editButton, "1.65rem", "2rem");
  }
}

function showErrorBorder(element) {
  element.style.border = "1.5px solid red";
  element.style.outline = "none";
}

function clearErrorBorder(element) {
  element.style.border = "";
}

function inputActionSeriesYReps(input) {
  let valor = input.value;

  // Elimina cualquier carácter que no sea número
  valor = valor.replace(/\D/g, "");

  let num = parseInt(valor, 10);

  if (isNaN(num)) {
    input.value = "";
    showErrorBorder(input);
    return;
  }

  if (num < 1) num = 1;
  if (num > 99) num = 99;

  input.value = num;

  validarSeriesYReps(input);
}

function inputPasteActionSeriesYReps(event) {
  const clipboard = event.clipboardData?.getData("text") ?? "";
  if (!/^\d+$/.test(clipboard)) {
    event.preventDefault(); // Bloquea si no es numérico
  }
}

function shakeEffect(article) {
  article.classList.remove("fade-in-up");
  article.style.animation = "none";

  // Fuerza reflow (reinicia animaciones)
  void article.offsetWidth;
  article.style.animation = "shake 0.5s ease-in-out";
  setTimeout(() => (article.style.animation = ""), 600);
}

function closeAllOpenedCards(article) {
  const allCards = article.parentElement.querySelectorAll(".routine-set-card");
  allCards.forEach((card) => {
    if (card !== article) {
      const desc = card.querySelector(".description");
      const arrow = card.querySelector(".arrowIcon");
      const edit = card.querySelector(".icon-container-edit");
      const trash = card.querySelector(".icon-container-trash");
      const seriesInput = card.querySelector("#series");
      const repsInput = card.querySelector("#reps");
      const textarea = card.querySelector("#description-text");
      const editButton = card.querySelector(".icon-container-edit");
      const editIcon = card.querySelector(".editIcon");

      if (card.classList.contains("accordion")) {
        if (editButton.dataset.editable === "true") {
          closeEditableCard(textarea, seriesInput, repsInput, editButton);
          toggleEditIcon("edit", editIcon, editButton, "1.65rem", "2rem");
        }
        closeAccordion(card, desc, arrow, trash, edit);
      }
    }
  });
}
