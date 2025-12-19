import {
    createTrainingSessionExercise,
    deleteTrainingSession,
    deleteTrainingSessionExercise,
    fetchExercises,
    fetchTrainingSession
} from "../services/api.js";
import {createExerciseSort} from "../modals/exercise-sort.js";
import {createExercisePicker} from "../modals/exercise-picker.js";
import {openConfirmModal} from "../../utils/helpers.js";
import {safeNavigate} from "../router.js";


export async function trainingSessionCard(sessionId) {

    let trainingSessionData = await fetchTrainingSession(sessionId);
    const exercisesData = await fetchExercises();
    let indiceEjercicio = 0;

    let exercisesSort = null;
    let pressTimer;

    console.log(trainingSessionData)
    if (trainingSessionData.sessionExercises.length !== 0) {
        exercisesSort = createExerciseSort(trainingSessionData.sessionExercises, moveToExercise)
    }

    const exercisePicker = createExercisePicker(exercisesData, addExercise);

    const trainingSessionCardContainer = document.createElement("div");
    trainingSessionCardContainer.className = "train-sess-card-container";

    function renderCard() {
        const exerciseData =
            getExercise();

        let seriesHTML = null;
        if (exercisesSort) {
            seriesHTML = exerciseData.series
                .map((serie, index) => renderSerie(serie, index))
                .join("");
        }

        trainingSessionCardContainer.innerHTML = `
            <div class="train-sess-card-general-options">
                <button class="train-sess-card-general-options-list" ${exercisesSort ? 'enabled' : "disabled"} data-action="list">
                    Ejercicios
                    <img src="/assets/icons/list.svg" alt="Icono de listado" class="listIcon">
                </button>
        
                <button class="train-sess-card-general-options-add" data-action="exercise">
                    Añadir ejercicio
                    <img src="/assets/icons/add.svg" alt="Icono de añadir" class="addIcon">
                </button>
        
                <button class="train-sess-card-general-options-del" data-action="delete-session">
                    Borrar sesión
                    <img src="/assets/icons/trash.svg" alt="Icono de borrar" class="trashIcon">
                </button>
            </div>

          <div class="train-sess-card">
            <div class="train-sess-card-exercise-num ${exercisesSort ? '' : 'hide'}">
                <p>${getExercise()?.order ?? ''}</p>
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
                <img src="${getExercise()?.exercise.imageUrl ?? '/assets/images/snorlax.png'}" alt="" class="train-sess-card-image">
                <h2 class="train-sess-card-title">${getExercise()?.exercise.name ?? "Añade un ejercicio"}</h2>
            </div>
            <div class="train-sess-card-description-container">
                <textarea maxlength="100" placeholder="Escribe algún detalle..." class="train-sess-card-description">Top set en la primera</textarea>
            </div>
            <div class="train-sess-card-series-list">
                ${seriesHTML ?? ""}
            </div>
            <button class="train-sess-card-add-serie" ${exercisesSort ? 'enabled' : "disabled"}  data-action="serie">Añadir serie</button>
            <hr>
            <div class="train-sess-card-buttons">
                <button class="train-sess-card-buttons-previous" ${exercisesSort ? 'enabled' : "disabled"}  data-action="previous">Anterior</button>
                <button class="train-sess-card-buttons-delete" ${exercisesSort ? 'enabled' : "disabled"} data-action="delete-exercise">Borrar ejercicio</button>
                <button class="train-sess-card-buttons-next" ${exercisesSort ? 'enabled' : "disabled"}  data-action="next">Siguiente</button>
            </div>
          </div>
  `;
    }

    renderCard();

    async function reloadData() {
        trainingSessionData = await fetchTrainingSession(sessionId);
        exercisesSort = trainingSessionData.sessionExercises.length !== 0
            ? createExerciseSort(trainingSessionData.sessionExercises, moveToExercise)
            : null;

        renderCard()
    }


    const startPress = (target) => {
        pressTimer = setTimeout(() => {
            const id = target.closest(".train-sess-card-serie").dataset.id;
            console.log(id)
            deleteSerie(id)
        }, 600);
    };

    const cancelPress = () => {
        clearTimeout(pressTimer);
    };

    trainingSessionCardContainer.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('train-sess-card-serie') || e.target.classList.contains('train-sess-card-serie')
            || e.target.classList.contains('train-sess-card-serie-num') || e.target.tagName === 'SPAN') {
            startPress(e.target);
        }
    });
    trainingSessionCardContainer.addEventListener('mouseup', cancelPress);
    trainingSessionCardContainer.addEventListener('mouseleave', cancelPress);

    trainingSessionCardContainer.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('train-sess-card-serie')) {
            startPress(e.target);
        }
    });
    trainingSessionCardContainer.addEventListener('touchend', cancelPress);
    trainingSessionCardContainer.addEventListener('touchcancel', cancelPress);

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

    trainingSessionCardContainer.addEventListener("click", async (event) => {
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
            case "delete-exercise": {
                await deleteExercise()
                break;
            }
            case "delete-session": {
                await deleteSession();
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

    // TODO
    function deleteSerie(id) {
        exerciseData.series = exerciseData.series.filter(serie => serie.id !== id);
        renderCard()
    }

    // TODO
    function addSerie() {
        const exercise = getExercise();

        if (!exercise) return;

        exercise.series.push({
            weight: null,
            reps: null,
            rir: null,
            intensity: null
        });
        renderCard()
        focusLastWeightInput()
    }

    async function deleteSession() {
        const confirmed = await openConfirmModal("¿Estás seguro de borrar esta sesión?");
        if (confirmed) {
            const result = await deleteTrainingSession(sessionId);

            if (result && result.ok) {
                safeNavigate('/sessions')
            } else {
                console.warn("No se pudo borrar el ejercicio", result);
            }
        } else {
            console.log("Acción cancelada");
        }
    }

    async function deleteExercise() {
        const exercise = getExercise();

        if (!exercise) return;
        const confirmed = await openConfirmModal("¿Estás seguro de borrar este ejercicio?");
        if (confirmed) {
            const result = await deleteTrainingSessionExercise(sessionId, exercise.id);

            if (result && result.ok) {
                await reloadData();
                renderCard()
            } else {
                console.warn("No se pudo añadir el ejercicio", result);
            }
        } else {
            console.log("Acción cancelada");
        }
    }

    function getExercise() {
        return trainingSessionData.sessionExercises[indiceEjercicio];
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

    async function addExercise(id) {
        try {
            const result = await createTrainingSessionExercise(sessionId, {
                exerciseId: Number(id),
            });

            if (result && result.ok) {
                indiceEjercicio = trainingSessionData.sessionExercises.length;
                await reloadData();
            } else {
                console.warn("No se pudo añadir el ejercicio", result);
            }
        } catch (error) {
            console.error("Error al añadir el ejercicio:", error);
        }
    }

    function moveToExercise(id) {
        console.log(99)
        indiceEjercicio = trainingSessionData.sessionExercises.findIndex(x => x.id === id);
        renderCard()
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
    <div class="train-sess-card-serie" data-id="${serie.id}">
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
