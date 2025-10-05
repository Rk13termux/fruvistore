// Login Page - Fruvi Dark Glass Theme
// Funciones de Supabase disponibles en window:
// window.signInWithEmail(email, password), window.ensureCustomerExists
// Estas funciones están disponibles globalmente desde supabaseService.js

export function renderLoginPage(root) {
  root.innerHTML = `
  <section class="auth auth--login">
    <div class="container">
      <div class="auth__wrap">
        <div class="auth__card glass fade-in-up">
          <div class="auth__brand">
            <i class="fas fa-apple-alt"></i>
            <span>Fruvi</span>
          </div>
          <h2>Bienvenido de nuevo</h2>
          <p class="auth__subtitle">Inicia sesión para gestionar tus pedidos y preferencias</p>
          <form id="loginForm" class="auth__form">
            <div class="form-group">
              <label for="loginEmail">Email</label>
              <input type="email" id="loginEmail" name="email" placeholder="tucorreo@ejemplo.com" required>
            </div>
            <div class="form-group">
              <label for="loginPassword">Contraseña</label>
              <input type="password" id="loginPassword" name="password" placeholder="••••••••" required>
            </div>
            <div id="loginError" class="error-message" style="display:none; margin-top:6px;">&nbsp;</div>
            <div class="auth__actions">
              <button type="submit" class="btn-primary glow-pulse">Entrar</button>
              <a href="#/registro" class="btn-link">Crear cuenta</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  `;

  const form = root.querySelector('#loginForm');
  const errorBox = root.querySelector('#loginError');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    const data = new FormData(form);
    const email = String(data.get('email')||'').trim();
    const password = String(data.get('password')||'');
    if (!email || !password) return;
    try {
      await window.signInWithEmail(email, password);
      // Ensure profile exists after login
      try { await window.ensureCustomerExists(); } catch(_) {}
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
  Object.assign(n.style, { position:'fixed', top:'90px', right:'20px', zIndex:10000 });
  document.body.appendChild(n);
  setTimeout(()=> n.remove(), 2500);
}
