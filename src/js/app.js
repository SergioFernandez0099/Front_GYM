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

/*
 ______     ____  __                    __   __
|  _ \ \   / /  \/  |   /\        /\    \ \ / /
| |_) \ \_/ /| \  / |  /  \      /  \    \ V /
|  _ < \   / | |\/| | / /\ \    / /\ \    > <
| |_) | | |  | |  | |/ ____ \  / ____ \  / . \
|____/  |_|  |_|  |_/_/    \_\/_/    \_\/_/ \_\

*/
