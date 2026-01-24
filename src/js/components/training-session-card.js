import {
    createTrainingSessionExercise,
    createTrainingSessionSerie,
    deleteTrainingSession,
    deleteTrainingSessionExercise,
    deleteTrainingSessionSerie,
    fetchExercises,
    fetchTrainingSession,
    updateTrainingSession
} from "../services/api.js";
import {createExerciseSort} from "../modals/exercise-sort.js";
import {createExercisePicker} from "../modals/exercise-picker.js";
import {capitalize, glowEffect, openConfirmModal, shakeEffect} from "../../utils/helpers.js";
import {safeNavigate} from "../router.js";
import {showSnackbar} from "./snackbar.js";
import {createSessionHistory} from "../modals/session-history.js";


export async function trainingSessionCard(sessionId) {

    let trainingSessionData;
    let exercisesData;

    try {
        trainingSessionData = await fetchTrainingSession(sessionId);
        exercisesData = await fetchExercises();
    } catch (error) {
        showSnackbar("error", "Error al cargar las sesiones de entrenamiento")
        safeNavigate("/error");
        return null;
    }
    let originalSeries = new Map();

    let indiceEjercicio = 0;

    let originalDescription = getExercise()?.description ?? "";

    getExercise()?.series.forEach((serie) => {
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

    let sessionHistory = createSessionHistory(trainingSessionData.sessionExercises[indiceEjercicio].history,
        trainingSessionData.sessionExercises[indiceEjercicio].exercise.name);

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

        sessionHistory = createSessionHistory(trainingSessionData.sessionExercises[indiceEjercicio].history,
            trainingSessionData.sessionExercises[indiceEjercicio].exercise.name);

        trainingSessionCardContainer.innerHTML = `
            <div class="train-sess-card-general-options">
                <button class="train-sess-card-general-options-list" ${exercisesSort ? 'enabled' : "disabled"} data-action="list">
                    Ejercicios
                    <img src="/icons/list.svg" alt="Icono de listado" class="listIcon">
                </button>
        
                <button class="train-sess-card-general-options-add" data-action="exercise">
                    Añadir ejercicio
                    <img src="/icons/add.svg" alt="Icono de añadir" class="addIcon">
                </button>
        
                <button class="train-sess-card-general-options-del" data-action="delete-session">
                    Borrar sesión
                    <img src="/icons/trash.svg" alt="Icono de borrar" class="trashIcon">
                </button>
            </div>

          <div class="train-sess-card">
            <div class="train-sess-card-exercise-num ${exercisesSort ? '' : 'hide'}">
                <p>${getExercise()?.order ?? ''}</p>
            </div>
            <div data-action="history" class="train-sess-card-icon train-sess-card-history-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="historyIcon" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
                    <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                        <path d="M 48.831 86.169 c -13.336 0 -25.904 -6.506 -33.62 -17.403 c -2.333 -3.295 -4.163 -6.901 -5.437 -10.717 l 5.606 -1.872 c 1.09 3.265 2.657 6.352 4.654 9.174 c 6.61 9.336 17.376 14.908 28.797 14.908 c 19.443 0 35.26 -15.817 35.26 -35.26 c 0 -19.442 -15.817 -35.259 -35.26 -35.259 C 29.389 9.74 13.571 25.558 13.571 45 h -5.91 c 0 -22.701 18.468 -41.169 41.169 -41.169 C 71.532 3.831 90 22.299 90 45 C 90 67.701 71.532 86.169 48.831 86.169 z" fill="currentColor" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
                        <polygon points="64.67,61.69 45.88,46.41 45.88,19.03 51.78,19.03 51.78,43.59 68.4,57.1 " fill="currentColor" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                        <polygon points="21.23,40.41 10.62,51.02 0,40.41 " fill="currentColor" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
                    </g>
                </svg>
            </div>
            
            <div data-action="save" class="train-sess-card-icon train-sess-card-save-icon">
                <svg width="800px" class="saveIcon" height="800px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                        fill="currentColor"/>
                </svg>
              <span class="save-loader">
                  <svg fill="currentColor" height="800px" width="800px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 489.711 489.711" xml:space="preserve">
                        <g>
                            <g>
                                <path d="M112.156,97.111c72.3-65.4,180.5-66.4,253.8-6.7l-58.1,2.2c-7.5,0.3-13.3,6.5-13,14c0.3,7.3,6.3,13,13.5,13
                            c0.2,0,0.3,0,0.5,0l89.2-3.3c7.3-0.3,13-6.2,13-13.5v-1c0-0.2,0-0.3,0-0.5v-0.1l0,0l-3.3-88.2c-0.3-7.5-6.6-13.3-14-13
                            c-7.5,0.3-13.3,6.5-13,14l2.1,55.3c-36.3-29.7-81-46.9-128.8-49.3c-59.2-3-116.1,17.3-160,57.1c-60.4,54.7-86,137.9-66.8,217.1
                            c1.5,6.2,7,10.3,13.1,10.3c1.1,0,2.1-0.1,3.2-0.4c7.2-1.8,11.7-9.1,9.9-16.3C36.656,218.211,59.056,145.111,112.156,97.111z"></path>
                                <path d="M462.456,195.511c-1.8-7.2-9.1-11.7-16.3-9.9c-7.2,1.8-11.7,9.1-9.9,16.3c16.9,69.6-5.6,142.7-58.7,190.7
                            c-37.3,33.7-84.1,50.3-130.7,50.3c-44.5,0-88.9-15.1-124.7-44.9l58.8-5.3c7.4-0.7,12.9-7.2,12.2-14.7s-7.2-12.9-14.7-12.2l-88.9,8
                            c-7.4,0.7-12.9,7.2-12.2,14.7l8,88.9c0.6,7,6.5,12.3,13.4,12.3c0.4,0,0.8,0,1.2-0.1c7.4-0.7,12.9-7.2,12.2-14.7l-4.8-54.1
                            c36.3,29.4,80.8,46.5,128.3,48.9c3.8,0.2,7.6,0.3,11.3,0.3c55.1,0,107.5-20.2,148.7-57.4
                            C456.056,357.911,481.656,274.811,462.456,195.511z"></path>
                            </g>
                        </g>
                  </svg>
              </span>
            </div>
            <div class="train-sess-card-info-tooltip hide">
                Para borrar una serie tan solo manten pulsado el número de esta. 
                Para cambiar las unidades simplemente pulsa sobre ellas
            </div>
            <div data-action="info" class="train-sess-card-icon train-sess-card-info-icon">
                <svg width="800px" class="infoIcon" height="800px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.75C11.8019 17.7474 11.6126 17.6676 11.4725 17.5275C11.3324 17.3874 11.2526 17.1981 11.25 17V10C11.25 9.80109 11.329 9.61032 11.4697 9.46967C11.6103 9.32902 11.8011 9.25 12 9.25C12.1989 9.25 12.3897 9.32902 12.5303 9.46967C12.671 9.61032 12.75 9.80109 12.75 10V17C12.7474 17.1981 12.6676 17.3874 12.5275 17.5275C12.3874 17.6676 12.1981 17.7474 12 17.75Z"
                        fill="currentColor"/>
                    <path d="M12 8.25C11.8019 8.24741 11.6126 8.16756 11.4725 8.02747C11.3324 7.88737 11.2526 7.69811 11.25 7.5V7C11.25 6.80109 11.329 6.61032 11.4697 6.46967C11.6103 6.32902 11.8011 6.25 12 6.25C12.1989 6.25 12.3897 6.32902 12.5303 6.46967C12.671 6.61032 12.75 6.80109 12.75 7V7.5C12.7474 7.69811 12.6676 7.88737 12.5275 8.02747C12.3874 8.16756 12.1981 8.24741 12 8.25Z"
                        fill="currentColor"/>
                </svg>
            </div>
            <div class="train-sess-card-header">
                <img src="${getExercise()?.exercise.imageUrl ?? '/images/snorlax.avif'}" alt="" class="train-sess-card-image">
                <h2 class="train-sess-card-title">${getExercise()?.exercise.name ?? "Añade un ejercicio"}</h2>
            </div>
            <div class="train-sess-card-description-container">
                <textarea maxlength="100" placeholder="Escribe algún detalle..." ${exercisesSort ? '' : 'readonly'} class="train-sess-card-description">${getExercise()?.description ?? ""}</textarea>
            </div>
            <div class="train-sess-card-series-list">
                ${seriesHTML ?? ""}
            </div>
            <button class="train-sess-card-add-serie" data-action="serie">Añadir serie</button>
            <hr>
            <div class="train-sess-card-buttons">
                <button class="train-sess-card-buttons-previous" data-action="previous">Anterior</button>
                <button class="train-sess-card-buttons-delete" data-action="delete-exercise">Borrar ejercicio</button>
                <button class="train-sess-card-buttons-next" data-action="next">Siguiente</button>
            </div>
          </div>
  `;

        trainingSessionCardContainer
            .querySelectorAll(".train-sess-card-serie-weight-image")
            .forEach(imagen => {
                imagen.addEventListener('contextmenu', (e) => e.preventDefault());
            });

    }

    renderCard();

    async function reloadData() {
        try {
            trainingSessionData = await fetchTrainingSession(sessionId);
            if (getExercise()) {
                getExercise()?.series.forEach((serie) => {
                    originalSeries.set(serie.id, {
                        reps: serie.reps,
                        weight: serie.weight,
                        intensity: serie.intensity,
                        rir: serie.rir,
                        unitId: serie.unit ? serie.unit.id : null
                    });
                });
                originalDescription = getExercise()?.description ?? "";
            } else {
                indiceEjercicio = 0;
            }
            exercisesSort = trainingSessionData.sessionExercises.length !== 0
                ? createExerciseSort(trainingSessionData.sessionExercises, sessionId, moveToExercise)
                : null;
            renderCard()
        } catch (error) {
            showSnackbar("error", "Error al cargar las sesiones de entrenamiento");
            safeNavigate("/error");
            return null
        }
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

    const handlePressStart = (e) => {
        const serieElement = e.target.closest('.train-sess-card-serie');
        if (serieElement) {
            startPress(serieElement);
        }
    };

    trainingSessionCardContainer.addEventListener('mousedown', handlePressStart);
    trainingSessionCardContainer.addEventListener('mouseup', cancelPress);
    trainingSessionCardContainer.addEventListener('mouseleave', cancelPress);

    trainingSessionCardContainer.addEventListener('touchstart', handlePressStart, {passive: true});
    trainingSessionCardContainer.addEventListener('touchend', cancelPress);
    trainingSessionCardContainer.addEventListener('touchmove', cancelPress, {passive: true});
    trainingSessionCardContainer.addEventListener('touchcancel', cancelPress);

    trainingSessionCardContainer.addEventListener("input", (e) => {
        const element = e.target;

        if (
            !element.classList.contains("train-sess-card-input-intensity") &&
            !element.classList.contains("train-sess-card-input-rir")
        ) {
            return;
        }

        let value = element.value;

        // Permitimos vacío (para borrar)
        if (value === "") return;

        // Si es número, lo convertimos a entero
        const num = parseInt(value, 10);

        // Si no es un número válido o fuera de rango, revertimos
        if (isNaN(num) || num < 0 || num > 10) {
            // Restauramos el valor previo
            element.value = element.dataset.lastValid ?? "";
        } else {
            // Guardamos el último valor válido
            element.dataset.lastValid = num;
            element.value = num; // Esto asegura que "01" se convierta en "1"
        }
    });


    trainingSessionCardContainer.addEventListener("focus", (e) => {
        const element = e.target;

        if (
            element.classList.contains("train-sess-card-input-intensity") ||
            element.classList.contains("train-sess-card-input-rir") ||
            element.classList.contains("train-sess-card-input-weight") ||
            element.classList.contains("train-sess-card-input-reps")
        ) {
            element.select();
        }
    }, true);

    trainingSessionCardContainer.addEventListener("click", async (event) => {
        const elemento = event.target.closest("[data-action]");
        if (elemento?.classList.contains('disabled')) return;
        if (!getExercise() && elemento?.dataset.action !== "exercise") {
            event.stopPropagation();
            const addButton = trainingSessionCardContainer.querySelector('.train-sess-card-general-options-add');
            shakeEffect(addButton);
            return;
        }
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
            case "history": {
                sessionHistory.show();
                break;
            }
            case "info": {
                const tooltip = trainingSessionCardContainer.querySelector(".train-sess-card-info-tooltip")
                tooltip.classList.toggle("hide")
                break;
            }
            case "save": {
                elemento.classList.add('disabled');
                await guardarSeriesYDescripcion(elemento);
                elemento.classList.remove('disabled');
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
                elemento.classList.add('disabled');
                await addSerie();
                elemento.classList.remove('disabled');
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

    async function guardarSeriesYDescripcion(saveIcon) {
        const card = document.querySelector(".train-sess-card");

        const modifiedSeries = collectModifiedSeries()

        const inputDescription = document.querySelector(".train-sess-card-description");
        let currentDescription = inputDescription.value.trim();
        if (modifiedSeries.length === 0 && originalDescription === currentDescription) {
            inputDescription.value = currentDescription;
            showSnackbar("warning", "Realiza alguna modificación antes de guardar")
            shakeEffect(card)
            return;
        }
        const exercise = getExercise();

        if (!exercise) return;

        saveIcon.classList.add("loading");
        saveIcon.children[0].classList.add("hideOpacity");

        const data = {
            ...(modifiedSeries.length !== 0 && {series: modifiedSeries}),
            ...(originalDescription !== currentDescription && {description: currentDescription}),
        };

        try {
            await updateTrainingSession(sessionId, exercise.id, data);

            // Actualización en local
            if (modifiedSeries.length !== 0) {
                modifiedSeries.forEach(mod => {
                    const original = originalSeries.get(mod.id);
                    if (original) {
                        Object.assign(original, mod);
                    }

                    // Actualizamos la serie dentro del objeto trainingSessionData
                    const serieToUpdate = exercise.series.find(s => s.id === mod.id);
                    if (serieToUpdate) {
                        Object.assign(serieToUpdate, mod);
                    }
                });
            }

            if (originalDescription !== currentDescription) {
                inputDescription.value = inputDescription.value.trim();
                exercise.description = inputDescription.value;
                originalDescription = inputDescription.value;
            }

            saveIcon.classList.remove("loading");
            saveIcon.children[0].classList.remove("hideOpacity");

            glowEffect(card)
            showSnackbar("success", "Datos guardados correctamente");
        } catch (error) {
            shakeEffect(card)
            saveIcon.classList.remove("loading");
            saveIcon.children[0].classList.remove("hideOpacity");
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

            originalSeries.delete(Number(id));
            exercise.series = exercise.series.filter(s => s.id !== Number(id));

            const serieEl = document.querySelector(`.train-sess-card-serie[data-id='${id}']`);
            if (serieEl) {
                serieEl.remove();
            }

            updateSerieNumbers();

            showSnackbar("success", "Serie eliminada correctamente");
        } catch (error) {
            console.error("No se pudo borrar la serie: ", error);
            const message = "No se pudo borrar la serie";
            showSnackbar("error", message);
        }
    }

    function updateSerieNumbers() {
        const seriesEls = document.querySelectorAll(".train-sess-card-serie");
        seriesEls.forEach((serieEl, index) => {
            const numEl = serieEl.querySelector(".train-sess-card-serie-num");
            if (numEl) numEl.textContent = index + 1;
        });
    }

    async function addSerie() {
        const exercise = getExercise();
        if (!exercise) return;

        try {
            const newSerie = await createTrainingSessionSerie(sessionId, exercise.id);

            if (!newSerie || !newSerie.id) throw new Error("No se puedo crear la serie, error del servidor.");

            exercise.series.push(newSerie);

            originalSeries.set(newSerie.id, {
                reps: newSerie.reps,
                weight: newSerie.weight,
                intensity: newSerie.intensity,
                rir: newSerie.rir,
                unitId: newSerie.unit ? newSerie.unit.id : null
            });

            const seriesList = document.querySelector(".train-sess-card-series-list");
            const serieIndex = seriesList.children.length; // índice para renderSerie
            const serieHTML = renderSerie(newSerie, serieIndex);

            // Convertimos el string HTML a elemento DOM
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = serieHTML.trim(); // trim por seguridad
            const serieEl = tempDiv.firstChild;

            seriesList.appendChild(serieEl);
            focusLastWeightInput()
        } catch (error) {
            console.error("No se pudo crear la serie", error);
            const message = "No se pudo añadir la nueva serie";
            showSnackbar("error", message);
        }
    }

    async function deleteSession() {
        const confirmed = await openConfirmModal("¿Estás seguro de borrar esta sesión?");
        if (!confirmed) return;

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
            if (indiceEjercicio > 0) indiceEjercicio--
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
            await createTrainingSessionExercise(sessionId, {
                exerciseId: Number(id),
            });

            indiceEjercicio = trainingSessionData.sessionExercises.length;

            showSnackbar("success", "Ejercicio añadido correctamente")
            await reloadData();

        } catch (error) {
            showSnackbar("error", "Error al añadir el ejercicio")
        }
    }

    function moveToExercise(id) {
        indiceEjercicio = trainingSessionData.sessionExercises.findIndex(x => x.id === id);
        renderCard()
    }

    return trainingSessionCardContainer;
}

function renderSerie(serie, index) {
    return `
    <div class="train-sess-card-serie" data-id="${serie.id}">
    
      <div class="train-sess-card-serie-image-container">
            <span class="train-sess-card-serie-num">${index + 1}</span>

            <img class="train-sess-card-serie-weight-image"
                src="/icons/kettlebell.svg" alt="Imágen de pesa rusa">
      </div>

      <input class="train-sess-card-input-weight"
             type="number"
             value="${serie.weight ?? ''}">

      <div class="train-sess-card-units-container">
       <p class="train-sess-card-units" data-action="unit" data-unit-id="${serie.unit ? serie.unit.id : ''}">${serie.unit ? capitalize(serie.unit.symbol) : ''}</p>
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
