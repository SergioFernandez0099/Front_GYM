import {fetchTrainingStats} from "../services/api.js";
import {showSnackbar} from "../components/snackbar.js";
import {safeNavigate} from "../router.js";
import {capitalize} from "../../utils/helpers.js";

const professionalImages = [
    "arnold_1.avif",
    "arnold_2.avif",
    "cbum.avif",
    "cbum_1.avif",
    "eddie_hall.avif",
    "hafthor-bjornsson.avif",
    "josema_beast.avif",
    "larry__ruedas.avif",
    "madelman.avif",
    "nick_walker.avif",
    "pingon.avif",
    "pingon_2.avif",
    "ramon_dino.avif",
    "ramon_dino_3.avif",
    "ronnie_1.avif",
    "ronnie_2.avif",
    "ronnie_3.avif",
    "sam_sulek.avif",
    "the_rock.avif",
    "valdivia.avif"
];

export async function Home() {

    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let stats = null;

    try {
        stats = await fetchTrainingStats(month, year);

    } catch (error) {
        showSnackbar("error", "Error al cargar las estadísticas");
        safeNavigate("/error");

        return null;
    }

    const randomImage =
        `/images/professionals/${professionalImages[Math.floor(Math.random() * professionalImages.length)]}`;

    const container = document.createElement('div');
    container.className = "home-container";

    // Determinar el saludo según el último carácter del username
    const username = stats.username ?? "";
    const isFemale = username.toLowerCase().endsWith("a");
    const greeting = isFemale ? "Bienvenida" : "Bienvenido";

    container.innerHTML = `
        <div class="home-container-logo">
            <h1 class="border">G Y M</h1>
            <h1 class="wave">G Y M</h1>
        </div>
        <div class="home-header">
            <h1 class="home-title">${greeting} ${capitalize(username)}</h1>
            <img class="home-image" src="${randomImage}" alt="Imagen de un culturista aleatorio">
        </div>
        <div class="home-container-stats">
            <div class="home-stats-bg">
                <div class="home-stats-header">
                    <svg fill="currentColor" version="1.1" class="home-stats-dumbbell" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 500.04 500.04" xml:space="preserve" transform="rotate(45)" stroke="currentColor" stroke-width="13.501161000000002">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#FF0000FF" stroke-width="4.000344"/>
                        <g id="SVGRepo_iconCarrier">
                            <g> 
                                <g> 
                                    <path d="M491.445,206.857c-4.752,0-8.605,4.857-8.605,10.834c0,16.582,0,48.1,0,64.672c0,5.977,3.854,10.824,8.615,10.824 c4.752,0,8.588-4.848,8.588-10.824c0-16.562,0-48.081,0-64.682C500.043,211.714,496.197,206.857,491.445,206.857z"/>
                                    <path d="M8.616,206.857c-4.752,0-8.616,4.857-8.616,10.834c0,16.601,0,48.071,0.01,64.653c0,5.977,3.854,10.824,8.606,10.844 c4.753,0,8.597-4.848,8.597-10.824c0-16.572,0-48.081,0.01-64.682C17.222,211.714,13.369,206.857,8.616,206.857z"/> 
                                    <path d="M114.568,108.812c-15.854,0-28.716,14.544-28.716,32.474c0,54.354,0.01,163.137,0.02,217.471 c0,17.93,12.842,32.473,28.697,32.473s28.716-14.553,28.716-32.473c0-21.316,0-51.045,0-82.545c16.553,0,164.713,0,208.874,0 c0,31.51,0,61.229,0,82.555c0,17.92,12.861,32.463,28.717,32.463c15.854,0,28.697-14.553,28.697-32.473 c0-54.354,0-163.137,0-217.471c0-17.939-12.844-32.474-28.697-32.474c-15.855,0-28.717,14.525-28.717,32.474 c0,21.315,0,51.035,0,82.543c-44.178,0-192.321,0-208.874,0c0-31.508,0-61.229,0-82.553 C143.285,123.338,130.433,108.812,114.568,108.812z"/> 
                                    <path d="M447.602,152.188c-0.938,0-1.865,0-2.811,0c-11.945,0-21.641,9.668-21.641,21.63c0,37.647,0,114.76,0,152.406 c0,11.953,9.695,21.65,21.648,21.65c0.938,0,1.885,0,2.812,0c11.953,0,21.648-9.668,21.648-21.631 c0-37.637,0-114.759-0.008-152.407C469.26,161.875,459.555,152.188,447.602,152.188z"/> 
                                    <path d="M52.116,152.188c-0.937,0-1.884,0-2.821,0c-11.953,0-21.64,9.668-21.64,21.63c0,37.647,0,114.76,0,152.406 c0,11.963,9.687,21.65,21.64,21.65c0.937,0,1.884,0,2.811,0c11.953,0,21.64-9.668,21.64-21.631c0-37.637,0-114.759,0-152.407 C73.756,161.875,64.069,152.188,52.116,152.188z"/>
                                </g> 
                            </g> 
                        </g>
                    </svg>
                    <span class="stats-title">TOTAL</span>
                </div>
                <p class="home-stats-label">Entrenamientos</p>
                <p class="home-stats">${stats.totalTrainingDays ?? ""}</p>
            </div>
            <div class="home-stats-bg">
              <div class="home-stats-header">
                     <svg xmlns="http://www.w3.org/2000/svg" class="home-stats-calendar" width="200" height="200" viewBox="0 0 20 20">
                        <path fill="currentColor" d="M7 11a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm1 2a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm2-2a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm1 2a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm2-2a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm4-5.5A2.5 2.5 0 0 0 14.5 3h-9A2.5 2.5 0 0 0 3 5.5v9A2.5 2.5 0 0 0 5.5 17h9a2.5 2.5 0 0 0 2.5-2.5v-9ZM4 7h12v7.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 14.5V7Zm1.5-3h9A1.5 1.5 0 0 1 16 5.5V6H4v-.5A1.5 1.5 0 0 1 5.5 4Z"/>
                    </svg>
                    <span class="stats-title">MES</span>
                </div>
                <p class="home-stats-label">Sesiones este mes</p>
                <p class="home-stats">${stats.monthlySessions ?? ""}</p>
            </div>
        </div>
        <a class="home-button" href="/sessions">▶ Comenzar entrenamiento</a>
    `;

    return container;
}



