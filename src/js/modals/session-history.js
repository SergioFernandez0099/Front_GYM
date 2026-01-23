export function createSessionHistory(history, exerciseName) {

    const existingModal = document.querySelector('.session-history-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // ===== Modal =====
    const modal = document.createElement('div');
    modal.className = 'session-history-modal';

    const historyHTML = history.map(e => `
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
                <td>${s.weight ?? "-"} ${s.unit?.symbol ?? ""}</td>
                <td>${s.reps}</td>
                <td>${s.rir ?? "-"}</td>
                <td>${s.intensity ?? "-"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
    
      </div>
    `).join("");


    modal.innerHTML = `
    <div class="session-history-container">
      <h4 class="session-history-label">Historial</h4>
      <h3 class="session-history-exercise">${exerciseName}</h3>
      <div class="session-history-list">
        ${historyHTML}
      </div>
    </div>
  `;

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
