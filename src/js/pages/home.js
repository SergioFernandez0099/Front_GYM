import {fetchTrainingStats} from "../services/api.js";
import {showSnackbar} from "../components/snackbar.js";
import {safeNavigate} from "../router.js";

export async function Home() {

    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let stats = null;

    try {
        stats = await fetchTrainingStats(month, year);
        console.log(stats);
    } catch (error) {
        showSnackbar("error", "Error al cargar las estadísticas");
        safeNavigate("/error");
        return null;
    }

    const container = document.createElement('div');
    container.className = "home-container";

    // Determinar el saludo según el último carácter del username
    const username = stats.username ?? "";
    const isFemale = username.toLowerCase().endsWith("a");
    const greeting = isFemale ? "Bienvenida" : "Bienvenido";

    container.innerHTML = `
        <div class="home-header">
            <h1 class="home-title">${greeting} ${username}</h1>
            <img class="home-image" src="/assets/images/snorlax.avif" alt="Imagen de un culturista aleatorio">
        </div>
        <p class="home-stats">Total de entrenos: ${stats.totalTrainingDays ?? ""}</p>
        <p class="home-stats">Total de entrenos este mes: ${stats.monthlySessions ?? ""}</p>
        <a class="home-button" href="/sessions">Comenzar entrenamiento</a>
    `;

    return container;
}



