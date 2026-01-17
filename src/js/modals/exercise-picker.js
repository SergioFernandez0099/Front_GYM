export function createExercisePicker(exercises, addExercise) {

    // ===== Eliminar modal existente si lo hay =====
    const existingModal = document.querySelector('.exercise-picker-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // ===== Modal =====
    const modal = document.createElement('div');
    modal.className = 'exercise-picker-modal';

    modal.innerHTML = `
    <div class="exercise-picker-container">

      <h3 class="exercise-picker-label">Selecciona un ejercicio</h3>

      <div class="exercise-search">
        <input
          type="text"
          class="exercise-input"
          placeholder="Nombre del ejercicio..."
          autocomplete="off"
        />
        <div class="exercise-suggestions hide"></div>
      </div>

    </div>
  `;

    document.body.appendChild(modal);

    // ===== Elementos =====
    const input = modal.querySelector('.exercise-input');
    const suggestions = modal.querySelector('.exercise-suggestions');

    // ===== Lógica de búsqueda =====
    input.addEventListener('input', () => {
        const value = input.value.trim().toLowerCase();

        if (!value) {
            hideSuggestions();
            return;
        }

        const matches = exercises
            .filter(e => e.name.toLowerCase().includes(value))
            .slice(0, 5);

        if (matches.length === 0) {
            hideSuggestions();
            return;
        }

        showSuggestions(matches);
    });

    // ===== Click en sugerencia =====
    suggestions.addEventListener('click', e => {
        if (!e.target.classList.contains('exercise-suggestion')) return;

        addExercise(e.target.dataset.id);
        hide();
    });

    // ===== Ocultar al perder foco =====
    input.addEventListener('blur', () => {
        setTimeout(hideSuggestions, 150);
    });

    // ===== Mostrar / ocultar modal =====
    function show() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        input.focus();
    }

    function hide() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        hideSuggestions();
        input.value = '';
    }

    function showSuggestions(items) {
        suggestions.classList.remove('hide');

        suggestions.innerHTML = items
            .map(e => `
            <div 
              class="exercise-suggestion" 
              data-id="${e.id}"
            >
              ${e.name}
            </div>
        `)
            .join('');

        // Reset forzado
        suggestions.classList.remove('show');
        void suggestions.offsetHeight;

        suggestions.classList.add('show');
    }

    function hideSuggestions() {
        if (!suggestions.classList.contains('show')) return;

        suggestions.classList.remove('show');

        const handler = () => {
            suggestions.classList.add('hide');
            suggestions.innerHTML = '';
            suggestions.removeEventListener('transitionend', handler);
        };

        suggestions.addEventListener('transitionend', handler);
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
