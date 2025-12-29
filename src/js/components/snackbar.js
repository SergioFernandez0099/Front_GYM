const snackbar = {
    el: document.getElementById("snackbar"),
    message: document.getElementById("snackbar-message"),
    gif: document.getElementById("snackbar-gif"),
    close: document.getElementById("snackbar-close"),
};

const queue = [];
let isShowing = false;
let timeoutId = null;

const TYPES = {
    success: {
        className: "success",
        gif: "/assets/gifs/success1.gif",
        duration: 300000,
    },
    warning: {
        className: "warning",
        gif: "/assets/gifs/warning.gif",
        duration: 4000,
    },
    error: {
        className: "error",
        gif: "/assets/gifs/error.gif",
        duration: 5000,
    },
};

export function showSnackbar(type, message) {
    if (!TYPES[type]) {
        throw new Error(`Snackbar type "${type}" not supported`);
    }

    queue.push({ type, message });
    processQueue();
}

function processQueue() {
    if (isShowing || queue.length === 0) return;

    const { type, message } = queue.shift();
    const config = TYPES[type];

    isShowing = true;

    // Limpiar clases anteriores
    snackbar.el.classList.remove("success", "warning", "error");

    snackbar.el.classList.add("show", config.className);
    snackbar.message.textContent = message;
    snackbar.gif.src = config.gif;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(hideSnackbar, config.duration);

    snackbar.close.onclick = hideSnackbar;
}

function hideSnackbar() {
    snackbar.el.classList.remove("show");
    isShowing = false;

    setTimeout(processQueue, 300);
}
