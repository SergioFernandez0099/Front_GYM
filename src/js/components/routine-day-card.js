import { router } from "../router";

export function RoutineDayCard(day, series = 3, reps = 10) {
  const article = document.createElement("article");

  if (day === "add") {
    article.className = "routine-day-add-card";
    article.innerHTML = `
    <div class="button-container">
    <div class="addButton">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
  </div>
  `;

  } else {
    article.className = "routine-day-card";
    article.innerHTML = `
    <div class="routine-info">
        <h2 class="routine-day-title">${day}</h2>
    </div>
    <div class="routine-day-image-container">
        <img src="https://media.istockphoto.com/id/953047628/es/foto/fondo-gimnasio-con-equipo-de.jpg?s=612x612&w=0&k=20&c=TeLvdkotQ7BW40Dy2kRz0L2Wa0klBm9WvCewIXwBFzk=" alt="Imagen de fondo en un gimnasio" class="routine-image" />
    </div>
  `;
     article.addEventListener("click", () => {
    router.navigate(`/routine/set/${day}`);
  });
  }

 
  return article;
}
