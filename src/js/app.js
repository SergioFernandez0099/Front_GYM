import { removeLoginCss } from "../utils/helpers.js";
import { Navbar } from "./components/navbar.js";
import { Login } from "./pages/login.js";
import { initRouter, router } from "./router.js";
import { setLoginStatus, getLoginStatus } from "./store.js";

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
  navbarContainer.innerHTML = "";
  navbarContainer.appendChild(Navbar());

  // footer
  
  initRouter();
}

// Iniciar aplicación
renderApp();
