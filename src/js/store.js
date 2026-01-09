import {validateToken} from "./services/api.js";
import {safeNavigate} from "./router.js";
import {showSnackbar} from "./components/snackbar.js";
import {hideLoader, showLoader} from "../utils/helpers.js";

let userId = localStorage.getItem("userId") || null;
let forceNoCache = false;
export let connected = false;

export function getLoginStatus() {
    return userId !== null;
}

export function getCurrentUserId() {
    return userId;
}

export function setCurrentUserId(id) {
    userId = id;
    localStorage.setItem("userId", id);
}

export function clearCurrentUserId() {
    userId = null;
    localStorage.removeItem("userId");
}

export function setForceNoCache(value) {
    forceNoCache = value;
}

export function getForceNoCache() {
    return forceNoCache;
}

export function setConnected(value) {
    connected = value;
}

export async function checkAndSetLogin(timeout = 9000) {
    if (!getCurrentUserId()) return false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        showLoader();
        const data = await validateToken({signal: controller.signal}); // validateToken debe usar fetch
        clearTimeout(timer);
        if (data?.userId) {
            setCurrentUserId(data.userId);
            setConnected(true);
        } else {
            setConnected(false);
            showSnackbar("error", "Error al conectar con el servidor");
            safeNavigate("error");
        }
        return !!data?.userId;
    } catch (error) {
        setConnected(false);
        clearTimeout(timer);

        if (error.name === "AbortError") {
            showSnackbar("error", "Tiempo de conexión agotado");
        } else {
            showSnackbar("error", "Error al conectar con el servidor");
        }

        safeNavigate("error");
        return false;
    } finally {
        hideLoader();
    }
}