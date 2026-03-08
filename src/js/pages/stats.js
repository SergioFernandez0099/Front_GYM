import {fetchExercises, fetchMuscleGroups, generateStatsPdf} from "../services/api";
import {showSnackbar} from "../components/snackbar.js";
import {safeNavigate} from "../router.js";

export async function Stats() {
    const page = document.createElement("div");
    page.className = "checklist-page";

    let exercisesData;
    let muscleGroupsData;
    try {
        muscleGroupsData = await fetchMuscleGroups();
        exercisesData = await fetchExercises();
    } catch (error) {
        showSnackbar("error", "Error al cargar los ejercicios");
        safeNavigate("/error");
        return null;
    }

    // ── Group exercises by muscle group ──────────────────────────────────
    const grouped = new Map();
    muscleGroupsData.forEach((mg) => grouped.set(mg.name, []));
    exercisesData.forEach((ex) => {
        const group = ex.muscleGroup?.name;
        if (grouped.has(group)) grouped.get(group).push(ex);
    });

    // ── Header ───────────────────────────────────────────────────────────
    const header = document.createElement("header");
    header.className = "checklist-header";
    header.innerHTML = `
        <div class="checklist-header__inner">
            <span class="checklist-header__eyebrow">GYM</span>
            <h1 class="checklist-header__title">Selección de<br><em>Ejercicios</em></h1>
            <div class="checklist-header__meta">
                <span class="checklist-counter" id="checklist-counter">0 seleccionados</span>
                <button class="btn-clear" id="btn-clear-all">Limpiar todo</button>
            </div>
        </div>
    `;
    page.appendChild(header);

    // ── Content ──────────────────────────────────────────────────────────
    const content = document.createElement("div");
    content.className = "checklist-content";

    grouped.forEach((exercises, muscleGroup) => {
        if (!exercises.length) return;

        const section = document.createElement("section");
        section.className = "muscle-section";

        const sectionHeader = document.createElement("div");
        sectionHeader.className = "muscle-section__header";
        sectionHeader.innerHTML = `
            <h2 class="muscle-section__title">
                <span class="muscle-section__title-text">${muscleGroup}</span>
                <span class="muscle-section__count">${exercises.length}</span>
            </h2>
            <button class="btn-select-all" data-group="${muscleGroup}" data-selected="false">
                Seleccionar todo
            </button>
        `;
        section.appendChild(sectionHeader);

        const grid = document.createElement("div");
        grid.className = "exercise-checklist-grid";

        exercises.forEach((exercise, index) => {
            const label = document.createElement("label");
            label.className = "exercise-checklist-item";
            label.style.animationDelay = `${index * 25}ms`;
            label.htmlFor = `exercise-${exercise.id}`;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `exercise-${exercise.id}`;
            checkbox.name = "exercise";
            checkbox.value = exercise.id;
            checkbox.dataset.muscleGroup = muscleGroup;
            checkbox.className = "exercise-checkbox";

            checkbox.addEventListener("change", () => {
                label.classList.toggle("exercise-checklist-item--checked", checkbox.checked);
                updateCounter();
                syncSelectAllBtn(sectionHeader.querySelector(".btn-select-all"), muscleGroup);
            });

            label.innerHTML = `
                <span class="exercise-checklist-item__box">
                    <svg class="exercise-checklist-item__check" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L4.5 7.5L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                <span class="exercise-checklist-item__id">#${exercise.id}</span>
                <span class="exercise-checklist-item__name">${exercise.name}</span>
            `;

            label.prepend(checkbox);
            grid.appendChild(label);
        });

        section.appendChild(grid);
        content.appendChild(section);
    });

    page.appendChild(content);

    // ── Sticky footer ────────────────────────────────────────────────────
    const footer = document.createElement("footer");
    footer.className = "checklist-footer";
    footer.innerHTML = `
        <div class="checklist-footer__inner">
            <div class="checklist-footer__info">
                <span class="checklist-footer__label">Ejercicios seleccionados</span>
                <span class="checklist-footer__count" id="footer-counter">0</span>
            </div>
            <button class="btn-generate-pdf" id="btn-generate-pdf" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                Generar PDF
            </button>
        </div>
    `;
    page.appendChild(footer);

    // ── Counter ──────────────────────────────────────────────────────────
    function updateCounter() {
        const total = page.querySelectorAll(".exercise-checkbox:checked").length;
        page.querySelector("#checklist-counter").textContent = `${total} seleccionado${total !== 1 ? "s" : ""}`;
        page.querySelector("#footer-counter").textContent = total;
        page.querySelector("#btn-generate-pdf").disabled = total === 0;
    }

    function syncSelectAllBtn(btn, group) {
        const checkboxes = [...page.querySelectorAll(`.exercise-checkbox[data-muscle-group="${group}"]`)];
        const allChecked = checkboxes.every((cb) => cb.checked);
        btn.dataset.selected = String(allChecked);
        btn.textContent = allChecked ? "Deseleccionar todo" : "Seleccionar todo";
    }

    // ── Select all per group ─────────────────────────────────────────────
    content.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-select-all");
        if (!btn) return;

        const group = btn.dataset.group;
        const isSelected = btn.dataset.selected === "true";
        page.querySelectorAll(`.exercise-checkbox[data-muscle-group="${group}"]`).forEach((cb) => {
            cb.checked = !isSelected;
            cb.closest(".exercise-checklist-item").classList.toggle("exercise-checklist-item--checked", !isSelected);
        });
        btn.dataset.selected = String(!isSelected);
        btn.textContent = isSelected ? "Seleccionar todo" : "Deseleccionar todo";
        updateCounter();
    });

    // ── Clear all ────────────────────────────────────────────────────────
    page.querySelector("#btn-clear-all").addEventListener("click", () => {
        page.querySelectorAll(".exercise-checkbox").forEach((cb) => {
            cb.checked = false;
            cb.closest(".exercise-checklist-item").classList.remove("exercise-checklist-item--checked");
        });
        page.querySelectorAll(".btn-select-all").forEach((btn) => {
            btn.textContent = "Seleccionar todo";
            btn.dataset.selected = "false";
        });
        updateCounter();
    });

    // ── PDF button ───────────────────────────────────────────────────────
    page.querySelector("#btn-generate-pdf").addEventListener("click", async () => {
        const selected = [...page.querySelectorAll(".exercise-checkbox:checked")].map((cb) => Number(cb.value));

        const pdfBtn = page.querySelector("#btn-generate-pdf");
        pdfBtn.disabled = true;
        pdfBtn.textContent = "Generando...";

        try {
            const blob = await generateStatsPdf(selected);
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            // libera memoria cuando ya no se necesite
            setTimeout(() => URL.revokeObjectURL(url), 10000);

            page.querySelector("#btn-clear-all").click();
        } catch (error) {
            console.log(error);
            showSnackbar("error", "Error al generar el PDF");
        } finally {
            pdfBtn.disabled = false;
            pdfBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            Generar PDF
        `;
        }
    });

    return page;
}