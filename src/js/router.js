import Navigo from "navigo";

import { Home } from "./pages/home.js";
import { About } from "./pages/about.js";
import { Contact } from "./pages/contact.js";
import { Exercises } from "./pages/exercises.js";
import { getLoginStatus } from "./store.js";

export const router = new Navigo("/");

// Inicializa el router después de que el DOM cargue
export function initRouter() {
  router
    .on(
      "/",
      requireLogin(() => render(Home()))
    )
    .on("/login", () => render(`<h2>Por favor, inicia sesión</h2>`))
    .on(
      "/about",
      requireLogin(() => render(About()))
    )
    .on(
      "/contact",
      requireLogin(() => render(Contact()))
    )
    .on(
      "/exercises",
      requireLogin(() => render(Exercises()))
    )
    .notFound(() => render(`<h2>404 - Página no encontrada</h2>`))
    .resolve();
}

function requireLogin(callback) {
  return () => {
    if (!getLoginStatus()) return redirectToLogin();
    callback();
  };
}

function render(content) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (typeof content === "string") {
    app.innerHTML = content;
  } else {
    app.appendChild(content);
  }
}

function redirectToLogin() {
  router.navigate("/login");
}
