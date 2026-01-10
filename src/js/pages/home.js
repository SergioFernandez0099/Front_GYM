import {fetchTrainingStats} from "../services/api.js";
import {showSnackbar} from "../components/snackbar.js";
import {safeNavigate} from "../router.js";

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
        `/assets/images/professionals/${professionalImages[Math.floor(Math.random() * professionalImages.length)]}`;

    const container = document.createElement('div');
    container.className = "home-container";

    // Determinar el saludo según el último carácter del username
    const username = stats.username ?? "";
    const isFemale = username.toLowerCase().endsWith("a");
    const greeting = isFemale ? "Bienvenida" : "Bienvenido";

    container.innerHTML = `
        <div class="home-header">
            <h1 class="home-title">${greeting} ${username}</h1>
            <img class="home-image" src="${randomImage}" alt="Imagen de un culturista aleatorio">
        </div>
        <p class="home-stats">Total de entrenos: ${stats.totalTrainingDays ?? ""}</p>
        <p class="home-stats">Total de entrenos este mes: ${stats.monthlySessions ?? ""}</p>
        <a class="home-button" href="/sessions">Comenzar entrenamiento</a>
    `;

    return container;
}



