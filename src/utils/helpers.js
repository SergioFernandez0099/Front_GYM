export function removeLoginCss() {
    const links = document.querySelectorAll('link[rel="stylesheet"]');

    links.forEach((link) => {
        if (link.href.includes("login.css")) {
            link.remove();
        }
    });
}

export function toggleEditIcon(icon, editIcon, editButton, minSize, maxSize) {
    if (icon === "edit") {
        editIcon.src = "/icons/edit.svg";
        editIcon.alt = "Icono de edición";
        editIcon.style.width = minSize;
        editIcon.style.height = minSize;
        editButton.dataset.editable = false;
    } else {
        editIcon.src = "/icons/tick.svg";
        editIcon.alt = "Icono de guardado";
        editIcon.style.width = maxSize;
        editIcon.style.height = maxSize;
        editButton.dataset.editable = true;
    }
}

export function shakeEffect(article) {
    removeFadeInUp(article);
    article.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => (article.style.animation = ""), 600);
}

export function glowEffect(article) {
    removeFadeInUp(article);
    article.style.animation = "saved-glow 1.2s ease-out";
    setTimeout(() => (article.style.animation = ""), 1200);
}

function removeFadeInUp(article) {
    article.classList.remove("fade-in-up");
    article.style.animation = "none";

    // Fuerza reflow (reinicia animaciones)
    void article.offsetWidth;
}

export function showErrorBorder(element) {
    element.style.border = "1.5px solid red";
    element.style.outline = "none";
}

export function clearErrorBorder(element) {
    element.style.border = "";
}

export function showLoader() {
    document.getElementById("loader-overlay").classList.remove("hidden");
}

export function hideLoader() {
    document.getElementById("loader-overlay").classList.add("hidden");
}

export const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export function openConfirmModal(title) {
    return new Promise((resolve) => {
        const modal = document.getElementById("confirmModal");
        const cancelBtn = modal.querySelector(".btn-cancel");
        const confirmBtn = modal.querySelector(".btn-delete");
        const modalTitle = modal.querySelector(".modal-title");

        modalTitle.textContent = title;
        modal.classList.add("show");

        const closeModal = () => {
            modal.classList.remove("show");
            // Limpiar eventos para evitar duplicados
            cancelBtn.onclick = null;
            confirmBtn.onclick = null;
            modal.removeEventListener("click", outsideClick);
        };

        const outsideClick = (e) => {
            if (e.target === modal) {
                closeModal();
                resolve(false);
            }
        };

        modal.addEventListener("click", outsideClick);

        cancelBtn.onclick = () => {
            closeModal();
            resolve(false);
        };

        confirmBtn.onclick = () => {
            closeModal();
            resolve(true);
        };
    });
}

// para ignorar acentos
export function normalize(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

export function getLastSegment(pathname) {
    // Convierte la ruta en array, eliminando strings vacíos
    const segments = pathname.split('/').filter(Boolean);

    // Si hay segmentos, devuelve el último; si no, devuelve "home"
    return segments.length > 0 ? segments.pop() : 'home';
}