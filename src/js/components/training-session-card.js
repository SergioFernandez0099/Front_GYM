import {fetchExercises, fetchTrainingSession} from "../services/api.js";
import {createExerciseSort} from "../modals/exercise-sort.js";
import {validarNumero10} from "../../utils/validators.js";
import {createExercisePicker} from "../modals/exercise-picker.js";


export async function trainingSessionCard(sessionId) {

    const trainingSessionData = await fetchTrainingSession(sessionId);
    const exercisesData = await fetchExercises();
    let indiceEjercicio = 0;

    const exercisesSort = createExerciseSort(trainingSessionData.sessionExercises)
    const exercisePicker = createExercisePicker(exercisesData);

    const trainingSessionCardContainer = document.createElement("div");
    trainingSessionCardContainer.className = "train-sess-card-container";

    function renderCard() {
        const exerciseData =
            trainingSessionData.sessionExercises[indiceEjercicio];

        const seriesHTML = exerciseData.series
            .map((serie, index) => renderSerie(serie, index))
            .join("");

        trainingSessionCardContainer.innerHTML = `
            <div class="train-sess-card-general-options">
                <button class="train-sess-card-general-options-list" data-action="list">
                    Ejercicios
                    <img src="/assets/icons/list.svg" alt="Icono de listado" class="listIcon">
                </button>
        
                <button class="train-sess-card-general-options-add" data-action="exercise">
                    Añadir ejercicio
                    <img src="/assets/icons/add.svg" alt="Icono de añadir" class="addIcon">
                </button>
        
                <button class="train-sess-card-general-options-del" data-action="delete-routine">
                    Borrar rutina
                    <img src="/assets/icons/trash.svg" alt="Icono de borrar" class="trashIcon">
                </button>
            </div>

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
            <div data-action="info" class="train-sess-card-icon train-sess-card-info-icon">
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
            </div>
            <button class="train-sess-card-add-serie" data-action="serie">Añadir serie</button>
            <hr>
            <div class="train-sess-card-buttons">
                <button class="train-sess-card-buttons-previous" data-action="previous">Anterior</button>
                <button class="train-sess-card-buttons-delete" data-action="delete">Borrar ejercicio</button>
                <button class="train-sess-card-buttons-next" data-action="next">Siguiente</button>
            </div>
          </div>
  `;
    }

    renderCard();

    trainingSessionCardContainer.addEventListener("beforeinput", (e) => {
        const element = e.target;

        if (
            !element.classList.contains("train-sess-card-input-intensity") &&
            !element.classList.contains("train-sess-card-input-rir")
        ) {
            return;
        }

        const currentValue = element.value;

        const newValue =
            e.inputType === "deleteContentBackward" ||
            e.inputType === "deleteContentForward"
                ? currentValue.slice(0, -1)
                : currentValue + (e.data ?? "");

        if (newValue === "") return;

        if (!/^(10|[0-9])$/.test(newValue)) {
            e.preventDefault();
        }
    });

    trainingSessionCardContainer.addEventListener("click", (event) => {
        const elemento = event.target.closest("[data-action]");
        if (!elemento) return;
        switch (elemento.dataset.action) {
            case "list": {
                exercisesSort.show();
                break;
            }
            case "exercise": {
                exercisePicker.show();
                break;
            }
            case "info": {
                const tooltip = trainingSessionCardContainer.querySelector(".train-sess-card-info-tooltip")
                tooltip.classList.toggle("hide")
                break;
            }
            case "next": {
                goToExercise("next")
                break;
            }
            case "previous": {
                goToExercise("previous")
                break;
            }
            case "delete": {
                break;
            }
            case "unit": {
                toogleUnit(elemento);
                break;
            }
            case "serie": {
                addSerie();
                break;
            }
            default: {
                return;
            }
        }
    })

    function goToExercise(direction) {
        const max = trainingSessionData.sessionExercises.length - 1;

        indiceEjercicio =
            direction === "next"
                ? indiceEjercicio === max ? 0 : indiceEjercicio + 1
                : indiceEjercicio === 0 ? max : indiceEjercicio - 1;
        renderCard()
    }

    function addSerie() {
        const exercise = trainingSessionData.sessionExercises[indiceEjercicio];

        exercise.series.push({
            weight: null,
            reps: null,
            rir: null,
            intensity: null
        });
        renderCard()
        focusLastWeightInput()
    }

    function focusLastWeightInput() {
        // Esperamos al siguiente repaint del DOM
        requestAnimationFrame(() => {
            const weightInputs = trainingSessionCardContainer.querySelectorAll(
                ".train-sess-card-input-weight"
            );

            const lastInput = weightInputs[weightInputs.length - 1];
            if (lastInput) {
                lastInput.focus();
            }
        });
    }

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
        <p class="train-sess-card-units" data-action="unit" data-unit="Kg">Kg</p>
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

function toogleUnit(elemento) {
    if (elemento.dataset.unit === "Kg") {
        elemento.dataset.unit = "Lb";
        elemento.textContent = "Lb"
    } else {
        elemento.dataset.unit = "Kg";
        elemento.textContent = "Kg"
    }
}
