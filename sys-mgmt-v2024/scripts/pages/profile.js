// Mi Cuenta - Perfil del usuario (Fruvi)
// Funciones de Supabase disponibles en window:
// window.getUser, window.getMyCustomer, window.upsertCustomer, window.ensureCustomerExists, window.updateMyCustomer
// Estas funciones están disponibles globalmente desde supabaseService.js

export async function renderProfilePage(root) {
  const user = await window.getUser();
  if (!user) {
    root.innerHTML = `
      <section class="container" style="padding:20px 0;">
        <h2>Necesitas iniciar sesión</h2>
        <p>Para ver tu perfil, por favor <a href="#/login">inicia sesión</a>.</p>
      </section>
    `;
    return;
  }

  let profile = await window.getMyCustomer();
  if (!profile) {
    try { profile = await window.ensureCustomerExists(); } catch(_) {}
  }

  root.innerHTML = `
    <section class="profile container">
      <h2>Mi Cuenta</h2>
      <p class="auth__subtitle">Administra tus datos de entrega y preferencias.</p>

      <form id="profileForm" class="glass" style="padding:16px; border-radius:16px; display:grid; gap:12px; max-width:700px;">
        <!-- Avatar section commented out for now
        <div style="display:grid; grid-template-columns: 140px 1fr; gap:18px; align-items:center;">
          <div style="display:grid; gap:10px; justify-items:center;">
            <img id="avatarPreview" src="${escapeHtml(profile?.avatar_url || '')}" alt="Avatar" style="width:120px; height:120px; border-radius:50%; object-fit:cover; background:rgba(255,255,255,0.06); border:1px solid var(--border);">
            <label class="btn-primary" style="display:inline-block; padding:8px 12px; border-radius:10px; cursor:pointer;">
              Subir foto
              <input id="avatarInput" type="file" accept="image/*" style="display:none;">
            </label>
            <div id="avatarProgress" style="display:none; font-size:.9rem; color:var(--muted);">Cargando...</div>
          </div>
          <div>
            <div class="progress" style="height:10px; background:rgba(255,255,255,0.06); border:1px solid var(--border); border-radius:999px; overflow:hidden; margin-bottom:10px;">
              <div id="profileBar" style="height:100%; width:0%; background:linear-gradient(135deg, var(--brand-2), var(--brand));"></div>
            </div>
            <small id="profilePct" style="color:var(--muted)">Completo: 0%</small>
          </div>
        </div>
        -->
        <div class="form-group">
          <label>Nombre Completo</label>
          <input id="full_name" value="${escapeHtml(profile?.full_name || user.user_metadata?.full_name || '')}" required />
          <div class="field-error" id="err_full_name" style="display:none;"></div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input id="email" value="${escapeHtml(profile?.email || user.email || '')}" disabled />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input id="phone" value="${escapeHtml(profile?.phone || '')}" placeholder="+1 234 567 890" />
          <div class="field-error" id="err_phone" style="display:none;"></div>
        </div>
        <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="form-group">
            <label>Dirección</label>
            <input id="address" value="${escapeHtml(profile?.address || '')}" />
            <div class="field-error" id="err_address" style="display:none;"></div>
          </div>
          <div class="form-group">
            <label>Ciudad</label>
            <input id="city" value="${escapeHtml(profile?.city || '')}" />
            <div class="field-error" id="err_city" style="display:none;"></div>
          </div>
        </div>
        <div class="form-row" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="form-group">
            <label>Código Postal</label>
            <input id="zip_code" value="${escapeHtml(profile?.zip_code || '')}" />
            <div class="field-error" id="err_zip" style="display:none;"></div>
          </div>
          <div class="form-group">
            <label>Frecuencia</label>
            <select id="frequency">
              ${['semanal','quincenal','mensual','ocasional'].map(op => `<option value="${op}" ${ (profile?.frequency||'ocasional')===op ? 'selected':'' }>${op}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Frutas favoritas (separadas por coma)</label>
          <input id="favorite_fruits" value="${escapeHtml(Array.isArray(profile?.favorite_fruits)? profile.favorite_fruits.join(', '): '')}" />
        </div>
        <div>
          <button type="submit" class="btn-primary">Guardar cambios</button>
        </div>
        <div id="profileMsg" class="success-message" style="display:none;"></div>
      </form>
    </section>
  `;

  const form = root.querySelector('#profileForm');
  const msg = root.querySelector('#profileMsg');
  // Avatar functionality commented out for now
  // const avatarInput = root.querySelector('#avatarInput');
  // const avatarPreview = root.querySelector('#avatarPreview');
  // const progressText = root.querySelector('#avatarProgress');
  const bar = root.querySelector('#profileBar');
  const pct = root.querySelector('#profilePct');

  computeProgress();
  // Avatar upload functionality commented out for now
  // avatarInput?.addEventListener('change', async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   progressText.style.display = 'block';
  //   progressText.textContent = 'Cargando...';
  //   try {
  //     const { uploadAvatar } = await import('../services/supabaseService.js');
  //     const url = await uploadAvatar(file);
  //     if (url) avatarPreview.src = url;
  //     showToast('Avatar actualizado correctamente');
  //   } catch(err) {
  //     console.error('Avatar upload error:', err);
  //     showToast(err?.message || 'No se pudo subir la imagen. Verifica tu conexión.', false);
  //   } finally {
  //     progressText.style.display = 'none';
  //   }
  // });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    if (!validate()) return;
    const submitBtn = form.querySelector('button[type="submit"]');
    const prevHtml = submitBtn?.innerHTML;
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Guardando...'; }
    try {
      const payload = {
        full_name: getVal('#full_name'),
        phone: getVal('#phone'),
        address: getVal('#address'),
        city: getVal('#city'),
        zip_code: getVal('#zip_code'),
        frequency: getVal('#frequency'),
        favorite_fruits: getVal('#favorite_fruits').split(',').map(s=>s.trim()).filter(Boolean),
        email: getVal('#email') || user.email,
        created_at: new Date().toISOString()
      };
      await window.updateMyCustomer({ ...payload });
      showToast('Datos guardados');
      // Actualizar nombre en navbar si cambia
      const btn = document.querySelector('.account-btn');
      if (btn && payload.full_name) btn.innerHTML = `${escapeHtml(payload.full_name)} <i class="fas fa-chevron-down"></i>`;
      computeProgress();
    } catch(err) {
      showToast(err?.message ? `No pudimos guardar: ${err.message}` : 'No pudimos guardar los cambios', false);
      console.error(err);
    }
    finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = prevHtml; }
    }
  });

  function getVal(sel){ return (root.querySelector(sel)?.value || '').trim(); }
  function showToast(text, ok=true){
    const n = document.createElement('div');
    n.className = ok ? 'success-message glass' : 'error-message glass';
    n.textContent = text;
    Object.assign(n.style, { position:'fixed', top:'90px', right:'20px', zIndex:10000});
    document.body.appendChild(n);
    setTimeout(()=> n.remove(), 2200);
  }
  function clearErrors(){ root.querySelectorAll('.field-error').forEach(e=>{e.style.display='none'; e.textContent='';}); }
  function validate(){
    let ok = true;
    const name = getVal('#full_name');
    if (!name) { err('#err_full_name','Ingresa tu nombre completo'); ok=false; }
    const phone = getVal('#phone');
    if (phone && !/^[+]?[\d\s\-()]{8,}$/.test(phone)) { err('#err_phone','Teléfono inválido'); ok=false; }
    const zip = getVal('#zip_code');
    if (zip && zip.length < 3) { err('#err_zip','Código postal inválido'); ok=false; }
    return ok;
  }
  function err(sel, msg){ const el = root.querySelector(sel); if (el){ el.textContent = msg; el.style.display='block'; }}
  function escapeHtml(s){ return (s||'').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }
  function computeProgress(){
    const fields = ['#full_name','#phone','#address','#city','#zip_code','#favorite_fruits'];
    const filled = fields.reduce((a,sel)=> a + (getVal(sel)?1:0), 0);
    const total = fields.length;
    const perc = Math.round((filled/total)*100);
    if (bar) bar.style.width = `${perc}%`;
    if (pct) pct.textContent = `Completo: ${perc}%`;
  }
}
