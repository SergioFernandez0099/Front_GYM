const images = import.meta.glob(
    "/assets/images/exercises/**/*.{png,jpg,jpeg,webp,svg,avif}",
    {eager: false}
);

export function removeLoginCss() {
    const links = document.querySelectorAll('link[rel="stylesheet"]');

    links.forEach((link) => {
        if (link.href.includes("login.css")) {
            link.remove();
        }
    });
}

export async function findImageByName(keyword) {
    const normalize = (text) =>
        text
            .toLowerCase()
            .replace(/[-_]/g, " ") // reemplaza guiones y guiones bajos por espacios
            .replace(/\s+/g, " ") // colapsa espacios múltiples
            .trim();

    const normalizedKeyword = normalize(keyword);
    const paths = Object.keys(images);

    const match = paths.find((path) => {
        const fileName = path
            .split("/")
            .pop()
            .replace(/\.[^/.]+$/, ""); // sin extensión
        const normalizedFile = normalize(fileName);
        return normalizedFile.includes(normalizedKeyword);
    });

    if (!match) return null;

    const module = await images[match]();
    const fileName = match
        .split("/")
        .pop()
        .replace(/\.[^/.]+$/, "");
    const altName = fileName.replace(/[-_]/g, " "); // alt más legible

    return {
        url: module.default,
        alt: altName,
    };
}

export function toggleEditIcon(icon, editIcon, editButton, minSize, maxSize) {
    if (icon === "edit") {
        editIcon.src = "/assets/icons/edit.svg";
        editIcon.alt = "Icono de edición";
        editIcon.style.width = minSize;
        editIcon.style.height = minSize;
        editButton.dataset.editable = false;
    } else {
        editIcon.src = "/assets/icons/tick.svg";
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


export function adjustAppHeight() {
    requestAnimationFrame(() => {
        const main = document.querySelector("main");
        const contentHeight = app.scrollHeight;
        const viewportHeight = window.innerHeight;

        if (contentHeight <= viewportHeight) {
            main.style.minHeight = "84vh";
        } else {
            main.style.minHeight = "100vh";
        }
    });
}
