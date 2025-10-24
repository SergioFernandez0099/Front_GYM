import "../../styles/components/navbar.css";
import { router } from "../router.js"; 

export function Navbar() {
  const nav = document.createElement("nav");
  nav.className = "navbar";

  nav.innerHTML = `
    <div class="navbar-container">
      <input type="checkbox" id="menu-toggle" />
      <label class="menu-btn" for="menu-toggle">
        <svg id="hamburger" class="Header__toggle-svg" viewBox="0 0 60 40">
          <g stroke="#ff0000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path id="top-line" d="M12,10 L48,10 Z"></path>
            <path id="middle-line" d="M12,20 L48,20 Z"></path>
            <path id="bottom-line" d="M12,30 L48,30 Z"></path>
          </g>
        </svg>
      </label>

      <div class="menu-items-container">
        <ul class="menu-items">
          <li><a href="/">Inicio</a></li>
          <li><a href="/home">Archivo</a></li>
          <li><a href="/routine">Rutina</a></li>
          <li><a href="/sheets">Registro</a></li>
          <li><a href="/exercises">Ejercicios</a></li>
        </ul>
      </div>

      <div class="container-logo">
        <h1 class="border">G Y M</h1>
        <h1 class="wave">G Y M</h1>
      </div>
    </div>
  `;

  const inputMenu = nav.querySelector("#menu-toggle");
  const mainContainer = document.querySelector("main");

  inputMenu.addEventListener("click", () => {
    if (inputMenu.checked) {
      mainContainer.style.filter = "blur(2px)";
    } else {
      mainContainer.style.filter = "none";
    }
  });

  // Intercepta los clicks en los enlaces para SPA
  const menuLinks = nav.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // evita recarga de página
      const href = link.getAttribute("href");
      router.navigate(href); // le dice a Navigo que cambie de ruta
      inputMenu.checked = false; // opcional: cierra el menú al hacer click
      mainContainer.style.filter = "none";
    });
  });

  return nav;
}
