export function createYearPicker({range = 100, onSelect, initialYear = new Date().getFullYear()}) {
    const systemYear = new Date().getFullYear(); // año real del sistema
    const scrollOffset = 10; // Pongo 9 para que se cargue bien en la interfaz
    let currentYear = initialYear;

    // ======= Modal =======
    const modal = document.createElement('div');
    modal.className = 'year-picker-modal';

    // ======= Contenedor años =======
    const container = document.createElement('div');
    container.className = 'year-picker-container';
    modal.appendChild(container);

    // ======= Crear lista de años =======
    function renderYears(centerYear) {
        container.innerHTML = '';
        for (let i = centerYear - range; i <= centerYear + range; i++) {
            const yearItem = document.createElement('div');
            yearItem.className = 'year-picker-items';
            yearItem.textContent = i;

            // Año seleccionado
            if (i === currentYear) {
                yearItem.classList.add('current');
            }

            // Año actual del sistema (si no es el seleccionado)
            if (i === systemYear && i !== currentYear) {
                yearItem.classList.add('system-year');
            }

            yearItem.addEventListener('click', () => {
                onSelect && onSelect(i);
                hide();
            });

            container.appendChild(yearItem);
        }
    }

    renderYears(currentYear);

    // ======= Mostrar / ocultar =======
    function show(yearToFocus = currentYear) {
        currentYear = yearToFocus;
        renderYears(currentYear);
        modal.classList.add('show');

        // Bloquear scroll e interacción fuera del modal
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'none';
        modal.style.pointerEvents = 'auto';

        // Esperar al renderizado para ajustar scroll
        requestAnimationFrame(() => {
            const items = Array.from(container.children);
            const targetYear = yearToFocus - scrollOffset;
            const targetItem = items.find(c => parseInt(c.textContent) === targetYear);
            container.scrollTop = targetItem ? targetItem.offsetTop : 0;
        });
    }

    function hide() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        document.body.style.pointerEvents = '';
    }

    // ======= Cerrar al click fuera del contenedor =======
    modal.addEventListener('click', e => {
        if (e.target === modal) hide();
    });

    document.body.appendChild(modal);

    return {container: modal, show, hide};
}
