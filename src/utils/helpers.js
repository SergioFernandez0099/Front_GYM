export function applyCSS(...cssFiles) {
  const mainCSS = "main.css";
  // Eliminar todos los estilos excepto el mainCSS
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach((link) => {
    if (!link.href.includes(mainCSS)) link.remove();
  });

  // Añadir cada CSS recibido si no está ya cargado
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
