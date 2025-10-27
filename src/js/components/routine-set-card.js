import { applyCSS } from "../../utils/helpers";

export function RoutineSetCard(exercise) {
  applyCSS(
      "/src/styles/routine.css",
      "/src/styles/components/routine-day-card.css",
      "/src/styles/components/routine-set-card.css"
    );
    
  const article = document.createElement("article");
  article.className = "routine-set-card";

  article.innerHTML = `
    <div class="routine-set-image-container">
        <img src="/assets/images/exercises/legs/hack-squat-800_rd.png" alt="" class="routine-set-image" />
    </div>
    <div class="routine-set-info">
        <h2 class="routine-set-title">${exercise.name}</h2>
               <div class="routine-details">
            <p class="routine-set-text">Series: ${exercise.series}3</p>
            <p class="routine-set-text">Reps: ${exercise.reps}</p>
        </div>
    </div>
  `;

  //   const inputMenu = nav.querySelector("#menu-toggle");
  //   const mainContainer = document.querySelector("main");

  //   inputMenu.addEventListener("click", () => {
  //     if (inputMenu.checked) {
  //       mainContainer.style.filter = "blur(2px)";
  //     } else {
  //       mainContainer.style.filter = "none";
  //     }
  //   });

  return article;
}
