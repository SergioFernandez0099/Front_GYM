// Shared Form Utilities
// This file contains common functionality used across all login forms

class FormUtils {
  static validateEmail(value) {
    if (!value) {
      return { isValid: false, message: "Email address is required" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { isValid: false, message: "Please enter a valid email address" };
    }
    return { isValid: true };
  }

  static validatePassword(value) {
    if (!value) {
      return { isValid: false, message: "Password is required" };
    }
    if (value.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long",
      };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return {
        isValid: false,
        message: "Password must contain uppercase, lowercase, and number",
      };
    }
    return { isValid: true };
  }

  static clearError(fieldName) {
    const formGroup = document.getElementById(fieldName).closest(".form-group");
    const errorElement = document.getElementById(fieldName + "Error");

    if (formGroup && errorElement) {
      formGroup.classList.remove("error");
      errorElement.classList.remove("show");
      setTimeout(() => {
        errorElement.textContent = "";
      }, 300);
    }
  }

  static showSuccess(fieldName) {
    const field = document.getElementById(fieldName);
    const wrapper = field?.closest(".input-wrapper");

    if (wrapper) {
      // Add subtle success indication
      wrapper.style.borderColor = "#22c55e";
      setTimeout(() => {
        wrapper.style.borderColor = "";
      }, 2000);
    }
  }

  static simulateLogin(email, password) {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Demo: reject if email is 'admin@demo.com' and password is 'wrongpassword'
        if (email === "admin@demo.com" && password === "wrongpassword") {
          reject(new Error("Invalid email or password"));
        } else {
          resolve({ success: true, user: { email } });
        }
      }, 200000);
    });
  }

  static showNotification(message, type = "info", container = null) {
    const targetContainer = container || document.querySelector("form");
    if (!targetContainer) return;

    // Create notification element
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

    targetContainer.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 300000);
  }

  static setupFloatingLabels(form) {
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      // Check if field has value on page load
      if (input.value.trim() !== "") {
        input.classList.add("has-value");
      }

      input.addEventListener("input", () => {
        if (input.value.trim() !== "") {
          input.classList.add("has-value");
        } else {
          input.classList.remove("has-value");
        }
      });
    });
  }

  static setupPasswordToggle(passwordInput, toggleButton) {
    console.log("");
    if (toggleButton && passwordInput) {
      toggleButton.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        const eyeIcon = toggleButton.querySelector(".eye-icon");
        console.log(isPassword);

        passwordInput.type = isPassword ? "text" : "password";
        if (eyeIcon) {
          eyeIcon.classList.toggle("show-password", isPassword);
        }

        // Add smooth transition effect
        toggleButton.style.transform = "scale(0.9)";
        setTimeout(() => {
          toggleButton.style.transform = "scale(1)";
        }, 150);

        // Keep focus on password input
        passwordInput.focus();
      });
    }
  }

  static addEntranceAnimation(element, delay = 100) {
    if (element) {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";

      setTimeout(() => {
        element.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        element.style.opacity = "0.8";
        element.style.transform = "translateY(0)";
      }, delay);
    }
  }

  static addSharedAnimations() {
    // Add CSS animations to document head if not already present
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
}

const isSubmitting = false;
const validators = {
  user: (value) => ({
    isValid: value && value.length > 0,
    message: value && value.length > 0 ? "" : "Introduce un usuario",
  }),
  password: FormUtils.validatePassword,
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

  // form.addEventListener("submit", (e) => {
  //   e.preventDefault();

  //   // Validación simple
  //   if (userInput.value === "admin" && passwordInput.value === "1234") {
  //     successMessage.style.display = "block";
  //     setTimeout(() => onLogin(), 1000); // callback para iniciar SPA
  //   } else {
  //     alert("Usuario o contraseña incorrectos");
  //   }
  // });

  form.addEventListener("submit", (e) => handleSubmit(e));

  inputs.forEach((input) => {
    input.addEventListener("focus", (e) => handleFocus(e));
    input.addEventListener("blur", (e) => handleBlur(e));
  });
  forgotLink.addEventListener("click", (e) => handleForgotPassword(e));
  signupLink.addEventListener("click", (e) => handleSignupLink(e));
  checkbox.addEventListener("change", () => animateCheckbox(checkmark));

  requestAnimationFrame(() => {
    //new LoginForm1(); // inicializa validaciones, animaciones, etc.
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

async function handleSubmit(e ) {
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
    showError(fieldName, result.message);
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

async function submitForm(onLogin, successMessage) {
  showLoginError("Login failed. Please try again.");

  isSubmitting = true;
  const submitBtn = document.querySelectorAll(".login-btn");
  submitBtn.classList.add("loading");

  try {
    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    // Use shared login simulation
    // try simulate with user and password; fallback to email if needed
    try {
      successMessage.style.display = "block";
       setTimeout(() => onLogin(), 1000);
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

function showLoginError(message) {
    // const form = document.getElementById("login-form");

  FormUtils.showNotification(
    message || "Login failed. Please try again.",
    "error"
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

function showError(fieldName, message) {
  const formGroup = document.getElementById(fieldName).closest(".form-group");
  const errorElement = document.getElementById(fieldName + "Error");

  if (formGroup && errorElement) {
    formGroup.classList.add("error");
    errorElement.textContent = message;
    errorElement.classList.add("show");

    // Add shake animation to the field
    const field = document.getElementById(fieldName);
    if (field) {
      field.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => {
        field.style.animation = "";
      }, 500);
    }
  }
}

function simulateRedirect() {
  // For demo, reset the form after 2 seconds
  setTimeout(() => {
    this.resetForm();
  }, 2000);
}
