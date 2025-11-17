import {initRouter, loadNavbarAndFooter} from "./router.js";
import {checkAndSetLogin} from "./store.js";
import '../styles/index.css';


async function initSPA() {
    const isValid = await checkAndSetLogin();
    if (isValid) {
        loadNavbarAndFooter();
    }


    initRouter();
}

// Iniciar aplicación
await initSPA();