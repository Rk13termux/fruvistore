/**
 * Admin Login Page
 * Sistema de autenticación para panel administrativo
 */

// Admin credentials (en producción usar Supabase auth)
const ADMIN_USERS = {
  'admin': 'fruvi2024',
  'sebas': 'admin123'
};

const SESSION_DURATION = 3600000; // 1 hora

class AdminLogin {
  constructor() {
    this.isProcessing = false;
  }

  render(container) {
    // Check if already logged in
    if (this.checkExistingSession()) {
      window.location.hash = '#/admin-panel';
      return;
    }

    container.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 20px;">
        <div class="admin-login-container" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border-radius: 24px; padding: 50px 40px; width: 100%; max-width: 420px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); animation: fadeInLogin 0.5s ease-out;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ff9b40 0%, #ff8b20 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 10px 30px rgba(255, 155, 64, 0.3);">
              <i class="fas fa-leaf" style="font-size: 36px; color: #000;"></i>
            </div>
            <h1 style="color: #fff; font-size: 28px; font-weight: 600; margin-bottom: 8px; font-family: 'Poppins', sans-serif;">Admin Access</h1>
            <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; font-family: 'Poppins', sans-serif;">Panel de Administración Fruvi</p>
          </div>

          <!-- Alert -->
          <div id="adminLoginAlert" style="display: none; padding: 14px 16px; border-radius: 10px; margin-bottom: 24px; font-size: 14px; background: rgba(255, 59, 48, 0.1); border: 1px solid rgba(255, 59, 48, 0.3); color: #ff3b30;">
            <i class="fas fa-exclamation-circle"></i>
            <span id="adminLoginAlertMessage"></span>
          </div>

          <!-- Form -->
          <form id="adminLoginForm" style="display: flex; flex-direction: column; gap: 24px;">
            
            <!-- Username -->
            <div>
              <label style="display: block; color: rgba(255, 255, 255, 0.8); font-size: 14px; font-weight: 500; margin-bottom: 10px; font-family: 'Poppins', sans-serif;">Usuario</label>
              <div style="position: relative;">
                <i class="fas fa-user" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: rgba(255, 255, 255, 0.4); font-size: 16px;"></i>
                <input 
                  type="text" 
                  id="adminUsername" 
                  required 
                  autocomplete="username"
                  style="width: 100%; padding: 14px 16px 14px 48px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; background: rgba(255, 255, 255, 0.05); color: #fff; font-size: 15px; box-sizing: border-box; transition: all 0.3s; font-family: 'Poppins', sans-serif;" 
                  placeholder="Ingresa tu usuario"
                >
              </div>
            </div>

            <!-- Password -->
            <div>
              <label style="display: block; color: rgba(255, 255, 255, 0.8); font-size: 14px; font-weight: 500; margin-bottom: 10px; font-family: 'Poppins', sans-serif;">Contraseña</label>
              <div style="position: relative;">
                <i class="fas fa-lock" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: rgba(255, 255, 255, 0.4); font-size: 16px;"></i>
                <input 
                  type="password" 
                  id="adminPassword" 
                  required 
                  autocomplete="current-password"
                  style="width: 100%; padding: 14px 16px 14px 48px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; background: rgba(255, 255, 255, 0.05); color: #fff; font-size: 15px; box-sizing: border-box; transition: all 0.3s; font-family: 'Poppins', sans-serif;" 
                  placeholder="Ingresa tu contraseña"
                >
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              id="adminLoginBtn"
              style="width: 100%; padding: 16px; background: linear-gradient(135deg, #ff9b40 0%, #ff8b20 100%); color: #000; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 20px rgba(255, 155, 64, 0.3); font-family: 'Poppins', sans-serif;"
            >
              <i class="fas fa-sign-in-alt"></i> Ingresar
            </button>
          </form>

          <!-- Back Link -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="#/" style="color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 14px; transition: color 0.3s; font-family: 'Poppins', sans-serif;">
              <i class="fas fa-arrow-left"></i> Volver a la tienda
            </a>
          </div>

        </div>
      </div>

      <style>
        @keyframes fadeInLogin {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shakeLogin {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        #adminUsername:focus,
        #adminPassword:focus {
          outline: none;
          border-color: #ff9b40 !important;
          background: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 0 0 3px rgba(255, 155, 64, 0.1) !important;
        }

        #adminLoginBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(255, 155, 64, 0.4) !important;
        }

        #adminLoginBtn:active {
          transform: translateY(0);
        }

        #adminLoginBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        @media (max-width: 480px) {
          .admin-login-container {
            padding: 40px 24px !important;
            max-width: 100% !important;
          }
        }
      </style>
    `;

    this.bindEvents();
    this.focusUsername();
  }

  bindEvents() {
    const form = document.getElementById('adminLoginForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Add input listeners for better UX
    const inputs = document.querySelectorAll('#adminUsername, #adminPassword');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.hideError());
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (this.isProcessing) return;

    const username = document.getElementById('adminUsername')?.value.trim();
    const password = document.getElementById('adminPassword')?.value;

    // Validate inputs
    if (!username || !password) {
      this.showError('Por favor, completa todos los campos');
      return;
    }

    this.setLoading(true);
    this.isProcessing = true;

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validate credentials
    if (ADMIN_USERS[username] && ADMIN_USERS[username] === password) {
      // Success - save session
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      localStorage.setItem('adminUser', username);

      // Redirect to admin dashboard
      window.location.hash = '#/admin-panel';
    } else {
      // Failed login
      this.setLoading(false);
      this.isProcessing = false;
      this.showError('Usuario o contraseña incorrectos');
      this.shakeForm();
    }
  }

  showError(message) {
    const alert = document.getElementById('adminLoginAlert');
    const alertMessage = document.getElementById('adminLoginAlertMessage');
    
    if (alert && alertMessage) {
      alertMessage.textContent = message;
      alert.style.display = 'block';
      alert.style.animation = 'fadeInLogin 0.3s ease-out';
    }
  }

  hideError() {
    const alert = document.getElementById('adminLoginAlert');
    if (alert) {
      alert.style.display = 'none';
    }
  }

  setLoading(loading) {
    const btn = document.getElementById('adminLoginBtn');
    if (btn) {
      btn.disabled = loading;
      btn.innerHTML = loading 
        ? '<i class="fas fa-spinner fa-spin"></i> Ingresando...'
        : '<i class="fas fa-sign-in-alt"></i> Ingresar';
    }
  }

  shakeForm() {
    const form = document.getElementById('adminLoginForm');
    if (form) {
      form.style.animation = 'none';
      setTimeout(() => {
        form.style.animation = 'shakeLogin 0.5s';
      }, 10);
    }
  }

  focusUsername() {
    setTimeout(() => {
      const usernameInput = document.getElementById('adminUsername');
      if (usernameInput) {
        usernameInput.focus();
      }
    }, 100);
  }

  checkExistingSession() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const loginTime = parseInt(localStorage.getItem('adminLoginTime') || '0', 10);
    
    if (isLoggedIn && loginTime && (Date.now() - loginTime < SESSION_DURATION)) {
      return true; // Session is valid
    }
    
    // Clear invalid session
    if (isLoggedIn) {
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminLoginTime');
      localStorage.removeItem('adminUser');
    }
    
    return false;
  }
}

// Export default
export default {
  render: (container) => {
    const loginPage = new AdminLogin();
    loginPage.render(container);
  }
};
