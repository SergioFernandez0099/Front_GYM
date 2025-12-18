export function createExerciseSort(exercises, moveToExercise) {
    const modal = document.createElement('div');
    modal.className = 'exercise-sort-modal';

    const container = document.createElement('div');
    container.className = 'exercise-sort-container';
    modal.appendChild(container);

    // Checkbox para activar ordenación
    const reorderLabel = document.createElement('label');
    reorderLabel.className = 'reorder-label';

    const labelContainer = document.createElement('div');
    labelContainer.className = 'label-container';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'enable-reorder';

    reorderLabel.appendChild(checkbox);
    reorderLabel.append('Ordenar');

    const saveButton = document.createElement('button');
    saveButton.className = 'exercise-sort-save hide ';
    saveButton.textContent = 'Guardar';

    labelContainer.appendChild(reorderLabel);
    labelContainer.appendChild(saveButton);

    container.appendChild(labelContainer);

    // Lista de ejercicios
    const list = document.createElement('div');
    list.className = 'exercise-sort-list';
    container.appendChild(list);

    const initialOrder = exercises.map(e => e.order);

    console.log(exercises)

    exercises.forEach(exercise => {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'exercise-item-container';
        itemContainer.setAttribute('data-id', exercise.id);
        const item = document.createElement('div');
        const span = document.createElement('span');
        span.className = 'exercise-span';
        span.textContent = "☰";
        item.className = 'exercise-item';
        item.textContent = exercise.exercise.name;
        item.draggable = false;
        itemContainer.appendChild(span);
        itemContainer.appendChild(item);
        list.appendChild(itemContainer);
    });

    // Activar / desactivar drag
    checkbox.addEventListener('change', () => {
        const items = list.querySelectorAll('.exercise-item-container');
        items.forEach(item => {
            console.log(item)
            item.draggable = checkbox.checked
            item.querySelector(".exercise-span").classList.toggle('show');
            if (checkbox.checked) {
                showSaveButton();
            } else {
                hideSaveButton();
            }
        });
    });

    function showSaveButton() {
        saveButton.classList.remove('hide');
        void saveButton.offsetWidth; // forzar reflow
        saveButton.classList.add('show');
    }

    function hideSaveButton() {
        saveButton.classList.remove('show');

        // Esperar a que termine la transición antes de ocultar completamente
        saveButton.addEventListener('transitionend', function handler() {
            saveButton.classList.add('hide'); // ahora ya queda fuera de la vista
            saveButton.removeEventListener('transitionend', handler);
        });
    }

    // Drag & drop
    let dragged = null;

    list.addEventListener('dragstart', e => {
        if (!checkbox.checked) return;

        dragged = e.target;
        e.dataTransfer.setData('text/plain', '');
        e.dataTransfer.effectAllowed = 'move';

        dragged.classList.add('dragging');
    });

    list.addEventListener('dragend', () => {
        if (!dragged) return;

        dragged.classList.remove('dragging');
        dragged = null;
    });

    list.addEventListener('dragover', e => {
        if (!checkbox.checked || !dragged) return;

        e.preventDefault();
        const after = getDragAfterElement(list, e.clientY);

        if (after == null) {
            list.appendChild(dragged);
        } else {
            list.insertBefore(dragged, after);
        }
    });

    list.addEventListener('click', (e) => {
        // Solo actuar si no estamos en modo ordenar
        if (!checkbox.checked) {
            // Buscar el contenedor del ejercicio clicado
            const itemContainer = e.target.closest('.exercise-item-container');
            if (!itemContainer) return;

            const exercise = exercises.find(e => e.id === Number(itemContainer.dataset.id));
            if (exercise) {
                moveToExercise(exercise.id); // tu función para seleccionar ejercicio
                hide()
            }
        }
    });

    saveButton.addEventListener('click', () => {
        const currentOrder = [...list.querySelectorAll('.exercise-item')].map(
            item => exercises.find(e => e.exercise.name === item.textContent).order
        );

        // Verificar si hubo cambios
        const changed = currentOrder.some((id, i) => id !== initialOrder[i]);
        if (changed) {
            actualizarOrden(currentOrder); // tu función para actualizar el orden
        }

        // Desactivar ordenación
        checkbox.checked = false;
        hideSaveButton();
    });

    function actualizarOrden(currentOrder) {
        console.log(34)
    }

    function getDragAfterElement(container, y) {
        const elements = [
            ...container.querySelectorAll('.exercise-item-container:not(.dragging)')
        ];

        return elements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return {offset, element: child};
            }
            return closest;
        }, {offset: Number.NEGATIVE_INFINITY}).element;
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
        if (e.target === modal) {
            hide()
            checkbox.checked = false;
            hideSaveButton();
        }
    });

    document.body.appendChild(modal);

    return {
        container: modal,
        show,
        hide
    };
}
