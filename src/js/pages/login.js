import {login} from "../services/api.js";
import {showSnackbar} from "../components/snackbar.js";

class FormUtils {
    // Validación de contraseña
    static validatePassword(value) {
        if (!value) {
            return {isValid: false, message: "Password is required"};
        }
        if (value.length < 4) {
            return {
                isValid: false,
                message: "Password must be at least 8 characters long",
            };
        }
        // if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        //   return {
        //     isValid: false,
        //     message: "Password must contain uppercase, lowercase, and number",
        //   };
        // }
        return {isValid: true};
    }

    // Muestra una notificación temporal dentro del formulario o contenedor dado
    static showNotification(message, type = "info", container = null) {
        const target = container || document.querySelector("form");
        if (!target) return;

        const notification = document.createElement("div");
        notification.className = `notification ${type}`;

        let backgroundColor, borderColor, textColor;
        switch (type) {
            case "error":
                backgroundColor = "rgba(239, 68, 68, 0.1)";
                borderColor = "rgba(239, 68, 68, 0.3)";
                textColor = "#ef4444";
                break;
            case "success":
                backgroundColor = "rgba(34, 197, 94, 0.1)";
                borderColor = "rgba(34, 197, 94, 0.3)";
                textColor = "#22c55e";
                break;
            default:
                backgroundColor = "rgba(6, 182, 212, 0.1)";
                borderColor = "rgba(6, 182, 212, 0.3)";
                textColor = "#06b6d4";
        }

        notification.innerHTML = `
      <div style="
        background: ${backgroundColor}; 
        backdrop-filter: blur(10px); 
        border: 1px solid ${borderColor}; 
        border-radius: 12px; 
        padding: 12px 16px; 
        margin-top: 2px; 
        margin-bottom: 16px; 
        color: ${textColor}; 
        text-align: center;
        font-size: 14px;
        animation: slideIn 0.3s ease;
      ">
        ${message}
      </div>
    `;
        target.appendChild(notification);

        // Elimina la notificación después de 3 segundos
        setTimeout(() => {
            // Aplica animación de salida al contenedor interno
            notification.firstElementChild.style.animation = "slideOut 0.3s ease";
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Inyecta animaciones compartidas en <head> (solo una vez)
    static addSharedAnimations() {
        if (!document.getElementById("shared-animations")) {
            const style = document.createElement("style");
            style.id = "shared-animations";
            style.textContent = `
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes checkmarkPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        @keyframes successPulse {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `;
            document.head.appendChild(style);
        }
    }

    // Configura las etiquetas flotantes (label) para que cambien con el valor
    static setupFloatingLabels(form) {
        form.querySelectorAll("input").forEach((input) => {
            if (input.value.trim()) input.classList.add("has-value");
            input.addEventListener("input", () => {
                input.classList.toggle("has-value", input.value.trim() !== "");
            });
        });
    }

    // Configura el botón de mostrar/ocultar contraseña
    static setupPasswordToggle(passwordInput, toggleButton) {
        if (toggleButton && passwordInput) {
            toggleButton.addEventListener("click", () => {
                const isPassword = passwordInput.type === "password";
                const eyeIcon = toggleButton.querySelector(".eye-icon");
                passwordInput.type = isPassword ? "text" : "password";
                eyeIcon?.classList.toggle("show-password", isPassword);
                toggleButton.style.transform = "scale(0.9)";
                setTimeout(() => (toggleButton.style.transform = ""), 150);
                passwordInput.focus();
            });
        }
    }
}

class LoginForm {
    constructor(onLogin) {
        this.onLogin = onLogin;
        this.isSubmitting = false;

        // Crea la estructura HTML del formulario
        this.container = document.createElement("div");
        this.container.classList.add("login-container");
        this.container.innerHTML = `
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
              <span class="error-message" id="userError"></span>
            </div>
            <div class="form-group">
              <div class="input-wrapper password-wrapper">
                <input type="password" id="password" name="password" required autocomplete="current-password">
                <label for="password">Contraseña</label>
                <button type="button" class="password-toggle" id="passwordToggle" aria-label="Toggle password visibility">
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
              <span class="btn-loader"><img src="favicon.png" class="btn-loader" alt="loader"></span>
            </button>
          </form>
          <div class="signup-link">
            <p>¿No tienes una cuenta? <a href="#">Regístrate</a></p>
          </div>
        </div>
    `;

        // Obtener referencias a elementos clave (se hace una sola vez)
        const form = this.container.querySelector("#loginForm");
        this.userField = form.querySelector("#user");
        this.passwordField = form.querySelector("#password");
        this.submitBtn = form.querySelector(".login-btn");
        this.errorElements = {
            user: form.querySelector("#userError"),
            password: form.querySelector("#passwordError"),
        };
        this.rememberCheckbox = form.querySelector("#remember");
        this.checkmark = form.querySelector(".checkmark");
        this.forgotLink = form.querySelector(".forgot-password");
        this.signupLink = this.container.querySelector(".signup-link a");
        const passwordToggle = form.querySelector("#passwordToggle");

        // Inicializar utilidades compartidas
        FormUtils.setupPasswordToggle(this.passwordField, passwordToggle);
        FormUtils.setupFloatingLabels(form);
        FormUtils.addSharedAnimations();

        // Validadores para cada campo
        this.validators = {
            user: (value) => ({
                isValid: !!value,
                message: value ? "" : "Introduce un usuario",
            }),
            password: FormUtils.validatePassword,
        };

        // Eventos del formulario
        form.addEventListener("submit", (e) => this.handleSubmit(e));
        this.userField.addEventListener("blur", () => this.validateField("user"));
        this.userField.addEventListener("input", () => this.clearError("user"));
        this.passwordField.addEventListener("blur", () =>
            this.validateField("password")
        );
        this.passwordField.addEventListener("input", () =>
            this.clearError("password")
        );

        // Efectos de foco en los wrappers de input
        form.querySelectorAll("input").forEach((input) => {
            input.addEventListener("focus", (e) =>
                e.target.closest(".input-wrapper")?.classList.add("focused")
            );
            input.addEventListener("blur", (e) =>
                e.target.closest(".input-wrapper")?.classList.remove("focused")
            );
        });

        // Enlaces de "olvidó contraseña" y "registro" (aún sin implementación de navegación)
        this.forgotLink.addEventListener("click", (e) => e.preventDefault());
        this.signupLink.addEventListener("click", (e) => e.preventDefault());

        // Animación del checkbox "Recuérdame"
        this.rememberCheckbox.addEventListener("change", () =>
            this.animateCheckbox()
        );

        // Atajos de teclado: Enter para enviar, Escape para borrar errores
        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && e.target.closest("#loginForm")) {
                e.preventDefault();
                this.handleSubmit(e);
            }
            if (e.key === "Escape") {
                Object.keys(this.validators).forEach((field) => this.clearError(field));
            }
        });

        return this.container; // Devuelve el nodo contenedor completo
    }

    // Valida un campo específico
    validateField(fieldName) {
        const field = this[fieldName + "Field"];
        const validator = this.validators[fieldName];
        if (!field || !validator) return true;

        const result = validator(field.value.trim());
        if (result.isValid) {
            this.clearError(fieldName);
        } else {
            this.showError(fieldName, result.message);
        }
        return result.isValid;
    }

    // Valida todo el formulario; retorna false si hay errores
    validateForm() {
        return Object.keys(this.validators).every((field) =>
            this.validateField(field)
        );
    }

    // Manejador de envío del formulario
    async handleSubmit(e) {
        e.preventDefault();
        if (this.isSubmitting) return;

        if (!this.validateForm()) {
            this.shakeForm(); // Agita si hay errores
            return;
        }

        this.isSubmitting = true;
        this.submitBtn.classList.add("loading"); // Muestra loader
        const user = this.userField.value;
        const pin = this.passwordField.value;

        try {
            const data = await login(user, pin);
            showSnackbar("success", `Bienvenido ${data.message.user.name}`);
            this.onLogin(); // Llama al callback de éxito
        } catch (error) {
            // Muestra mensaje de error y agita
            FormUtils.showNotification(error.message, "error");
            this.shakeForm();
        } finally {
            this.isSubmitting = false;
            this.submitBtn.classList.remove("loading");
        }
    }

    // Aplica la animación de sacudida al formulario
    shakeForm() {
        const form = this.container.querySelector(".login-form");
        if (form) {
            form.style.animation = "shake 0.5s ease-in-out";
            setTimeout(() => (form.style.animation = ""), 500);
        }
    }

    // Muestra un mensaje de error junto al campo
    showError(fieldName, message) {
        const field = this[fieldName + "Field"];
        const errorEl = this.errorElements[fieldName];
        if (field && errorEl) {
            const formGroup = field.closest(".form-group");
            formGroup?.classList.add("error");
            errorEl.textContent = message;
            errorEl.classList.add("show");
            field.style.animation = "shake 0.5s ease-in-out";
            setTimeout(() => (field.style.animation = ""), 500);
        }
    }

    // Limpia el estado de error del campo
    clearError(fieldName) {
        const field = this[fieldName + "Field"];
        const errorEl = this.errorElements[fieldName];
        if (field && errorEl) {
            const formGroup = field.closest(".form-group");
            formGroup?.classList.remove("error");
            errorEl.classList.remove("show");
            setTimeout(() => {
                errorEl.textContent = "";
            }, 300);
        }
    }

    // Efecto visual al pulsar el checkbox "Recuérdame"
    animateCheckbox() {
        if (this.checkmark) {
            this.checkmark.style.transform = "scale(0.8)";
            setTimeout(() => (this.checkmark.style.transform = ""), 150);
        }
    }
}

// Función exportada que crea la instancia del formulario de login
export function Login({onLogin}) {

    // Devuelve el contenedor generado por LoginForm
    return new LoginForm(onLogin);
}
