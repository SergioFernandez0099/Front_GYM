export function ExerciseCard(exercise) {
  const article = document.createElement("article");
  article.className = "exercise-card";

  article.innerHTML = `
    <div class="exercise-image-container">
        <img src="${exercise.imageUrl}" alt="" class="exercise-image" />
    </div>
    <div class="exercise-info">
        <h2 class="exercise-title">${exercise.name}</h2>
    </div>
  `;

  return article;
}