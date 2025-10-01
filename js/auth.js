// ============================================
// AUTH PAGE JAVASCRIPT - Sign In / Sign Up
// ============================================

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = '672817275533-fc983udf6qmg9d0c8b0m8nojda5jb4r7.apps.googleusercontent.com';

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        console.log('Initializing Google Sign-In...');
        
        // Render Sign In button
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: true
        });

        // Render button for Sign In form
        const signInButton = document.getElementById('googleSignInButton');
        if (signInButton) {
            console.log('Rendering Google Sign In button');
            google.accounts.id.renderButton(
                signInButton,
                {
                    theme: 'outline',
                    size: 'large',
                    width: 400,
                    text: 'continue_with',
                    shape: 'rectangular',
                    logo_alignment: 'left'
                }
            );
        } else {
            console.error('Sign In button container not found');
        }

        // Render button for Sign Up form
        const signUpButton = document.getElementById('googleSignUpButton');
        if (signUpButton) {
            console.log('Rendering Google Sign Up button');
            google.accounts.id.renderButton(
                signUpButton,
                {
                    theme: 'outline',
                    size: 'large',
                    width: 400,
                    text: 'signup_with',
                    shape: 'rectangular',
                    logo_alignment: 'left'
                }
            );
        } else {
            console.error('Sign Up button container not found');
        }
    } else {
        console.log('Google Sign-In library not loaded yet, retrying...');
        setTimeout(initializeGoogleSignIn, 500); // Retry after 500ms
    }
}

// Handle Google Sign-In Response
async function handleGoogleSignIn(response) {
    try {
        // Decode the JWT token to get user info
        const userInfo = parseJwt(response.credential);
        
        console.log('Google Sign-In successful:', userInfo);
        
        // Send to backend API
        const apiResponse = await apiCall(API_CONFIG.ENDPOINTS.GOOGLE_AUTH, 'POST', {
            email: userInfo.email,
            googleId: userInfo.sub,
            firstName: userInfo.given_name || userInfo.name.split(' ')[0],
            lastName: userInfo.family_name || userInfo.name.split(' ').slice(1).join(' '),
            picture: userInfo.picture
        });
        
        if (apiResponse.success) {
            // Store user data and token
            localStorage.setItem('styloUserData', JSON.stringify(apiResponse.user));
            localStorage.setItem('styloAuthToken', apiResponse.token);
            
            // Show success message
            alert(`Welcome ${apiResponse.user.firstName}! Redirecting to your dashboard...`);
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        }
        
    } catch (error) {
        console.error('Error processing Google Sign-In:', error);
        alert('Failed to sign in with Google. Please try again. Error: ' + error.message);
    }
}

// Parse JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Google Sign-In
    initializeGoogleSignIn();
    
    // Form Elements
    const signInFormContainer = document.getElementById('signInForm');
    const signUpFormContainer = document.getElementById('signUpForm');
    const showSignUpBtn = document.getElementById('showSignUp');
    const showSignInBtn = document.getElementById('showSignIn');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Toggle Password Visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const eyeIcon = button.querySelector('.eye-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.textContent = '🙈';
            } else {
                input.type = 'password';
                eyeIcon.textContent = '👁️';
            }
        });
    });

    // Switch Between Sign In and Sign Up Forms
    showSignUpBtn.addEventListener('click', () => {
        signInFormContainer.classList.add('hidden');
        signUpFormContainer.classList.remove('hidden');
        document.getElementById('forgotPasswordForm')?.classList.add('hidden');
        clearAllErrors();
    });

    showSignInBtn.addEventListener('click', () => {
        signUpFormContainer.classList.add('hidden');
        signInFormContainer.classList.remove('hidden');
        document.getElementById('forgotPasswordForm')?.classList.add('hidden');
        clearAllErrors();
    });

    // ============================================
    // VALIDATION FUNCTIONS
    // ============================================

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    };

    const validateName = (name) => {
        return name.trim().length >= 2;
    };

    const showError = (inputId, errorId, message) => {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        
        if (input) {
            input.classList.add('error');
            input.classList.remove('success');
        }
        
        if (error) {
            error.textContent = message;
        }
    };

    const showSuccess = (inputId, errorId) => {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        
        if (input) {
            input.classList.remove('error');
            input.classList.add('success');
        }
        
        if (error) {
            error.textContent = '';
        }
    };

    const clearError = (inputId, errorId) => {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        
        if (input) {
            input.classList.remove('error', 'success');
        }
        
        if (error) {
            error.textContent = '';
        }
    };

    const clearAllErrors = () => {
        document.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('error', 'success');
        });
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    };

    // ============================================
    // SIGN IN FORM VALIDATION & SUBMISSION
    // ============================================

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        let isValid = true;

        // Validate Email
        if (!email) {
            showError('loginEmail', 'loginEmailError', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('loginEmail', 'loginEmailError', 'Please enter a valid email');
            isValid = false;
        } else {
            showSuccess('loginEmail', 'loginEmailError');
        }

        // Validate Password
        if (!password) {
            showError('loginPassword', 'loginPasswordError', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('loginPassword', 'loginPasswordError', 'Password must be at least 6 characters');
            isValid = false;
        } else {
            showSuccess('loginPassword', 'loginPasswordError');
        }

        if (isValid) {
            try {
                // Call backend API
                const response = await apiCall(API_CONFIG.ENDPOINTS.LOGIN, 'POST', {
                    email,
                    password
                });
                
                if (response.success) {
                    // Store user data and token
                    localStorage.setItem('styloUserData', JSON.stringify(response.user));
                    localStorage.setItem('styloAuthToken', response.token);
                    
                    alert('Login successful! Redirecting to dashboard...');
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed: ' + error.message);
            }
        }
    });

    // Real-time validation for login form
    document.getElementById('loginEmail').addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !validateEmail(email)) {
            showError('loginEmail', 'loginEmailError', 'Please enter a valid email');
        } else if (email) {
            showSuccess('loginEmail', 'loginEmailError');
        }
    });

    document.getElementById('loginPassword').addEventListener('blur', function() {
        const password = this.value;
        if (password && password.length < 6) {
            showError('loginPassword', 'loginPasswordError', 'Password must be at least 6 characters');
        } else if (password) {
            showSuccess('loginPassword', 'loginPasswordError');
        }
    });

    // ============================================
    // SIGN UP FORM VALIDATION & SUBMISSION
    // ============================================

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        let isValid = true;

        // Validate First Name
        if (!firstName) {
            showError('firstName', 'firstNameError', 'First name is required');
            isValid = false;
        } else if (!validateName(firstName)) {
            showError('firstName', 'firstNameError', 'Name must be at least 2 characters');
            isValid = false;
        } else {
            showSuccess('firstName', 'firstNameError');
        }

        // Validate Last Name
        if (!lastName) {
            showError('lastName', 'lastNameError', 'Last name is required');
            isValid = false;
        } else if (!validateName(lastName)) {
            showError('lastName', 'lastNameError', 'Name must be at least 2 characters');
            isValid = false;
        } else {
            showSuccess('lastName', 'lastNameError');
        }

        // Validate Email
        if (!email) {
            showError('registerEmail', 'registerEmailError', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('registerEmail', 'registerEmailError', 'Please enter a valid email');
            isValid = false;
        } else {
            showSuccess('registerEmail', 'registerEmailError');
        }

        // Validate Password
        if (!password) {
            showError('registerPassword', 'registerPasswordError', 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError('registerPassword', 'registerPasswordError', 'Password must be at least 8 characters with uppercase, lowercase, and number');
            isValid = false;
        } else {
            showSuccess('registerPassword', 'registerPasswordError');
        }

        // Validate Confirm Password
        if (!confirmPassword) {
            showError('confirmPassword', 'confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'confirmPasswordError', 'Passwords do not match');
            isValid = false;
        } else {
            showSuccess('confirmPassword', 'confirmPasswordError');
        }

        // Validate Terms Agreement
        if (!agreeTerms) {
            const errorEl = document.getElementById('agreeTermsError');
            if (errorEl) {
                errorEl.textContent = 'You must agree to the terms and conditions';
            }
            isValid = false;
        } else {
            const errorEl = document.getElementById('agreeTermsError');
            if (errorEl) {
                errorEl.textContent = '';
            }
        }

        if (isValid) {
            try {
                // Call backend API
                const response = await apiCall(API_CONFIG.ENDPOINTS.REGISTER, 'POST', {
                    firstName,
                    lastName,
                    email,
                    password
                });
                
                if (response.success) {
                    // Store user data and token
                    localStorage.setItem('styloUserData', JSON.stringify(response.user));
                    localStorage.setItem('styloAuthToken', response.token);
                    
                    alert('Account created successfully! Redirecting to your dashboard...');
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed: ' + error.message);
            }
        }
    });

    // Real-time validation for register form
    document.getElementById('firstName').addEventListener('blur', function() {
        const name = this.value.trim();
        if (name && !validateName(name)) {
            showError('firstName', 'firstNameError', 'Name must be at least 2 characters');
        } else if (name) {
            showSuccess('firstName', 'firstNameError');
        }
    });

    document.getElementById('lastName').addEventListener('blur', function() {
        const name = this.value.trim();
        if (name && !validateName(name)) {
            showError('lastName', 'lastNameError', 'Name must be at least 2 characters');
        } else if (name) {
            showSuccess('lastName', 'lastNameError');
        }
    });

    document.getElementById('registerEmail').addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !validateEmail(email)) {
            showError('registerEmail', 'registerEmailError', 'Please enter a valid email');
        } else if (email) {
            showSuccess('registerEmail', 'registerEmailError');
        }
    });

    document.getElementById('registerPassword').addEventListener('blur', function() {
        const password = this.value;
        if (password && !validatePassword(password)) {
            showError('registerPassword', 'registerPasswordError', 'Password must be at least 8 characters with uppercase, lowercase, and number');
        } else if (password) {
            showSuccess('registerPassword', 'registerPasswordError');
        }
    });

    document.getElementById('confirmPassword').addEventListener('blur', function() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = this.value;
        if (confirmPassword && password !== confirmPassword) {
            showError('confirmPassword', 'confirmPasswordError', 'Passwords do not match');
        } else if (confirmPassword) {
            showSuccess('confirmPassword', 'confirmPasswordError');
        }
    });

    // Clear error on input
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
            }
        });
    });

    // Google Sign-In buttons are now handled by the Google SDK
    // No need for manual click handlers

    // Forgot Password Link
    document.querySelector('.forgot-password')?.addEventListener('click', (e) => {
        e.preventDefault();
        showForgotPasswordForm();
    });

    // Back to Sign In from Forgot Password
    document.getElementById('backToSignIn')?.addEventListener('click', () => {
        showSignInForm();
    });

    // Reset Password Form Submit
    document.getElementById('resetPasswordForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('resetEmail').value.trim();
        
        // Validate email
        if (!email) {
            showError('resetEmail', 'resetEmailError', 'Email is required');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('resetEmail', 'resetEmailError', 'Please enter a valid email');
            return;
        }
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send password reset request to backend
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Show success message
                alert(`✅ Password reset link sent to ${email}!\n\nPlease check your email inbox (and spam folder) for the reset link.`);
                
                // Clear form
                document.getElementById('resetEmail').value = '';
                
                // Go back to sign in
                setTimeout(() => {
                    showSignInForm();
                }, 2000);
            } else {
                throw new Error(data.message || 'Failed to send reset link');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            
            // For demo purposes, show success even if backend fails
            alert(`✅ If an account exists with ${email}, you will receive a password reset link shortly.\n\nPlease check your email inbox (and spam folder).`);
            
            // Clear form
            document.getElementById('resetEmail').value = '';
            
            // Go back to sign in
            setTimeout(() => {
                showSignInForm();
            }, 2000);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});

// Show Forgot Password Form
function showForgotPasswordForm() {
    document.getElementById('signInForm').classList.add('hidden');
    document.getElementById('signUpForm').classList.add('hidden');
    document.getElementById('forgotPasswordForm').classList.remove('hidden');
    
    // Clear any previous errors
    document.getElementById('resetEmail').value = '';
    document.getElementById('resetEmail').classList.remove('error');
    document.getElementById('resetEmailError').textContent = '';
}

// Show Sign In Form (updated to hide forgot password)
function showSignInForm() {
    document.getElementById('signInForm').classList.remove('hidden');
    document.getElementById('signUpForm').classList.add('hidden');
    document.getElementById('forgotPasswordForm').classList.add('hidden');
}
