import {initRouter, loadNavbarAndFooter} from "./router.js";
import {checkAndSetLogin} from "./store.js";

import '../styles/index.css';

async function initSPA() {
    loadNavbarAndFooter();
    await checkAndSetLogin();
    initRouter();
}

// Iniciar aplicación
await initSPA();