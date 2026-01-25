import {updateRoutineSetsOrder, updateTrainingSessionExerciseOrder} from "../services/api.js";
import {safeNavigate} from "../router.js";
import {showSnackbar} from "../components/snackbar.js";

// Para indicar que el modal es solo para guardar y no permite seleccionar se usa
// la variable moveToExercise = null
export function createExerciseSort(exercises, entityId, moveToExercise = null) {

    const existingModal = document.querySelector('.exercise-sort-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'exercise-sort-modal';

    const container = document.createElement('div');
    container.className = 'exercise-sort-container';
    modal.appendChild(container);

    let reorderLabel;
    let labelContainer;
    let checkbox;

    if (moveToExercise) {
        // Checkbox para activar ordenación
        reorderLabel = document.createElement('label');
        reorderLabel.className = 'reorder-label';

        labelContainer = document.createElement('div');
        labelContainer.className = 'label-container';

        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'enable-reorder';

        reorderLabel.appendChild(checkbox);
        reorderLabel.append('Ordenar');
        labelContainer.appendChild(reorderLabel);
    }

    const saveButton = document.createElement('button');

    saveButton.textContent = 'Guardar';

    if (moveToExercise) {
        saveButton.className = 'exercise-sort-save hide ';
        labelContainer.appendChild(saveButton);
        container.appendChild(labelContainer);
    } else {
        saveButton.className = 'exercise-sort-save show ';
        container.appendChild(saveButton);
    }

    // Lista de ejercicios
    const list = document.createElement('div');
    list.className = 'exercise-sort-list';
    container.appendChild(list);

    const originalOrder = exercises.map(e => ({
        id: moveToExercise ? e.id : e.setId,
        order: e.order
    }));

    exercises.forEach(exercise => {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'exercise-item-container';
        itemContainer.setAttribute('data-id', moveToExercise ? exercise.id : exercise.setId);
        const item = document.createElement('div');
        const span = document.createElement('span');
        span.className = moveToExercise ? 'exercise-span' : 'exercise-span show';
        span.textContent = "☰";
        item.className = 'exercise-item';
        item.textContent = moveToExercise ? exercise.exercise.name : exercise.name;
        item.draggable = false;
        itemContainer.draggable = !moveToExercise;
        itemContainer.appendChild(span);
        itemContainer.appendChild(item);

        list.appendChild(itemContainer);
    });

    if (moveToExercise) {
        // Activar / desactivar drag
        checkbox.addEventListener('change', () => {
            if (exercises.length === 1) {
                checkbox.checked = false;
                showSnackbar("warning", "Añade más ejercicios para cambiar el orden")
                return;
            }
            if (checkbox.checked) {
                showSaveButton()
                showItemsSpan()
            } else {
                const currentOrder = getCurrentOrderFromDOM();
                const diff = getOrderDiff(originalOrder, currentOrder);

                if (diff.length !== 0) restoreOriginalOrder()

                hideSaveButton()
                hideItemsSpan()
            }
        });
    }

    function showItemsSpan() {
        const items = list.querySelectorAll('.exercise-item-container');
        items.forEach(item => {
            item.draggable = checkbox.checked
            item.querySelector(".exercise-span").classList.add('show');
        });
    }

    function hideItemsSpan() {
        const items = list.querySelectorAll('.exercise-item-container');
        items.forEach(item => {
            item.draggable = checkbox.checked
            item.querySelector(".exercise-span").classList.remove('show');
        });
    }

    function getCurrentOrderFromDOM() {
        return [...list.querySelectorAll('.exercise-item-container')].map(
            (el, index) => ({
                id: Number(el.dataset.id),
                order: index + 1
            })
        );
    }

    function getOrderDiff(original, current) {

        const originalMap = new Map(
            original.map(item => [item.id, item.order])
        );

        return current.filter(item => {
            return originalMap.get(item.id) !== item.order;
        });
    }

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
        if (moveToExercise) {
            if (!checkbox.checked) return;
        }

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
        if (moveToExercise) {
            if (!checkbox.checked || !dragged) return;
        } else {
            if (!dragged) return;
        }

        e.preventDefault();
        const after = getDragAfterElement(list, e.clientY);

        if (after == null) {
            list.appendChild(dragged);
        } else {
            list.insertBefore(dragged, after);
        }
    });

    if (moveToExercise) {
        list.addEventListener('click', (e) => {
            // Solo actuar si no estamos en modo ordenar
            if (checkbox.checked) return;

            // Buscar el contenedor del ejercicio clicado
            const itemContainer = e.target.closest('.exercise-item-container');
            if (!itemContainer) return;

            const exercise = exercises.find(e => e.id === Number(itemContainer.dataset.id));
            if (exercise) {
                moveToExercise(exercise.id); // tu función para seleccionar ejercicio
                hide()
            }
        });
    }

    saveButton.addEventListener('click', async () => {
        const currentOrder = getCurrentOrderFromDOM();
        const diff = getOrderDiff(originalOrder, currentOrder);

        if (diff.length === 0) {
            showSnackbar("warning", "No hay cambios de orden")
            return;
        }

        await actualizarOrden(currentOrder);
    });

    function restoreOriginalOrder() {
        const sortedOriginal = [...originalOrder].sort((a, b) => a.order - b.order);
        const fragment = document.createDocumentFragment();

        sortedOriginal.forEach(item => {
            const element = list.querySelector(`[data-id="${item.id}"]`);
            if (element) {
                fragment.appendChild(element);
            }
        });

        list.innerHTML = '';
        list.appendChild(fragment);
    }

    async function actualizarOrden(currentOrder) {
        const data = currentOrder.map(e => e.id);

        try {
            moveToExercise
                ? await updateTrainingSessionExerciseOrder(entityId, data)
                : await updateRoutineSetsOrder(entityId, {order: data});
            originalOrder.length = 0;
            currentOrder.forEach(o => originalOrder.push(o));
            showSnackbar("success", "Orden actualizado correctamente");

            hide()
            moveToExercise
                ? safeNavigate(`/sessions/${entityId}`)
                : safeNavigate(`/routine/set/${entityId}`);

        } catch (error) {
            console.warn("No se pudo actualizar el orden", error);
            showSnackbar("error", "No se pudo actualizar el orden");

            restoreOriginalOrder();
            checkbox.checked = false;
            if (moveToExercise) {
                hideSaveButton();
                hideItemsSpan();
            }
        }
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
        if (moveToExercise) {
            if (checkbox.checked) {
                checkbox.checked = false;
                hideItemsSpan();
                hideSaveButton();
            }
        }
        restoreOriginalOrder();
        modal.classList.remove('show');
        document.body.style.overflow = '';
        document.body.style.pointerEvents = '';
    }

    modal.addEventListener('click', e => {
        if (e.target === modal) hide();
    });

    document.body.appendChild(modal);

    return {
        container: modal,
        show,
        hide
    };
}
