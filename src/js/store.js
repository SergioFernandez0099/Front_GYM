
let isLoggedIn = true;
let token = null;

export function setLoginStatus(status, newToken = null) {
  isLoggedIn = status;
  if (newToken) token = newToken;
}

export function getLoginStatus() {
  return isLoggedIn;
}

export function getToken() {
  return token;
}
