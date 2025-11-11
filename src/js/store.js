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
