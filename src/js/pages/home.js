// import { Navbar } from '../components/Navbar.js';

import { applyCSS } from "../../utils/helpers";

export function Home() {
  applyCSS('/src/styles/variables.css');

  const container = document.createElement('div');

  const content = document.createElement('div');
  content.innerHTML = `
    <h1 style="color: white;">Bienvenido a Home</h1>
    <p style="color: white;">Contenido de la página principal...</p>
  `;
  container.appendChild(content);

  return container;
}


