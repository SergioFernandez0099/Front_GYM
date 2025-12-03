import {fetchTrainingSession} from "../services/api.js";
import {createExercisePicker} from "./modals/exercise-picker.js";

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
     <div class="train-sess-card-save-icon">
        <img src="/assets/icons/save.svg" alt="Icono de guardado" class="saveIcon">
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
                <div class="train-sess-card-serie-image-container"> 
                    <span class="train-sess-card-serie-num">1</span>
                    <img class="train-sess-card-serie-weight-image" src="../../../favicon.png" alt="" >
                </div>
                <input class="train-sess-card-input-weight" type="number">
                <span>Kg</span>
                <img class="train-sess-card-serie-reps-image" src="" alt="" >
                <input class="train-sess-card-input-reps" type="number">
                <span>RIR</span>
                <select class="train-sess-card-input-reps"> 
                  <option value="">…</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </select>
                <span>@</span>
                <input class="train-sess-card-input-intensity" type="number">
                <button class="train-sess-card-delete-btn"><img src="/assets/icons/trash.svg" alt="Icono de borrar" class="trashIcon"></button>
            </div>
             <div class="train-sess-card-serie">
                 <div class="train-sess-card-serie-image-container"> 
                    <span class="train-sess-card-serie-num">2</span>
                    <img class="train-sess-card-serie-weight-image" src="../../../favicon.png" alt="" >
                </div>
                <input class="train-sess-card-input-weight" type="number">
                <span>Kg</span>
                <img class="train-sess-card-serie-reps-image" src="" alt="" >
                <input class="train-sess-card-input-reps" type="number">
                <span>RIR</span>
                <input class="train-sess-card-input-rir" type="number">
                <span>@</span>
                <input class="train-sess-card-input-intensity" type="number">
                <button class="train-sess-card-delete-btn"><img src="/assets/icons/trash.svg" alt="Icono de borrar" class="trashIcon"></button>
            </div>
             <div class="train-sess-card-serie">
                <span class="train-sess-card-serie-num">3- </span>
                <img class="train-sess-card-serie-weight-image" src="../../../favicon.png" alt="" >
                <input class="train-sess-card-input-weight" type="number">
                <span>Kg</span>
                <img class="train-sess-card-serie-reps-image" src="" alt="" >
                <input class="train-sess-card-input-reps" type="number">
                <span>RIR</span>
                <input class="train-sess-card-input-rir" type="number">
                 <span>@</span>
                <input class="train-sess-card-input-intensity" type="number">
                <button class="train-sess-card-delete-btn"><img src="/assets/icons/trash.svg" alt="Icono de borrar" class="trashIcon"></button>
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
    imgList.src = "/assets/icons/trash.svg";
    imgList.alt = "Icono de listado";
    imgList.className = "listIcon";

    btnList.appendChild(imgList);
    generalOptions.appendChild(btnList);

    const btnAdd = document.createElement("button");
    btnAdd.className = "train-sess-card-general-options-add";
    btnAdd.textContent = "Añadir ejercicio";

    const imgAdd = document.createElement("img");
    imgAdd.src = "/assets/icons/trash.svg";
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
