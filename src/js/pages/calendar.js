import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { applyCSS } from "../../utils/helpers";
import esLocale from "@fullcalendar/core/locales/es";
import { createYearPicker } from "../components/yearpicker.js";

export async function trainingSchedule() {
    applyCSS("/src/styles/calendar.css", "/src/styles/components/yearpicker.css");

    const calendarContainer = document.createElement("div");
    calendarContainer.className = "calendar-container";

    const calendarEl = document.createElement("div");
    calendarEl.id = "calendar";
    calendarContainer.appendChild(calendarEl);

    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        locale: esLocale,
        dayMaxEventRows: true,
        aspectRatio: 1.5,
        headerToolbar: {
            left: "",
            center: "title",
            right: "prev,next"
        },
        events: [
            {
                start: "2025-11-15",
                allDay: true,
                extendedProps: { imageUrl: "favicon.png" },
            },
        ],
        eventContent: function (info) {
            const img = document.createElement("img");
            img.src = info.event.extendedProps.imageUrl;
            img.className = "calendar-img";
            return { domNodes: [img] };
        },
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
