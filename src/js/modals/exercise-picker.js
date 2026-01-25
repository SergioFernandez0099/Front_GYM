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
      <button class="close-btn">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="currentColor" class="closeIcon" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z"
                fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L6.53035 18.5303C6.23745 18.8232 5.76258 18.8232 5.46969 18.5303C5.17679 18.2374 5.17679 17.7626 5.46968 17.4697L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967Z"
                fill="currentColor"/>
        </svg>
      </button>
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

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        hide();
    })

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
