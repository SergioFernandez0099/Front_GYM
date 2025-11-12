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
      img.style.width = "2rem";
      img.style.height = "2rem";
      img.style.objectFit = "cover"; // para que la imagen llene el espacio
      img.style.borderRadius = "6px";
      img.style.pointerEvents = "none"; // opcional, para que no bloquee clics
      return { domNodes: [img] };
    },
  });

  calendar.render();

  requestAnimationFrame(() => calendar.updateSize());

  return calendarContainer;
}
