export function RoutineSetCard(exercise) {
  const article = document.createElement("article");
  article.className = "routine-set-card";

  article.innerHTML = `
    <div class="exercise-image-container">
        <img src="/assets/images/exercises/legs/hack-squat-800_rd.png" alt="" class="exercise-image" />
    </div>
    <div class="exercise-info">
        <h2 class="exercise-title">${exercise.name}</h2>
               <div class="routine-details">
            <p class="exercise-text">Series: ${exercise.series}3</p>
            <p class="exercise-text">Reps: ${exercise.reps}</p>
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
