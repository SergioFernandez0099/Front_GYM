import Navigo from "navigo";

import {Home} from "./pages/home.js";
import {About} from "./pages/about.js";
import {Exercises} from "./pages/exercises.js";
import {checkAndSetLogin, connected, getLoginStatus} from "./store.js";
import {Routine} from "./pages/routine.js";
import {RoutineSet} from "./pages/routine-set.js";
import {adjustAppHeight, hideLoader, removeLoginCss, showLoader,} from "../utils/helpers.js";
import {Navbar, updateReloadButton} from "./components/navbar.js";
import {logout} from "./services/api.js";
import {Login} from "./pages/login.js";
import {Footer} from "./components/footer.js";
import {trainingSessionCard} from "./components/training-session-card.js";
import {trainingSchedule} from "./pages/calendar.js";
import {errorPage} from "./pages/errorPage.js";

export const router = new Navigo("/");

// Guardamos los callbacks de cada ruta
const routeHandlers = {};
let retryRoute  = null;

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
        .on("/error", requireLogin(async () => {
            routeHandlers["/error"] = async () => {
                await render(errorPage("Error al cargar la página", async () => {
                    if (connected) {
                        safeNavigate(retryRoute || "/");
                    } else {
                        if (await checkAndSetLogin()) safeNavigate(retryRoute || "/");
                    }
                }));
            };
            await render(errorPage("Error al cargar la página", async () => {
                if (connected) {
                    safeNavigate(retryRoute || "/");
                } else {
                    if (await checkAndSetLogin()) safeNavigate(retryRoute || "/");
                }
            }));
        }))

        .on("/login", () => {
            routeHandlers["/login"] = () => {
                const navbarContainer = document.getElementById("navbar");
                const footerContainer = document.getElementById("footer");

                navbarContainer.innerHTML = "";
                footerContainer.innerHTML = "";

                document.body.className = 'login';
                render(
                    Login({
                        onLogin: () => {
                            router.navigate("/");
                            loadNavbarAndFooter();
                            removeLoginCss();
                        },
                    })
                );
            }
            const navbarContainer = document.getElementById("navbar");
            const footerContainer = document.getElementById("footer");

            navbarContainer.innerHTML = "";
            footerContainer.innerHTML = "";

            document.body.className = 'login';
            render(
                Login({
                    onLogin: () => {
                        router.navigate("/");
                        loadNavbarAndFooter();
                        removeLoginCss();
                    },
                })
            );
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
            requireLogin(({data}) => {
                const routineId = parseInt(data.id);
                routeHandlers[`/routine/set/${routineId}`] = () =>
                    render(RoutineSet(routineId));
                render(RoutineSet(routineId));
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
            "/sessions/:sessionId",
            requireLogin(({data}) => {
                const sessionId = parseInt(data.sessionId);
                routeHandlers[`/sessions/${sessionId}`] = () =>
                    render(trainingSessionCard(sessionId));
                render(trainingSessionCard(sessionId));
            })
        )
        .on(
            "/exercises",
            requireLogin(async () => {
                routeHandlers["/exercises"] = () => render(Exercises());
                render(Exercises());
            })
        )
        .on(
            "/sessions",
            requireLogin(async () => {
                routeHandlers["/sessions"] = () => render(trainingSchedule());
                render(trainingSchedule());
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
    const currentPath = window.location.pathname;

    if (currentPath !== "/error" && path !== "/error") {
        retryRoute = path;
    }

    if (currentPath === path && routeHandlers[path]) {
        routeHandlers[path]();
    } else {
        router.navigate(path);
    }
}


function requireLogin(callback) {
    return (params) => {
        if (!getLoginStatus()) return redirectToLogin();
        document.body.className = 'default';
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
    document.body.className = 'login';
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
