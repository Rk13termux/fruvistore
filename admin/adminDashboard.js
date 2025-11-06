/**
 * Admin Dashboard Module
 * Main dashboard with overview statistics and charts
 */

import '../scripts/services/adminDatabaseService.js';

// Authentication check
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const loginTimeRaw = localStorage.getItem('adminLoginTime');
    const loginTime = loginTimeRaw ? parseInt(loginTimeRaw, 10) : 0;

    if (!isLoggedIn || !loginTime || Number.isNaN(loginTime)) {
        window.location.replace('./secure-access.html');
        return false;
    }

    // Check if session expired (1 hour)
    if (Date.now() - loginTime > 60 * 60 * 1000) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminLoginTime');
        localStorage.removeItem('adminUser');
        window.location.replace('./secure-access.html');
        return false;
    }

    return true;
}

class AdminDashboard {
    constructor() {
        this.dbService = null;
        this.charts = {};
    }

    async initialize(containerId = 'dashboard-content') {
        try {
            // Check authentication first
            if (!checkAdminAuth()) {
                return; // Will redirect if not authenticated
            }

            console.log('🚀 Initializing Admin Dashboard...');

            // Get container and render interface
            const container = document.getElementById(containerId);
            if (!container) {
                console.error('Container not found:', containerId);
                return;
            }

            // Render the complete interface
            this.renderInterface(container);

            // Initialize database service
            this.dbService = window.adminDatabaseService || await import('../scripts/services/adminDatabaseService.js').then(m => m.default);
            await this.dbService.initialize();

            // Load dashboard data
            await this.loadDashboardData();

            console.log('✅ Admin Dashboard initialized successfully');
        } catch (error) {
            console.error('❌ Admin Dashboard initialization failed:', error);
            this.showAlert('Error inicializando dashboard: ' + error.message, 'danger');
        }
    }

    renderInterface(container) {
        container.innerHTML = `
            <!-- Dashboard Header -->
            <div class="dashboard-header">
                <h1><i class="fas fa-tachometer-alt"></i> Dashboard Administrativo</h1>
                <p>Bienvenido al panel de control de FruviStore</p>
            </div>

            <!-- Alert Container -->
            <div id="dashboardAlertContainer"></div>

            <!-- Key Metrics -->
            <div class="metrics-grid" id="keyMetrics">
                <div class="metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-store"></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value" id="totalProducts">--</div>
                        <div class="metric-label">Productos</div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value" id="totalBoxes">--</div>
                        <div class="metric-label">Cajas</div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value" id="totalUsers">--</div>
                        <div class="metric-label">Usuarios</div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value" id="totalCredits">--</div>
                        <div class="metric-label">Créditos Totales</div>
                    </div>
                </div>
            </div>

            <!-- Charts Row -->
            <div class="charts-row">
                <div class="chart-container">
                    <h3><i class="fas fa-chart-pie"></i> Estado de Productos</h3>
                    <canvas id="productsStatusChart"></canvas>
                </div>
                <div class="chart-container">
                    <h3><i class="fas fa-chart-bar"></i> Créditos por Usuario</h3>
                    <canvas id="creditsDistributionChart"></canvas>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="activity-section">
                <h3><i class="fas fa-clock"></i> Actividad Reciente</h3>
                <div class="activity-list" id="recentActivity">
                    <div class="activity-item">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Cargando actividad reciente...</span>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <h3><i class="fas fa-bolt"></i> Acciones Rápidas</h3>
                <div class="actions-grid">
                    <button class="action-btn" onclick="event.preventDefault(); showSection('store', this)">
                        <i class="fas fa-store"></i>
                        <span>Gestionar Productos</span>
                    </button>
                    <button class="action-btn" onclick="event.preventDefault(); showSection('boxes', this)">
                        <i class="fas fa-box"></i>
                        <span>Gestionar Cajas</span>
                    </button>
                    <button class="action-btn" onclick="event.preventDefault(); showSection('credits', this)">
                        <i class="fas fa-coins"></i>
                        <span>Gestionar Créditos</span>
                    </button>
                    <button class="action-btn" onclick="window.open('../index.html', '_blank')">
                        <i class="fas fa-external-link-alt"></i>
                        <span>Ver Tienda</span>
                    </button>
                </div>
            </div>

            <!-- Loading Container -->
            <div id="dashboardLoadingContainer"></div>
        `;
    }

    async loadDashboardData() {
        try {
            this.showLoading('Cargando datos del dashboard...');

            // Load all data in parallel
            const [products, boxes, usersCredits] = await Promise.all([
                this.dbService.getAllProducts(),
                this.dbService.getAllBoxes(),
                this.dbService.getUsersCredits()
            ]);

            // Update metrics
            this.updateMetrics(products, boxes, usersCredits);

            // Create charts
            this.createCharts(products, boxes, usersCredits);

            // Load recent activity
            this.loadRecentActivity();

            this.hideLoading();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.hideLoading();
            this.showAlert('Error cargando datos del dashboard: ' + error.message, 'danger');
        }
    }

    updateMetrics(products, boxes, usersCredits) {
        // Update product count
        const totalProducts = products?.length || 0;
        document.getElementById('totalProducts').textContent = this.formatNumber(totalProducts);

        // Update boxes count
        const totalBoxes = boxes?.length || 0;
        document.getElementById('totalBoxes').textContent = this.formatNumber(totalBoxes);

        // Update users count
        const totalUsers = usersCredits?.length || 0;
        document.getElementById('totalUsers').textContent = this.formatNumber(totalUsers);

        // Update total credits
        const totalCredits = usersCredits?.reduce((sum, user) => sum + (user.credits || 0), 0) || 0;
        document.getElementById('totalCredits').textContent = this.formatNumber(totalCredits);
    }

    createCharts(products, boxes, usersCredits) {
        // Products status chart
        this.createProductsStatusChart(products);

        // Credits distribution chart
        this.createCreditsDistributionChart(usersCredits);
    }

    createProductsStatusChart(products) {
        const canvas = document.getElementById('productsStatusChart');
        if (!canvas) return;

        const activeProducts = products?.filter(p => p.available !== false && p.is_active !== false).length || 0;
        const inactiveProducts = (products?.length || 0) - activeProducts;

        const ctx = canvas.getContext('2d');
        this.charts.productsStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Activos', 'Inactivos'],
                datasets: [{
                    data: [activeProducts, inactiveProducts],
                    backgroundColor: ['#28a745', '#dc3545'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createCreditsDistributionChart(usersCredits) {
        const canvas = document.getElementById('creditsDistributionChart');
        if (!canvas) return;

        // Group users by credit ranges
        const ranges = {
            'Sin créditos': 0,
            '1-50': 0,
            '51-100': 0,
            '101-500': 0,
            '500+': 0
        };

        usersCredits?.forEach(user => {
            const credits = user.credits || 0;
            if (credits === 0) ranges['Sin créditos']++;
            else if (credits <= 50) ranges['1-50']++;
            else if (credits <= 100) ranges['51-100']++;
            else if (credits <= 500) ranges['101-500']++;
            else ranges['500+']++;
        });

        const ctx = canvas.getContext('2d');
        this.charts.creditsDistribution = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(ranges),
                datasets: [{
                    label: 'Usuarios',
                    data: Object.values(ranges),
                    backgroundColor: '#2a5298',
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    loadRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        if (!activityContainer) return;

        // Mock recent activity - in a real app, this would come from the database
        const activities = [
            { icon: 'fas fa-user-plus', text: 'Nuevo usuario registrado', time: 'Hace 5 min' },
            { icon: 'fas fa-shopping-cart', text: 'Pedido completado', time: 'Hace 12 min' },
            { icon: 'fas fa-tag', text: 'Precio actualizado', time: 'Hace 1 hora' },
            { icon: 'fas fa-box', text: 'Nueva caja creada', time: 'Hace 2 horas' }
        ];

        const activityHtml = activities.map(activity => `
            <div class="activity-item">
                <i class="${activity.icon}"></i>
                <span>${activity.text}</span>
                <small>${activity.time}</small>
            </div>
        `).join('');

        activityContainer.innerHTML = activityHtml;
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('dashboardAlertContainer');
        if (!alertContainer) return;

        const alertId = 'alert-' + Date.now();
        const alertHtml = `
            <div id="${alertId}" class="alert alert-${type}" style="display: block;">
                <i class="fas fa-info-circle"></i>
                ${message}
                <button onclick="this.parentElement.remove()" class="alert-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        alertContainer.insertAdjacentHTML('beforeend', alertHtml);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) alert.remove();
        }, 5000);
    }

    showLoading(message = 'Cargando...') {
        // Loading animations disabled for better UX
        return;
    }

    hideLoading() {
        // Loading animations disabled for better UX
        return;
    }

    formatNumber(value) {
        return new Intl.NumberFormat('es-CO', {
            maximumFractionDigits: 0
        }).format(Number(value) || 0);
    }
}

// Create and export singleton instance
const adminDashboard = new AdminDashboard();
window.adminDashboard = adminDashboard;

// Global initialization function called from HTML
window.initAdminDashboard = async function() {
    try {
        console.log('🎯 Initializing dashboard from HTML...');
        await adminDashboard.initialize('dashboard-content');
        console.log('✅ Dashboard initialized successfully from HTML');
    } catch (error) {
        console.error('❌ Dashboard initialization failed from HTML:', error);
    }
};

export default adminDashboard;