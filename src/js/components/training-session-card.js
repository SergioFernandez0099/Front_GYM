import {fetchTrainingSession} from "../services/api.js";
import {createExercisePicker} from "../modals/exercise-picker.js";
import {validarNumero10} from "../../utils/validators.js";

export async function trainingSessionCard(sessionId) {

    const trainingSessionData = await fetchTrainingSession(sessionId);
    console.log(trainingSessionData);

    const trainingSessionCardContainer = document.createElement("div");
    trainingSessionCardContainer.className = "train-sess-card-container";

    trainingSessionCardContainer.innerHTML = `
  <div class="train-sess-card">
    <div class="train-sess-card-exercise-num">
        <p>1</p>
    </div>
    <div class="train-sess-card-icon train-sess-card-save-icon">
        <img src="/assets/icons/save.svg" alt="Icono de guardado" class="saveIcon">
    </div>
    <div class="train-sess-card-info-tooltip hide">
        Información adicional asfañslfkjasñl kasfjñsalkjfñlaskj añlksfj añslkjf 
    </div>
    <div id="infoIcon" class="train-sess-card-icon train-sess-card-info-icon">
        <img src="/assets/icons/info.svg" alt="Icono de información" class="infoIcon">
    </div>
    <div class="train-sess-card-header">
        <img src="/assets/images/exercises/pecho/press_banca.png" alt="" class="train-sess-card-image">
        <h2 class="train-sess-card-title">Press Banca</h2>
    </div>
        <div class="train-sess-card-description-container">
            <textarea maxlength="100" placeholder="Escribe algún detalle..." class="train-sess-card-description">Top set en la primera</textarea>
        </div>
        <div class="train-sess-card-series-list">
            <div class="train-sess-card-serie">
                <span class="train-sess-card-serie-num">1</span>
                <img class="train-sess-card-serie-weight-image" src="/assets/icons/kettlebell.svg" alt="" >
                <input class="train-sess-card-input-weight" type="number">
                <div class="train-sess-card-units-container">
                    <p class="train-sess-card-units" data-unit="Kg">Kg</p>
                </div>
               <input class="train-sess-card-input-reps" type="number">
                <span>Reps</span>
                <span>RIR</span>
                <input class="train-sess-card-input-rir" type="number">
                <span>@</span>
                <input class="train-sess-card-input-intensity" type="number">
            </div>
             <div class="train-sess-card-serie">
                <span class="train-sess-card-serie-num">2</span>
                <img class="train-sess-card-serie-weight-image" src="/assets/icons/kettlebell.svg" alt="" >
                <input class="train-sess-card-input-weight" type="number">
                <div class="train-sess-card-units-container">
                    <p class="train-sess-card-units" data-unit="Kg">Kg</p>
                </div>
                <input class="train-sess-card-input-reps" type="number">
                <span>Reps</span>
                <span>RIR</span>
                <input class="train-sess-card-input-rir" type="number">
                <span>@</span>
                <input class="train-sess-card-input-intensity" type="number">
            </div>
             <div class="train-sess-card-serie">
                <span class="train-sess-card-serie-num">3</span>
                <img class="train-sess-card-serie-weight-image" src="/assets/icons/kettlebell.svg" alt="" >
                <input class="train-sess-card-input-weight" type="number">
                <div class="train-sess-card-units-container">
                    <p class="train-sess-card-units" data-unit="Kg">Kg</p>
                </div>
                <input class="train-sess-card-input-reps" type="number">
                <span>Reps</span>
                <span class="label">RIR</span>
                <input class="train-sess-card-input-rir" type="number">
                <span class="label">@</span>
                <input class="train-sess-card-input-intensity" type="number">
            </div>
            <button class="train-sess-card-add-serie">Añadir serie</button>
            <hr>
            <div class="train-sess-card-buttons">
                <button class="train-sess-card-buttons-previous">Anterior</button>
                <button class="train-sess-card-buttons-delete">Borrar ejercicio</button>
                <button class="train-sess-card-buttons-next">Siguiente</button>
            </div>
        </div>
    </div>
   
  `;

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
