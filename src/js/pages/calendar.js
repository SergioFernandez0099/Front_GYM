import {Calendar} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import {createYearPicker} from "../modals/year-picker.js";
import {
    createTrainingSession,
    deleteTrainingSession,
    fetchRoutineDays,
    fetchTrainingSessions
} from "../services/api.js";
import {safeNavigate} from "../router.js";
import {createRoutinePicker} from "../modals/routine-picker.js";
import {openConfirmModal} from "../../utils/helpers.js";
import {showSnackbar} from "../components/snackbar.js";

export async function trainingSchedule() {


    const calendarContainer = document.createElement("div");
    calendarContainer.className = "calendar-container";

    const calendarEl = document.createElement("div");
    calendarEl.id = "calendar";
    calendarContainer.appendChild(calendarEl);


    let sessionsData;
    let routinesData;

    try {
        sessionsData = await fetchTrainingSessions();
        routinesData = await fetchRoutineDays();
    } catch (error) {
        showSnackbar("error", "Error al cargar las sesiones");
        safeNavigate("/error");
        return null;
    }

    let dateSelected = null;

    const routinePicker = createRoutinePicker(routinesData, createSession)

    const sessionEvents = sessionsData.map(session => ({
        id: session.id,
        start: session.date,
        allDay: true,
        extendedProps: {imageUrl: "favicon.png"},
    }));

    console.log(sessionEvents);
    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        locale: esLocale,
        dayMaxEventRows: true,
        aspectRatio: 1.5,
        headerToolbar: {
            left: "",
            center: "title",
            right: "prev,next"
        },
        events: sessionEvents,
        eventLongPressDelay: 600,
        eventDidMount(info) {
            info._longPress = false;

            // Inicio del press
            info.el.addEventListener("mousedown", () => {
                info._pressTimer = setTimeout(async () => {
                    info._longPress = true;
                    await deleteSession(info.event.id)
                }, 600);
            });

            // Fin del press
            info.el.addEventListener("mouseup", (e) => {
                clearTimeout(info._pressTimer);

                if (info._longPress) {
                    e.stopImmediatePropagation(); // Evita que dispare eventClick
                    info._longPress = false;
                }
            });

            // Si el ratón sale, cancelar
            info.el.addEventListener("mouseleave", () => {
                clearTimeout(info._pressTimer);
            });
        },
        eventContent: function (info) {
            const img = document.createElement("img");
            img.src = info.event.extendedProps.imageUrl;
            img.className = "calendar-img";
            return {domNodes: [img]};
        },
        eventClick: function (info) {
            const sessionId = info.event.id;
            safeNavigate(`/sessions/${sessionId}`);
        },
        dateClick: async function (info) {
            dateSelected = info.dateStr;
            await routinePicker.show()
        }
    });

    calendar.render();
    requestAnimationFrame(() => calendar.updateSize());

    // ======= Crear YearPicker =======
    const yearPicker = createYearPicker({
        range: 100,
        onSelect: (year) => {
            const newDate = new Date(calendar.getDate());
            newDate.setFullYear(year);
            calendar.gotoDate(newDate);
        }
    });
    document.body.appendChild(yearPicker.container);

    // ======= Enganchar click al título =======
    function attachTitleClick() {
        const titleEl = calendarEl.querySelector(".fc-toolbar-title");
        if (titleEl && !titleEl.dataset.yearpickerAttached) {
            titleEl.style.cursor = "pointer";
            titleEl.addEventListener("click", () => {
                const visibleDate = calendar.getDate();
                const currentYear = visibleDate.getFullYear();
                yearPicker.show(currentYear);
            });
            titleEl.dataset.yearpickerAttached = "true";
        }
    }

    async function createSession(routineId) {
        const data = {
            routineId: Number(routineId),
            date: dateSelected,
        }
        const result = await createTrainingSession(data)

        if (result && result.ok) {
            safeNavigate(`/sessions/${result.id}`);
        }
        console.error("No se ha podido crear la sesión")
    }

    async function deleteSession(sessionId) {
        const confirmed = await openConfirmModal("¿Estás seguro de borrar esta sesión?");
        if (confirmed) {
            const result = await deleteTrainingSession(sessionId);

            if (result && result.ok) {
                safeNavigate('/sessions')
            } else {
                console.warn("No se pudo borrar el ejercicio", result);
            }
        } else {
            console.log("Acción cancelada");
        }
    }

    calendar.setOption("datesSet", attachTitleClick);
    attachTitleClick();

    return calendarContainer;
}

