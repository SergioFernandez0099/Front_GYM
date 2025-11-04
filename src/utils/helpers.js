const images = import.meta.glob(
  "/assets/images/exercises/**/*.{png,jpg,jpeg,webp,svg,avif}",
  { eager: false }
);

export function applyCSS(...cssFiles) {
  cssFiles.forEach((cssFile) => {
    const alreadyLoaded = [
      ...document.querySelectorAll('link[rel="stylesheet"]'),
    ].some((link) => link.href.includes(cssFile));

    if (!alreadyLoaded) {
      const newLink = document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.href = cssFile;
      document.head.appendChild(newLink);
    }
  });
}

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
      .replace(/[-_]/g, ' ')   // reemplaza guiones y guiones bajos por espacios
      .replace(/\s+/g, ' ')    // colapsa espacios múltiples
      .trim();

  const normalizedKeyword = normalize(keyword);
  const paths = Object.keys(images);

  const match = paths.find((path) => {
    const fileName = path.split('/').pop().replace(/\.[^/.]+$/, ''); // sin extensión
    const normalizedFile = normalize(fileName);
    return normalizedFile.includes(normalizedKeyword);
  });

  if (!match) return null;

  const module = await images[match]();
  const fileName = match.split('/').pop().replace(/\.[^/.]+$/, '');
  const altName = fileName.replace(/[-_]/g, ' '); // alt más legible

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

