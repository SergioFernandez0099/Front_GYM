import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { applyCSS } from "../../utils/helpers";
import esLocale from "@fullcalendar/core/locales/es";

export async function trainingSchedule() {
  applyCSS("/src/styles/calendar.css");
  const calendarContainer = document.createElement("div");
  calendarContainer.className = "calendar-container";

  let calendarEl = document.createElement("div");
  calendarEl.id = "calendar";

  calendarContainer.appendChild(calendarEl);

  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin],
    initialView: "dayGridMonth",
    locale: esLocale,
    dayMaxEventRows: true,
      aspectRatio: 1.5,
    events: [
      {
        start: "2025-11-15",
        allDay: true,
        extendedProps: {
          imageUrl: "favicon.png", // aquí ponemos la URL de la imagen
        },
      },
    ],
    eventContent: function (info) {
      const img = document.createElement("img");
      img.src = info.event.extendedProps.imageUrl;
      img.style.width = "70%";
      img.style.height = "70%";
      img.style.objectFit = "contain"; // para que la imagen llene el espacio
      img.style.filter = "drop-shadow(0 1px 3px #575757)";
      img.style.pointerEvents = "none"; // opcional, para que no bloquee clics
      return { domNodes: [img] };
    },
  });

  calendar.render();

  requestAnimationFrame(() => calendar.updateSize());

  return calendarContainer;
}
