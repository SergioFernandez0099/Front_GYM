import {fetchTrainingSession} from "../services/api.js";
import {createExercisePicker} from "../modals/exercise-picker.js";
import {validarNumero10} from "../../utils/validators.js";


export async function trainingSessionCard(sessionId) {

    const trainingSessionData = await fetchTrainingSession(sessionId);
    let indiceEjercicio = 0;

    const trainingSessionCardContainer = document.createElement("div");
    trainingSessionCardContainer.className = "train-sess-card-container";

    function renderCard() {
        const exerciseData =
            trainingSessionData.sessionExercises[indiceEjercicio];

        const seriesHTML = exerciseData.series
            .map((serie, index) => renderSerie(serie, index))
            .join("");

        trainingSessionCardContainer.innerHTML = `
  <div class="train-sess-card">
    <div class="train-sess-card-exercise-num">
        <p>${indiceEjercicio + 1}</p>
    </div>
    <div class="train-sess-card-icon train-sess-card-save-icon">
        <img src="/assets/icons/save.svg" alt="Icono de guardado" class="saveIcon">
    </div>
    <div class="train-sess-card-info-tooltip hide">
        Para borrar una serie tan solo manten pulsado el número de esta. 
        Para cambiar las unidades simplemente pulsa sobre ellas
    </div>
    <div id="infoIcon" class="train-sess-card-icon train-sess-card-info-icon">
        <img src="/assets/icons/info.svg" alt="Icono de información" class="infoIcon">
    </div>
    <div class="train-sess-card-header">
        <img src="${trainingSessionData.sessionExercises[indiceEjercicio].exercise.imageUrl}" alt="" class="train-sess-card-image">
        <h2 class="train-sess-card-title">${trainingSessionData.sessionExercises[indiceEjercicio].exercise.name}</h2>
    </div>
        <div class="train-sess-card-description-container">
            <textarea maxlength="100" placeholder="Escribe algún detalle..." class="train-sess-card-description">Top set en la primera</textarea>
        </div>
        <div class="train-sess-card-series-list">
            ${seriesHTML}
            <button class="train-sess-card-add-serie">Añadir serie</button>
            <hr>
            <div class="train-sess-card-buttons">
                <button class="train-sess-card-buttons-previous" data-action="previous">Anterior</button>
                <button class="train-sess-card-buttons-delete" data-action="delete">Borrar ejercicio</button>
                <button class="train-sess-card-buttons-next" data-action="next">Siguiente</button>
            </div>
        </div>
    </div>
  `;
    }

    renderCard();

    const infoIcon = trainingSessionCardContainer.querySelector("#infoIcon");
    const tooltip = trainingSessionCardContainer.querySelector(".train-sess-card-info-tooltip")

    infoIcon.addEventListener("click", () => {
        tooltip.classList.toggle("hide")
    });

    const unitsButton = trainingSessionCardContainer.querySelectorAll(".train-sess-card-units");

    Array.from(unitsButton).forEach((unit) => {
        console.log(unit)
        unit.addEventListener("click", (event) => {
            const elemento = event.target;
            if (elemento.dataset.unit === "Kg") {
                elemento.dataset.unit = "Lb";
                elemento.textContent = "Lb"
            } else {
                elemento.dataset.unit = "Kg";
                elemento.textContent = "Kg"
            }
        })
    })

    const generalOptions = document.createElement("div");
    generalOptions.className = "train-sess-card-general-options";
    trainingSessionCardContainer.appendChild(generalOptions);

    const btnList = document.createElement("button");
    btnList.className = "train-sess-card-general-options-list";
    btnList.textContent = "Ejercicios";

    const imgList = document.createElement("img");
    imgList.src = "/assets/icons/list.svg";
    imgList.alt = "Icono de listado";
    imgList.className = "listIcon";

    btnList.appendChild(imgList);
    generalOptions.appendChild(btnList);

    const btnAdd = document.createElement("button");
    btnAdd.className = "train-sess-card-general-options-add";
    btnAdd.textContent = "Añadir ejercicio";

    const imgAdd = document.createElement("img");
    imgAdd.src = "/assets/icons/add.svg";
    imgAdd.alt = "Icono de añadir";
    imgAdd.className = "addIcon";

    btnAdd.appendChild(imgAdd);
    generalOptions.appendChild(btnAdd);

    const btnDelete = document.createElement("button");
    btnDelete.className = "train-sess-card-general-options-del";
    btnDelete.textContent = "Borrar rutina";

    const imgDelete = document.createElement("img");
    imgDelete.src = "/assets/icons/trash.svg";
    imgDelete.alt = "Icono de borrar";
    imgDelete.className = "trashIcon";

    btnDelete.appendChild(imgDelete);
    generalOptions.appendChild(btnDelete);

    trainingSessionCardContainer.prepend(generalOptions);

    const exercisesPicker = createExercisePicker(trainingSessionData.sessionExercises)

    generalOptions.addEventListener('click', (e) => {
        const element = e.target;

        if (element.classList.contains('train-sess-card-general-options-list')) {
            exercisesPicker.show();
        }
    })

    const card = trainingSessionCardContainer.querySelector(".train-sess-card");
    card.addEventListener("beforeinput", (e) => {
        const element = e.target;
        if (element.classList.contains("train-sess-card-input-intensity") ||
            element.classList.contains("train-sess-card-input-rir")
        ) {
            // Valor actual
            const currentValue = element.value;
            // Valor que quedaría tras la entrada
            const newValue =
                e.inputType === "deleteContentBackward" || e.inputType === "deleteContentForward"
                    ? currentValue.slice(0, -1)
                    : currentValue + e.data;

            // Permitir dejar vacío
            if (newValue === "") return;

            // Validar número del 0 al 10
            const num = Number(newValue);
            if (!/^(10|[0-9])$/.test(newValue) || isNaN(num) || num < 0 || num > 10) {
                e.preventDefault();
            }

        }

    })

    const buttons = trainingSessionCardContainer.querySelector(".train-sess-card-buttons");
    Array.from(buttons.children).forEach((button) => {
        button.addEventListener("click", (event) => {
            console.log(3)
            const elemento = event.target;
            switch (elemento.dataset.action) {
                case "next": {
                    if (indiceEjercicio === trainingSessionData.sessionExercises.length - 1) {
                        indiceEjercicio = 0;
                        break;
                    }
                    indiceEjercicio++;
                    break;
                }
                case "previous": {
                    if (indiceEjercicio === 0) {
                        indiceEjercicio = trainingSessionData.sessionExercises.length -1;
                        return
                    }
                    indiceEjercicio--;
                    break;
                }
                case "delete":{
                    break;
                }
                default: {
                    return;
                }
            }
            console.log(indiceEjercicio);
            renderCard()
        })
    })

//   try {
//     const routineDays = await fetchRoutineDays();
//     const fragment = document.createDocumentFragment();

//     routineDays.forEach((day) => {
//       const dayCard = RoutineDayCard(day);
//       attachRoutineDayCardEvents(dayCard, day);
//       fragment.appendChild(dayCard);
//     });

//     routineList.appendChild(fragment);
//   } catch (error) {
//     console.error("Error cargando rutinas:", error);
//     routineList.textContent = "No se pudieron cargar las rutinas.";
//   }

//   const addCard = RoutineDayCard("add");
//   addCard.addEventListener("click", () => handleAddRoutine(routineList));
//   routineList.appendChild(addCard);

    return trainingSessionCardContainer;
}

function renderSerie(serie, index) {
    return `
    <div class="train-sess-card-serie">
      <span class="train-sess-card-serie-num">${index + 1}</span>

      <img class="train-sess-card-serie-weight-image"
           src="/assets/icons/kettlebell.svg" alt="">

      <input class="train-sess-card-input-weight"
             type="number"
             value="${serie.weight ?? ''}">

      <div class="train-sess-card-units-container">
        <p class="train-sess-card-units" data-unit="Kg">Kg</p>
      </div>

      <input class="train-sess-card-input-reps"
             type="number"
             value="${serie.reps ?? ''}">
      <span>Reps</span>

      <span>RIR</span>
      <input class="train-sess-card-input-rir"
             type="number"
             value="${serie.rir ?? ''}">

      <span>@</span>
      <input class="train-sess-card-input-intensity"
             type="number"
             value="${serie.intensity ?? ''}">
    </div>
  `;
}
