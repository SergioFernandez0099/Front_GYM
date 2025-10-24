import { Navbar } from "./components/navbar.js";
import { Login } from "./pages/login.js";
import { initRouter } from "./router.js";
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
        },
      })
    );
  } else {
    initSPA();
  }
}

function initSPA() {
  document.getElementById("navbar").innerHTML = Navbar();

  initRouter();
}

// Iniciar aplicación
renderApp();
