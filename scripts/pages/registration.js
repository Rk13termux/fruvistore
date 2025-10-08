// Registration Page (3 steps)
import { chatCompletion } from '../services/groqService.js';

export function renderRegistrationPage(root) {
  root.innerHTML = `
  <section class="registration">
    <div class="container">
      <div class="registration__header">
        <h2>Registro de Cliente</h2>
        <p>Únete a Fruvi y recibe frutas premium en la puerta de tu casa.</p>
      </div>

      <div class="registration__form-wrapper">
        <form id="registrationForm" class="registration-form glass">
          <div class="form-step active" id="step1">
            <h3>Paso 1: Información Personal</h3>
            <div class="form-group">
              <label for="fullName">Nombre Completo *</label>
              <input type="text" id="fullName" name="fullName" required>
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="phone">Teléfono *</label>
              <input type="tel" id="phone" name="phone" required>
            </div>
            <div class="form-group">
              <label for="password">Contraseña *</label>
              <div style="position:relative;">
                <input type="password" id="password" name="password" minlength="6" placeholder="Mínimo 6 caracteres" required style="padding-right:44px;">
                <button type="button" id="togglePwd" aria-label="Mostrar/ocultar contraseña" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); background:transparent; border:none; color:var(--muted); cursor:pointer;">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
            <button type="button" class="btn-primary next-step" id="next1">Siguiente</button>
          </div>

          <div class="form-step" id="step2">
            <h3>Paso 2: Dirección de Entrega</h3>
            <div class="form-group">
              <label for="address">Dirección *</label>
              <input type="text" id="address" name="address" required>
            </div>
            <div class="form-group">
              <label for="zipCode">Código Postal *</label>
              <input type="text" id="zipCode" name="zipCode" required>
            </div>
            <div class="form-buttons">
              <button type="button" class="btn-secondary prev-step" id="prev2">Anterior</button>
              <button type="button" class="btn-primary next-step" id="next2">Siguiente</button>
            </div>
          </div>

          <div class="form-step" id="step3">
            <h3>Paso 3: Preferencias</h3>
            <div class="form-group">
              <label>Frutas Favoritas (selecciona múltiples)</label>
              <div class="checkbox-group">
                ${['Manzanas','Plátanos','Naranjas','Fresas','Mango','Piña'].map((f,i)=>
                  `<label><input type="checkbox" name="fruits" value="${f.toLowerCase()}"> ${f}</label>`
                ).join('')}
              </div>
            </div>
            <div class="form-group">
              <label for="frequency">Frecuencia de Compra</label>
              <select id="frequency" name="frequency">
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
                <option value="ocasional" selected>Ocasional</option>
              </select>
            </div>
            <div class="form-buttons">
              <button type="button" class="btn-secondary prev-step" id="prev3">Anterior</button>
              <button type="submit" class="btn-primary submit-btn">Registrarse</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
  `;

  const form = root.querySelector('#registrationForm');
  const steps = [1,2,3];
  let currentStep = 1;

  // Navigation between steps
  root.querySelector('#next1').addEventListener('click', () => moveTo(2));
  root.querySelector('#next2').addEventListener('click', () => moveTo(3));
  root.querySelector('#prev2').addEventListener('click', () => moveTo(1));
  root.querySelector('#prev3').addEventListener('click', () => moveTo(2));

  // Show/hide password toggle
  const pwd = root.querySelector('#password');
  const togglePwd = root.querySelector('#togglePwd');
  if (pwd && togglePwd) {
    togglePwd.addEventListener('click', () => {
      const show = pwd.type === 'password';
      pwd.type = show ? 'text' : 'password';
      togglePwd.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
  }

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
