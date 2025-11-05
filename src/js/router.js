import Navigo from "navigo";

import { Home } from "./pages/home.js";
import { About } from "./pages/about.js";
import { Contact } from "./pages/contact.js";
import { Exercises } from "./pages/exercises.js";
import { getLoginStatus } from "./store.js";
import { Routine } from "./pages/routine.js";
import { RoutineSet } from "./pages/routine-set.js";

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
      "/routine/set/:id",
      requireLogin(async ({ data }) => {
        const routineId = data.id; // id de la rutina desde la URL
        // const userId = getCurrentUserId(); // id del usuario logueado
        const userId = 1; // id del usuario logueado
        const routineSetContainer = await RoutineSet({ userId, routineId });
        render(routineSetContainer);
      })
    )
    .on(
      "/routine",
      requireLogin(async () => {
        const routineContainer = await Routine();
        render(routineContainer);
      })
    )
    .on(
      "/contact",
      requireLogin(() => render(Contact()))
    )
    .on(
      "/exercises",
      requireLogin(async () => {
        const exerciseContainer = await Exercises();
        render(exerciseContainer);
      })
    )
    .notFound(() => render(`<h2>404 - Página no encontrada</h2>`))
    .resolve();
}

function requireLogin(callback) {
  return (params) => {
    if (!getLoginStatus()) return redirectToLogin();
    callback(params);
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
