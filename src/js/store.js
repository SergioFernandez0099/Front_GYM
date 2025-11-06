let isLoggedIn = true;
let token = null;
let userId = 3;

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

export function getCurrentUserId(){
  return userId;
}
