export function createExercisePicker(exercises) {
    const modal = document.createElement('div');
    modal.className = 'exercise-picker-modal';

    const container = document.createElement('div');
    container.className = 'exercise-picker-container';
    modal.appendChild(container);

    // Checkbox para activar ordenación
    const reorderBox = document.createElement('label');
    reorderBox.className = 'reorder-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'enable-reorder';
    reorderBox.appendChild(checkbox);

    reorderBox.append("Ordenar");
    container.appendChild(reorderBox);

    // Lista de ejercicios
    const list = document.createElement('div');
    list.className = 'exercise-list';
    container.appendChild(list);

    exercises.forEach(exercise => {
        console.log(exercise)
        const item = document.createElement('a');
        item.className = 'exercise-item';
        item.textContent = exercise.exercise.name;
        item.href = exercise.url; // Navega directamente
        item.draggable = false;   // Se activará al marcar el checkbox
        list.appendChild(item);
    });

    // Activar o no arrastrar
    checkbox.addEventListener('change', () => {
        const items = list.querySelectorAll('.exercise-item');
        items.forEach(item => item.draggable = checkbox.checked);
    });

    // Lógica drag & drop
    let dragged = null;

    list.addEventListener('dragstart', e => {
        if (!checkbox.checked) return;
        dragged = e.target;
        e.target.classList.add('dragging');
    });

    list.addEventListener('dragend', e => {
        if (!checkbox.checked) return;
        e.target.classList.remove('dragging');
        dragged = null;
    });

    list.addEventListener('dragover', e => {
        if (!checkbox.checked) return;
        e.preventDefault();
        const after = getDragAfterElement(list, e.clientY);
        if (after == null) {
            list.appendChild(dragged);
        } else {
            list.insertBefore(dragged, after);
        }
    });

    // Función para detectar posición al arrastrar
    function getDragAfterElement(container, y) {
        const elements = [...container.querySelectorAll('.exercise-item:not(.dragging)')];

        return elements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function show() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'none';
        modal.style.pointerEvents = 'auto';
    }

    function hide() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        document.body.style.pointerEvents = '';
    }

    modal.addEventListener('click', e => {
        if (e.target === modal) hide();
    });

    document.body.appendChild(modal);

    return {container: modal, show, hide};
}