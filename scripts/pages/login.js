// Login Page - Fruvi Premium Experience
// Funciones de Supabase disponibles en window:
// window.signInWithEmail(email, password), window.ensureCustomerExists
// Estas funciones están disponibles globalmente desde supabaseService.js

export function renderLoginPage(root) {
  root.innerHTML = `
  <section class="auth auth--login">
    <div class="container">
      <div class="auth__wrap">
        <div class="auth__promo glass fade-in-up">
          <div class="auth__eyebrow">Ecosistema AgroTech</div>
          <h2>Administra tu cuenta premium</h2>
          <p>Accede a reportes nutricionales, logística inteligente y experiencias personalizadas para tu equipo.</p>
          <ul class="auth__highlights">
            <li><i class="fas fa-chart-line"></i> Dashboard con métricas en tiempo real.</li>
            <li><i class="fas fa-robot"></i> Recomendaciones de IA según objetivos diarios.</li>
            <li><i class="fas fa-truck-fast"></i> Seguimiento de entregas con trazabilidad total.</li>
          </ul>
          <div class="auth__badge-row">
            <span><i class="fas fa-lock"></i> Cifrado end-to-end</span>
            <span><i class="fas fa-leaf"></i> Cultivos certificados</span>
          </div>
        </div>

        <div class="auth__card glass fade-in-up auth__card--login">
          <div class="auth__brand">
            <img src="images/logo.png" alt="Fruvi" class="auth__logo-mark">
            <span>Fruvi</span>
          </div>
          <h3>Bienvenido de nuevo</h3>
          <p class="auth__subtitle">Inicia sesión para gestionar tus pedidos y experiencias personalizadas.</p>
          <form id="loginForm" class="auth__form">
            <div class="form-group">
              <label for="loginEmail">Email</label>
              <input type="email" id="loginEmail" name="email" placeholder="tucorreo@fruvi.com" required>
            </div>
            <div class="form-group password-field">
              <label for="loginPassword">Contraseña</label>
              <div class="password-wrapper">
                <input type="password" id="loginPassword" name="password" placeholder="••••••••" required>
                <button type="button" id="toggleLoginPwd" aria-label="Mostrar u ocultar contraseña">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
            <div id="loginError" class="error-message" style="display:none; margin-top:6px;">&nbsp;</div>
            <div class="auth__meta">
              <a href="#/registro" class="auth__link">¿Sin cuenta? Crea una ahora</a>
              <a href="mailto:soporte@fruvi.com" class="auth__link">Soporte 24/7</a>
            </div>
            <div class="auth__actions">
              <button type="submit" class="btn-primary glow-pulse">Ingresar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  `;

  const form = root.querySelector('#loginForm');
  const errorBox = root.querySelector('#loginError');
  const loginPwd = root.querySelector('#loginPassword');
  const toggleLoginPwd = root.querySelector('#toggleLoginPwd');

  if (loginPwd && toggleLoginPwd) {
    toggleLoginPwd.addEventListener('click', () => {
      const show = loginPwd.type === 'password';
      loginPwd.type = show ? 'text' : 'password';
      toggleLoginPwd.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    const password = String(data.get('password') || '');
    if (!email || !password) return;
    try {
      await window.signInWithEmail(email, password);
      try { await window.ensureCustomerExists(); } catch (_) {}
      showAuthToast(`Bienvenido, ${email}`);
      setTimeout(() => { location.hash = '#/'; }, 800);
    } catch (err) {
      console.error(err);
      errorBox.textContent = err?.message || 'No pudimos iniciar sesión. Verifica tus datos.';
      errorBox.style.display = 'block';
    }
  });
}

function showAuthToast(msg) {
  const n = document.createElement('div');
  n.className = 'toast glass';
  n.textContent = msg;
  Object.assign(n.style, { position: 'fixed', top: '90px', right: '20px', zIndex: 10000 });
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2500);
}
