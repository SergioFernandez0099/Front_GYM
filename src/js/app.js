import {removeLoginCss} from "../utils/helpers.js";
import {Navbar} from "./components/navbar.js";
import {Login} from "./pages/login.js";
import {initRouter, router} from "./router.js";
import {getLoginStatus, setLoginStatus} from "./store.js";
import {Footer} from "./components/footer.js";

function renderApp() {
    if (!getLoginStatus()) {
        // Mostrar login primero
        const app = document.getElementById("app");
        app.innerHTML = "";
        app.appendChild(
            Login({
                onLogin: () => {
                    setLoginStatus(true);
                    initSPA();
                    router.navigate("/");
                },
            })
        );
    } else {
        initSPA();
    }
}

function initSPA() {
    removeLoginCss();
    const navbarContainer = document.getElementById("navbar");
    const footerContainer = document.getElementById("footer");

    navbarContainer.innerHTML = "";
    footerContainer.innerHTML = "";

    navbarContainer.appendChild(Navbar());
    footerContainer.appendChild(Footer());

    initRouter();
}

// Iniciar aplicación
renderApp();
