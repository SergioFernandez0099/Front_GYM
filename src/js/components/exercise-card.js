export function ExerciseCard() {
  const article = document.createElement("article");
  article.className = "exercise-card";

  article.innerHTML = `
    <div class="exercise-image-container">
        <img src="/assets/images/exercises/legs/hack-squat-800_rd.png" alt="" class="exercise-image" />
    </div>
    <div class="exercise-info">
        <h2 class="exercise-title">Hack Squat</h2>
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
