export function Contact() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Contacto</h2>
    <p>Escríbeme a contacto@example.com</p>
  `;
  return container;
}