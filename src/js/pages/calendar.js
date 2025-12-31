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
            info._pressTimer = null;

            // Función para iniciar el long press
            const startLongPress = () => {
                info._pressTimer = setTimeout(async () => {
                    info._longPress = true;
                    await deleteSession(info.event.id);
                }, 600);
            };

            // Función para cancelar el long press
            const cancelLongPress = () => {
                if (info._pressTimer) {
                    clearTimeout(info._pressTimer);
                    info._pressTimer = null;
                }
            };

            // Función para finalizar el long press
            const endLongPress = (e) => {
                cancelLongPress();

                if (info._longPress) {
                    e.stopImmediatePropagation(); // Evita que dispare eventClick
                    e.preventDefault();
                    info._longPress = false;
                }
            };

            // --- EVENTOS DESKTOP (Mouse) ---
            info.el.addEventListener("mousedown", startLongPress);
            info.el.addEventListener("mouseup", endLongPress);
            info.el.addEventListener("mouseleave", cancelLongPress);

            // --- EVENTOS MÓVIL (Touch) ---
            info.el.addEventListener("touchstart", (e) => {
                startLongPress();
            }, {passive: true});

            info.el.addEventListener("touchend", (e) => {
                endLongPress(e);
            });

            info.el.addEventListener("touchmove", (e) => {
                // Si el usuario mueve el dedo, cancelar el long press
                cancelLongPress();
            }, {passive: true});

            info.el.addEventListener("touchcancel", cancelLongPress);
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
            await routinePicker.show();
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
        try {
            const data = {
                routineId: Number(routineId),
                date: dateSelected,
            }
            
            const result = await createTrainingSession(data);

            showSnackbar("success", "Sesión creada correctamente")
            safeNavigate(`/sessions/${result.id}`);
        } catch (error) {
            showSnackbar("error", "Error al crear la sesión");
        }
    }

    async function deleteSession(sessionId) {
        const confirmed = await openConfirmModal("¿Estás seguro de borrar esta sesión?");
        if (!confirmed) return
        try {
            await deleteTrainingSession(sessionId);
            showSnackbar("success", "Sesión de entrenamiento borrada correctamente")
            safeNavigate('/sessions')
        } catch (error) {
            showSnackbar("error", "No se pudo borrar la sesión de entrenamiento")
        }
    }

    calendar.setOption("datesSet", attachTitleClick);
    attachTitleClick();

    return calendarContainer;
}

