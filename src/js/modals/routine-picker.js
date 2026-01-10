export function createRoutinePicker(routines, createSession) {

    // ===== Modal =====
    const modal = document.createElement('div');
    modal.className = 'routine-picker-modal';

    const routinesHTML = routines
        .map(e => `
            <div 
              class="routine-picker-list-item" 
              data-id="${e.id}"
            >
              ${e.name}
            </div>
        `).join('');

    modal.innerHTML = `
    <div class="routine-picker-container">
      <h3 class="routine-picker-label">Selecciona una rutina</h3>
      <div class="routine-picker-list">
        ${routinesHTML}
      </div>
      <button class="routine-picker-button" id="routinePickerBtn">Crear sesión vacía</button>
    </div>
  `;

    document.body.appendChild(modal);

    // ===== Elementos =====
    const button = modal.querySelector('#routinePickerBtn');
    const routineList = modal.querySelector('.routine-picker-list');

    // ===== Creación de sesión vacía =====
    button.addEventListener('click', () => {
        createSession(-1);
        hide();
    });

    // ===== Click en listado de rutinas =====
    routineList.addEventListener('click', e => {
        if (!e.target.classList.contains('routine-picker-list-item')) return;

        createSession(e.target.dataset.id);
        hide();
    });

    // ===== Mostrar / ocultar modal =====
    function show() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function hide() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', e => {
        if (e.target === modal) {
            hide();
        }
    });

    return {
        container: modal,
        show,
        hide
    };
}
