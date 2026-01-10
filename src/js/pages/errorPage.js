import {shakeEffect} from "../../utils/helpers.js";

export async function errorPage(mensaje = "Algo ha ido mal", retryCallback = null) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("error-container");

    errorContainer.innerHTML = `
        <img src="/assets/images/connection_error.avif" alt="Imagen de error" class="error-image">
        <h1 class="error-label">${mensaje}</h1>
        <button id="errorButton">Reintentar</button>
    `
    const button = errorContainer.querySelector("#errorButton");
    button.addEventListener("click", () => {
        if (retryCallback && typeof retryCallback === "function") {
            retryCallback();
        } else {
            location.reload();
        }
    });

    requestAnimationFrame(() => {
        shakeEffect(button)
    });

    return errorContainer;
}