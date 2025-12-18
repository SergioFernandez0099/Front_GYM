export function createConfirmDialog() {
    const modal = document.createElement('div');
    modal.className = 'confirm-dialog show';

    modal.innerHTML = `
        <div class="confirm-dialog-container">
            <h3 class="confirm-dialog-title"></h3>
            <div class="confirm-dialog-buttons">
                <button class="btn-cancel">Cancelar</button>
                <button class="btn-confirm">Confirmar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const cancelBtn = modal.querySelector('.btn-cancel');
    const confirmBtn = modal.querySelector('.btn-confirm');
    const dialogTitle = modal.querySelector('.confirm-dialog-title');

    function show(title) {
        dialogTitle.textContent = title;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        return new Promise((resolve) => {
            // Cancelar
            const onCancel = () => {
                cleanup();
                resolve(false);
            };
            cancelBtn.addEventListener('click', onCancel);

            // Confirmar
            const onConfirm = () => {
                cleanup();
                resolve(true);
            };
            confirmBtn.addEventListener('click', onConfirm);

            // Clic fuera
            const onOutsideClick = (e) => {
                if (e.target === modal) onCancel();
            };
            modal.addEventListener('click', onOutsideClick);

            function cleanup() {
                modal.classList.remove('show');
                document.body.style.overflow = '';
                cancelBtn.removeEventListener('click', onCancel);
                confirmBtn.removeEventListener('click', onConfirm);
                modal.removeEventListener('click', onOutsideClick);
            }
        });
    }

    return { show };
}
