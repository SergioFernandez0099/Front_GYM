import Navigo from "navigo";

import {Home} from "./pages/home.js";
import {About} from "./pages/about.js";
import {Contact} from "./pages/contact.js";
import {Exercises} from "./pages/exercises.js";
import {getLoginStatus} from "./store.js";
import {Routine} from "./pages/routine.js";
import {RoutineSet} from "./pages/routine-set.js";
import {adjustAppHeight, hideLoader, removeLoginCss, showLoader} from "../utils/helpers.js";
import {Navbar, updateReloadButton} from "./components/navbar.js";
import {logout} from "./pages/services/api.js";
import {Login} from "./pages/login.js";
import {Footer} from "./components/footer.js";

export const router = new Navigo("/");

// Guardamos los callbacks de cada ruta
const routeHandlers = {};

// Inicializa el router después de que el DOM cargue
export function initRouter() {
    router
        .on(
            "/",
            requireLogin(() => {
                routeHandlers["/"] = () => render(Home());
                render(Home());
            })
        )
        .on("/login", () => {
            routeHandlers["/login"] = () =>
                render(
                    Login({
                        onLogin: () => {
                            router.navigate("/");
                            loadNavbarAndFooter();
                            removeLoginCss();
                        }
                    }),);
            render(
                Login({
                    onLogin: () => {
                        router.navigate("/");
                        loadNavbarAndFooter();
                        removeLoginCss();
                    },
                }));
        })
        .on(
            "/logout",
            requireLogin(async () => {
                await logout();
                router.navigate("/login");
            })
        )
        .on(
            "/about",
            requireLogin(() => {
                routeHandlers["/about"] = () => render(About());
                render(About());
            })
        )
        .on(
            "/routine/set/:id",
            requireLogin(async ({data}) => {
                const routineId = parseInt(data.id);
                const userId = 3;
                const routineSetContainer = await RoutineSet({userId, routineId});
                routeHandlers[`/routine/set/${routineId}`] = () =>
                    render(routineSetContainer);
                render(routineSetContainer);
            })
        )
        .on(
            "/routine",
            requireLogin(() => {
                routeHandlers["/routine"] = () => render(Routine());
                render(Routine());
            })
        )
        .on(
            "/contact",
            requireLogin(() => {
                routeHandlers["/contact"] = () => render(Contact());
                render(Contact());
            })
        )
        .on(
            "/exercises",
            requireLogin(async () => {
                routeHandlers["/exercises"] = () => render(Exercises());
                render(Exercises());
            })
        )
        .notFound(() => {
            routeHandlers["404"] = () =>
                render(`<h2>404 - Página no encontrada</h2>`);
            render(`<h2>404 - Página no encontrada</h2>`);
        })
        .resolve();
}

// Función para navegar de manera segura
export function safeNavigate(path) {
    // Si ya estamos en la misma ruta, ejecutamos el callback manualmente
    if (window.location.pathname === path && routeHandlers[path]) {
        routeHandlers[path]();
    } else {
        router.navigate(path);
    }
}

function requireLogin(callback) {
    return (params) => {
        if (!getLoginStatus()) return redirectToLogin();
        callback(params);
    };
}

async function render(content) {
    const app = document.getElementById("app");
    showLoader();
    app.innerHTML = "";

    try {
        const resolvedContent = await content;

        if (typeof resolvedContent === "string") {
            app.innerHTML = resolvedContent;
        } else if (resolvedContent instanceof HTMLElement) {
            app.appendChild(resolvedContent);
        } else {
            console.warn("Tipo de contenido no soportado:", resolvedContent);
        }

        const reloadBtn = document.querySelector("#reload");
        if (reloadBtn) updateReloadButton(reloadBtn);

    } catch (error) {
        console.error("Error al renderizar:", error);
        app.innerHTML = "<h2>Error al cargar la página</h2>";
    } finally {
        // Esto para colocar el footer correctamente
        adjustAppHeight();
        hideLoader();
    }
}

function redirectToLogin() {
    router.navigate("/login");
}

export function loadNavbarAndFooter() {
    const navbarContainer = document.getElementById("navbar");
    const footerContainer = document.getElementById("footer");

    navbarContainer.innerHTML = "";
    footerContainer.innerHTML = "";

    navbarContainer.appendChild(Navbar());
    footerContainer.appendChild(Footer());
}
