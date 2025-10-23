import { Home } from './pages/home.js';
import { About } from './pages/about.js';
import { Contact } from './pages/contact.js';

// Las rutas disponibles
const routes = {
  '/': Home,
  '/about': About,
  '/contact': Contact
};

// Variable global para comprobar login
// Esta variable debe venir de app.js o de un store global
let isLoggedIn = false;

// Función para actualizar el estado de login desde app.js
export function setLoginStatus(status) {
  isLoggedIn = status;
}

// Router principal
export function router() {
  const path = location.hash.slice(1) || '/';
console.log("Router ejecutado para ruta:", path, "Usuario logueado:", isLoggedIn);
  // Si no está logueado, redirigir a login (podría ser opcional si login está en app.js)
  if (!isLoggedIn) {
    // En este ejemplo, app.js se encarga de mostrar Login, así que podemos salir
    return;
  }

  const render = routes[path] || (() => {
    const div = document.createElement('div');
    div.innerHTML = '<h2>404 - Página no encontrada</h2>';
    return div;
  });

  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(render());
}
