import { FormUtils } from "../components/form-utils.js";
import { LoginForm1 } from "./login.js";

  const isSubmitting = false;
     const validators = {
            user: (value) => ({ isValid: value && value.length > 0, message: value && value.length > 0 ? '' : 'Introduce un usuario' }),
            password: FormUtils.validatePassword
        };
        

export function Login({ onLogin }) {
  if (!document.getElementById("login-css")) {
    // evitar cargar varias veces
    const link = document.createElement("link");
    link.id = "login-css";
    link.rel = "stylesheet";
    link.href = "/src/styles/login.css"; // ruta de tu CSS
    document.head.appendChild(link);
  }

  const container = document.createElement("div");
  container.innerHTML = `
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <h2 class="border">G Y M</h2>
                <h2 class="wave">G Y M</h2>
                <p>Inicio de sesión</p>
            </div>

            <form class="login-form" id="loginForm" novalidate>
                <div class="form-group">
                    <div class="input-wrapper">
                        <input type="text" id="user" name="user" required autocomplete="given-name">
                        <label for="user">Usuario</label>
                        <span class="focus-border"></span>
                    </div>
                    <span class="error-message" id="emailError"></span>
                </div>

                <div class="form-group">
                    <div class="input-wrapper password-wrapper">
                        <input type="password" id="password" name="password" required autocomplete="current-password">
                        <label for="password">Contraseña</label>
                        <button type="button" class="password-toggle" id="passwordToggle"
                            aria-label="Toggle password visibility">
                            <span class="eye-icon"></span>
                        </button>
                        <span class="focus-border"></span>
                    </div>
                    <span class="error-message" id="passwordError"></span>
                </div>

                <div class="form-options">
                    <label class="remember-wrapper">
                        <input type="checkbox" id="remember" name="remember">
                        <span class="checkbox-label">
                            <span class="checkmark"></span>
                            Recuérdame
                        </span>
                    </label>
                    <a href="#" class="forgot-password">¿Has olvidado la contraseña?</a>
                </div>

                <button type="submit" class="login-btn btn">
                    <span class="btn-text">Iniciar sesión</span>
                    <span class="btn-loader">
                        <img src="favicon.png" class="btn-loader" alt="loader">
                    </span>
                </button>
            </form>

            <div class="signup-link">
                <p>¿No tienes una cuenta? <a href="#">Regístrate</a></p>
            </div>

            <div class="success-message" id="successMessage">
                <div class="success-icon">✓</div>
                <h3>Login Successful!</h3>
                <p>Redirecting to your dashboard...</p>
            </div>
        </div>
    </div>
  `;

  
  // Capturar el formulario
  const form = container.querySelector("#loginForm");
  const submitBtn = form.querySelector(".login-btn");
  const userInput = form.querySelector("#user");
  const passwordToggle = form.querySelector("#passwordToggle");
  const passwordInput = form.querySelector("#password");
  const inputs = form.querySelectorAll("input");
  const successMessage = container.querySelector("#successMessage");
  const forgotLink = form.querySelector(".forgot-password");
  const signupLink = container.querySelector(".signup-link");
  const checkbox = form.querySelector("#remember");
  const checkmark = form.querySelector(".checkmark");

  FormUtils.setupPasswordToggle(passwordInput, passwordToggle);
  FormUtils.setupFloatingLabels(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validación simple
    if (userInput.value === "admin" && passwordInput.value === "1234") {
      successMessage.style.display = "block";
      setTimeout(() => onLogin(), 1000); // callback para iniciar SPA
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  });

  form.addEventListener("submit", (e) => handleSubmit(e));
  inputs.forEach((input) => {
    input.addEventListener("focus", (e) => handleFocus(e));
    input.addEventListener("blur", (e) => handleBlur(e));
  });
  forgotLink.addEventListener("click", (e) => handleForgotPassword(e));
  signupLink.addEventListener("click", (e) => handleSignupLink(e));
  checkbox.addEventListener("change", () => animateCheckbox(checkmark));

  requestAnimationFrame(() => {
    new LoginForm1(); // inicializa validaciones, animaciones, etc.
  });

  return container;
}

function handleForgotPassword(e) {
  e.preventDefault();
  // TODO
}
function handleSignupLink(e) {
  e.preventDefault();
  // TODO
}

function handleFocus(e) {
  const wrapper = e.target.closest(".input-wrapper");
  if (wrapper) {
    wrapper.classList.add("focused");
  }
}

function handleBlur(e) {
  const wrapper = e.target.closest(".input-wrapper");
  if (wrapper) {
    wrapper.classList.remove("focused");
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  console.log(e.target);
  

  if (isSubmitting) return;

  const isValid = validateForm();
  await submitForm(e.target);
  // if (isValid) {
  //     await this.submitForm();
  // } else {
  //     this.shakeForm();
  // }
}

function validateField(fieldName) {
  const field = document.getElementById(fieldName);
  const validator = validators[fieldName];

  if (!field || !validator) return true;

  const result = validator(field.value.trim(), field);

  if (result.isValid) {
    FormUtils.clearError(fieldName);
  } else {
    FormUtils.showError(fieldName, result.message);
  }

  return result.isValid;
}

function validateForm() {
  let isValid = true;

  Object.keys(validators).forEach((fieldName) => {
    if (!validateField(fieldName)) {
      isValid = false;
    }
  });

  return isValid;
}

async function submitForm(form) {
  showLoginError("Login failed. Please try again.", form);

  isSubmitting = true;
  submitBtn.classList.add("loading");

  try {
    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    // Use shared login simulation
    // try simulate with user and password; fallback to email if needed
    try {
      // TODO
      await FormUtils.simulateLogin(user, password);
    } catch (err) {
      // If FormUtils expects an email param or user wasn't provided, try email field
      const emailField = document.getElementById("email");
      if (emailField && emailField.value)
        await FormUtils.simulateLogin(emailField.value, password);
      else throw err;
    }
  } catch (error) {
    console.error("Login error:", error);
    showLoginError(error.message);
  } finally {
    isSubmitting = false;
    this.submitBtn.classList.remove("loading");
  }
}

function showLoginError(message, form) {
  FormUtils.showNotification(
    message || "Login failed. Please try again.",
    "error",
    form
  );
  // Shake the entire card
  const card = document.querySelector(".login-card");
  card.style.animation = "shake 0.5s ease-in-out";
  setTimeout(() => {
    card.style.animation = "";
  }, 500);
}

function animateCheckbox(checkmark) {
  if (checkmark) {
    checkmark.style.transform = "scale(0.8)";
    setTimeout(() => {
      checkmark.style.transform = "scale(1)";
    }, 150);
  }
}

function addInputAnimations(inputs) {
  inputs.forEach((input, index) => {
    // Stagger animation on page load
    setTimeout(() => {
      input.style.opacity = "1";
      input.style.transform = "translateY(0)";
    }, index * 150);
  });
}

function shakeForm(form) {
  form.style.animation = "shake 0.5s ease-in-out";
  setTimeout(() => {
    form.style.animation = "";
  }, 500);
}

function simulateRedirect() {
  // For demo, reset the form after 2 seconds
  setTimeout(() => {
    this.resetForm();
  }, 2000);
}
