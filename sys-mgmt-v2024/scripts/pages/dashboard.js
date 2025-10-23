// Dashboard Page - Simple and Clean Version

export async function renderDashboardPage(root) {
  console.log('🚀 Loading Dashboard...');
  console.log('📍 Root element:', root);

  // Check user authentication
  let userStatus;
  try {
    userStatus = await window.getUserStatus();
    console.log('👤 User status:', userStatus);
  } catch (error) {
    console.error('❌ Error getting user status:', error);
    userStatus = { isGuest: true };
  }

  if (userStatus.isGuest) {
    root.innerHTML = `
      <div style="
        min-height: 80vh;
        background: #000000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      ">
        <div style="
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
          max-width: 500px;
          backdrop-filter: blur(20px);
        ">
          <div style="color: #ff9b40; font-size: 4rem; margin-bottom: 1.5rem;">
            <i class="fas fa-lock"></i>
          </div>
          <h2 style="color: white; font-size: 2rem; margin-bottom: 1rem;">Acceso Restringido</h2>
          <p style="color: #9aa6b2; margin-bottom: 2rem;">Debes iniciar sesión para acceder al dashboard.</p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button onclick="window.location.hash='#/login'" style="
              background: linear-gradient(45deg, #ff9b40, #8bda01);
              color: black;
              border: none;
              padding: 1rem 2rem;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
            ">
              <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
            </button>
            <button onclick="window.location.hash='#/registro'" style="
              background: transparent;
              color: white;
              border: 2px solid rgba(255,255,255,0.2);
              padding: 1rem 2rem;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
            ">
              <i class="fas fa-user-plus"></i> Crear Cuenta
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Get user data - with fallbacks for demo
  console.log('📊 Getting user data...');
  let user, userStats;
  
  try {
    user = await window.getCurrentUser() || { email: 'usuario@demo.com', name: 'Usuario Demo' };
    console.log('👤 User data:', user);
    
    userStats = await window.getUserStats(user.id) || null;
    console.log('📈 User stats:', userStats);
  } catch (error) {
    console.error('❌ Error getting user data:', error);
    user = { email: 'usuario@demo.com', name: 'Usuario Demo' };
    userStats = null;
  }

  // Use demo stats if no user stats available
  if (!userStats) {
    console.log('🔧 Using demo stats...');
    userStats = generateDemoStats();
  }

  console.log('🎨 Starting dashboard render...');

  root.innerHTML = `
    <section class="dashboard" style="min-height: 100vh; background: #000000;">
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
        <div style="padding: 3rem 0; text-align: center;">
          <h1 style="color: white; font-size: 2.5rem; margin-bottom: 1rem; background: linear-gradient(45deg, #ff9b40, #8bda01); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            🎯 Dashboard de ${user.email || 'Usuario'}
          </h1>
          <p style="color: #9aa6b2; font-size: 1.2rem; margin-bottom: 2rem;">
            Panel de control personalizado
          </p>
          
          <!-- Quick Actions -->
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3rem;">
            <button onclick="window.location.hash='#/tienda'" style="
              background: linear-gradient(45deg, #ff9b40, #8bda01);
              color: black;
              border: none;
              padding: 1rem 2rem;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              transition: transform 0.2s ease;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
              <i class="fas fa-shopping-basket"></i>
              Ir a Tienda
            </button>
            <button onclick="window.location.hash='#/perfil'" style="
              background: transparent;
              color: white;
              border: 2px solid rgba(255,255,255,0.2);
              padding: 1rem 2rem;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              transition: all 0.2s ease;
            " onmouseover="this.style.borderColor='#ff9b40'; this.style.color='#ff9b40'" onmouseout="this.style.borderColor='rgba(255,255,255,0.2)'; this.style.color='white'">
              <i class="fas fa-user-cog"></i>
              Mi Perfil
            </button>
          </div>
          
          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
            <div style="
              background: rgba(255,255,255,0.06);
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 16px;
              padding: 2rem;
              text-align: center;
              backdrop-filter: blur(20px);
              transition: transform 0.2s ease;
            " onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
              <div style="color: #ff9b40; font-size: 2rem; margin-bottom: 1rem;">
                <i class="fas fa-shopping-cart"></i>
              </div>
              <h3 style="color: white; font-size: 2.2rem; margin: 0; font-weight: 700;">${userStats.totalOrders || 0}</h3>
              <p style="color: #9aa6b2; margin: 0.5rem 0 0 0;">Total de Pedidos</p>
            </div>
            
            <div style="
              background: rgba(255,255,255,0.06);
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 16px;
              padding: 2rem;
              text-align: center;
              backdrop-filter: blur(20px);
              transition: transform 0.2s ease;
            " onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
              <div style="color: #8bda01; font-size: 2rem; margin-bottom: 1rem;">
                <i class="fas fa-dollar-sign"></i>
              </div>
              <h3 style="color: white; font-size: 2.2rem; margin: 0; font-weight: 700;">$${(userStats.totalSpent || 0).toFixed(2)}</h3>
              <p style="color: #9aa6b2; margin: 0.5rem 0 0 0;">Total Gastado</p>
            </div>
            
            <div style="
              background: rgba(255,255,255,0.06);
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 16px;
              padding: 2rem;
              text-align: center;
              backdrop-filter: blur(20px);
              transition: transform 0.2s ease;
            " onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
              <div style="color: #ff8bd3; font-size: 2rem; margin-bottom: 1rem;">
                <i class="fas fa-star"></i>
              </div>
              <h3 style="color: white; font-size: 2.2rem; margin: 0; font-weight: 700;">${userStats.loyaltyPoints || 0}</h3>
              <p style="color: #9aa6b2; margin: 0.5rem 0 0 0;">Puntos de Lealtad</p>
            </div>
          </div>
          
          <!-- Welcome Message -->
          <div style="
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
            padding: 2rem;
            backdrop-filter: blur(20px);
            text-align: center;
          ">
            <h3 style="color: white; margin: 0 0 1rem 0; font-size: 1.5rem;">
              ¡Bienvenido a tu Dashboard! 🎉
            </h3>
            <p style="color: #9aa6b2; margin: 0 0 1.5rem 0; line-height: 1.6;">
              Desde aquí puedes acceder a todas las funciones premium de Fruvi. 
              Explora la tienda, revisa tus pedidos y disfruta de la experiencia completa.
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <button onclick="window.location.hash='#/tienda'" style="
                background: rgba(255,155,64,0.1);
                border: 1px solid rgba(255,155,64,0.3);
                color: #ff9b40;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
              ">
                🛒 Explorar Tienda
              </button>
              <button onclick="window.location.hash='#/cajas'" style="
                background: rgba(139,218,1,0.1);
                border: 1px solid rgba(139,218,1,0.3);
                color: #8bda01;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
              ">
                📦 Ver Cajas
              </button>
              <button onclick="window.location.hash='#/recetas'" style="
                background: rgba(255,139,211,0.1);
                border: 1px solid rgba(255,139,211,0.3);
                color: #ff8bd3;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
              ">
                🍳 Recetas
              </button>
              <button onclick="window.location.hash='#/asistente'" style="
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: white;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
              ">
                🤖 Asistente IA
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Simple verification after render
  setTimeout(() => {
    console.log('🔧 Verifying dashboard render...');
    
    const dashboardEl = document.querySelector('.dashboard');
    console.log('  - .dashboard found:', !!dashboardEl);
    
    if (dashboardEl) {
      console.log('✅ Dashboard rendered and visible');
    } else {
      console.error('❌ Dashboard element not found');
    }
  }, 100);

  console.log('✅ Dashboard HTML rendered successfully');
}

// Generate demo data for development/testing
function generateDemoStats() {
  return {
    totalOrders: 47,
    totalSpent: 1456.80,
    loyaltyPoints: 2890,
    topCategories: [
      { name: 'Cítricas', spent: 450.20 },
      { name: 'Tropicales', spent: 380.50 },
      { name: 'Bayas', spent: 290.80 }
    ]
  };
}