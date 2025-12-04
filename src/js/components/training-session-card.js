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
    <div class="train-sess-card-icon train-sess-card-info-icon">
        <img src="/assets/icons/info.svg" alt="Icono de información" class="infoIcon">
    </div>
    <div class="train-sess-card-header">
        <img src="/assets/images/exercises/pecho/press_banca.png" alt="" class="train-sess-card-image">
        <h2 class="train-sess-card-title">Press Banca</h2>
    </div>
        <div class="train-sess-card-description-container">
            <p class="train-sess-card-description">Top set en la primera</p>
        </div>
        <div class="train-sess-card-series-list">
            <div class="train-sess-card-serie">
                <span class="train-sess-card-serie-num">1</span>
                <img class="train-sess-card-serie-weight-image" src="/assets/icons/kettlebell.svg" alt="" >
                <input class="train-sess-card-input-weight" type="number">
                <span>Kg</span>
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
                <span>Kg</span>
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
                <span>Kg</span>
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
    // card.addEventListener("beforeinput", (e) => {
    //     const element = e.target;
    //     if (element.classList.contains("train-sess-card-input-intensity") ||
    //         element.classList.contains("train-sess-card-input-rir")
    //     ) {
    //         // e.data puede ser null si se borra
    //         const inputData = e.data || "";
    //
    //         // Simular cuál sería el nuevo valor si se permitiera el input
    //         const start = element.selectionStart;
    //         const end = element.selectionEnd;
    //         const newValue =
    //             element.value.slice(0, start) +
    //             inputData +
    //             element.value.slice(end);
    //
    //         // Si está vacío, permitir
    //         if (newValue === "") return;
    //
    //         // Validar: máximo 2 dígitos
    //         if (!/^\d{1,2}$/.test(newValue)) {
    //             e.preventDefault();
    //             return;
    //         }
    //
    //         // Validar que sea un número de 1 o 2 dígitos
    //         if (!/^\d{1,2}$/.test(newValue)) {
    //             e.preventDefault();
    //             return;
    //         }
    //
    //         // Convertir a número y validar rango 1-10
    //         const num = Number(newValue);
    //         if (num < 1 || num > 10) {
    //             e.preventDefault();
    //         }
    //     }
    //
    // })

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
