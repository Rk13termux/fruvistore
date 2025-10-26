import '../services/storeService.js';
import '../services/productManager.js';

const HOUR_IN_MS = 60 * 60 * 1000;
const MAX_WAIT_ATTEMPTS = 60;
const WAIT_DELAY_MS = 150;
const PRODUCTS_FALLBACK = {
  url: 'https://xujenwuefrgxfsiqjqhl.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amVud3VlZnJneGZzaXFqcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTExNTYsImV4cCI6MjA3NjU2NzE1Nn0.89UAEW8CVBkz8lEAdnJzt0XJNo0C4lCrZMBBcRYKmMs'
};

const isAuthorized = checkAdminAuth();

if (isAuthorized) {
  document.body?.classList.remove('is-hidden');
  document.addEventListener('DOMContentLoaded', async () => {
    const dashboard = new AdminDashboard();
    window.__adminDashboard = dashboard;
    attachGlobals(dashboard);
    await dashboard.init();
  });
} else {
  document.body?.classList.add('is-hidden');
}

function checkAdminAuth() {
  try {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const loginTimeRaw = localStorage.getItem('adminLoginTime');
    const loginTime = loginTimeRaw ? parseInt(loginTimeRaw, 10) : 0;

    if (!isLoggedIn || !loginTime || Number.isNaN(loginTime)) {
      redirectToLogin();
      return false;
    }

    if (Date.now() - loginTime > HOUR_IN_MS) {
      redirectToLogin();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verificando sesión de admin:', error);
    redirectToLogin();
    return false;
  }
}

function redirectToLogin() {
  window.location.replace('./admin-login.html');
}

function getAdminUser() {
  return localStorage.getItem('adminUser') || 'Admin';
}

function logout() {
  if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    return;
  }

  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('adminLoginTime');
  localStorage.removeItem('adminUser');

  if (document.body) {
    document.body.style.opacity = '0';
    document.body.style.transform = 'scale(0.95)';
  }

  setTimeout(() => {
    redirectToLogin();
  }, 300);
}

window.logout = logout;

function attachGlobals(dashboard) {
  window.closeModal = () => dashboard.closeModal();
  window.forceCloseModal = () => dashboard.closeModal();
  window.showAddProductModal = () => dashboard.showAddProductModal();
  window.closeAddProductModal = () => dashboard.closeAddProductModal();
  window.updateSinglePrice = () => dashboard.updateSinglePrice();
  window.viewPriceHistory = () => dashboard.viewPriceHistory();
  window.applyBulkIncrease = () => dashboard.applyBulkIncrease();
  window.updateStock = () => dashboard.updateStock();
  window.showLowStock = () => dashboard.showLowStock();
  window.showAllProducts = () => dashboard.showAllProducts();
  window.editSelectedProduct = () => dashboard.editSelectedProduct();
  window.deleteSelectedProduct = () => dashboard.deleteSelectedProduct();
  window.confirmDeleteProduct = (id, name) => dashboard.confirmDeleteProduct(id, name);
  window.updateProductStatus = () => dashboard.updateProductStatus();
  window.loadInventoryReport = () => dashboard.loadInventoryReport();
  window.loadDailyReport = () => dashboard.loadDailyReport();
  window.exportProducts = () => dashboard.exportProducts();
  window.importPricesFromCSV = () => dashboard.importPricesFromCSV();
  window.refreshCategoriesChart = () => dashboard.refreshCategoriesChart();
  window.refreshPricesChart = () => dashboard.refreshPricesChart();
  window.refreshStockChart = () => dashboard.refreshStockChart();
  window.refreshRevenueChart = () => dashboard.refreshRevenueChart();
  window.restockProduct = (productId, targetStock) => dashboard.restockProduct(productId, targetStock);
  window.updatePrice = productId => dashboard.updatePrice(productId);
  window.addNewProduct = () => dashboard.showAddProductModal();
  window.showEnvironmentInfo = () => dashboard.showEnvironmentInfo();
}

class AdminDashboard {
  constructor() {
    this.productManager = null;
    this.products = [];
    this.stats = null;
    this.charts = {
      categories: null,
      prices: null,
      stock: null,
      revenue: null
    };
    this.editingProductId = null;
    this.connectionChecked = false;
  }

  async init() {
    this.updateHeaderUserInfo();
    this.updateConnectionStatus('warning', 'Verificando conexión con Supabase...');

    try {
      await this.ensureSupabase();
      await this.ensureStoreService();
      await this.initializeProductManager();
      await this.testConnectionStatus();
      this.bindFormHandlers();
      await this.refreshData(true);
      this.updateConnectionStatus('success', '✅ Conectado a base de datos de productos');
      this.connectionChecked = true;
    } catch (error) {
      console.error('Error inicializando panel de administración:', error);
      this.updateConnectionStatus('error', `❌ ${error.message || 'Error durante la inicialización'}`);
      this.showAlert(`Error inicializando el panel: ${error.message}`, 'danger');
    }
  }

  async ensureSupabase() {
    let attempts = 0;
    while (!window.supabase && attempts < MAX_WAIT_ATTEMPTS) {
      await this.wait(WAIT_DELAY_MS);
      attempts += 1;
    }

    if (!window.supabase) {
      throw new Error('Biblioteca de Supabase no cargada. Verifica tu conexión a Internet.');
    }
  }

  async ensureStoreService() {
    let attempts = 0;

    while (!window.productsClient && attempts < MAX_WAIT_ATTEMPTS) {
      await this.wait(WAIT_DELAY_MS);
      attempts += 1;
    }

    if (!window.productsClient && window.supabase) {
      console.warn('Cliente de productos no disponible. Creando cliente manualmente con valores predeterminados.');
      window.productsClient = window.supabase.createClient(PRODUCTS_FALLBACK.url, PRODUCTS_FALLBACK.anonKey);
      window.supabaseClient = window.productsClient;
    }

    if (!window.productsClient) {
      throw new Error('No se pudo inicializar el cliente de productos.');
    }

    this.productsClient = window.productsClient;
  }

  async initializeProductManager() {
    if (typeof window.initProductManager === 'function') {
      this.productManager = window.initProductManager();
    }

    if (!this.productManager) {
      this.productManager = this.createFallbackManager();
    }
  }

  createFallbackManager() {
    return {
      getAllProducts: async () => {
        if (typeof window.getAllProducts === 'function') {
          return window.getAllProducts();
        }
        return [];
      },
      updateProductPrice: async (productId, newPrice, reason, updatedBy = 'admin') => {
        if (typeof window.updateProductPrice === 'function') {
          return window.updateProductPrice(productId, newPrice, reason, updatedBy);
        }
        return { success: false, error: 'Función updateProductPrice no disponible' };
      },
      applyPriceIncrease: async (categoryOrIds, percent, reason) => {
        if (typeof window.applyInflationIncrease === 'function') {
          if (Array.isArray(categoryOrIds)) {
            const updates = categoryOrIds.map(async productId => {
              const product = this.getProductById(productId);
              const newPrice = product ? Math.round((product.price_per_kg || 0) * (1 + percent / 100)) : 0;
              return this.productManager.updateProductPrice(productId, newPrice, reason, 'admin');
            });
            return Promise.all(updates);
          }
          return window.applyInflationIncrease(percent, categoryOrIds);
        }
        return { success: false, error: 'Función applyInflationIncrease no disponible' };
      },
      updateStock: async (productId, quantityChange, reason) => {
        if (typeof window.updateStock === 'function') {
          return window.updateStock(productId, quantityChange, reason);
        }
        return { success: false, error: 'Función updateStock no disponible' };
      },
      getLowStockProducts: async () => {
        const products = this.products || [];
        return products.filter(product => (product.stock_kg || product.stock || 0) <= (product.min_stock_kg || product.min_stock || 0));
      },
      getInventoryReport: async () => {
        if (typeof window.getInventoryReport === 'function') {
          return window.getInventoryReport();
        }
        return { report: null, products: [] };
      },
      getDailyPriceReport: async () => {
        if (typeof window.getDailyPriceReport === 'function') {
          return window.getDailyPriceReport();
        }
        return [];
      },
      getPriceHistory: async (productId, days = 30) => {
        if (this.productsClient) {
          return this.productsClient
            .from('price_updates_log')
            .select('*')
            .eq('product_id', productId)
            .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false });
        }
        return { data: [], error: null };
      },
      restockProduct: async (productId, targetStock, reason = 'Restock to target level') => {
        if (!this.productsClient) {
          return { success: false, error: 'Cliente de productos no disponible' };
        }

        const { data, error } = await this.productsClient
          .from('current_products')
          .select('stock_kg')
          .eq('id', productId)
          .single();

        if (error) {
          return { success: false, error: error.message };
        }

        const currentStock = data?.stock_kg || 0;
        const difference = targetStock - currentStock;
        if (difference === 0) {
          return { success: true, message: 'El stock ya está en el nivel objetivo' };
        }

        if (typeof window.updateStock === 'function') {
          return window.updateStock(productId, difference, reason);
        }

        return { success: false, error: 'Función updateStock no disponible' };
      },
      importPricesFromCSV: async (csvData, updatedBy = 'bulk_import') => {
        if (typeof window.importPricesFromCSV === 'function') {
          return window.importPricesFromCSV(csvData, updatedBy);
        }
        if (typeof productManager?.importPricesFromCSV === 'function') {
          return productManager.importPricesFromCSV(csvData, updatedBy);
        }
        return { success: false, error: 'Función importPricesFromCSV no disponible' };
      }
    };
  }

  async testConnectionStatus() {
    if (typeof window.testProductsConnection === 'function') {
      const connected = await window.testProductsConnection();
      if (!connected) {
        this.updateConnectionStatus('warning', '⚠️ Cliente inicializado. Verifica que las tablas de productos estén creadas.');
      }
    }
  }

  bindFormHandlers() {
    const form = document.getElementById('addProductForm');
    if (form) {
      form.addEventListener('submit', event => this.handleAddProduct(event));
    }

    const pricesPeriod = document.getElementById('pricesPeriod');
    if (pricesPeriod) {
      pricesPeriod.addEventListener('change', () => this.refreshPricesChart());
    }

    this.bindSelectListeners();
  }

  bindSelectListeners() {
    const priceSelect = document.getElementById('priceProductSelect');
    if (priceSelect) {
      priceSelect.addEventListener('change', () => this.prefillPriceFields());
    }

    const stockSelect = document.getElementById('stockProductSelect');
    if (stockSelect) {
      stockSelect.addEventListener('change', () => this.renderSelectedStockInfo());
    }
  }

  async refreshData(showLoading = false) {
    try {
      if (showLoading) {
        this.showLoading('Cargando datos de productos...');
      }

      if (typeof this.productManager.getAllProducts === 'function') {
        this.products = await this.productManager.getAllProducts();
      } else if (typeof window.getAllProducts === 'function') {
        this.products = await window.getAllProducts();
      } else {
        this.products = [];
      }

      if (!Array.isArray(this.products)) {
        this.products = [];
      }

      this.populateSelectors();
      this.prefillPriceFields();
      this.renderSelectedStockInfo();
      this.stats = this.computeStats(this.products);
      this.renderStats();
      this.renderCharts();
      this.hideLoading();
    } catch (error) {
      console.error('Error cargando productos:', error);
      this.hideLoading();
      this.showAlert(`Error cargando productos: ${error.message}`, 'danger');
    }
  }

  computeStats(products) {
    const stats = {
      totalProducts: products.length,
      activeProducts: 0,
      lowStockCount: 0,
      totalValue: 0,
      avgPrice: 0,
      totalStock: 0,
      categories: {}
    };

    if (products.length === 0) {
      return stats;
    }

    let priceAccumulator = 0;

    products.forEach(product => {
      const price = Number(product.price_per_kg || product.price || 0);
      const stock = Number(product.stock_kg || product.stock || 0);
      const minStock = Number(product.min_stock_kg || product.min_stock || 0);
      const category = product.category || 'Sin categoría';
      const isActive = product.available !== false && product.is_active !== false;

      if (isActive) {
        stats.activeProducts += 1;
      }

      if (stock <= minStock) {
        stats.lowStockCount += 1;
      }

      stats.totalValue += stock * price;
      stats.totalStock += stock;
      priceAccumulator += price;

      if (!stats.categories[category]) {
        stats.categories[category] = {
          count: 0,
          totalStock: 0,
          totalValue: 0,
          lowStock: 0
        };
      }

      const categoryStats = stats.categories[category];
      categoryStats.count += 1;
      categoryStats.totalStock += stock;
      categoryStats.totalValue += stock * price;
      if (stock <= minStock) {
        categoryStats.lowStock += 1;
      }
    });

    stats.avgPrice = products.length ? priceAccumulator / products.length : 0;
    return stats;
  }

  renderStats() {
    const container = document.getElementById('statsContainer');
    if (!container || !this.stats) {
      return;
    }

    const { totalProducts, activeProducts, lowStockCount, totalValue, avgPrice, categories, totalStock } = this.stats;

    container.innerHTML = `
      <div class="stat-card">
        <i class="fas fa-boxes"></i>
        <div class="value">${totalProducts}</div>
        <div class="label">Total Productos</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-check-circle"></i>
        <div class="value">${activeProducts}</div>
        <div class="label">Productos Activos</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-exclamation-triangle"></i>
        <div class="value">${lowStockCount}</div>
        <div class="label">Stock Bajo</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-dollar-sign"></i>
        <div class="value">${this.formatPrice(totalValue)}</div>
        <div class="label">Valor Total Inventario</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-layer-group"></i>
        <div class="value">${Object.keys(categories).length}</div>
        <div class="label">Categorías</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-weight-hanging"></i>
        <div class="value">${this.formatNumber(totalStock)} kg</div>
        <div class="label">Stock Total</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-tag"></i>
        <div class="value">${this.formatPrice(avgPrice)}</div>
        <div class="label">Precio Promedio / kg</div>
      </div>
    `;
  }

  renderCharts() {
    const products = this.products || [];
    if (!this.stats) {
      return;
    }

    this.renderCategoriesChart(this.stats.categories);
    this.renderPricesChart(products);
    this.renderStockChart(products);
    this.renderRevenueChart(this.stats.categories);
  }

  destroyChart(refName) {
    if (this.charts[refName]) {
      this.charts[refName].destroy();
      this.charts[refName] = null;
    }
  }

  renderCategoriesChart(categories) {
    const canvas = document.getElementById('categoriesChart');
    if (!canvas || typeof Chart === 'undefined') {
      return;
    }

    this.destroyChart('categories');

    const labels = Object.keys(categories);
    const data = labels.map(label => categories[label].count);
    const colors = [
      'rgba(255, 155, 64, 0.8)',
      'rgba(139, 218, 1, 0.8)',
      'rgba(255, 139, 211, 0.8)',
      'rgba(243, 156, 18, 0.8)',
      'rgba(64, 196, 255, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(75, 192, 192, 0.8)'
    ];

    this.charts.categories = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e9eef5',
              padding: 20,
              font: {
                family: 'Inter',
                size: 12
              }
            }
          }
        }
      }
    });
  }

  renderPricesChart(products) {
    const canvas = document.getElementById('pricesChart');
    if (!canvas || typeof Chart === 'undefined') {
      return;
    }

    this.destroyChart('prices');

    const categoryMap = new Map();
    products.forEach(product => {
      const category = product.category || 'Sin categoría';
      const price = Number(product.price_per_kg || product.price || 0);
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category).push(price);
    });

    const labels = Array.from(categoryMap.keys());
    const series = labels.map(label => {
      const prices = categoryMap.get(label);
      const avg = prices.reduce((acc, value) => acc + value, 0) / (prices.length || 1);
      return avg;
    });

    this.charts.prices = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Precio Promedio (COP / kg)',
            data: series,
            borderColor: '#ff9b40',
            backgroundColor: 'rgba(255, 155, 64, 0.12)',
            borderWidth: 3,
            tension: 0.35,
            pointBackgroundColor: '#ff9b40',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#e9eef5'
            }
          },
          tooltip: {
            callbacks: {
              label: context => `Precio: ${this.formatPrice(context.parsed.y)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#9aa6b2',
              callback: value => this.formatPrice(value)
            },
            grid: {
              color: 'rgba(255,255,255,0.08)'
            }
          },
          x: {
            ticks: { color: '#9aa6b2' },
            grid: { color: 'rgba(255,255,255,0.08)' }
          }
        }
      }
    });
  }

  renderStockChart(products) {
    const canvas = document.getElementById('stockChart');
    if (!canvas || typeof Chart === 'undefined') {
      return;
    }

    this.destroyChart('stock');

    const sorted = [...products]
      .sort((a, b) => (b.stock_kg || b.stock || 0) - (a.stock_kg || a.stock || 0))
      .slice(0, 10);

    const labels = sorted.map(product => product.name);
    const stockData = sorted.map(product => product.stock_kg || product.stock || 0);
    const minStockData = sorted.map(product => product.min_stock_kg || product.min_stock || 0);

    this.charts.stock = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Stock actual (kg)',
            data: stockData,
            backgroundColor: 'rgba(139, 218, 1, 0.8)',
            borderColor: '#8bda01',
            borderWidth: 1
          },
          {
            label: 'Stock mínimo (kg)',
            data: minStockData,
            backgroundColor: 'rgba(255, 71, 87, 0.8)',
            borderColor: '#ff4757',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#e9eef5'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#9aa6b2',
              callback: value => `${value} kg`
            },
            grid: {
              color: 'rgba(255,255,255,0.08)'
            }
          },
          x: {
            ticks: { color: '#9aa6b2', maxRotation: 35 },
            grid: { color: 'rgba(255,255,255,0.08)' }
          }
        }
      }
    });
  }

  renderRevenueChart(categories) {
    const canvas = document.getElementById('revenueChart');
    if (!canvas || typeof Chart === 'undefined') {
      return;
    }

    this.destroyChart('revenue');

    const labels = Object.keys(categories);
    const values = labels.map(label => categories[label].totalValue);

    this.charts.revenue = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Valor de Inventario (COP)',
            data: values,
            backgroundColor: 'rgba(255, 155, 64, 0.8)',
            borderColor: '#ff9b40',
            borderWidth: 2,
            borderRadius: 10,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#e9eef5'
            }
          },
          tooltip: {
            callbacks: {
              label: context => `Valor: ${this.formatPrice(context.parsed.y)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#9aa6b2',
              callback: value => this.formatPrice(value)
            },
            grid: {
              color: 'rgba(255,255,255,0.08)'
            }
          },
          x: {
            ticks: { color: '#9aa6b2' },
            grid: { color: 'rgba(255,255,255,0.08)' }
          }
        }
      }
    });
  }

  refreshCategoriesChart() {
    this.renderCategoriesChart(this.stats?.categories || {});
  }

  refreshPricesChart() {
    this.renderPricesChart(this.products || []);
  }

  refreshStockChart() {
    this.renderStockChart(this.products || []);
  }

  refreshRevenueChart() {
    this.renderRevenueChart(this.stats?.categories || {});
  }

  populateSelectors() {
    const priceSelect = document.getElementById('priceProductSelect');
    const stockSelect = document.getElementById('stockProductSelect');
    const manageSelect = document.getElementById('manageProductSelect');

    if (priceSelect) {
      this.populateSelect(priceSelect, 'Seleccionar producto...', product => `${product.name} (${product.category || 'Sin categoría'})`);
    }

    if (stockSelect) {
      this.populateSelect(stockSelect, 'Seleccionar producto...', product => `${product.name} (${this.formatNumber(product.stock_kg || product.stock || 0)} kg)`);
    }

    if (manageSelect) {
      this.populateSelect(manageSelect, 'Seleccionar producto...', product => `${product.name} - ${product.available !== false && product.is_active !== false ? 'Activo' : 'Inactivo'}`);
    }
  }

  populateSelect(selectElement, placeholder, labelFn) {
    const prevValue = selectElement.value;
    selectElement.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;
    selectElement.appendChild(placeholderOption);

    this.products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = labelFn(product);
      selectElement.appendChild(option);
    });

    if (prevValue && this.products.some(product => String(product.id) === String(prevValue))) {
      selectElement.value = prevValue;
    }
  }

  prefillPriceFields() {
    const priceSelect = document.getElementById('priceProductSelect');
    const priceInput = document.getElementById('newPrice');
    if (!priceSelect || !priceInput) {
      return;
    }

    const product = this.getProductById(priceSelect.value);
    if (product) {
      priceInput.value = Math.round(product.price_per_kg || product.price || 0);
    }
  }

  renderSelectedStockInfo() {
    const stockSelect = document.getElementById('stockProductSelect');
    const infoContainer = document.getElementById('currentStock');

    if (!stockSelect || !infoContainer) {
      return;
    }

    const product = this.getProductById(stockSelect.value);
    if (!product) {
      infoContainer.innerHTML = '<span style="color: #666;">Selecciona un producto para ver el stock actual.</span>';
      return;
    }

    const currentStock = this.formatNumber(product.stock_kg || product.stock || 0);
    const minStock = this.formatNumber(product.min_stock_kg || product.min_stock || 0);
    const statusClass = (product.stock_kg || product.stock || 0) <= (product.min_stock_kg || product.min_stock || 0) ? 'stock-low' : 'stock-good';
    const icon = statusClass === 'stock-low' ? 'fa-exclamation-triangle' : 'fa-check-circle';

    infoContainer.innerHTML = `
      <div class="stock-status">
        <span class="${statusClass}">
          <i class="fas ${icon}"></i>
          Stock actual: ${currentStock} kg
        </span>
      </div>
      <small style="color: #666;">Stock mínimo recomendado: ${minStock} kg</small>
    `;
  }

  getProductById(productId) {
    if (!productId) {
      return null;
    }
    return this.products.find(product => String(product.id) === String(productId)) || null;
  }

  async updateSinglePrice() {
    const productSelect = document.getElementById('priceProductSelect');
    const priceInput = document.getElementById('newPrice');
    const reasonInput = document.getElementById('priceReason');

    if (!productSelect || !priceInput) {
      return;
    }

    const productId = productSelect.value;
    const newPrice = Number(priceInput.value);
    const reason = reasonInput?.value?.trim() || 'Actualización manual';

    if (!productId || Number.isNaN(newPrice) || newPrice <= 0) {
      this.showAlert('Por favor selecciona un producto y un precio válido.', 'warning');
      return;
    }

    try {
      this.showLoading('Actualizando precio...');
      const result = await this.productManager.updateProductPrice(productId, newPrice, reason, getAdminUser());

      if (result?.success) {
        this.showAlert('Precio actualizado correctamente.', 'success');
        await this.refreshData(false);
        priceInput.value = '';
        if (reasonInput) {
          reasonInput.value = '';
        }
      } else {
        const errorMessage = result?.error || 'No se pudo actualizar el precio.';
        this.showAlert(`Error actualizando precio: ${errorMessage}`, 'danger');
      }
    } catch (error) {
      console.error('Error actualizando precio:', error);
      this.showAlert(`Error actualizando precio: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  async viewPriceHistory() {
    const select = document.getElementById('priceProductSelect');
    if (!select || !select.value) {
      this.showAlert('Selecciona un producto para ver su historial de precios.', 'warning');
      return;
    }

    const product = this.getProductById(select.value);
    if (!product) {
      this.showAlert('Producto no encontrado.', 'danger');
      return;
    }

    try {
      this.showLoading('Cargando historial de precios...');
      let history = [];

      if (typeof this.productManager.getPriceHistory === 'function') {
        const result = await this.productManager.getPriceHistory(product.id, 60);
        history = Array.isArray(result) ? result : result?.data || [];
      }

      if (!history.length) {
        this.showAlert('No hay registros recientes de cambios de precios para este producto.', 'info');
        return;
      }

      let rows = '';
      history.forEach(entry => {
        rows += `
          <tr>
            <td>${this.formatDate(entry.created_at)}</td>
            <td>${this.formatPrice(entry.price_per_kg)}</td>
            <td>${entry.reason || 'Sin motivo'}</td>
            <td>${entry.updated_by || 'admin'}</td>
          </tr>
        `;
      });

      const html = `
        <h3>Historial de precios - ${this.escapeHtml(product.name)}</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Precio (COP / kg)</th>
                <th>Motivo</th>
                <th>Actualizado por</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `;

      this.showModal(html);
    } catch (error) {
      console.error('Error obteniendo historial de precios:', error);
      this.showAlert(`Error obteniendo historial de precios: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  async applyBulkIncrease() {
    const categorySelect = document.getElementById('categorySelect');
    const percentInput = document.getElementById('increasePercent');

    if (!percentInput) {
      return;
    }

    const percent = Number(percentInput.value);
    if (Number.isNaN(percent) || percent <= 0) {
      this.showAlert('Ingresa un porcentaje válido para aplicar el aumento.', 'warning');
      return;
    }

    const category = categorySelect?.value || null;
    const confirmMessage = category
      ? `¿Aplicar ${percent}% de aumento a la categoría "${category}"?`
      : `¿Aplicar ${percent}% de aumento a todos los productos?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      this.showLoading('Aplicando aumento masivo...');
      if (category) {
        const result = await this.productManager.applyPriceIncrease(category, percent, `Ajuste masivo ${percent}% - ${category}`);
        if (result?.success === false) {
          throw new Error(result.error || 'Error aplicando aumento.');
        }
      } else if (typeof window.applyInflationIncrease === 'function') {
        await window.applyInflationIncrease(percent);
      }

      this.showAlert('Aumento aplicado correctamente.', 'success');
      percentInput.value = '';
      await this.refreshData(false);
    } catch (error) {
      console.error('Error aplicando aumento:', error);
      this.showAlert(`Error aplicando aumento: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  async updateStock() {
    const productSelect = document.getElementById('stockProductSelect');
    const changeInput = document.getElementById('stockChange');
    const reasonInput = document.getElementById('stockReason');

    if (!productSelect || !changeInput) {
      return;
    }

    const productId = productSelect.value;
    const changeValue = Number(changeInput.value);
    const reason = reasonInput?.value?.trim() || 'Ajuste manual';

    if (!productId || Number.isNaN(changeValue) || changeValue === 0) {
      this.showAlert('Selecciona un producto y una cantidad válida para ajustar el stock.', 'warning');
      return;
    }

    try {
      this.showLoading('Actualizando inventario...');
      const result = await this.productManager.updateStock(productId, changeValue, reason);
      if (result?.success) {
        this.showAlert('Inventario actualizado correctamente.', 'success');
        changeInput.value = '';
        if (reasonInput) {
          reasonInput.value = '';
        }
        await this.refreshData(false);
      } else {
        const errorMessage = result?.error || 'No se pudo actualizar el inventario.';
        this.showAlert(`Error actualizando inventario: ${errorMessage}`, 'danger');
      }
    } catch (error) {
      console.error('Error actualizando inventario:', error);
      this.showAlert(`Error actualizando inventario: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  async restockProduct(productId, targetStock) {
    if (!productId) {
      return;
    }

    try {
      this.showLoading('Reabasteciendo producto...');
      const result = await this.productManager.restockProduct(productId, targetStock, 'Restock desde panel admin');
      if (result?.success) {
        this.showAlert(result?.message || 'Producto reabastecido correctamente.', 'success');
        await this.refreshData(false);
      } else {
        this.showAlert(result?.error || 'No se pudo reabastecer el producto.', 'danger');
      }
    } catch (error) {
      console.error('Error reabasteciendo producto:', error);
      this.showAlert(`Error reabasteciendo producto: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  async showLowStock() {
    try {
      this.showLoading('Cargando productos con stock bajo...');
      let lowStockProducts = [];

      if (typeof this.productManager.getLowStockProducts === 'function') {
        lowStockProducts = await this.productManager.getLowStockProducts();
      } else {
        lowStockProducts = (this.products || []).filter(product => (product.stock_kg || product.stock || 0) <= (product.min_stock_kg || product.min_stock || 0));
      }

      if (!lowStockProducts.length) {
        this.showAlert('¡Excelente! No hay productos con stock bajo.', 'success');
        return;
      }

      let rows = '';
      lowStockProducts.forEach(product => {
        rows += `
          <tr>
            <td>
              <div class="product-name">
                <i class="fas fa-apple-alt" style="color: #8bda01;"></i>
                ${this.escapeHtml(product.name)}
              </div>
            </td>
            <td><span class="product-category">${this.escapeHtml(product.category || 'Sin categoría')}</span></td>
            <td>
              <div class="stock-status">
                <span class="stock-low">
                  <i class="fas fa-exclamation-triangle"></i>
                  ${this.formatNumber(product.stock_kg || product.stock || 0)} kg
                </span>
              </div>
            </td>
            <td><span style="color: #666; font-weight: 500;">${this.formatNumber(product.min_stock_kg || product.min_stock || 0)} kg</span></td>
            <td>
              <button class="btn-sm btn-success" onclick="restockProduct(${product.id}, ${(product.min_stock_kg || product.min_stock || 0) * 2})">
                <i class="fas fa-plus"></i> Reabastecer
              </button>
            </td>
          </tr>
        `;
      });

      const html = `
        <h3>Productos con stock bajo (${lowStockProducts.length})</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock actual</th>
                <th>Stock mínimo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;

      this.showModal(html);
    } catch (error) {
      console.error('Error cargando productos con stock bajo:', error);
      this.showAlert(`Error cargando productos con stock bajo: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  async loadInventoryReport() {
    try {
      this.showLoading('Generando reporte de inventario...');
      let reportData = null;
      if (typeof this.productManager.getInventoryReport === 'function') {
        reportData = await this.productManager.getInventoryReport();
      }

      const report = reportData?.report || this.stats;
      const products = reportData?.products || this.products;

      if (!report || !products) {
        throw new Error('No se pudo generar el reporte de inventario.');
      }

      let categoryRows = '';
      Object.entries(report.categories || {}).forEach(([category, data]) => {
        categoryRows += `
          <tr>
            <td>
              <div class="product-name">
                <i class="fas fa-tags" style="color: #2a5298;"></i>
                <strong>${this.escapeHtml(category)}</strong>
              </div>
            </td>
            <td>${data.count} productos</td>
            <td>${this.formatNumber(data.totalStock)} kg</td>
            <td>${this.formatPrice(data.totalValue)}</td>
            <td>
              ${data.lowStock > 0
                ? `<span class="stock-low"><i class="fas fa-exclamation-triangle"></i> ${data.lowStock}</span>`
                : `<span class="stock-good"><i class="fas fa-check-circle"></i> 0</span>`}
            </td>
          </tr>
        `;
      });

      const html = `
        <h3>Reporte completo de inventario</h3>
        <div class="stats-grid mb-2">
          <div class="stat-card">
            <div class="value">${report.totalProducts}</div>
            <div class="label">Total productos</div>
          </div>
          <div class="stat-card">
            <div class="value">${report.lowStockCount}</div>
            <div class="label">Stock bajo</div>
          </div>
          <div class="stat-card">
            <div class="value">${this.formatPrice(report.totalValue)}</div>
            <div class="label">Valor total inventario</div>
          </div>
        </div>
        <h4>Detalle por categoría</h4>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Productos</th>
                <th>Stock total</th>
                <th>Valor</th>
                <th>Stock bajo</th>
              </tr>
            </thead>
            <tbody>${categoryRows}</tbody>
          </table>
        </div>
      `;

      this.showModal(html);
    } catch (error) {
      console.error('Error generando reporte de inventario:', error);
      this.showAlert(`Error generando reporte de inventario: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  async loadDailyReport() {
    try {
      this.showLoading('Generando reporte diario de precios...');
      let report = [];

      if (typeof this.productManager.getDailyPriceReport === 'function') {
        report = await this.productManager.getDailyPriceReport();
      }

      if (!Array.isArray(report) || !report.length) {
        this.showAlert('No hay cambios de precios registrados en las últimas 24 horas.', 'info');
        return;
      }

      let rows = '';
      report.forEach(entry => {
        const productName = entry.management_products?.name || entry.product_name || 'Producto';
        const category = entry.management_products?.category || entry.category || 'N/A';
        rows += `
          <tr>
            <td>${this.formatDate(entry.created_at)}</td>
            <td>${this.escapeHtml(productName)}</td>
            <td>${this.escapeHtml(category)}</td>
            <td>${this.formatPrice(entry.price_per_kg)}</td>
            <td>${entry.reason || 'Sin motivo'}</td>
            <td>${entry.updated_by || 'admin'}</td>
          </tr>
        `;
      });

      const html = `
        <h3>Reporte diario de actualizaciones de precios</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio (COP / kg)</th>
                <th>Motivo</th>
                <th>Actualizado por</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;

      this.showModal(html);
    } catch (error) {
      console.error('Error generando reporte diario:', error);
      this.showAlert(`Error generando reporte diario: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  async showAllProducts() {
    try {
      this.showLoading('Cargando catálogo completo...');
      const products = this.products || [];

      if (!products.length) {
        this.showAlert('No hay productos registrados en la base de datos.', 'info');
        return;
      }

      let rows = '';
      let totalValue = 0;
      let lowStockCount = 0;
      let activeCount = 0;

      products.forEach(product => {
        const stock = Number(product.stock_kg || product.stock || 0);
        const minStock = Number(product.min_stock_kg || product.min_stock || 0);
        const price = Number(product.price_per_kg || product.price || 0);
        const cost = Number(product.cost_per_kg || product.cost || 0);
        const isLow = stock <= minStock;
        const isActive = product.available !== false && product.is_active !== false;
        const safeName = this.escapeHtml(product.name);
        const safeCategory = this.escapeHtml(product.category || 'Sin categoría');
        const safeOrigin = this.escapeHtml(product.origin || 'Colombia');

        if (isLow) {
          lowStockCount += 1;
        }

        if (isActive) {
          activeCount += 1;
        }

        totalValue += stock * price;

        const statusClass = isLow ? 'stock-low' : 'stock-good';
        const statusIcon = isLow ? 'fa-exclamation-triangle' : 'fa-check-circle';
        const availabilityBadge = isActive
          ? '<span style="background: rgba(40, 167, 69, 0.12); color: #28a745; padding: 0.25rem 0.6rem; border-radius: 8px; font-weight: 600;"><i class="fas fa-check"></i> Disponible</span>'
          : '<span style="background: rgba(220, 53, 69, 0.12); color: #dc3545; padding: 0.25rem 0.6rem; border-radius: 8px; font-weight: 600;"><i class="fas fa-times"></i> No disponible</span>';

        const organicIcon = product.organic || product.is_organic
          ? '<i class="fas fa-leaf" style="color: #28a745; margin-left: 0.5rem;" title="Orgánico"></i>'
          : '';

        const escapedNameForJs = safeName.replace(/'/g, "\\'");

        rows += `
          <tr>
            <td>
              <div class="product-name">
                <i class="fas fa-apple-alt" style="color: #8bda01;"></i>
                ${safeName}
                ${organicIcon}
              </div>
              <small style="color: #666; margin-left: 1.5rem;">${safeOrigin}</small>
            </td>
            <td><span class="product-category">${safeCategory}</span></td>
            <td>
              <span class="price-display">${this.formatPrice(price)} / kg</span><br>
              <small style="color: #666;">Costo: ${this.formatPrice(cost)} / kg</small>
            </td>
            <td>
              <div class="stock-status">
                <span class="${statusClass}">
                  <i class="fas ${statusIcon}"></i>
                  ${this.formatNumber(stock)} kg
                </span>
              </div>
              <small style="color: #666;">Mín: ${this.formatNumber(minStock)} kg</small>
            </td>
            <td>${availabilityBadge}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-sm btn-info" onclick="editSelectedProductFromModal(${product.id})" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-sm btn-warning" onclick="updatePrice(${product.id})" title="Cambiar precio">
                  <i class="fas fa-tag"></i>
                </button>
                <button class="btn-sm btn-success" onclick="restockProduct(${product.id}, ${(minStock || 0) * 2})" title="Actualizar stock">
                  <i class="fas fa-boxes"></i>
                </button>
                <button class="btn-sm btn-danger" onclick="confirmDeleteProduct(${product.id}, '${escapedNameForJs}')" title="Eliminar producto">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      });

      const html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3>Catálogo completo (${products.length})</h3>
          <div class="action-buttons">
            <button class="btn-sm btn-success" onclick="addNewProduct()">
              <i class="fas fa-plus"></i> Nuevo producto
            </button>
            <button class="btn-sm btn-info" onclick="exportProducts()">
              <i class="fas fa-download"></i> Exportar
            </button>
          </div>
        </div>
        <div class="table-container" style="max-height: 600px;">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="stats-grid" style="margin-top: 1.5rem;">
          <div class="stat-card">
            <i class="fas fa-box"></i>
            <div class="value">${products.length}</div>
            <div class="label">Total productos</div>
          </div>
          <div class="stat-card">
            <i class="fas fa-check-circle"></i>
            <div class="value">${activeCount}</div>
            <div class="label">Activos</div>
          </div>
          <div class="stat-card">
            <i class="fas fa-exclamation-triangle"></i>
            <div class="value">${lowStockCount}</div>
            <div class="label">Stock bajo</div>
          </div>
          <div class="stat-card">
            <i class="fas fa-dollar-sign"></i>
            <div class="value">${this.formatPrice(totalValue)}</div>
            <div class="label">Valor total</div>
          </div>
        </div>
      `;

      this.showModal(html);

      // Vincular botón de edición dentro del modal
      window.editSelectedProductFromModal = productId => {
        this.closeModal();
        const manageSelect = document.getElementById('manageProductSelect');
        if (manageSelect) {
          manageSelect.value = String(productId);
        }
        this.editSelectedProduct(productId);
      };
    } catch (error) {
      console.error('Error cargando catálogo completo:', error);
      this.showAlert(`Error cargando catálogo completo: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  updatePrice(productId) {
    const select = document.getElementById('priceProductSelect');
    const priceInput = document.getElementById('newPrice');

    if (!select || !priceInput) {
      return;
    }

    select.value = String(productId);
    const product = this.getProductById(productId);
    if (product) {
      priceInput.value = Math.round(product.price_per_kg || product.price || 0);
      this.showAlert(`Preparado para actualizar el precio de ${this.escapeHtml(product.name)}.`, 'info');
    }

    this.closeModal();
  }

  showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    const form = document.getElementById('addProductForm');
    if (modal) {
      modal.style.display = 'none';
    }
    if (form) {
      form.reset();
      delete form.dataset.editingId;
    }
    this.editingProductId = null;
    const title = document.querySelector('#addProductModal .modal-header h3');
    const cta = document.querySelector('#addProductModal .btn-success');
    if (title) {
      title.innerHTML = '<i class="fas fa-plus-circle"></i> Agregar nuevo producto';
    }
    if (cta) {
      cta.innerHTML = '<i class="fas fa-plus"></i> Crear Producto';
    }
  }

  async handleAddProduct(event) {
    event.preventDefault();
    const form = event.target;

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      category: formData.get('category'),
      description: formData.get('description') || '',
      image_url: formData.get('image') || '/images/products/placeholder.jpg',
      price_per_kg: Number(formData.get('price')) || 0,
      cost_per_kg: Number(formData.get('cost')) || 0,
      stock_kg: Number(formData.get('stock')) || 0,
      min_stock_kg: Number(formData.get('minStock')) || 0,
      origin: formData.get('origin') || 'Colombia',
      supplier: formData.get('supplier') || null,
      rating: Number(formData.get('rating')) || 4.0,
      is_organic: formData.get('organic') === 'on',
      is_active: formData.get('active') === 'on'
    };

    if (!payload.name || !payload.category || payload.price_per_kg <= 0) {
      this.showAlert('Completa los campos obligatorios (nombre, categoría y precio).', 'warning');
      return;
    }

    try {
      this.showLoading(this.editingProductId ? 'Actualizando producto...' : 'Creando producto...');
      let result;

      if (this.editingProductId) {
        result = await window.updateCompleteProduct(this.editingProductId, payload);
      } else {
        result = await window.createProduct(payload);
      }

      if (result?.success === false) {
        throw new Error(result.error || 'Operación no realizada.');
      }

      this.showAlert(this.editingProductId ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.', 'success');
      this.closeAddProductModal();
      await this.refreshData(false);
    } catch (error) {
      console.error('Error guardando producto:', error);
      this.showAlert(`Error guardando producto: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  editSelectedProduct(forcedProductId = null) {
    const select = document.getElementById('manageProductSelect');
    const productId = forcedProductId || select?.value;

    if (!productId) {
      this.showAlert('Selecciona un producto para editar.', 'warning');
      return;
    }

    const product = this.getProductById(productId);
    if (!product) {
      this.showAlert('Producto no encontrado.', 'danger');
      return;
    }

    const form = document.getElementById('addProductForm');
    if (!form) {
      return;
    }

    form.dataset.editingId = productId;
    this.editingProductId = productId;

    form.querySelector('#productName').value = product.name || '';
    form.querySelector('#productCategory').value = product.category || '';
    form.querySelector('#productPrice').value = Math.round(product.price_per_kg || product.price || 0);
    form.querySelector('#productCost').value = product.cost_per_kg || product.cost || '';
    form.querySelector('#productStock').value = product.stock_kg || product.stock || '';
    form.querySelector('#productMinStock').value = product.min_stock_kg || product.min_stock || '';
    form.querySelector('#productOrigin').value = product.origin || 'Colombia';
    form.querySelector('#productSupplier').value = product.supplier || '';
    form.querySelector('#productRating').value = product.rating || 4;
    form.querySelector('#productDescription').value = product.description || '';
    form.querySelector('#productImage').value = product.image_url || '';
    form.querySelector('#productOrganic').checked = product.organic || product.is_organic || false;
    form.querySelector('#productActive').checked = product.available !== false && product.is_active !== false;

    const title = document.querySelector('#addProductModal .modal-header h3');
    const cta = document.querySelector('#addProductModal .btn-success');
    if (title) {
      title.innerHTML = '<i class="fas fa-edit"></i> Editar producto';
    }
    if (cta) {
      cta.innerHTML = '<i class="fas fa-save"></i> Guardar cambios';
    }

    this.showAddProductModal();
  }

  async deleteSelectedProduct() {
    const select = document.getElementById('manageProductSelect');
    const productId = select?.value;

    if (!productId) {
      this.showAlert('Selecciona un producto para eliminar.', 'warning');
      return;
    }

    const product = this.getProductById(productId);
    if (!product) {
      this.showAlert('Producto no encontrado.', 'danger');
      return;
    }

    this.confirmDeleteProduct(productId, product.name);
  }

  async confirmDeleteProduct(productId, productName) {
    if (!confirm(`¿Eliminar permanentemente "${productName}"?`)) {
      return;
    }

    try {
      this.showLoading('Eliminando producto...');
      const result = await window.deleteProduct(productId);

      if (result?.success === false) {
        throw new Error(result.error || 'No se pudo eliminar el producto.');
      }

      this.showAlert('Producto eliminado correctamente.', 'success');
      await this.refreshData(false);
    } catch (error) {
      console.error('Error eliminando producto:', error);
      this.showAlert(`Error eliminando producto: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  async updateProductStatus() {
    const select = document.getElementById('manageProductSelect');
    const statusSelect = document.getElementById('productStatus');

    if (!select || !statusSelect) {
      return;
    }

    const productId = select.value;
    const newStatus = statusSelect.value;

    if (!productId || !newStatus) {
      this.showAlert('Selecciona un producto y un estado.', 'warning');
      return;
    }

    try {
      this.showLoading('Actualizando estado del producto...');
      const isActive = newStatus === 'active';
      const result = await window.updateCompleteProduct(productId, {
        is_active: isActive,
        available: isActive
      });

      if (result?.success === false) {
        throw new Error(result.error || 'No se pudo actualizar el estado.');
      }

      this.showAlert('Estado del producto actualizado.', 'success');
      statusSelect.value = '';
      await this.refreshData(false);
    } catch (error) {
      console.error('Error actualizando estado del producto:', error);
      this.showAlert(`Error actualizando estado: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  async exportProducts() {
    try {
      this.showLoading('Generando archivo de exportación...');
      const csv = this.generateProductsCSV(this.products || []);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `productos_fruvi_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      this.showAlert('Archivo exportado correctamente.', 'success');
    } catch (error) {
      console.error('Error exportando productos:', error);
      this.showAlert(`Error exportando productos: ${error.message}`, 'danger');
    } finally {
      this.hideLoading();
    }
  }

  generateProductsCSV(products) {
    const headers = [
      'ID',
      'Nombre',
      'Categoría',
      'Precio (COP/kg)',
      'Costo (COP/kg)',
      'Stock (kg)',
      'Stock mínimo (kg)',
      'Orgánico',
      'Calificación',
      'Origen',
      'Activo'
    ];

    const rows = products.map(product => [
      product.id,
      `"${product.name}"`,
      `"${product.category}"`,
      Number(product.price_per_kg || product.price || 0),
      Number(product.cost_per_kg || product.cost || 0),
      Number(product.stock_kg || product.stock || 0),
      Number(product.min_stock_kg || product.min_stock || 0),
      product.organic || product.is_organic ? 'Sí' : 'No',
      Number(product.rating || 4.0),
      `"${product.origin || 'Colombia'}"`,
      product.available !== false && product.is_active !== false ? 'Sí' : 'No'
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }

  async importPricesFromCSV() {
    const fileInput = document.getElementById('csvFile');
    if (!fileInput || !fileInput.files.length) {
      this.showAlert('Selecciona un archivo CSV para importar.', 'warning');
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async event => {
      try {
        const csvData = event.target?.result;
        if (!csvData) {
          throw new Error('No se pudo leer el archivo CSV.');
        }

        this.showLoading('Importando precios desde CSV...');
        const result = await this.productManager.importPricesFromCSV(csvData, getAdminUser());

        if (result?.success === false) {
          throw new Error(result.error || 'No se pudo importar el archivo.');
        }

        this.showAlert('Precios importados correctamente.', 'success');
        fileInput.value = '';
        await this.refreshData(false);
      } catch (error) {
        console.error('Error importando CSV:', error);
        this.showAlert(`Error importando CSV: ${error.message}`, 'danger');
      } finally {
        this.hideLoading();
      }
    };

    reader.onerror = () => {
      this.showAlert('No se pudo leer el archivo CSV.', 'danger');
    };

    reader.readAsText(file, 'UTF-8');
  }

  showAlert(message, type = 'info') {
    const container = document.getElementById('reportContainer');
    if (!container) {
      console.log(`[${type}] ${message}`);
      return;
    }

    const icons = {
      success: 'check-circle',
      warning: 'exclamation-triangle',
      danger: 'times-circle',
      info: 'info-circle'
    };

    const icon = icons[type] || 'info-circle';

    container.innerHTML = `
      <div class="alert alert-${type}">
        <i class="fas fa-${icon}"></i>
        ${message}
      </div>
    `;
  }

  showLoading(message = 'Cargando...') {
    const container = document.getElementById('reportContainer');
    if (!container) {
      return;
    }

    container.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner"></i>
        ${message}
      </div>
    `;
  }

  hideLoading() {
    const container = document.getElementById('reportContainer');
    if (!container) {
      return;
    }

    container.innerHTML = `
      <p style="color: #666; text-align: center; padding: 2rem;">
        <i class="fas fa-info-circle"></i>
        Selecciona una acción para ver reportes.
      </p>
    `;
  }

  showModal(content) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    if (!modal || !modalContent) {
      console.warn('Modal no disponible');
      return;
    }

    modalContent.innerHTML = content;
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
  }

  closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.add('hidden');
    }
  }

  showEnvironmentInfo() {
    const instructions = `
      <h3>Configuración de Supabase</h3>
      <div style="line-height: 1.6; text-align: left;">
        <div style="background: rgba(139, 218, 1, 0.12); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <h4 style="color: #1e3c72; margin-bottom: 1rem;">
            <i class="fas fa-info-circle"></i> Sistema de doble base de datos
          </h4>
          <ul style="color: #666; margin-left: 1rem;">
            <li><strong>Base de usuarios:</strong> Maneja login, registro y perfiles.</li>
            <li><strong>Base de productos:</strong> Catálogo, precios e inventario.</li>
          </ul>
        </div>
        <h4 style="color: #1e3c72;">Variables necesarias</h4>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.9rem; margin: 1rem 0;">
          VITE_SUPABASE_PRODUCTS_URL<br>
          VITE_SUPABASE_PRODUCTS_ANON_KEY<br>
          VITE_SUPABASE_URL (usuarios)<br>
          VITE_SUPABASE_ANON_KEY (usuarios)
        </div>
        <p style="color: #666;">Para configurar Supabase sigue estos pasos:</p>
        <ol style="color: #666; padding-left: 1.25rem;">
          <li>Crea un proyecto en <a href="https://supabase.com/" target="_blank" rel="noopener" style="color: #8bda01;">supabase.com</a>.</li>
          <li>Obtén el <strong>Project URL</strong> y la <strong>anon public key</strong> desde Settings → API.</li>
          <li>Ejecuta en el SQL editor: <code>setup-supabase-products.sql</code> y luego <code>insert-colombian-fruits.sql</code> ubicados en <code>scripts/database/</code>.</li>
        </ol>
        <div style="background: #e8f5e8; border: 1px solid #4caf50; padding: 1rem; border-radius: 8px; margin-top: 1.5rem;">
          <strong>Listo:</strong> una vez completado, este panel administrará los precios e inventario en tiempo real.
        </div>
      </div>
    `;

    this.showModal(instructions);
  }

  updateConnectionStatus(state, message) {
    const container = document.getElementById('connectionStatus');
    if (!container) {
      return;
    }

    container.style.display = 'block';
    container.className = 'alert';

    if (state === 'success') {
      container.classList.add('alert-success');
    } else if (state === 'warning') {
      container.classList.add('alert-warning');
    } else if (state === 'error') {
      container.classList.add('alert-danger');
    }

    container.innerHTML = message;

    if (state === 'success') {
      setTimeout(() => {
        container.style.display = 'none';
      }, 6000);
    }
  }

  updateHeaderUserInfo() {
    const userInfo = document.getElementById('userInfo');
    if (!userInfo) {
      return;
    }

    const loginTimeRaw = localStorage.getItem('adminLoginTime');
    const loginDate = loginTimeRaw ? new Date(Number(loginTimeRaw)) : new Date();
    const username = getAdminUser();
    const timeString = loginDate.toLocaleTimeString();

    userInfo.innerHTML = `
      <span class="user-welcome">
        <i class="fas fa-user-shield"></i>
        Bienvenido, <strong>${this.escapeHtml(username)}</strong>
      </span>
      <span class="login-time">Sesión iniciada: ${timeString}</span>
    `;
  }

  formatPrice(value) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  formatNumber(value) {
    return new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  formatDate(dateString) {
    if (!dateString) {
      return '-';
    }
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  escapeHtml(value) {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
