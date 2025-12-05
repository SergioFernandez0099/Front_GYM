import {initRouter, loadNavbarAndFooter} from "./router.js";
import {checkAndSetLogin} from "./store.js";
import { provideFluentDesignSystem, fluentTooltip, fluentButton } from "@fluentui/web-components";

import '../styles/index.css';

async function initSPA() {
    const isValid = await checkAndSetLogin();
    if (isValid) {
        loadNavbarAndFooter();
    }


    initRouter();
}


provideFluentDesignSystem().register(
    fluentTooltip(),
    fluentButton()
);

// Iniciar aplicación
await initSPA();