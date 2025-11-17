// =====================================================
// DASHBOARD PAGE - PROFESSIONAL & MOTIVATIONAL
// Sistema gamificado con gráficos y datos reales
// =====================================================

let healthChart = null;
let ordersChart = null;

export async function renderDashboardPage(root) {
  console.log('🚀 Loading Professional Dashboard...');

  // Check authentication
  let userStatus;
  try {
    userStatus = await window.getUserStatus();
  } catch (error) {
    console.error('❌ Error getting user status:', error);
    userStatus = { isGuest: true };
  }

  if (userStatus.isGuest) {
    renderGuestView(root);
    return;
  }

  // Get user data
  let user, userData;
  try {
    user = await window.getCurrentUser();
    userData = await fetchUserDashboardData(user.id);
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    user = { email: 'usuario@demo.com', user_metadata: { full_name: 'Usuario' } };
    userData = generateDemoData();
  }

  renderDashboard(root, user, userData);
}

// =====================================================
// VISTA DE INVITADO
// =====================================================
function renderGuestView(root) {
  root.innerHTML = `
    <div class="guest-dashboard">
      <div class="guest-card">
        <div class="guest-icon">
          <i class="fas fa-lock"></i>
        </div>
        <h2>Acceso Restringido</h2>
        <p>Debes iniciar sesión para acceder a tu dashboard personalizado.</p>
        <div class="guest-actions">
          <button onclick="window.location.hash='#/login'" class="btn-primary">
            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
          </button>
          <button onclick="window.location.hash='#/registro'" class="btn-secondary">
            <i class="fas fa-user-plus"></i> Crear Cuenta
          </button>
        </div>
      </div>
    </div>
  `;
}

// =====================================================
// RENDERIZAR DASHBOARD PRINCIPAL
// =====================================================
function renderDashboard(root, user, data) {
  const userName = user.user_metadata?.full_name || user.email.split('@')[0];
  const greeting = getTimeGreeting();
  
  root.innerHTML = `
    <div class="dashboard-professional">
      <!-- Header con bienvenida -->
      <div class="dash-header">
        <div class="welcome-section">
          <h1 class="welcome-title">${greeting}, <span class="highlight">${userName}</span> 👋</h1>
          <p class="welcome-subtitle">Aquí está tu progreso de hoy</p>
        </div>
        <div class="streak-badge ${data.streak >= 7 ? 'streak-fire' : ''}">
          <i class="fas fa-fire"></i>
          <div class="streak-info">
            <span class="streak-number">${data.streak}</span>
            <span class="streak-label">días seguidos</span>
          </div>
        </div>
      </div>

      <!-- Daily Challenge -->
      <div class="daily-challenge">
        <div class="challenge-header">
          <h3><i class="fas fa-trophy"></i> Desafío del Día</h3>
          <span class="challenge-reward">+${data.dailyChallenge.reward} pts</span>
        </div>
        <p class="challenge-description">${data.dailyChallenge.description}</p>
        <div class="challenge-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${data.dailyChallenge.progress}%"></div>
          </div>
          <span class="progress-text">${data.dailyChallenge.progress}% completado</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card" data-color="orange">
          <div class="stat-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">${data.totalOrders}</span>
            <span class="stat-label">Pedidos</span>
            <span class="stat-change ${data.ordersChange >= 0 ? 'positive' : 'negative'}">
              <i class="fas fa-arrow-${data.ordersChange >= 0 ? 'up' : 'down'}"></i> 
              ${Math.abs(data.ordersChange)}%
            </span>
          </div>
        </div>

        <div class="stat-card" data-color="green">
          <div class="stat-icon">
            <i class="fas fa-coins"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">${data.aiCredits}</span>
            <span class="stat-label">Créditos IA</span>
            <button class="stat-action" onclick="window.location.hash='#/nutricion'">
              <i class="fas fa-plus"></i> Comprar
            </button>
          </div>
        </div>

        <div class="stat-card" data-color="pink">
          <div class="stat-icon">
            <i class="fas fa-heartbeat"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">${data.healthScore}/100</span>
            <span class="stat-label">Score de Salud</span>
            <span class="stat-change positive">
              <i class="fas fa-arrow-up"></i> +${data.healthImprovement}
            </span>
          </div>
        </div>

        <div class="stat-card" data-color="gold">
          <div class="stat-icon">
            <i class="fas fa-medal"></i>
          </div>
          <div class="stat-content">
            <span class="stat-value">${data.achievements.unlocked}/${data.achievements.total}</span>
            <span class="stat-label">Logros</span>
            <button class="stat-action" onclick="showAchievements()">
              <i class="fas fa-eye"></i> Ver
            </button>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-container">
        <div class="chart-card">
          <div class="chart-header">
            <h3><i class="fas fa-chart-line"></i> Evolución de Salud</h3>
          </div>
          <div class="chart-wrapper">
            <canvas id="healthChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3><i class="fas fa-shopping-bag"></i> Pedidos por Categoría</h3>
          </div>
          <div class="chart-wrapper">
            <canvas id="ordersChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Progress Rings -->
      <div class="goals-section">
        <h3 class="section-title"><i class="fas fa-bullseye"></i> Objetivos Mensuales</h3>
        <div class="goals-grid">
          <div class="goal-card">
            <canvas id="goalChart1" width="120" height="120"></canvas>
            <div class="goal-info">
              <span class="goal-value">${data.goals.nutrition}%</span>
              <span class="goal-label">Nutrición</span>
            </div>
          </div>
          <div class="goal-card">
            <canvas id="goalChart2" width="120" height="120"></canvas>
            <div class="goal-info">
              <span class="goal-value">${data.goals.orders}%</span>
              <span class="goal-label">Pedidos</span>
            </div>
          </div>
          <div class="goal-card">
            <canvas id="goalChart3" width="120" height="120"></canvas>
            <div class="goal-info">
              <span class="goal-value">${data.goals.health}%</span>
              <span class="goal-label">Salud</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3 class="section-title"><i class="fas fa-bolt"></i> Acciones Rápidas</h3>
        <div class="actions-grid">
          <div class="action-card" onclick="window.location.hash='#/tienda'">
            <div class="action-icon-wrapper" style="background: linear-gradient(135deg, rgba(255, 155, 64, 0.2), rgba(255, 155, 64, 0.1));">
              <i class="fas fa-store"></i>
            </div>
            <div class="action-content">
              <h4>Explorar Tienda</h4>
              <p>Descubre productos frescos y orgánicos</p>
            </div>
            <div class="action-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>

          <div class="action-card" onclick="window.location.hash='#/cajas'">
            <div class="action-icon-wrapper" style="background: linear-gradient(135deg, rgba(139, 218, 1, 0.2), rgba(139, 218, 1, 0.1));">
              <i class="fas fa-box"></i>
            </div>
            <div class="action-content">
              <h4>Cajas Premium</h4>
              <p>Suscripciones personalizadas de frutas</p>
            </div>
            <div class="action-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>

          <div class="action-card" onclick="window.location.hash='#/nutricion'">
            <div class="action-icon-wrapper" style="background: linear-gradient(135deg, rgba(255, 139, 211, 0.2), rgba(255, 139, 211, 0.1));">
              <i class="fas fa-apple-alt"></i>
            </div>
            <div class="action-content">
              <h4>Consulta Nutricional</h4>
              <p>Análisis IA personalizado de nutrición</p>
            </div>
            <div class="action-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>

          <div class="action-card" onclick="window.location.hash='#/recetas'">
            <div class="action-icon-wrapper" style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.1));">
              <i class="fas fa-utensils"></i>
            </div>
            <div class="action-content">
              <h4>Recetas Saludables</h4>
              <p>Crea platos deliciosos con IA</p>
            </div>
            <div class="action-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>

          <div class="action-card" onclick="window.location.hash='#/asistente'">
            <div class="action-icon-wrapper" style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));">
              <i class="fas fa-robot"></i>
            </div>
            <div class="action-content">
              <h4>Asistente Virtual</h4>
              <p>Chatbot inteligente 24/7</p>
            </div>
            <div class="action-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>

          <div class="action-card" onclick="window.location.hash='#/perfil'">
            <div class="action-icon-wrapper" style="background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(138, 43, 226, 0.1));">
              <i class="fas fa-user-cog"></i>
            </div>
            <div class="action-content">
              <h4>Mi Perfil</h4>
              <p>Gestiona tu cuenta y preferencias</p>
            </div>
            <div class="action-arrow">
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <h3 class="section-title"><i class="fas fa-clock"></i> Actividad Reciente</h3>
        <div class="activity-list">
          ${renderActivityList(data.recentActivity)}
        </div>
      </div>
    </div>
  `;

  // Inicializar gráficos
  setTimeout(() => {
    initHealthChart(data.healthData);
    initOrdersChart(data.ordersData);
    initGoalRings(data.goals);
    addAnimations();
  }, 100);
}

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function renderActivityList(activities) {
  return activities.map(activity => `
    <div class="activity-item">
      <div class="activity-icon ${activity.type}">
        <i class="fas fa-${activity.icon}"></i>
      </div>
      <div class="activity-content">
        <p class="activity-text">${activity.text}</p>
        <span class="activity-time">${activity.time}</span>
      </div>
    </div>
  `).join('');
}

// =====================================================
// CHART.JS - GRÁFICOS
// =====================================================

function initHealthChart(data) {
  const ctx = document.getElementById('healthChart');
  if (!ctx) return;

  if (healthChart) healthChart.destroy();

  healthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Score de Salud',
        data: data.values,
        borderColor: '#8bda01',
        backgroundColor: 'rgba(139, 218, 1, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8bda01',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleColor: '#8bda01',
          bodyColor: '#fff',
          borderColor: '#8bda01',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: '#9aa6b2' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#9aa6b2' }
        }
      }
    }
  });
}

function initOrdersChart(data) {
  const ctx = document.getElementById('ordersChart');
  if (!ctx) return;

  if (ordersChart) ordersChart.destroy();

  ordersChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: [
          '#ff9b40',
          '#8bda01',
          '#ff8bd3',
          '#00d4ff',
          '#ffd700'
        ],
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#e9eef5',
            padding: 15,
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          borderColor: '#ff9b40',
          borderWidth: 1
        }
      }
    }
  });
}

function initGoalRings(goals) {
  drawProgressRing('goalChart1', goals.nutrition, '#8bda01');
  drawProgressRing('goalChart2', goals.orders, '#ff9b40');
  drawProgressRing('goalChart3', goals.health, '#ff8bd3');
}

function drawProgressRing(canvasId, percentage, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 50;
  const lineWidth = 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Progress arc
  const startAngle = -0.5 * Math.PI;
  const endAngle = startAngle + (2 * Math.PI * percentage / 100);

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

// =====================================================
// ANIMACIONES
// =====================================================

function addAnimations() {
  const cards = document.querySelectorAll('.stat-card, .chart-card, .goal-card');
  
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 50 * index);
  });
}

// =====================================================
// DATOS DESDE SUPABASE
// =====================================================

async function fetchUserDashboardData(userId) {
  try {
    // Aquí irán las consultas reales a Supabase
    // Por ahora retorna datos demo
    return generateDemoData();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return generateDemoData();
  }
}

// =====================================================
// DATOS DEMO
// =====================================================

function generateDemoData() {
  return {
    totalOrders: 24,
    ordersChange: 12,
    aiCredits: 150,
    healthScore: 78,
    healthImprovement: 5,
    streak: 7,
    achievements: { unlocked: 8, total: 15 },
    dailyChallenge: {
      description: 'Completa 3 consultas nutricionales',
      progress: 66,
      reward: 50
    },
    goals: {
      nutrition: 75,
      orders: 60,
      health: 78
    },
    healthData: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      values: [65, 68, 72, 70, 75, 76, 78]
    },
    ordersData: {
      labels: ['Cítricos', 'Tropicales', 'Berries', 'Exóticos', 'Orgánicos'],
      values: [8, 6, 4, 3, 3]
    },
    recentActivity: [
      { icon: 'shopping-cart', text: 'Pedido realizado - $45.00', time: 'Hace 2 horas', type: 'order' },
      { icon: 'robot', text: 'Consulta nutricional completada', time: 'Hace 5 horas', type: 'ai' },
      { icon: 'medal', text: '¡Nuevo logro desbloqueado!', time: 'Ayer', type: 'achievement' },
      { icon: 'fire', text: '¡7 días de racha! 🔥', time: 'Hace 1 día', type: 'streak' }
    ]
  };
}

// Función global para mostrar achievements
window.showAchievements = function() {
  alert('Sistema de logros en desarrollo. ¡Próximamente!');
};