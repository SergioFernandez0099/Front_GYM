export function About() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Sobre mí</h2>
    <p>Esta es la página de información.</p>
  `;
  return container;
}