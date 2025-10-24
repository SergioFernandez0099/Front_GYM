import Navigo from 'navigo';

import { Home } from './pages/home.js';
import { About } from './pages/about.js';
import { Contact } from './pages/contact.js';
import { getLoginStatus } from './store.js';

const router = new Navigo('/');

export function initRouter() {
  router
    .on('/', () => {
      if (!getLoginStatus()) return redirectToLogin();
      render(Home());
    })
    .on('/about', () => {
      if (!getLoginStatus()) return redirectToLogin();
      render(About());
    })
    .on('/contact', () => {
      if (!getLoginStatus()) return redirectToLogin();
      render(Contact());
    })
    .notFound(() => {
      render(`<h2>404 - Página no encontrada</h2>`);
    })
    .resolve(); // inicializa la ruta actual
}

function render(content) {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.append(content);
}

function redirectToLogin() {
  const app = document.getElementById('app');
  app.innerHTML = '<h2>Por favor, inicia sesión</h2>';
}
