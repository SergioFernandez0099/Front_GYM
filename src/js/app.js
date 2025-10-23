import { Navbar } from './components/navbar.js';
import { router, setLoginStatus } from './router.js';
import { Login } from './pages/login2.js';

let isLoggedIn = false;

function renderApp() {
  if (!isLoggedIn) {
    // Mostrar login primero
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(Login({
      onLogin: () => {
        isLoggedIn = true;
        setLoginStatus(true);
        initSPA(); // Una vez logueado, inicializamos la SPA normal
      }
    }));
  } else {
    initSPA();
  }
}

function initSPA() {
  // Cargar navbar
  document.getElementById('navbar').innerHTML = Navbar();

  // Escuchar rutas
  window.addEventListener('hashchange', router);
  router(); // renderizar la ruta inicial
}

// Iniciar aplicación
renderApp();
