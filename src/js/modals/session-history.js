export function createSessionHistory(history, exerciseName) {

    const existingModal = document.querySelector('.session-history-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // ===== Modal =====
    const modal = document.createElement('div');
    modal.className = 'session-history-modal';

    const historyHTML = (history.length > 0)
        ? history.map(e => `
              <div class="session-history-list-item">
                
                <p class="session-date">
                  ${new Date(e.sessionDate).toLocaleDateString("es-ES")}
                </p>
            
                <table class="session-history-table">
                  <thead>
                    <tr>
                      <th>SERIE</th>
                      <th class="th-weight">
                        <img src="/icons/dumbbell.svg" class="session-history-dumbbell" alt="Peso" />
                        PESO
                      </th>
                      <th>REPS</th>
                      <th>RIR</th>
                      <th>@</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${e.series.map(s => `
                      <tr>
                        <td>${s.order}</td>
                        <td>${s.weight != null ? `${s.weight} ${s.unit?.symbol ?? ""}` : "-"}</td>
                        <td>${s.reps}</td>
                        <td>${s.rir ?? "-"}</td>
                        <td>${s.intensity ?? "-"}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
            
              </div>
            `).join("")
        : `<h4 class="session-history-noresults">No hay registros</h4>`;


    modal.innerHTML = `
    <div class="session-history-container">
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
      <h4 class="session-history-label">Historial</h4>
      <h3 class="session-history-exercise">${exerciseName}</h3>
      <div class="session-history-list">
        ${historyHTML}
      </div>
    </div>
  `;

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        hide();
    })

    document.body.appendChild(modal);

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
