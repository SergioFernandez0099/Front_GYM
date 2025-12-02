import {fetchTrainingSession} from "../services/api.js";

export async function trainingSessionCard(sessionId) {

    console.log(sessionId);
    const trainingSessionData = await fetchTrainingSession(sessionId);
    console.log(trainingSessionData);

    const trainingSessionCardContainer = document.createElement("div");
    trainingSessionCardContainer.className = "train-sess-card-container";

    trainingSessionCardContainer.innerHTML = `
  <div class="train-sess-card">
    <div class="train-sess-card-header">
            <img src="/assets/images/exercises/pecho/press_banca.png" alt="" class="train-sess-card-image">
            <h2 class="train-sess-card-title">Press Banca</h2>
        </div>
        <div class="train-sess-card-description-container">
            <p class="train-sess-card-description">Top set en la primera</p>
        </div>
        <div class="train-sess-card-series-list">
            <div class="train-sess-card-serie">
                <span class="train-sess-card-serie-num">1- </span>
                <img class="train-sess-card-serie-weight-image" src="favicon.png" alt="" >
                <input class="train-sess-card-input-weight" type="number">
                <span>Kg,</span>
                <img class="train-sess-card-serie-reps-image" src="" alt="" >
                <input class="train-sess-card-input-reps" type="number">
                <span>, @</span>
                <input class="train-sess-card-input-intensity" type="number">
            </div>
             <div class="train-sess-card-serie">
                <span class="train-sess-card-serie-num">2- </span>
                <img class="train-sess-card-serie-weight-image" src="favicon.png" alt="" >
                <input class="train-sess-card-input-weight" type="number">
                <span>Kg,</span>
                <img class="train-sess-card-serie-reps-image" src="" alt="" >
                <input class="train-sess-card-input-reps" type="number">
                <span>, @</span>
                <input class="train-sess-card-input-intensity" type="number">
            </div>
             <div class="train-sess-card-serie">
                <span class="train-sess-card-serie-num">3- </span>
                <img class="train-sess-card-serie-weight-image" src="favicon.png" alt="" >
                <input class="train-sess-card-input-weight" type="number">
                <span>Kg,</span>
                <img class="train-sess-card-serie-reps-image" src="" alt="" >
                <input class="train-sess-card-input-reps" type="number">
                <span>, @</span>
                <input class="train-sess-card-input-intensity" type="number">
            </div>
        </div>
    </div>
  `;


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
