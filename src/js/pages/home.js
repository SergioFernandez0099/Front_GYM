// import { Navbar } from '../components/Navbar.js';

export function Home() {
  const container = document.createElement('div');

  // Insertar la navbar
  // container.appendChild(Navbar());

  // Insertar el contenido principal
  const content = document.createElement('div');
  content.innerHTML = `
    <h1>Bienvenido a Home</h1>
    <p>Contenido de la página principal...</p>
  `;
  container.appendChild(content);

  return container;
}


