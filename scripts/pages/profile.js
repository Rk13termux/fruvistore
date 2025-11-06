// Mi Cuenta - Perfil del usuario (Fruvi)
// Funciones de Supabase disponibles en window:
// window.getUser, window.getMyCustomer, window.upsertCustomer, window.ensureCustomerExists, window.updateMyCustomer
// Estas funciones están disponibles globalmente desde supabaseService.js

// Helper function
function escapeHtml(s) { 
  return (s||'').replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); 
}

export async function renderProfilePage(root) {
  console.log('🎨 Rendering profile page...', root);
  
  const user = await window.getUser();
  console.log('👤 User data:', user);
  
  if (!user) {
    root.innerHTML = `
      <section class="container" style="padding:20px 0;">
        <h2>Necesitas iniciar sesión</h2>
        <p>Para ver tu perfil, por favor <a href="#/login">inicia sesión</a>.</p>
      </section>
    `;
    return;
  }

  // Get profile data directly from Supabase
  let profile = null;
  try {
    const { data, error } = await window.supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data && !error) {
      profile = data;
      console.log('📋 Profile data loaded:', profile);
    } else if (error && error.code === 'PGRST116') {
      // No profile exists, create one
      console.log('📋 Creating new customer profile...');
      const newProfile = {
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        created_at: new Date().toISOString()
      };
      
      const { data: created, error: createError } = await window.supabase
        .from('customers')
        .insert([newProfile])
        .select()
        .single();
      
      if (created && !createError) {
        profile = created;
        console.log('✅ Profile created:', profile);
      }
    }
  } catch (e) {
    console.error('❌ Error loading/creating profile:', e);
  }

  root.innerHTML = `
    <section class="profile-page">
      <!-- Header Section -->
      <div class="profile-header">
        <div class="profile-header-content">
          <div class="profile-avatar">
            <div class="avatar-circle">
              <i class="fas fa-user"></i>
            </div>
            <div class="avatar-badge">
              <i class="fas fa-check"></i>
            </div>
          </div>
          <div class="profile-header-info">
            <h1>${escapeHtml(profile?.full_name || user.user_metadata?.full_name || 'Mi Perfil')}</h1>
            <p>${escapeHtml(user.email)}</p>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="profile-container">
        <!-- User ID Card -->
        <div class="profile-card user-id-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-id-card"></i>
            </div>
            <div class="card-header-text">
              <h3>Tu User ID</h3>
              <p>Necesitarás este ID para comprar créditos adicionales</p>
            </div>
          </div>
          <div class="card-body">
            <div class="user-id-container">
              <code id="userIdDisplay" class="user-id-code">${user.id}</code>
              <button id="copyUserIdBtn" class="btn-copy">
                <i class="fas fa-copy"></i>
                <span>Copiar</span>
              </button>
            </div>
            <div class="info-banner">
              <i class="fas fa-info-circle"></i>
              <span>Comparte este ID cuando compres créditos por WhatsApp</span>
            </div>
          </div>
        </div>

        <!-- Profile Form Card -->
        <div class="profile-card">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-user-edit"></i>
            </div>
            <div class="card-header-text">
              <h3>Información Personal</h3>
              <p>Administra tus datos de entrega y preferencias</p>
            </div>
          </div>
          <div class="card-body">
            <form id="profileForm" class="profile-form">
              <!-- Full Name -->
              <div class="form-group">
                <label for="full_name">
                  <i class="fas fa-user"></i>
                  Nombre Completo
                </label>
                <input 
                  type="text"
                  id="full_name" 
                  value="${escapeHtml(profile?.full_name || user.user_metadata?.full_name || '')}" 
                  placeholder="Ingresa tu nombre completo"
                  required 
                />
                <div class="field-error" id="err_full_name"></div>
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="email">
                  <i class="fas fa-envelope"></i>
                  Email
                </label>
                <input 
                  type="email"
                  id="email" 
                  value="${escapeHtml(profile?.email || user.email || '')}" 
                  disabled 
                />
                <small class="field-hint">El email no se puede modificar</small>
              </div>

              <!-- Phone -->
              <div class="form-group">
                <label for="phone">
                  <i class="fas fa-phone"></i>
                  Teléfono
                </label>
                <input 
                  type="tel"
                  id="phone" 
                  value="${escapeHtml(profile?.phone || '')}" 
                  placeholder="+57 300 123 4567" 
                />
                <div class="field-error" id="err_phone"></div>
              </div>

              <!-- Address Row -->
              <div class="form-row">
                <div class="form-group">
                  <label for="address">
                    <i class="fas fa-map-marker-alt"></i>
                    Dirección
                  </label>
                  <input 
                    type="text"
                    id="address" 
                    value="${escapeHtml(profile?.address || '')}" 
                    placeholder="Calle, carrera, número"
                  />
                  <div class="field-error" id="err_address"></div>
                </div>
                <div class="form-group">
                  <label for="city">
                    <i class="fas fa-city"></i>
                    Ciudad
                  </label>
                  <input 
                    type="text"
                    id="city" 
                    value="${escapeHtml(profile?.city || '')}" 
                    placeholder="Tu ciudad"
                  />
                  <div class="field-error" id="err_city"></div>
                </div>
              </div>

              <!-- Zip & Frequency Row -->
              <div class="form-row">
                <div class="form-group">
                  <label for="zip_code">
                    <i class="fas fa-mail-bulk"></i>
                    Código Postal
                  </label>
                  <input 
                    type="text"
                    id="zip_code" 
                    value="${escapeHtml(profile?.zip_code || '')}" 
                    placeholder="110111"
                  />
                  <div class="field-error" id="err_zip"></div>
                </div>
                <div class="form-group">
                  <label for="frequency">
                    <i class="fas fa-calendar-alt"></i>
                    Frecuencia de Compra
                  </label>
                  <select id="frequency">
                    ${['semanal','quincenal','mensual','ocasional'].map(op => `
                      <option value="${op}" ${(profile?.frequency||'ocasional')===op ? 'selected' : ''}>
                        ${op.charAt(0).toUpperCase() + op.slice(1)}
                      </option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <!-- Favorite Fruits -->
              <div class="form-group">
                <label for="favorite_fruits">
                  <i class="fas fa-apple-alt"></i>
                  Frutas Favoritas
                </label>
                <input 
                  type="text"
                  id="favorite_fruits" 
                  value="${escapeHtml(Array.isArray(profile?.favorite_fruits) ? profile.favorite_fruits.join(', ') : '')}" 
                  placeholder="Mango, Fresa, Banano..."
                />
                <small class="field-hint">Separadas por coma</small>
              </div>

              <!-- Progress Bar -->
              <div class="profile-progress">
                <div class="progress-header">
                  <span class="progress-label">Completitud del perfil</span>
                  <span id="profilePct" class="progress-percentage">0%</span>
                </div>
                <div class="progress-bar-container">
                  <div id="profileBar" class="progress-bar-fill"></div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="form-actions">
                <button type="submit" class="btn-save">
                  <i class="fas fa-save"></i>
                  Guardar Cambios
                </button>
              </div>

              <!-- Success Message -->
              <div id="profileMsg" class="success-message"></div>
            </form>
          </div>
        </div>

        <!-- Quick Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-coins"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value" id="userCredits">--</div>
              <div class="stat-label">Créditos</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">0</div>
              <div class="stat-label">Compras</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-heart"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">${Array.isArray(profile?.favorite_fruits) ? profile.favorite_fruits.length : 0}</div>
              <div class="stat-label">Favoritos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Copy User ID functionality
  const copyBtn = root.querySelector('#copyUserIdBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const userIdDisplay = root.querySelector('#userIdDisplay');
      const userId = userIdDisplay?.textContent;
      
      try {
        await navigator.clipboard.writeText(userId);
        copyBtn.innerHTML = '<i class="fas fa-check"></i><span>¡Copiado!</span>';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fas fa-copy"></i><span>Copiar</span>';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (error) {
        console.error('Error copying:', error);
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = userId;
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        copyBtn.innerHTML = '<i class="fas fa-check"></i><span>¡Copiado!</span>';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fas fa-copy"></i><span>Copiar</span>';
          copyBtn.classList.remove('copied');
        }, 2000);
      }
    });
  }

  // Load user credits
  async function loadUserCredits() {
    try {
      console.log('💰 Loading user credits for:', user.id);
      const { data, error } = await window.supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .single();
      
      console.log('💰 Credits data:', data, 'Error:', error);
      
      if (data && !error) {
        const creditsEl = root.querySelector('#userCredits');
        if (creditsEl) {
          creditsEl.textContent = data.credits || 0;
          console.log('✅ Credits displayed:', data.credits);
        }
      } else if (error && error.code === 'PGRST116') {
        // No credits record exists, create one
        console.log('💰 Creating initial credits record...');
        const { data: created, error: createError } = await window.supabase
          .from('user_credits')
          .insert([{ 
            user_id: user.id, 
            credits: 25,
            created_at: new Date().toISOString() 
          }])
          .select()
          .single();
        
        if (created && !createError) {
          const creditsEl = root.querySelector('#userCredits');
          if (creditsEl) {
            creditsEl.textContent = created.credits || 25;
            console.log('✅ Initial credits created and displayed:', created.credits);
          }
        }
      }
    } catch (err) {
      console.error('❌ Error loading credits:', err);
      const creditsEl = root.querySelector('#userCredits');
      if (creditsEl) {
        creditsEl.textContent = '0';
      }
    }
  }

  loadUserCredits();

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
        updated_at: new Date().toISOString()
      };
      
      // Update profile in Supabase
      const { error } = await window.supabase
        .from('customers')
        .update(payload)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      showToast('Datos guardados correctamente');
      
      // Actualizar nombre en navbar si cambia
      const btn = document.querySelector('.account-btn');
      if (btn && payload.full_name) {
        btn.innerHTML = `👤 ${escapeHtml(payload.full_name)} <i class="fas fa-chevron-down"></i>`;
      }
      computeProgress();
    } catch(err) {
      showToast(err?.message ? `No pudimos guardar: ${err.message}` : 'No pudimos guardar los cambios', false);
      console.error('Error saving profile:', err);
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
  function computeProgress(){
    const fields = ['#full_name','#phone','#address','#city','#zip_code','#favorite_fruits'];
    const filled = fields.reduce((a,sel)=> a + (getVal(sel)?1:0), 0);
    const total = fields.length;
    const perc = Math.round((filled/total)*100);
    if (bar) bar.style.width = `${perc}%`;
    if (pct) pct.textContent = `${perc}%`;
  }
  
  console.log('✅ Profile page rendered successfully');
  console.log('🔍 Root innerHTML length:', root.innerHTML.length);
}
