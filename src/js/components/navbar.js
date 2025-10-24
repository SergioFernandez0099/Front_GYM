export function Navbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar';

  nav.innerHTML = `
    <div class="navbar-container">
      <input type="checkbox" id="menu-toggle" />
      <label class="menu-btn" for="menu-toggle">
        <svg id="hamburger" class="Header__toggle-svg" viewBox="0 0 60 40">
          <g stroke="#ff0000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path id="top-line" d="M12,10 L48,10 Z"></path>
            <path id="middle-line" d="M12,20 L48,20 Z"></path>
            <path id="bottom-line" d="M12,30 L48,30 Z"></path>
          </g>
        </svg>
      </label>

      <div class="menu-items-container">
        <ul class="menu-items">
          <li><a href="#home">Archivo</a></li>
          <li><a href="#about">Rutina</a></li>
          <li><a href="#food">Registro</a></li>
          <li><a href="#food-menu">Ejercicios</a></li>
        </ul>
      </div>

      <div class="container-logo">
        <h1 class="border">G Y M</h1>
        <h1 class="wave">G Y M</h1>
      </div>
    </div>
  `;

  return nav;
}
