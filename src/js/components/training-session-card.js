import {
    createTrainingSessionExercise,
    createTrainingSessionSerie,
    deleteTrainingSession,
    deleteTrainingSessionExercise,
    deleteTrainingSessionSerie,
    fetchExercises,
    fetchTrainingSession,
    updateTrainingSessionSerie
} from "../services/api.js";
import {createExerciseSort} from "../modals/exercise-sort.js";
import {createExercisePicker} from "../modals/exercise-picker.js";
import {openConfirmModal} from "../../utils/helpers.js";
import {safeNavigate} from "../router.js";
import {showSnackbar} from "./snackbar.js";


export async function trainingSessionCard(sessionId) {

    let trainingSessionData;
    let exercisesData;

    try {
        trainingSessionData = await fetchTrainingSession(sessionId);
        exercisesData = await fetchExercises();
    } catch (error) {
        showSnackbar("error", "Error al cargar las sesiones de entrenamiento")
        safeNavigate("/error")
        return null;
    }
    let originalSeries = new Map();

    let indiceEjercicio = 0;

    getExercise().series.forEach((serie) => {
        originalSeries.set(serie.id, {
            reps: serie.reps,
            weight: serie.weight,
            intensity: serie.intensity,
            rir: serie.rir,
            unitId: serie.unit ? serie.unit.id : null
        });
    });

    let exercisesSort = null;
    let pressTimer;


    if (trainingSessionData.sessionExercises.length !== 0) {
        exercisesSort = createExerciseSort(trainingSessionData.sessionExercises, sessionId, moveToExercise)
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
            <div data-action="save" class="train-sess-card-icon train-sess-card-save-icon">
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
        try {
            trainingSessionData = await fetchTrainingSession(sessionId);
        } catch (error) {
            showSnackbar("error","Error al cargar las sesiones de entrenamiento");
            safeNavigate("/error");
            return null
        }
        getExercise().series.forEach((serie) => {
            originalSeries.set(serie.id, {
                reps: serie.reps,
                weight: serie.weight,
                intensity: serie.intensity,
                rir: serie.rir,
                unitId: serie.unit ? serie.unit.id : null
            });
        });
        exercisesSort = trainingSessionData.sessionExercises.length !== 0
            ? createExerciseSort(trainingSessionData.sessionExercises, sessionId, moveToExercise)
            : null;

        renderCard()
    }


    const startPress = (target) => {
        pressTimer = setTimeout(() => {
            const id = target.closest(".train-sess-card-serie").dataset.id;
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
            case "save": {
                await guardarSeries();
                await reloadData()
                break;
            }
            case "next": {
                goToExercise("next")
                showSnackbar("success", "Datos guardados correctamente");
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
                await addSerie();
                break;
            }
            default: {
                return;
            }
        }
    })

    function getSerieFromDOM(serieEl) {
        const repsValue = serieEl.querySelector(".train-sess-card-input-reps").value;
        const weightValue = serieEl.querySelector(".train-sess-card-input-weight").value;
        const intensityValue = serieEl.querySelector(".train-sess-card-input-intensity").value;
        const rirValue = serieEl.querySelector(".train-sess-card-input-rir").value;

        return {
            id: Number(serieEl.dataset.id),
            reps: repsValue !== "" ? Number(repsValue) : null,
            weight: weightValue !== "" ? Number(weightValue) : null,
            rir: rirValue !== "" ? Number(rirValue) : null,
            intensity: intensityValue !== "" ? Number(intensityValue) : null,
            unitId: getUnitIdFromDOM(serieEl)
        };
    }


    function getSerieDiff(original, current) {
        const diff = {id: current.id};

        if (original.reps !== current.reps) diff.reps = current.reps;
        if (original.weight !== current.weight) diff.weight = current.weight;
        if (original.intensity !== current.intensity) diff.intensity = current.intensity;
        if (original.rir !== current.rir) diff.rir = current.rir;
        if (original.unitId !== current.unitId) diff.unitId = current.unitId;

        // Si solo tiene id → no hay cambios
        return Object.keys(diff).length > 1 ? diff : null;
    }

    function collectModifiedSeries() {
        const seriesEls = document.querySelectorAll(".train-sess-card-serie");
        const modified = [];

        seriesEls.forEach((serieEl) => {
            const current = getSerieFromDOM(serieEl);
            const original = originalSeries.get(current.id);

            if (!original) return; // serie nueva → otro endpoint

            const diff = getSerieDiff(original, current);
            if (diff) {
                modified.push(diff);
            }
        });

        return modified;
    }

    function getUnitIdFromDOM(serieEl) {
        const unitEl = serieEl.querySelector(".train-sess-card-units");
        return unitEl ? Number(unitEl.dataset.unitId) : null;
    }

    function goToExercise(direction) {
        const max = trainingSessionData.sessionExercises.length - 1;

        indiceEjercicio =
            direction === "next"
                ? indiceEjercicio === max ? 0 : indiceEjercicio + 1
                : indiceEjercicio === 0 ? max : indiceEjercicio - 1;

        getExercise().series.forEach((serie) => {
            originalSeries.set(serie.id, {
                reps: serie.reps,
                weight: serie.weight,
                intensity: serie.intensity,
                rir: serie.rir,
                unitId: serie.unit ? serie.unit.id : null
            });
        });
        renderCard()
    }

    async function guardarSeries() {
        const modifiedSeries = collectModifiedSeries();

        if (modifiedSeries.length === 0) {
            console.log("No hay cambios");
            return;
        }
        const exercise = getExercise();

        if (!exercise) return;

        const data = {
            series: modifiedSeries
        };

        try {
            await updateTrainingSessionSerie(sessionId, exercise.id, data);
            showSnackbar("success", "Datos guardados correctamente");
        } catch (error) {
            console.error("No se pudo guardar los datos: ", error);
            const message = "No se pudo guardar los datos";
            showSnackbar("error", message);
        }
    }

    async function deleteSerie(id) {
        const confirmed = await openConfirmModal("¿Estás seguro de borrar esta serie?");
        if (!confirmed) return;

        const exercise = getExercise();
        if (!exercise) return;

        try {
            await deleteTrainingSessionSerie(sessionId, exercise.id, Number(id));
            showSnackbar("success", "Serie eliminada correctamente");
            await reloadData()
        } catch (error) {
            console.error("No se pudo borrar la serie: ", error);
            const message = "No se pudo borrar la serie";
            showSnackbar("error", message);
        }
    }

    async function addSerie() {
        const exercise = getExercise();
        if (!exercise) return;

        try {
            await createTrainingSessionSerie(sessionId, exercise.id);
            await reloadData()
            focusLastWeightInput()
        } catch (error) {
            console.error("No se pudo crear la serie", error);
            const message = "No se pudo añadir la nueva serie";
            showSnackbar("error", message);
        }
    }

    async function deleteSession() {
        const confirmed = await openConfirmModal("¿Estás seguro de borrar esta sesión?");
        if (!confirmed) {
            return;
        }

        try {
            await deleteTrainingSession(sessionId);
            showSnackbar("success", "Sesión eliminada correctamente");
            safeNavigate('/sessions')
        } catch (error) {
            console.error("Error eliminando la sesión:", error);
            const message = "No se pudo eliminar la sesión";
            showSnackbar("error", message);
        }
    }

    async function deleteExercise() {
        const exercise = getExercise();
        if (!exercise) return;

        const confirmed = await openConfirmModal("¿Estás seguro de borrar este ejercicio?");
        if (!confirmed) return;

        try {
            await deleteTrainingSessionExercise(sessionId, exercise.id);
            showSnackbar("success", "Ejercicio eliminado correctamente");
            await reloadData();
        } catch (error) {
            console.error("Error eliminando el ejercicio:", error);
            const message = "No se pudo eliminar el ejercicio";
            showSnackbar("error", message);
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
       <p class="train-sess-card-units" data-action="unit" data-unit-id="${serie.unit ? serie.unit.id : ''}">${serie.unit ? serie.unit.symbol : ''}</p>
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
    if (elemento.dataset.unitId === "1") {
        elemento.dataset.unitId = "2";
        elemento.textContent = "Lb"
    } else {
        elemento.dataset.unitId = "1";
        elemento.textContent = "Kg"
    }
}
