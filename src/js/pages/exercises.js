import { ExerciseCard } from "../components/exercise-card";
import "../../styles/exercises.css";

export function Exercises() {
  const section = document.createElement("section");
  section.className = "exercise-list";

  section.appendChild(ExerciseCard());
//   section.innerHTML = ExerciseCard();

  //   const inputMenu = nav.querySelector("#menu-toggle");
  //   const mainContainer = document.querySelector("main");

  //   inputMenu.addEventListener("click", () => {
  //     if (inputMenu.checked) {
  //       mainContainer.style.filter = "blur(2px)";
  //     } else {
  //       mainContainer.style.filter = "none";
  //     }
  //   });

  return section;
}
