export function Home() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Inicio</h2>
    <p>Bienvenido a la página principal.</p>
  `;
  return container;
}