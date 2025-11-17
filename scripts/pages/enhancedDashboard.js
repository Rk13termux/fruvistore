/**
 * Enhanced Admin Dashboard
 * Sistema completo de análisis empresarial y reportes contables
 */

import '../services/adminDatabaseService.js';

class EnhancedDashboard {
    constructor() {
        this.dbService = null;
        this.currentPeriod = 'month'; // day, week, month, year, custom
        this.customDateRange = { start: null, end: null };
        this.charts = {};
    }

    async initialize(containerId = 'dashboard-content') {
        try {
            console.log('🚀 Initializing Enhanced Dashboard...');

            const container = document.getElementById(containerId);
            if (!container) {
                console.error('Container not found:', containerId);
                return;
            }

            // Render interface
            this.renderInterface(container);

            // Initialize database service
            this.dbService = window.adminDatabaseService || await import('../services/adminDatabaseService.js').then(m => m.default);
            await this.dbService.initialize();

            // Load dashboard data
            await this.loadDashboardData();

            console.log('✅ Enhanced Dashboard initialized successfully');
        } catch (error) {
            console.error('❌ Enhanced Dashboard initialization failed:', error);
        }
    }

    renderInterface(container) {
        container.innerHTML = `
            <!-- Dashboard Header -->
            <div class="dashboard-enhanced-header">
                <div class="header-title">
                    <h1><i class="fas fa-chart-line"></i> Dashboard Empresarial</h1>
                    <p>Análisis completo de ventas, productos y rendimiento</p>
                </div>
                <div class="header-actions">
                    <div class="period-selector">
                        <button class="period-btn active" data-period="day" onclick="enhancedDashboard.setPeriod('day')">
                            <i class="fas fa-calendar-day"></i> Hoy
                        </button>
                        <button class="period-btn" data-period="week" onclick="enhancedDashboard.setPeriod('week')">
                            <i class="fas fa-calendar-week"></i> Semana
                        </button>
                        <button class="period-btn" data-period="month" onclick="enhancedDashboard.setPeriod('month')">
                            <i class="fas fa-calendar-alt"></i> Mes
                        </button>
                        <button class="period-btn" data-period="year" onclick="enhancedDashboard.setPeriod('year')">
                            <i class="fas fa-calendar"></i> Año
                        </button>
                        <button class="period-btn" data-period="custom" onclick="enhancedDashboard.showCustomDatePicker()">
                            <i class="fas fa-calendar-check"></i> Personalizado
                        </button>
                    </div>
                    <button class="btn btn-info" onclick="enhancedDashboard.refreshDashboard()">
                        <i class="fas fa-sync-alt"></i> Actualizar
                    </button>
                    <button class="btn btn-success" onclick="enhancedDashboard.generateReport()">
                        <i class="fas fa-file-download"></i> Generar Reporte
                    </button>
                </div>
            </div>

            <!-- Custom Date Range Picker -->
            <div id="customDateRange" class="custom-date-range" style="display: none;">
                <div class="info-box">
                    <i class="fas fa-calendar-check"></i>
                    <div class="message-content">
                        <strong>Seleccionar Período Personalizado</strong>
                        <div class="date-inputs">
                            <div class="form-group">
                                <label>Fecha Inicio</label>
                                <input type="date" id="startDate" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Fecha Fin</label>
                                <input type="date" id="endDate" class="form-control">
                            </div>
                            <button class="btn btn-primary" onclick="enhancedDashboard.applyCustomDate()">
                                <i class="fas fa-check"></i> Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- KPI Cards -->
            <div class="kpi-grid">
                <!-- Fila 1: Métricas Financieras -->
                <div class="kpi-card kpi-revenue">
                    <div class="kpi-icon">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="totalRevenue">$0</h3>
                        <p>Ingresos Totales</p>
                        <span class="kpi-trend" id="revenueTrend">
                            <i class="fas fa-arrow-up"></i> 0%
                        </span>
                    </div>
                </div>

                <div class="kpi-card kpi-orders">
                    <div class="kpi-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="totalOrders">0</h3>
                        <p>Pedidos Realizados</p>
                        <span class="kpi-trend" id="ordersTrend">
                            <i class="fas fa-arrow-up"></i> 0%
                        </span>
                    </div>
                </div>

                <div class="kpi-card kpi-avg-ticket">
                    <div class="kpi-icon">
                        <i class="fas fa-ticket-alt"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="avgTicket">$0</h3>
                        <p>Ticket Promedio</p>
                        <span class="kpi-trend" id="avgTicketTrend">
                            <i class="fas fa-arrow-up"></i> 0%
                        </span>
                    </div>
                </div>

                <div class="kpi-card kpi-inventory">
                    <div class="kpi-icon">
                        <i class="fas fa-warehouse"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="inventoryValue">$0</h3>
                        <p>Valor Inventario</p>
                        <span class="kpi-trend" id="inventoryTrend">
                            <i class="fas fa-minus"></i> 0%
                        </span>
                    </div>
                </div>

                <!-- Fila 2: Productos -->
                <div class="kpi-card kpi-products">
                    <div class="kpi-icon">
                        <i class="fas fa-box-open"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="totalProducts">0</h3>
                        <p>Total Productos</p>
                    </div>
                </div>

                <div class="kpi-card kpi-products-active">
                    <div class="kpi-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="productsActive">0</h3>
                        <p>Productos Activos</p>
                    </div>
                </div>

                <div class="kpi-card kpi-categories">
                    <div class="kpi-icon">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="categoriesCount">0</h3>
                        <p>Categorías</p>
                    </div>
                </div>

                <div class="kpi-card kpi-low-stock">
                    <div class="kpi-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="lowStockProducts">0</h3>
                        <p>Stock Bajo</p>
                    </div>
                </div>

                <!-- Fila 3: Cajas -->
                <div class="kpi-card kpi-boxes">
                    <div class="kpi-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="totalBoxes">0</h3>
                        <p>Total Cajas</p>
                    </div>
                </div>

                <div class="kpi-card kpi-boxes-active">
                    <div class="kpi-icon">
                        <i class="fas fa-box-open"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="boxesActive">0</h3>
                        <p>Cajas Activas</p>
                    </div>
                </div>

                <div class="kpi-card kpi-boxes-featured">
                    <div class="kpi-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="boxesFeatured">0</h3>
                        <p>Cajas Destacadas</p>
                    </div>
                </div>

                <div class="kpi-card kpi-stock">
                    <div class="kpi-icon">
                        <i class="fas fa-weight-hanging"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="totalStock">0 kg</h3>
                        <p>Stock Total</p>
                    </div>
                </div>

                <!-- Fila 4: Clientes y Créditos -->
                <div class="kpi-card kpi-customers">
                    <div class="kpi-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="totalCustomers">0</h3>
                        <p>Total Clientes</p>
                    </div>
                </div>

                <div class="kpi-card kpi-customers-credits">
                    <div class="kpi-icon">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="customersWithCredits">0</h3>
                        <p>Clientes con Créditos</p>
                    </div>
                </div>

                <div class="kpi-card kpi-credits">
                    <div class="kpi-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="creditsTotal">0</h3>
                        <p>Créditos Disponibles</p>
                    </div>
                </div>

                <div class="kpi-card kpi-credits-purchased">
                    <div class="kpi-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div class="kpi-content">
                        <h3 id="creditsPurchased">0</h3>
                        <p>Créditos Comprados</p>
                    </div>
                </div>
            </div>

            <!-- Charts Row 1 -->
            <div class="charts-row">
                <div class="chart-container chart-large">
                    <div class="chart-header">
                        <h3><i class="fas fa-chart-area"></i> Ventas en el Tiempo</h3>
                        <div class="chart-controls">
                            <select id="salesChartType" class="form-control" onchange="enhancedDashboard.updateSalesChart()">
                                <option value="revenue">Ingresos</option>
                                <option value="orders">Pedidos</option>
                                <option value="both">Ambos</option>
                            </select>
                        </div>
                    </div>
                    <canvas id="salesChart"></canvas>
                </div>

                <div class="chart-container chart-medium">
                    <div class="chart-header">
                        <h3><i class="fas fa-chart-pie"></i> Ventas por Categoría</h3>
                    </div>
                    <canvas id="categoryChart"></canvas>
                </div>
            </div>

            <!-- Charts Row 2 -->
            <div class="charts-row">
                <div class="chart-container chart-medium">
                    <div class="chart-header">
                        <h3><i class="fas fa-chart-bar"></i> Top 10 Productos</h3>
                        <div class="chart-controls">
                            <select id="topProductsMetric" class="form-control" onchange="enhancedDashboard.updateTopProducts()">
                                <option value="revenue">Por Ingresos</option>
                                <option value="quantity">Por Cantidad</option>
                                <option value="orders">Por Pedidos</option>
                            </select>
                        </div>
                    </div>
                    <canvas id="topProductsChart"></canvas>
                </div>

                <div class="chart-container chart-medium">
                    <div class="chart-header">
                        <h3><i class="fas fa-chart-line"></i> Tendencia de Precios</h3>
                    </div>
                    <canvas id="priceTrendChart"></canvas>
                </div>
            </div>

            <!-- Analytics Tables -->
            <div class="analytics-section">
                <h3><i class="fas fa-table"></i> Análisis Detallado</h3>
                
                <div class="analytics-tabs">
                    <button class="analytics-tab-btn active" data-tab="products" onclick="enhancedDashboard.switchAnalyticsTab('products')">
                        <i class="fas fa-box"></i> Productos
                    </button>
                    <button class="analytics-tab-btn" data-tab="customers" onclick="enhancedDashboard.switchAnalyticsTab('customers')">
                        <i class="fas fa-users"></i> Clientes
                    </button>
                    <button class="analytics-tab-btn" data-tab="transactions" onclick="enhancedDashboard.switchAnalyticsTab('transactions')">
                        <i class="fas fa-exchange-alt"></i> Transacciones
                    </button>
                    <button class="analytics-tab-btn" data-tab="inventory" onclick="enhancedDashboard.switchAnalyticsTab('inventory')">
                        <i class="fas fa-warehouse"></i> Inventario
                    </button>
                </div>

                <div id="analyticsContent" class="analytics-content">
                    <!-- Content will be loaded dynamically -->
                </div>
            </div>

            <!-- Export Modal -->
            <div id="exportModal" class="modal" style="display: none;">
                <div class="modal-overlay" onclick="enhancedDashboard.closeExportModal()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-file-download"></i> Generar Reporte</h3>
                        <button onclick="enhancedDashboard.closeExportModal()" class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Tipo de Reporte</label>
                                <select id="reportType" class="form-control">
                                    <option value="complete">Reporte Completo</option>
                                    <option value="sales">Ventas</option>
                                    <option value="inventory">Inventario</option>
                                    <option value="customers">Clientes</option>
                                    <option value="financial">Financiero</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Formato</label>
                                <select id="reportFormat" class="form-control">
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </div>
                        </div>
                        <div class="button-group">
                            <button class="btn btn-success" onclick="enhancedDashboard.downloadReport()">
                                <i class="fas fa-download"></i> Descargar
                            </button>
                            <button class="btn btn-secondary" onclick="enhancedDashboard.closeExportModal()">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadDashboardData() {
        try {
            console.log('📊 Loading dashboard data from DB...');

            const summary = await this.dbService.getDashboardSummary({
                startDate: this.customDateRange.start,
                endDate: this.customDateRange.end,
                period: this.currentPeriod
            });

            // Update all KPIs with real data
            this.updateKPIs(summary);

            // Create or update charts with salesByDay data
            this.createCharts(summary.salesByDay || []);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    updateKPIs(data) {
        // Métricas Financieras
        document.getElementById('totalRevenue').textContent = this.formatCurrency(data.revenue || 0);
        document.getElementById('totalOrders').textContent = (data.ordersCount || 0).toLocaleString();
        document.getElementById('avgTicket').textContent = this.formatCurrency(data.avgOrderValue || 0);
        document.getElementById('inventoryValue').textContent = this.formatCurrency(data.inventoryValue || 0);

        // Productos
        document.getElementById('totalProducts').textContent = (data.products || 0).toLocaleString();
        document.getElementById('productsActive').textContent = (data.productsActive || 0).toLocaleString();
        document.getElementById('categoriesCount').textContent = (data.categoriesCount || 0).toLocaleString();
        document.getElementById('lowStockProducts').textContent = (data.lowStockProducts || 0).toLocaleString();

        // Cajas
        document.getElementById('totalBoxes').textContent = (data.boxes || 0).toLocaleString();
        document.getElementById('boxesActive').textContent = (data.boxesActive || 0).toLocaleString();
        document.getElementById('boxesFeatured').textContent = (data.boxesFeatured || 0).toLocaleString();
        document.getElementById('totalStock').textContent = `${(data.totalStockKg || 0).toLocaleString()} kg`;

        // Clientes y Créditos
        document.getElementById('totalCustomers').textContent = (data.customers || 0).toLocaleString();
        document.getElementById('customersWithCredits').textContent = (data.customersWithCredits || 0).toLocaleString();
        document.getElementById('creditsTotal').textContent = (data.creditsTotal || 0).toLocaleString();
        document.getElementById('creditsPurchased').textContent = (data.creditsPurchased || 0).toLocaleString();
    }

    createCharts(salesByDay = []) {
        // Crear gráfico de ventas
        const salesCtx = document.getElementById('salesChart');
        if (salesCtx) {
            // Prepare data
            const labels = (salesByDay.length > 0) ? salesByDay.map(s => s.date) : ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
            const dataSet = (salesByDay.length > 0) ? salesByDay.map(s => s.value) : [1200000,1900000,1500000,2200000,1800000,2500000,2100000];

            if (this.charts.sales) {
                this.charts.sales.data.labels = labels;
                this.charts.sales.data.datasets[0].data = dataSet;
                this.charts.sales.update();
            } else {
                this.charts.sales = new Chart(salesCtx, {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [{
                            label: 'Ingresos',
                            data: dataSet,
                            borderColor: '#4A9EFF',
                            backgroundColor: 'rgba(74, 158, 255, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: true }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });
            }
        }

        // Category chart (pie chart)
        this.createCategoryChart();
        
        // Top products chart (bar chart)
        this.createTopProductsChart();
        
        // Price trend chart (line chart)
        this.createPriceTrendChart();
    }

    async createCategoryChart() {
        const categoryCtx = document.getElementById('categoryChart');
        if (!categoryCtx) return;

        try {
            const products = await this.dbService.getAllProducts();
            const categoryMap = new Map();
            
            products.forEach(p => {
                const cat = p.category || 'Sin categoría';
                categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
            });

            const labels = Array.from(categoryMap.keys());
            const data = Array.from(categoryMap.values());
            const colors = ['#4A9EFF', '#ff9b40', '#8bda01', '#e66bc0', '#00d4ff', '#ffc107'];

            if (this.charts.category) {
                this.charts.category.data.labels = labels;
                this.charts.category.data.datasets[0].data = data;
                this.charts.category.update();
            } else {
                this.charts.category = new Chart(categoryCtx, {
                    type: 'pie',
                    data: {
                        labels,
                        datasets: [{
                            data,
                            backgroundColor: colors.slice(0, labels.length),
                            borderWidth: 2,
                            borderColor: '#1a1a1a'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom' }
                        }
                    }
                });
            }
        } catch (err) {
            console.error('Error creating category chart:', err);
        }
    }

    async createTopProductsChart() {
        const topProductsCtx = document.getElementById('topProductsChart');
        if (!topProductsCtx) return;

        try {
            const products = await this.dbService.getAllProducts();
            // Sort by stock descending
            const topProducts = products
                .sort((a, b) => (b.stock_kg || 0) - (a.stock_kg || 0))
                .slice(0, 10);

            const labels = topProducts.map(p => p.name || 'N/A');
            const data = topProducts.map(p => p.stock_kg || 0);

            if (this.charts.topProducts) {
                this.charts.topProducts.data.labels = labels;
                this.charts.topProducts.data.datasets[0].data = data;
                this.charts.topProducts.update();
            } else {
                this.charts.topProducts = new Chart(topProductsCtx, {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [{
                            label: 'Stock (kg)',
                            data,
                            backgroundColor: 'rgba(74, 158, 255, 0.6)',
                            borderColor: '#4A9EFF',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            x: { beginAtZero: true }
                        }
                    }
                });
            }
        } catch (err) {
            console.error('Error creating top products chart:', err);
        }
    }

    async createPriceTrendChart() {
        const priceTrendCtx = document.getElementById('priceTrendChart');
        if (!priceTrendCtx) return;

        try {
            const priceReport = await this.dbService.getDailyPriceReport();
            
            if (!priceReport || priceReport.length === 0) {
                // Use demo data if no price history
                const demoLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
                const demoData = [4500, 4650, 4800, 4750, 4900, 5000];
                
                if (this.charts.priceTrend) {
                    this.charts.priceTrend.data.labels = demoLabels;
                    this.charts.priceTrend.data.datasets[0].data = demoData;
                    this.charts.priceTrend.update();
                } else {
                    this.charts.priceTrend = new Chart(priceTrendCtx, {
                        type: 'line',
                        data: {
                            labels: demoLabels,
                            datasets: [{
                                label: 'Precio Promedio',
                                data: demoData,
                                borderColor: '#8bda01',
                                backgroundColor: 'rgba(139, 218, 1, 0.1)',
                                fill: true,
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: true }
                            },
                            scales: {
                                y: { beginAtZero: false }
                            }
                        }
                    });
                }
            } else {
                // Use real price data grouped by date
                const priceMap = new Map();
                priceReport.forEach(p => {
                    const date = new Date(p.created_at).toISOString().slice(0, 7); // YYYY-MM
                    if (!priceMap.has(date)) priceMap.set(date, []);
                    priceMap.get(date).push(p.price_per_kg || 0);
                });

                const labels = Array.from(priceMap.keys()).sort();
                const avgPrices = labels.map(date => {
                    const prices = priceMap.get(date);
                    return prices.reduce((sum, p) => sum + p, 0) / prices.length;
                });

                if (this.charts.priceTrend) {
                    this.charts.priceTrend.data.labels = labels;
                    this.charts.priceTrend.data.datasets[0].data = avgPrices;
                    this.charts.priceTrend.update();
                } else {
                    this.charts.priceTrend = new Chart(priceTrendCtx, {
                        type: 'line',
                        data: {
                            labels,
                            datasets: [{
                                label: 'Precio Promedio',
                                data: avgPrices,
                                borderColor: '#8bda01',
                                backgroundColor: 'rgba(139, 218, 1, 0.1)',
                                fill: true,
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: true }
                            },
                            scales: {
                                y: { beginAtZero: false }
                            }
                        }
                    });
                }
            }
        } catch (err) {
            console.error('Error creating price trend chart:', err);
        }
    }

    setPeriod(period) {
        this.currentPeriod = period;
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === period);
        });
        
        if (period === 'custom') {
            document.getElementById('customDateRange').style.display = 'block';
        } else {
            document.getElementById('customDateRange').style.display = 'none';
            this.loadDashboardData();
        }
    }

    showCustomDatePicker() {
        document.getElementById('customDateRange').style.display = 'block';
    }

    applyCustomDate() {
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;
        
        if (!start || !end) {
            alert('Por favor selecciona ambas fechas');
            return;
        }

        this.customDateRange = { start, end };
        this.loadDashboardData();
    }

    refreshDashboard() {
        this.loadDashboardData();
    }

    generateReport() {
        document.getElementById('exportModal').style.display = 'flex';
    }

    closeExportModal() {
        document.getElementById('exportModal').style.display = 'none';
    }

    downloadReport() {
        const type = document.getElementById('reportType').value;
        const format = document.getElementById('reportFormat').value;
        
        console.log(`Downloading ${type} report in ${format} format...`);
        
        // Get data based on report type
        this.generateReportData(type).then(data => {
            if (format === 'csv') {
                this.downloadCSV(data, `reporte_${type}_${new Date().toISOString().slice(0,10)}.csv`);
            } else if (format === 'excel') {
                alert('Descarga Excel en desarrollo. Por ahora use CSV.');
            } else {
                alert('Descarga PDF en desarrollo. Por ahora use CSV.');
            }
            this.closeExportModal();
        }).catch(err => {
            console.error('Error generating report:', err);
            alert('Error al generar reporte: ' + err.message);
        });
    }

    async generateReportData(type) {
        const summary = await this.dbService.getDashboardSummary({
            startDate: this.customDateRange.start,
            endDate: this.customDateRange.end,
            period: this.currentPeriod
        });

        const reportData = [];
        
        switch(type) {
            case 'complete':
                reportData.push({ Métrica: 'Productos', Valor: summary.products });
                reportData.push({ Métrica: 'Cajas', Valor: summary.boxes });
                reportData.push({ Métrica: 'Inventario', Valor: this.formatCurrency(summary.inventoryValue) });
                reportData.push({ Métrica: 'Clientes', Valor: summary.customers });
                reportData.push({ Métrica: 'Créditos Totales', Valor: summary.creditsTotal });
                reportData.push({ Métrica: 'Pedidos', Valor: summary.ordersCount });
                reportData.push({ Métrica: 'Ingresos', Valor: this.formatCurrency(summary.revenue) });
                break;
            case 'sales':
                (summary.salesByDay || []).forEach(s => {
                    reportData.push({ Fecha: s.date, Ingresos: this.formatCurrency(s.value) });
                });
                break;
            case 'inventory':
                const products = await this.dbService.getAllProducts();
                (products || []).forEach(p => {
                    reportData.push({
                        Producto: p.name,
                        Categoría: p.category || 'N/A',
                        Stock: p.stock_kg || 0,
                        Precio: this.formatCurrency(p.price_per_kg || 0)
                    });
                });
                break;
            case 'customers':
                const credits = await this.dbService.getUsersCredits();
                (credits || []).forEach(c => {
                    reportData.push({
                        Usuario: c.name || 'N/A',
                        Email: c.email || 'N/A',
                        Créditos: c.credits || 0
                    });
                });
                break;
            case 'financial':
                reportData.push({ Concepto: 'Ingresos Totales', Monto: this.formatCurrency(summary.revenue) });
                reportData.push({ Concepto: 'Inventario Valorizado', Monto: this.formatCurrency(summary.inventoryValue) });
                break;
        }

        return reportData;
    }

    downloadCSV(data, filename) {
        if (!data || data.length === 0) {
            alert('No hay datos para descargar');
            return;
        }

        const keys = Object.keys(data[0]);
        const csv = [
            keys.join(','), // Header
            ...data.map(row => keys.map(k => {
                let val = row[k];
                if (typeof val === 'string' && val.includes(',')) val = `"${val}"`;
                return val;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    }

    switchAnalyticsTab(tab) {
        document.querySelectorAll('.analytics-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        // Cargar contenido del tab
        this.loadAnalyticsContent(tab);
    }

    async loadAnalyticsContent(tab) {
        const container = document.getElementById('analyticsContent');
        container.innerHTML = '<p style="text-align: center; padding: 20px;">Cargando datos...</p>';

        try {
            let html = '';
            
            switch(tab) {
                case 'products':
                    const products = await this.dbService.getAllProducts();
                    html = this.generateProductsTable(products);
                    break;
                case 'customers':
                    const credits = await this.dbService.getUsersCredits();
                    html = this.generateCustomersTable(credits);
                    break;
                case 'transactions':
                    html = '<p style="padding: 20px;">Historial de transacciones próximamente disponible</p>';
                    break;
                case 'inventory':
                    const inventory = await this.dbService.getInventoryReport();
                    html = this.generateInventoryTable(inventory);
                    break;
            }
            
            container.innerHTML = html;
        } catch (err) {
            console.error('Error loading analytics:', err);
            container.innerHTML = `<p style="color: red; padding: 20px;">Error al cargar datos: ${err.message}</p>`;
        }
    }

    generateProductsTable(products) {
        if (!products || products.length === 0) {
            return '<p style="padding: 20px;">No hay productos registrados</p>';
        }

        return `
            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Stock (kg)</th>
                            <th>Precio/kg</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(p => `
                            <tr>
                                <td>${p.name || 'N/A'}</td>
                                <td>${p.category || 'Sin categoría'}</td>
                                <td>${p.stock_kg || 0}</td>
                                <td>${this.formatCurrency(p.price_per_kg || 0)}</td>
                                <td>
                                    <span class="badge ${(p.stock_kg || 0) > 0 ? 'badge-success' : 'badge-warning'}">
                                        ${(p.stock_kg || 0) > 0 ? 'Disponible' : 'Agotado'}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateCustomersTable(credits) {
        if (!credits || credits.length === 0) {
            return '<p style="padding: 20px;">No hay usuarios registrados</p>';
        }

        return `
            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Créditos</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${credits.map(c => `
                            <tr>
                                <td>${c.name || 'N/A'}</td>
                                <td>${c.email || 'N/A'}</td>
                                <td>${c.credits || 0}</td>
                                <td>
                                    <span class="badge ${(c.credits || 0) > 0 ? 'badge-success' : 'badge-inactive'}">
                                        ${(c.credits || 0) > 0 ? 'Activo' : 'Sin créditos'}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateInventoryTable(inventory) {
        if (!inventory || inventory.length === 0) {
            return '<p style="padding: 20px;">No hay datos de inventario</p>';
        }

        return `
            <div class="analytics-table-wrapper">
                <table class="analytics-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Stock (kg)</th>
                            <th>Costo/kg</th>
                            <th>Valor Total</th>
                            <th>Estado Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inventory.map(i => {
                            const totalValue = (i.stock_kg || 0) * (i.cost_per_kg || 0);
                            const lowStock = (i.stock_kg || 0) < 10;
                            return `
                                <tr>
                                    <td>${i.product_name || 'N/A'}</td>
                                    <td>${i.stock_kg || 0}</td>
                                    <td>${this.formatCurrency(i.cost_per_kg || 0)}</td>
                                    <td>${this.formatCurrency(totalValue)}</td>
                                    <td>
                                        <span class="badge ${lowStock ? 'badge-warning' : 'badge-success'}">
                                            ${lowStock ? 'Stock Bajo' : 'Normal'}
                                        </span>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    updateSalesChart() {
        // Actualizar gráfico de ventas
    }

    updateTopProducts() {
        // Actualizar top productos
    }
}

// Create and export instance
const enhancedDashboard = new EnhancedDashboard();
window.enhancedDashboard = enhancedDashboard;

export default enhancedDashboard;
