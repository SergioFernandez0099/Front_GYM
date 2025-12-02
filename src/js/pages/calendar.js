import {Calendar} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import {createYearPicker} from "../components/yearpicker.js";
import {createTrainingSession, fetchTrainingSessions} from "../services/api.js";
import {safeNavigate} from "../router.js";

export async function trainingSchedule() {

    const calendarContainer = document.createElement("div");
    calendarContainer.className = "calendar-container";

    const calendarEl = document.createElement("div");
    calendarEl.id = "calendar";
    calendarContainer.appendChild(calendarEl);

    const sessionsData = await fetchTrainingSessions();

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

            // Inicio del press
            info.el.addEventListener("mousedown", () => {
                info._pressTimer = setTimeout(() => {
                    info._longPress = true;
                    // TODO mostrar modal de borrado
                    alert("LONG PRESS en evento " + info.event.id);
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
            const sessionId = await crearSessionEntrenamiento(1, info.dateStr);
            safeNavigate(`/sessions/${sessionId}`);
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

    calendar.setOption("datesSet", attachTitleClick);
    attachTitleClick();

    return calendarContainer;
}

async function crearSessionEntrenamiento(routineId, date) {

    const data = {
        routineId: routineId,
        date: date,
    }
    const result = await createTrainingSession(routineId, data)

    return result.id;
}
