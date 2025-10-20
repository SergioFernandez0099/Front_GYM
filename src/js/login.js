// Login Form 1 - Glassmorphism Style JavaScript
// This file extends form-utils.js with form-specific functionality

class LoginForm1 {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.submitBtn = this.form.querySelector('.login-btn');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.passwordInput = document.getElementById('password');
        this.successMessage = document.getElementById('successMessage');
        this.isSubmitting = false;
        
        this.validators = {
            user: (value) => ({ isValid: value && value.length > 0, message: value && value.length > 0 ? '' : 'Introduce un usuario' }),
            password: FormUtils.validatePassword
        };
        
        this.init();
    }
    
    init() {
        this.addEventListeners();
        FormUtils.setupFloatingLabels(this.form);
        this.addInputAnimations();
        FormUtils.setupPasswordToggle(this.passwordInput, this.passwordToggle);
        FormUtils.addSharedAnimations();
    }
    
    addEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        Object.keys(this.validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => FormUtils.clearError(fieldName));
            }
        });
        
        // Enhanced focus effects
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.handleFocus(e));
            input.addEventListener('blur', (e) => this.handleBlur(e));
        });
        
        // Remember me checkbox animation
        const checkbox = document.getElementById('remember');
        if (checkbox) {
            checkbox.addEventListener('change', () => this.animateCheckbox());
        }
        
        // Forgot password link
        const forgotLink = document.querySelector('.forgot-password');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => this.handleForgotPassword(e));
        }
        
        // Sign up link
        const signupLink = document.querySelector('.signup-link a');
        if (signupLink) {
            signupLink.addEventListener('click', (e) => this.handleSignupLink(e));
        }
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    addInputAnimations() {
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach((input, index) => {
            // Stagger animation on page load
            setTimeout(() => {
                input.style.opacity = '1';
                input.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    

    
    handleFocus(e) {
        const wrapper = e.target.closest('.input-wrapper');
        if (wrapper) {
            wrapper.classList.add('focused');
        }
    }
    
    handleBlur(e) {
        const wrapper = e.target.closest('.input-wrapper');
        if (wrapper) {
            wrapper.classList.remove('focused');
        }
    }
    
    animateCheckbox() {
        const checkmark = document.querySelector('.checkmark');
        if (checkmark) {
            checkmark.style.transform = 'scale(0.8)';
            setTimeout(() => {
                checkmark.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    handleForgotPassword(e) {
        e.preventDefault();
        // Add subtle animation
        const link = e.target;
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);        
    }
    
    handleSignupLink(e) {
        e.preventDefault();
        // Add subtle animation
        const link = e.target;
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
        
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const isValid = this.validateForm();
        await this.submitForm();
        // if (isValid) {
        //     await this.submitForm();
        // } else {
        //     this.shakeForm();
        // }
    }
    
    validateForm() {
        let isValid = true;
        
        Object.keys(this.validators).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const validator = this.validators[fieldName];
        
        if (!field || !validator) return true;
        
        const result = validator(field.value.trim(), field);
        
        if (result.isValid) {
            FormUtils.clearError(fieldName);
        } else {
            FormUtils.showError(fieldName, result.message);
        }
        
        return result.isValid;
    }
    
    shakeForm() {
        this.form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.form.style.animation = '';
        }, 500);
    }
    
    async submitForm() {
        this.showLoginError("Login failed. Please try again.");

        this.isSubmitting = true;
        this.submitBtn.classList.add('loading');
        
        try {
            const user = document.getElementById('user').value;
            const password = document.getElementById('password').value;

            // Use shared login simulation
            // try simulate with user and password; fallback to email if needed
            try {
                await FormUtils.simulateLogin(user, password);
            } catch (err) {
                // If FormUtils expects an email param or user wasn't provided, try email field
                const emailField = document.getElementById('email');
                if (emailField && emailField.value) await FormUtils.simulateLogin(emailField.value, password);
                else throw err;
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showLoginError(error.message);
        } finally {
            this.isSubmitting = false;
            this.submitBtn.classList.remove('loading');
        }
    }

    
    simulateRedirect() {
        // For demo, reset the form after 2 seconds
        setTimeout(() => {
            this.resetForm();
        }, 2000);
    }
    
    showLoginError(message) {
        console.log(234);
        
        FormUtils.showNotification(message || 'Login failed. Please try again.', 'error', this.form);
        // Shake the entire card
        const card = document.querySelector('.login-card');
        card.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }
    
    resetForm() {
        this.successMessage.classList.remove('show');
        
        setTimeout(() => {
            // Show form elements again
            const elementsToShow = ['.signup-link'];
            this.form.style.display = 'block';
            elementsToShow.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.display = 'block';
                }
            });
            
            this.form.reset();
            
            // Clear all validation states
            Object.keys(this.validators).forEach(fieldName => {
                FormUtils.clearError(fieldName);
            });
            
            // Reset form appearance
            this.form.style.opacity = '1';
            this.form.style.transform = 'translateY(0)';
            
            // Reset other elements
            elementsToShow.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
            
            // Reset floating labels
            const inputs = this.form.querySelectorAll('input');
            inputs.forEach(input => {
                input.classList.remove('has-value');
            });
            
            // Reset password visibility
            if (this.passwordInput) {
                this.passwordInput.type = 'password';
                const eyeIcon = this.passwordToggle?.querySelector('.eye-icon');
                if (eyeIcon) {
                    eyeIcon.classList.remove('show-password');
                }
            }
        }, 300);
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Enter key submits form if focus is on form elements
            if (e.key === 'Enter' && e.target.closest('#loginForm')) {
                e.preventDefault();
                this.handleSubmit(e);
            }
            
            // Escape key clears errors
            if (e.key === 'Escape') {
                Object.keys(this.validators).forEach(fieldName => {
                    FormUtils.clearError(fieldName);
                });
            }
        });
    }
    
    // Public methods
    validate() {
        return this.validateForm();
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add entrance animation to login card
    const loginCard = document.querySelector('.login-card');
    FormUtils.addEntranceAnimation(loginCard);
    
    // Initialize the login form
    new LoginForm1();
});

// Handle page visibility changes for better UX
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Re-focus on email field if user returns to page
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName !== 'INPUT') {
            const emailInput = document.querySelector('#email');
            if (emailInput && !emailInput.value) {
                setTimeout(() => emailInput.focus(), 100);
            }
        }
    }
});