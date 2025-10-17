export function renderRegistrationPage(root) {
  root.innerHTML = `
  <section class="registration registration--premium">
    <div class="container">
      <div class="registration__layout">
        <aside class="registration__intro glass fade-in-up">
          <div class="registration__brand">
            <img src="/images/logo.png" alt="Fruvi Logo" class="registration__logo">
            <span>Fruvi Prime</span>
          </div>
          <h2>Activa tu perfil AgroTech</h2>
          <p>Controla la trazabilidad, personaliza entregas y recibe recomendaciones con datos nutricionales inteligentes.</p>
          <ul class="registration__benefits">
            <li><i class="fas fa-seedling"></i> Lotes premium auditados con sensores de campo.</li>
            <li><i class="fas fa-microchip"></i> IA que calibra macros y micronutrientes para ti.</li>
            <li><i class="fas fa-shield-alt"></i> Logística con trazabilidad blockchain 24/7.</li>
          </ul>
          <div class="registration__badges">
            <span><i class="fas fa-tachometer-alt"></i> Entregas 24-48h</span>
            <span><i class="fas fa-star"></i> Curaduría premium</span>
            <span><i class="fas fa-leaf"></i> Cultivos regenerativos</span>
          </div>
        </aside>

        <div class="registration__form-shell glass fade-in-up">
          <header class="registration__header">
            <div class="registration__eyebrow">Onboarding exclusivo</div>
            <h3>Completa tu registro en 3 pasos</h3>
            <p>Tu cuenta sincroniza recomendaciones, historial nutricional y logística avanzada.</p>
            <span class="registration__step-count">Paso <strong id="stepIndex">1</strong> de 3</span>
          </header>

          <div class="registration__progress">
            <div class="progress-step is-active" data-step="1">
              <span class="progress-badge">1</span>
              <span class="progress-label">Identidad</span>
            </div>
            <div class="progress-step" data-step="2">
              <span class="progress-badge">2</span>
              <span class="progress-label">Entrega</span>
            </div>
            <div class="progress-step" data-step="3">
              <span class="progress-badge">3</span>
              <span class="progress-label">Preferencias</span>
            </div>
          </div>

          <form id="registrationForm" class="registration-form">
            <div class="form-step active" id="step1">
              <div class="form-section-title">
                <h4>Información personal</h4>
                <p>Conectamos tus datos con nuestro ecosistema para entregas personalizadas.</p>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label for="fullName">Nombre completo *</label>
                  <input type="text" id="fullName" name="fullName" placeholder="Carla Mendoza" required>
                </div>
                <div class="form-group">
                  <label for="email">Email *</label>
                  <input type="email" id="email" name="email" placeholder="tucorreo@fruvi.com" required>
                </div>
                <div class="form-group">
                  <label for="phone">Teléfono *</label>
                  <input type="tel" id="phone" name="phone" placeholder="(+57) 300 000 0000" required>
                </div>
                <div class="form-group password-field">
                  <label for="password">Contraseña *</label>
                  <div class="password-wrapper">
                    <input type="password" id="password" name="password" minlength="6" placeholder="Mínimo 6 caracteres" required>
                    <button type="button" id="togglePwd" aria-label="Mostrar u ocultar contraseña">
                      <i class="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="form-buttons form-buttons--end">
                <button type="button" class="next-step" id="next1">Continuar</button>
              </div>
            </div>

            <div class="form-step" id="step2">
              <div class="form-section-title">
                <h4>Dirección de entrega</h4>
                <p>Optimiza rutas y ventanas de entrega precisas.</p>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label for="address">Dirección *</label>
                  <input type="text" id="address" name="address" placeholder="Calle 123 #45-67" required>
                </div>
                <div class="form-group">
                  <label for="city">Ciudad *</label>
                  <input type="text" id="city" name="city" placeholder="Bogotá" required>
                </div>
                <div class="form-group">
                  <label for="zipCode">Código postal *</label>
                  <input type="text" id="zipCode" name="zipCode" placeholder="110111" required>
                </div>
                <div class="form-group">
                  <label for="frequency">Frecuencia de compra</label>
                  <select id="frequency" name="frequency">
                    <option value="semanal">Semanal</option>
                    <option value="quincenal">Quincenal</option>
                    <option value="mensual">Mensual</option>
                    <option value="ocasional" selected>Ocasional</option>
                  </select>
                </div>
              </div>
              <div class="form-buttons">
                <button type="button" class="prev-step" id="prev2">Volver</button>
                <button type="button" class="next-step" id="next2">Continuar</button>
              </div>
            </div>

            <div class="form-step" id="step3">
              <div class="form-section-title">
                <h4>Preferencias nutricionales</h4>
                <p>Personalizamos tus cajas según objetivos y sabores favoritos.</p>
              </div>
              <div class="form-grid form-grid--two">
                <div class="form-group">
                  <label>Frutas favoritas</label>
                  <div class="checkbox-group">
                    ${['Manzanas','Plátanos','Naranjas','Fresas','Mango','Piña','Kiwi','Uvas'].map(f =>
                      `<label><input type="checkbox" name="fruits" value="${f.toLowerCase()}"> ${f}</label>`
                    ).join('')}
                  </div>
                </div>
                <div class="form-group">
                  <label for="notes">Objetivo principal</label>
                  <textarea id="notes" name="notes" rows="4" placeholder="Ej: Refuerzo inmunológico para mi equipo de ventas"></textarea>
                </div>
              </div>
              <div class="form-buttons">
                <button type="button" class="prev-step" id="prev3">Volver</button>
                <button type="submit" class="submit-btn">Finalizar registro</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  `;

  const form = root.querySelector('#registrationForm');
  let currentStep = 1;
  const progressSteps = Array.from(root.querySelectorAll('.progress-step'));
  const stepIndexEl = root.querySelector('#stepIndex');

  root.querySelector('#next1').addEventListener('click', () => moveTo(2));
  root.querySelector('#next2').addEventListener('click', () => moveTo(3));
  root.querySelector('#prev2').addEventListener('click', () => moveTo(1));
  root.querySelector('#prev3').addEventListener('click', () => moveTo(2));

  const pwd = root.querySelector('#password');
  const togglePwd = root.querySelector('#togglePwd');
  if (pwd && togglePwd) {
    togglePwd.addEventListener('click', () => {
      const show = pwd.type === 'password';
      pwd.type = show ? 'text' : 'password';
      togglePwd.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
  }

  updateProgress(currentStep);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const data = new FormData(form);
    const payload = {
      full_name: data.get('fullName'),
      email: data.get('email'),
      phone: data.get('phone'),
      address: data.get('address'),
      city: data.get('city'),
      zip_code: data.get('zipCode'),
      frequency: data.get('frequency') || 'ocasional',
      favorite_fruits: data.getAll('fruits'),
      notes: data.get('notes') || '',
      created_at: new Date().toISOString()
    };

    // Validate auth fields explicitly (password length >= 6)
    const password = String(data.get('password') || '');
    const emailVal = String(payload.email || '').trim();
    if (!emailVal) {
      showBanner('Ingresa un email válido', false);
      moveTo(1);
      root.querySelector('#email')?.focus();
      return;
    }
    if (!password || password.length < 6) {
      showBanner('La contraseña debe tener al menos 6 caracteres', false);
      moveTo(1);
      root.querySelector('#password')?.focus();
      return;
    }

    try {
      // 1) Crear cuenta en Supabase Auth
      const signRes = await window.signUpWithEmail(emailVal, password, { full_name: payload.full_name, phone: payload.phone });

      const userId = signRes?.user?.id;
      const hasSession = !!signRes?.session;

      if (hasSession && userId) {
        // 2) Guardar perfil en customers (usuario ya autenticado)
        const profile = { ...payload, user_id: userId };
        await window.upsertCustomer({ user_id: userId }, profile);
      }

      // Mensaje según modo de confirmación
      const msg = hasSession
        ? '¡Registro exitoso! Tu cuenta está lista.'
        : '¡Registro exitoso! Revisa tu correo para confirmar la cuenta.';
      showBanner(msg, true);
      form.reset();
      moveTo(1, true);
    } catch (err) {
      console.error(err);
      const msg = err?.message || 'Error en el registro. Por favor, intenta nuevamente.';
      showBanner(msg, false);
    }
  });

  function moveTo(step, force = false) {
    if (!force && step > currentStep && !validateStep(currentStep)) return;
    const from = root.querySelector(`#step${currentStep}`);
    const to = root.querySelector(`#step${step}`);
    if (from && to) {
      from.classList.remove('active');
      to.classList.add('active');
      currentStep = step;
      updateProgress(currentStep);
    }
  }

  function validateStep(step) {
    const el = root.querySelector(`#step${step}`);
    const required = el.querySelectorAll('[required]');
    for (const field of required) {
      if (!field.value.trim()) {
        alert(`Por favor, completa el campo: ${field.previousElementSibling?.textContent || field.name}`);
        field.focus();
        return false;
      }
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        alert('Por favor, ingresa un email válido');
        field.focus();
        return false;
      }
      if (field.type === 'tel' && !/^[+]?[\d\s\-\(\)]{10,}$/.test(field.value)) {
        alert('Por favor, ingresa un teléfono válido');
        field.focus();
        return false;
      }
    }
    return true;
  }

  function updateProgress(step) {
    progressSteps.forEach((item) => {
      const value = Number(item.dataset.step);
      item.classList.toggle('is-active', value === step);
      item.classList.toggle('is-complete', value < step);
    });
    if (stepIndexEl) stepIndexEl.textContent = step;
  }

  function showBanner(text, ok=true) {
    const n = document.createElement('div');
    n.className = ok ? 'success-message' : 'error-message';
    n.textContent = text;
    n.style.position = 'fixed';
    n.style.top = '90px';
    n.style.left = '50%';
    n.style.transform = 'translateX(-50%)';
    n.style.zIndex = '10000';
    document.body.appendChild(n);
    setTimeout(()=> n.remove(), 4000);
  }
}
