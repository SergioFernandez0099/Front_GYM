import {validateToken} from "./services/api.js";

let userId = localStorage.getItem("userId") || null;
let forceNoCache = false;

export function getLoginStatus() {
  return userId !== null;
}

export function getCurrentUserId(){
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

export async function checkAndSetLogin() {
    if (!getCurrentUserId()) return false;

    try {
        const data = await validateToken();
        if (data?.userId) setCurrentUserId(data.userId);
        else clearCurrentUserId();
        return !!data?.userId;
    } catch {
        clearCurrentUserId();
        return false;
    }
}