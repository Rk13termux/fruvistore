/**
 * Store Management Module
 * Handles all product management operations
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

class StoreManagement {
    constructor() {
        this.products = [];
        this.selectedProductId = null;
        this.dbService = null;
    }

    async initialize(containerId = 'store-management-content') {
        try {
            // Check authentication first
            if (!checkAdminAuth()) {
                return; // Will redirect if not authenticated
            }

            console.log('🚀 Initializing Store Management...');

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

            // Load initial data
            await this.loadProducts();

            // Setup event listeners
            this.setupEventListeners();

            console.log('✅ Store Management initialized successfully');
        } catch (error) {
            console.error('❌ Store Management initialization failed:', error);
            this.showAlert('Error inicializando gestión de productos: ' + error.message, 'danger');
        }
    }

    renderInterface(container) {
        container.innerHTML = `
            <!-- Management Header -->
            <div class="management-header">
                <div class="header-title">
                    <h1><i class="fas fa-store"></i> Gestión de Tienda</h1>
                    <p>Administra productos, precios y stock</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-info" onclick="storeManagement.refreshProducts()">
                        <i class="fas fa-sync-alt"></i> Actualizar
                    </button>
                </div>
            </div>

            <!-- Alert Container -->
            <div id="alertContainer"></div>

            <!-- Quick Stats -->
            <div id="storeStats" class="stats-grid">
                <!-- Stats will be populated here -->
            </div>

            <!-- Price Management Section -->
            <div class="management-section">
                <h3><i class="fas fa-tag"></i> Gestión de Precios</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="priceProductSelect">Producto</label>
                        <select id="priceProductSelect" class="form-control" onchange="storeManagement.handlePriceProductChange()">
                            <option value="">Cargando productos...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="newPrice">Nuevo Precio (COP/kg)</label>
                        <input type="number" id="newPrice" class="form-control" min="100" step="100">
                    </div>
                    <div class="form-group">
                        <label for="priceReason">Motivo</label>
                        <input type="text" id="priceReason" class="form-control" placeholder="Actualización manual">
                    </div>
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <div class="button-group">
                            <button class="btn btn-success" onclick="storeManagement.updateSinglePrice()">
                                <i class="fas fa-save"></i> Actualizar Precio
                            </button>
                            <button class="btn btn-info" onclick="storeManagement.viewPriceHistory()">
                                <i class="fas fa-history"></i> Ver Historial
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stock Management Section -->
            <div class="management-section">
                <h3><i class="fas fa-boxes"></i> Gestión de Inventario</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="stockProductSelect">Producto</label>
                        <select id="stockProductSelect" class="form-control" onchange="storeManagement.handleStockProductChange()">
                            <option value="">Cargando productos...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="stockChange">Cambio de Stock</label>
                        <input type="number" id="stockChange" class="form-control" step="1" placeholder="Ej: 50 o -10">
                    </div>
                    <div class="form-group">
                        <label for="stockReason">Motivo</label>
                        <input type="text" id="stockReason" class="form-control" placeholder="Ajuste manual">
                    </div>
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <button class="btn btn-success" onclick="storeManagement.updateStock()">
                            <i class="fas fa-save"></i> Actualizar Stock
                        </button>
                    </div>
                </div>
                <div id="currentStock" class="info-display"></div>
            </div>

            <!-- Bulk Operations Section -->
            <div class="management-section">
                <h3><i class="fas fa-magic"></i> Operaciones Masivas</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="categorySelect">Categoría</label>
                        <select id="categorySelect" class="form-control">
                            <option value="">Todas las categorías</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="increasePercent">Porcentaje de Aumento</label>
                        <input type="number" id="increasePercent" class="form-control" min="0" step="0.1" placeholder="5.0">
                    </div>
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <button class="btn btn-warning" onclick="storeManagement.applyBulkIncrease()">
                            <i class="fas fa-arrow-up"></i> Aplicar Aumento Masivo
                        </button>
                    </div>
                </div>
            </div>

            <!-- Product Management Section -->
            <div class="management-section">
                <h3><i class="fas fa-cogs"></i> Gestión de Productos</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="manageProductSelect">Producto</label>
                        <select id="manageProductSelect" class="form-control" onchange="storeManagement.handleManageProductChange()">
                            <option value="">Cargando productos...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="productStatus">Estado</label>
                        <select id="productStatus" class="form-control">
                            <option value="active">Activar</option>
                            <option value="inactive">Desactivar</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <div class="button-group">
                            <button class="btn btn-info" onclick="storeManagement.editSelectedProduct()">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-danger" onclick="storeManagement.deleteSelectedProduct()">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                            <button class="btn btn-success" onclick="storeManagement.updateProductStatus()">
                                <i class="fas fa-toggle-on"></i> Cambiar Estado
                            </button>
                        </div>
                    </div>
                </div>
                <div id="productDetails" class="info-display"></div>
            </div>

            <!-- Reports Section -->
            <div class="management-section">
                <h3><i class="fas fa-chart-bar"></i> Reportes</h3>
                <div class="action-buttons">
                    <button class="btn btn-info" onclick="storeManagement.showLowStock()">
                        <i class="fas fa-exclamation-triangle"></i> Stock Bajo
                    </button>
                    <button class="btn btn-primary" onclick="storeManagement.loadInventoryReport()">
                        <i class="fas fa-file-alt"></i> Reporte de Inventario
                    </button>
                    <button class="btn btn-secondary" onclick="storeManagement.loadDailyReport()">
                        <i class="fas fa-calendar-day"></i> Reporte Diario
                    </button>
                    <button class="btn btn-success" onclick="storeManagement.showAllProducts()">
                        <i class="fas fa-list"></i> Catálogo Completo
                    </button>
                    <button class="btn btn-warning" onclick="storeManagement.exportProducts()">
                        <i class="fas fa-download"></i> Exportar CSV
                    </button>
                </div>
            </div>

            <!-- Products Table -->
            <div class="management-section">
                <h3><i class="fas fa-table"></i> Productos Recientes</h3>
                <div class="table-container">
                    <table id="productsTableContainer" class="data-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Precio / kg</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="6" style="text-align: center; color: #666;">
                                    <i class="fas fa-spinner fa-spin"></i> Cargando productos...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal -->
            <div id="modal" class="modal" style="display: none;">
                <div class="modal-overlay" onclick="storeManagement.closeModal()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Modal</h3>
                        <button onclick="storeManagement.closeModal()" class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="modalContent" class="modal-body"></div>
                </div>
            </div>
        `;
    }

    async loadProducts() {
        try {
            this.showLoading('Cargando productos...');
            this.products = await this.dbService.getAllProducts();
            this.renderProductsTable();
            this.populateSelectors();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading products:', error);
            this.hideLoading();
            this.showAlert('Error cargando productos: ' + error.message, 'danger');
        }
    }

    setupEventListeners() {
        // Event listeners are now handled by onclick attributes in the rendered HTML
        // This method can be used for any additional dynamic event binding if needed
    }

    // ===== PRICE MANAGEMENT =====

    async updateSinglePrice() {
        const productSelect = document.getElementById('priceProductSelect');
        const priceInput = document.getElementById('newPrice');
        const reasonInput = document.getElementById('priceReason');

        if (!productSelect || !priceInput) return;

        const productId = productSelect.value;
        const newPrice = Number(priceInput.value);
        const reason = reasonInput?.value?.trim() || 'Actualización manual';

        if (!productId || Number.isNaN(newPrice) || newPrice <= 0) {
            this.showAlert('Por favor selecciona un producto y un precio válido.', 'warning');
            return;
        }

        try {
            this.showLoading('Actualizando precio...');
            const result = await this.dbService.updateProductPrice(productId, newPrice, reason, this.getAdminUser());

            // Si result existe (no es null/undefined), la operación fue exitosa
            if (result) {
                this.showAlert('Precio actualizado correctamente.', 'success');
                await this.loadProducts();
                priceInput.value = '';
                if (reasonInput) reasonInput.value = '';
            } else {
                this.showAlert('Error actualizando precio: No se recibió respuesta del servidor.', 'danger');
            }
        } catch (error) {
            console.error('Error updating price:', error);
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
            // Note: This would need to be implemented in the database service
            // For now, show a placeholder
            this.showAlert('Funcionalidad de historial de precios próximamente disponible.', 'info');
        } catch (error) {
            console.error('Error loading price history:', error);
            this.showAlert(`Error obteniendo historial de precios: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async applyBulkIncrease() {
        const categorySelect = document.getElementById('categorySelect');
        const percentInput = document.getElementById('increasePercent');

        if (!percentInput) return;

        const percent = Number(percentInput.value);
        if (Number.isNaN(percent) || percent <= 0) {
            this.showAlert('Ingresa un porcentaje válido para aplicar el aumento.', 'warning');
            return;
        }

        const category = categorySelect?.value || null;
        const confirmMessage = category
            ? `¿Aplicar ${percent}% de aumento a la categoría "${category}"?`
            : `¿Aplicar ${percent}% de aumento a todos los productos?`;

        if (!confirm(confirmMessage)) return;

        try {
            this.showLoading('Aplicando aumento masivo...');
            // Note: This would need to be implemented in the database service
            // For now, show a placeholder
            this.showAlert('Funcionalidad de aumento masivo próximamente disponible.', 'info');
        } catch (error) {
            console.error('Error applying bulk increase:', error);
            this.showAlert(`Error aplicando aumento: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    // ===== STOCK MANAGEMENT =====

    async updateStock() {
        const productSelect = document.getElementById('stockProductSelect');
        const changeInput = document.getElementById('stockChange');
        const reasonInput = document.getElementById('stockReason');

        if (!productSelect || !changeInput) return;

        const productId = productSelect.value;
        const changeValue = Number(changeInput.value);
        const reason = reasonInput?.value?.trim() || 'Ajuste manual';

        if (!productId || Number.isNaN(changeValue) || changeValue === 0) {
            this.showAlert('Ingresa una cantidad válida diferente de cero.', 'warning');
            return;
        }

        try {
            this.showLoading('Actualizando inventario...');
            const result = await this.dbService.updateStock(productId, changeValue, reason);

            // Si result existe, la operación fue exitosa
            if (result) {
                this.showAlert('Inventario actualizado correctamente.', 'success');
                changeInput.value = '';
                if (reasonInput) reasonInput.value = '';
                await this.loadProducts();
            } else {
                this.showAlert('Error actualizando inventario: No se recibió respuesta del servidor.', 'danger');
            }
        } catch (error) {
            console.error('Error updating stock:', error);
            this.showAlert(`Error actualizando inventario: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    // ===== PRODUCT MANAGEMENT =====

    async editSelectedProduct() {
        const select = document.getElementById('manageProductSelect');
        const productId = select?.value;

        if (!productId) {
            this.showAlert('Selecciona un producto para editar.', 'warning');
            return;
        }

        const product = this.getProductById(productId);
        if (!product) {
            this.showAlert('Producto no encontrado.', 'danger');
            return;
        }

        // Populate form with product data
        this.populateProductForm(product);
        this.showAlert(`Preparado para editar: ${product.name}`, 'info');
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

        if (!confirm(`¿Eliminar permanentemente "${product.name}"?`)) return;

        try {
            this.showLoading('Eliminando producto...');
            const result = await this.dbService.deleteProduct(productId);

            // Si result es true o existe, la operación fue exitosa
            if (result) {
                this.showAlert('Producto eliminado correctamente.', 'success');
                await this.loadProducts();
            } else {
                this.showAlert('No se pudo eliminar el producto.', 'danger');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showAlert(`Error eliminando producto: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async updateProductStatus() {
        const select = document.getElementById('manageProductSelect');
        const statusSelect = document.getElementById('productStatus');

        if (!select || !statusSelect) return;

        const productId = select.value;
        const newStatus = statusSelect.value;

        if (!productId || !newStatus) {
            this.showAlert('Selecciona un producto y un estado.', 'warning');
            return;
        }

        try {
            this.showLoading('Actualizando estado del producto...');
            const isActive = newStatus === 'active';
            const result = await this.dbService.updateCompleteProduct(productId, {
                is_active: isActive
            });

            // Si result existe, la operación fue exitosa
            if (result) {
                this.showAlert('Estado del producto actualizado.', 'success');
                statusSelect.value = '';
                await this.loadProducts();
            } else {
                this.showAlert('No se pudo actualizar el estado.', 'danger');
            }
        } catch (error) {
            console.error('Error updating product status:', error);
            this.showAlert(`Error actualizando estado: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    // ===== REPORTS =====

    async showLowStock() {
        try {
            this.showLoading('Cargando productos con stock bajo...');
            const lowStockProducts = await this.dbService.getLowStockProducts();

            if (!lowStockProducts.length) {
                this.showAlert('¡Excelente! No hay productos con stock bajo.', 'success');
                return;
            }

            this.renderLowStockModal(lowStockProducts);
        } catch (error) {
            console.error('Error loading low stock products:', error);
            this.showAlert(`Error cargando productos con stock bajo: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async loadInventoryReport() {
        try {
            this.showLoading('Generando reporte de inventario...');
            const { report, products } = await this.dbService.getInventoryReport();

            if (!report || !products) {
                throw new Error('No se pudo generar el reporte de inventario.');
            }

            this.renderInventoryReportModal(report, products);
        } catch (error) {
            console.error('Error generating inventory report:', error);
            this.showAlert(`Error generando reporte de inventario: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async loadDailyReport() {
        try {
            this.showLoading('Generando reporte diario de precios...');
            const report = await this.dbService.getDailyPriceReport();

            if (!Array.isArray(report) || !report.length) {
                this.showAlert('No hay cambios de precios registrados en las últimas 24 horas.', 'info');
                return;
            }

            this.renderDailyReportModal(report);
        } catch (error) {
            console.error('Error generating daily report:', error);
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

            this.renderAllProductsModal(products);
        } catch (error) {
            console.error('Error loading all products:', error);
            this.showAlert(`Error cargando catálogo completo: ${error.message}`, 'danger');
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
            console.error('Error exporting products:', error);
            this.showAlert(`Error exportando productos: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async importPricesFromCSV() {
        const fileInput = document.getElementById('csvFile');
        if (!fileInput || !fileInput.files.length) {
            this.showAlert('Selecciona un archivo CSV para importar.', 'warning');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const csvData = event.target?.result;
                if (!csvData) {
                    throw new Error('No se pudo leer el archivo CSV.');
                }

                this.showLoading('Importando precios desde CSV...');
                // Note: This would need to be implemented in the database service
                this.showAlert('Funcionalidad de importación próximamente disponible.', 'info');
            } catch (error) {
                console.error('Error importing CSV:', error);
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

    // ===== UTILITY METHODS =====

    getProductById(productId) {
        if (!productId) return null;
        return this.products.find(product => String(product.id) === String(productId)) || null;
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
        if (!priceSelect || !priceInput) return;

        const product = this.getProductById(priceSelect.value);
        if (product) {
            priceInput.value = Math.round(product.price_per_kg || product.price || 0);
        }
    }

    prefillStockFields() {
        const stockSelect = document.getElementById('stockProductSelect');
        const infoContainer = document.getElementById('currentStock');

        if (!stockSelect || !infoContainer) return;

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

    loadProductDetails() {
        const select = document.getElementById('manageProductSelect');
        const detailsContainer = document.getElementById('productDetails');

        if (!select || !detailsContainer) return;

        const product = this.getProductById(select.value);
        if (!product) {
            detailsContainer.innerHTML = '<p style="color: #666;">Selecciona un producto para ver detalles.</p>';
            return;
        }

        detailsContainer.innerHTML = `
            <div class="product-details">
                <h4>${this.escapeHtml(product.name)}</h4>
                <p><strong>Categoría:</strong> ${this.escapeHtml(product.category || 'Sin categoría')}</p>
                <p><strong>Precio:</strong> ${this.formatPrice(product.price_per_kg || product.price || 0)} / kg</p>
                <p><strong>Stock:</strong> ${this.formatNumber(product.stock_kg || product.stock || 0)} kg</p>
                <p><strong>Estado:</strong> ${product.available !== false && product.is_active !== false ? 'Activo' : 'Inactivo'}</p>
            </div>
        `;
    }

    populateProductForm(product) {
        // This would populate a form for editing product details
        // Implementation depends on the specific form structure
        console.log('Populating form for product:', product);
    }

    // ===== MODAL RENDERING =====

    renderLowStockModal(products) {
        let rows = '';
        products.forEach(product => {
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
                        <button class="btn-sm btn-success" onclick="storeManagement.restockProduct(${product.id}, ${(product.min_stock_kg || product.min_stock || 0) * 2})">
                            <i class="fas fa-plus"></i> Reabastecer
                        </button>
                    </td>
                </tr>
            `;
        });

        const html = `
            <h3>Productos con stock bajo (${products.length})</h3>
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
    }

    renderInventoryReportModal(report, products) {
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
    }

    renderDailyReportModal(report) {
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
    }

    renderAllProductsModal(products) {
        let rows = '';
        let totalValue = 0;
        let lowStockCount = 0;
        let activeCount = 0;

        products.forEach(product => {
            const stock = Number(product.stock_kg || product.stock || 0);
            const minStock = Number(product.min_stock_kg || product.min_stock || 0);
            const price = Number(product.price_per_kg || product.price || 0);
            const isLow = stock <= minStock;
            const isActive = product.available !== false && product.is_active !== false;

            if (isLow) lowStockCount += 1;
            if (isActive) activeCount += 1;
            totalValue += stock * price;

            const statusClass = isLow ? 'stock-low' : 'stock-good';
            const statusIcon = isLow ? 'fa-exclamation-triangle' : 'fa-check-circle';
            const availabilityBadge = isActive
                ? '<span style="background: rgba(40, 167, 69, 0.12); color: #28a745; padding: 0.25rem 0.6rem; border-radius: 8px; font-weight: 600;"><i class="fas fa-check"></i> Disponible</span>'
                : '<span style="background: rgba(220, 53, 69, 0.12); color: #dc3545; padding: 0.25rem 0.6rem; border-radius: 8px; font-weight: 600;"><i class="fas fa-times"></i> No disponible</span>';

            rows += `
                <tr>
                    <td>
                        <div class="product-name">
                            <i class="fas fa-apple-alt" style="color: #8bda01;"></i>
                            ${this.escapeHtml(product.name)}
                        </div>
                        <small style="color: #666; margin-left: 1.5rem;">${this.escapeHtml(product.origin || 'Colombia')}</small>
                    </td>
                    <td><span class="product-category">${this.escapeHtml(product.category || 'Sin categoría')}</span></td>
                    <td>
                        <span class="price-display">${this.formatPrice(price)} / kg</span>
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
                            <button class="btn-sm btn-info" onclick="storeManagement.editSelectedProductFromModal(${product.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-sm btn-warning" onclick="storeManagement.updatePrice(${product.id})">
                                <i class="fas fa-tag"></i>
                            </button>
                            <button class="btn-sm btn-success" onclick="storeManagement.restockProduct(${product.id}, ${(minStock || 0) * 2})">
                                <i class="fas fa-boxes"></i>
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
                    <button class="btn-sm btn-success" onclick="storeManagement.addNewProduct()">
                        <i class="fas fa-plus"></i> Nuevo producto
                    </button>
                    <button class="btn-sm btn-info" onclick="storeManagement.exportProducts()">
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
    }

    renderProductsTable() {
        const container = document.getElementById('productsTableContainer');
        if (!container) return;

        let rows = '';
        this.products.slice(0, 50).forEach(product => {
            const stock = Number(product.stock_kg || product.stock || 0);
            const minStock = Number(product.min_stock_kg || product.min_stock || 0);
            const price = Number(product.price_per_kg || product.price || 0);
            const isLow = stock <= minStock;
            const isActive = product.available !== false && product.is_active !== false;

            const statusClass = isLow ? 'stock-low' : 'stock-good';
            const statusIcon = isLow ? 'fa-exclamation-triangle' : 'fa-check-circle';

            rows += `
                <tr>
                    <td>${this.escapeHtml(product.name)}</td>
                    <td>${this.escapeHtml(product.category || 'Sin categoría')}</td>
                    <td>${this.formatPrice(price)}</td>
                    <td>
                        <span class="${statusClass}">
                            <i class="fas ${statusIcon}"></i>
                            ${this.formatNumber(stock)} kg
                        </span>
                    </td>
                    <td>${isActive ? 'Activo' : 'Inactivo'}</td>
                    <td>
                        <button class="btn-sm btn-info" onclick="storeManagement.editSelectedProductFromModal(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Precio / kg</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }

    // ===== UTILITY METHODS =====

    showAlert(message, type = 'info') {
        const container = document.getElementById('alertContainer');
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
        // Loading animations disabled for better UX
        // Operations happen instantly without visual interruption
        return;
    }

    hideLoading() {
        // Loading animations disabled for better UX
        return;
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
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(value) {
        if (value === null || value === undefined) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
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

    getAdminUser() {
        return localStorage.getItem('adminUser') || 'admin';
    }

    refreshProducts() {
        this.loadProducts();
    }

    // ===== EVENT HANDLERS FOR ONCLICK ATTRIBUTES =====

    handlePriceProductChange() {
        this.prefillPriceFields();
    }

    handleStockProductChange() {
        this.prefillStockFields();
    }

    handleManageProductChange() {
        this.loadProductDetails();
    }

    // ===== ADDITIONAL METHODS =====

    editSelectedProductFromModal(productId) {
        this.closeModal();
        const manageSelect = document.getElementById('manageProductSelect');
        if (manageSelect) {
            manageSelect.value = String(productId);
        }
        this.editSelectedProduct();
    }

    updatePrice(productId) {
        const select = document.getElementById('priceProductSelect');
        const priceInput = document.getElementById('newPrice');

        if (!select || !priceInput) return;

        select.value = String(productId);
        const product = this.getProductById(productId);
        if (product) {
            priceInput.value = Math.round(product.price_per_kg || product.price || 0);
            this.showAlert(`Preparado para actualizar el precio de ${this.escapeHtml(product.name)}.`, 'info');
        }

        this.closeModal();
    }

    restockProduct(productId, targetStock) {
        if (!productId) return;

        // This would trigger the restock functionality
        console.log(`Restocking product ${productId} to ${targetStock}`);
        this.showAlert('Funcionalidad de reabastecimiento próximamente disponible.', 'info');
    }

    addNewProduct() {
        this.closeModal();
        // This would open the add product modal
        console.log('Add new product functionality');
        this.showAlert('Funcionalidad de agregar producto próximamente disponible.', 'info');
    }
}

// Create and export singleton instance
const storeManagement = new StoreManagement();
window.storeManagement = storeManagement;

export default storeManagement;