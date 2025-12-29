export async function errorPage(mensaje = "Algo ha ido mal", retryCallback = null) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("error-container");
    console.log("error")
    errorContainer.innerHTML = `
        <img src="/assets/images/snorlax.png" alt="Imagen de error" class="error-image">
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

    return errorContainer;
}