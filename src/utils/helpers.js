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
