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
        this.editingProductId = null;
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

            <!-- Create/Edit Product Form Section -->
            <div class="management-section">
                <h3>
                    <i class="fas fa-plus-circle"></i> 
                    <span id="formTitle">Crear Nuevo Producto</span>
                </h3>
                <button class="btn btn-primary" onclick="storeManagement.toggleProductForm()" id="toggleFormBtn">
                    <i class="fas fa-plus"></i> Mostrar Formulario
                </button>
                
                <div id="productFormContainer" style="display: none; margin-top: 20px;">
                    <div class="form-grid" style="grid-template-columns: repeat(3, 1fr);">
                        <div class="form-group">
                            <label for="newProductName">Nombre del Producto *</label>
                            <input type="text" id="newProductName" class="form-control" placeholder="Ej: Mango Ataulfo" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="newProductCategory">Categoría *</label>
                            <select id="newProductCategory" class="form-control" required>
                                <option value="">Seleccionar...</option>
                                <option value="Bayas">Bayas</option>
                                <option value="Bananos">Bananos</option>
                                <option value="Cítricos">Cítricos</option>
                                <option value="Frutas de Clima Frío">Frutas de Clima Frío</option>
                                <option value="Frutas Tropicales">Frutas Tropicales</option>
                                <option value="Frutas Exóticas">Frutas Exóticas</option>
                                <option value="Melones y Sandías">Melones y Sandías</option>
                                <option value="Uvas">Uvas</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="newProductImage">Nombre de Imagen *</label>
                            <input type="text" id="newProductImage" class="form-control" placeholder="Ej: mango-ataulfo.png" required>
                            <small style="color: #666;">Solo el nombre del archivo en /public/images/products/</small>
                        </div>
                    </div>
                    
                    <div class="form-grid" style="grid-template-columns: 1fr 2fr;">
                        <div>
                            <div class="form-group">
                                <label for="newProductPrice">Precio/kg (COP) *</label>
                                <input type="number" id="newProductPrice" class="form-control" step="100" min="0" placeholder="5000" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="newProductCost">Costo/kg (COP)</label>
                                <input type="number" id="newProductCost" class="form-control" step="100" min="0" placeholder="3000">
                            </div>
                            
                            <div class="form-group">
                                <label for="newProductStock">Stock (kg)</label>
                                <input type="number" id="newProductStock" class="form-control" step="0.1" min="0" placeholder="0" value="0">
                            </div>
                            
                            <div class="form-group">
                                <label for="newProductOrigin">Origen</label>
                                <input type="text" id="newProductOrigin" class="form-control" placeholder="Colombia" value="Colombia">
                            </div>
                            
                            <div class="form-group">
                                <label for="newProductSeason">Temporada</label>
                                <input type="text" id="newProductSeason" class="form-control" placeholder="Ej: Junio-Agosto">
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="newProductOrganic">
                                    Producto Orgánico
                                </label>
                            </div>
                        </div>
                        
                        <div>
                            <div class="form-group">
                                <label for="newProductDescription">Descripción</label>
                                <textarea id="newProductDescription" class="form-control" rows="6" placeholder="Descripción del producto..."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>Vista Previa de Imagen</label>
                                <div id="imagePreview" style="border: 2px dashed #ddd; border-radius: 8px; padding: 20px; text-align: center; min-height: 200px; background: #f8f9fa;">
                                    <i class="fas fa-image" style="font-size: 48px; color: #ddd;"></i>
                                    <p style="color: #999; margin-top: 10px;">La imagen aparecerá aquí</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="button-group" style="margin-top: 20px;">
                        <button class="btn btn-success" onclick="storeManagement.saveProduct()" id="saveProductBtn">
                            <i class="fas fa-save"></i> <span id="saveBtnText">Crear Producto</span>
                        </button>
                        <button class="btn btn-secondary" onclick="storeManagement.cancelProductForm()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Product Management Section -->
            <div class="management-section">
                <h3><i class="fas fa-cogs"></i> Gestión de Productos Existentes</h3>
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

            <!-- Products Table with Tabs -->
            <div class="management-section">
                <div class="products-tabs-header">
                    <h3><i class="fas fa-table"></i> Catálogo de Productos</h3>
                    <div class="tabs-navigation">
                        <button class="tab-btn active" data-tab="active" onclick="storeManagement.switchTab('active')">
                            <i class="fas fa-check-circle"></i> 
                            Productos Activos
                            <span class="tab-badge" id="activeCount">0</span>
                        </button>
                        <button class="tab-btn" data-tab="inactive" onclick="storeManagement.switchTab('inactive')">
                            <i class="fas fa-pause-circle"></i> 
                            Productos Inactivos
                            <span class="tab-badge inactive" id="inactiveCount">0</span>
                        </button>
                    </div>
                </div>

                <!-- Active Products Tab -->
                <div id="activeProductsTab" class="tab-content active">
                    <div class="info-box">
                        <i class="fas fa-info-circle"></i>
                        <div class="message-content">
                            <strong>Productos Activos</strong>
                            <p>Estos productos están visibles en la tienda y disponibles para venta.</p>
                        </div>
                    </div>
                    <div class="table-container">
                        <table id="activeProductsTable" class="data-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio / kg</th>
                                    <th>Stock</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="5" style="text-align: center; color: #666;">
                                        <i class="fas fa-spinner fa-spin"></i> Cargando productos...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Inactive Products Tab -->
                <div id="inactiveProductsTab" class="tab-content">
                    <div class="info-box">
                        <i class="fas fa-pause-circle"></i>
                        <div class="message-content">
                            <strong>Productos Inactivos</strong>
                            <p>Estos productos están ocultos de la tienda. Útil cuando están fuera de temporada o escasos en el mercado.</p>
                        </div>
                    </div>
                    
                    <!-- Buscador de productos inactivos -->
                    <div class="search-box" style="margin-bottom: 1rem;">
                        <input 
                            type="text" 
                            id="inactiveSearchInput" 
                            placeholder="🔍 Buscar en productos inactivos (nombre, categoría)..." 
                            style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;"
                            oninput="storeManagement.searchInactiveProducts(this.value)"
                        />
                    </div>

                    <div class="table-container">
                        <table id="inactiveProductsTable" class="data-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio / kg</th>
                                    <th>Motivo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="5" style="text-align: center; color: #666;">
                                        <i class="fas fa-spinner fa-spin"></i> Cargando productos...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
            console.log('📥 Cargando productos desde la base de datos...');
            this.showLoading('Cargando productos...');
            this.products = await this.dbService.getAllProducts();
            
            console.log('✅ Productos cargados:', {
                total: this.products.length,
                primeros_3: this.products.slice(0, 3).map(p => ({
                    id: p.id,
                    nombre: p.name,
                    is_active: p.is_active,
                    available: p.available
                }))
            });
            
            this.renderProductsTable();
            this.populateSelectors();
            this.hideLoading();
        } catch (error) {
            console.error('❌ Error loading products:', error);
            this.hideLoading();
            this.showAlert('Error cargando productos: ' + error.message, 'danger');
        }
    }

    setupEventListeners() {
        // Event listeners are now handled by onclick attributes in the rendered HTML
        // This method can be used for any additional dynamic event binding if needed
        
        // Add image preview listener
        const imageInput = document.getElementById('newProductImage');
        if (imageInput) {
            imageInput.addEventListener('input', (e) => {
                this.updateImagePreview(e.target.value);
            });
        }
    }

    // ===== PRODUCT CRUD METHODS =====

    toggleProductForm() {
        const container = document.getElementById('productFormContainer');
        const btn = document.getElementById('toggleFormBtn');
        
        if (container.style.display === 'none') {
            container.style.display = 'block';
            btn.innerHTML = '<i class="fas fa-minus"></i> Ocultar Formulario';
        } else {
            container.style.display = 'none';
            btn.innerHTML = '<i class="fas fa-plus"></i> Mostrar Formulario';
            this.cancelProductForm();
        }
    }

    updateImagePreview(filename) {
        const preview = document.getElementById('imagePreview');
        if (!preview) return;
        
        if (!filename || filename.trim() === '') {
            preview.innerHTML = '<i class="fas fa-image" style="font-size: 48px; color: #ddd;"></i><p style="color: #999; margin-top: 10px;">La imagen aparecerá aquí</p>';
            return;
        }
        
        const imagePath = `/images/products/${filename.trim()}`;
        preview.innerHTML = `<img src="${imagePath}" alt="Preview" style="max-width: 100%; max-height: 200px; object-fit: contain;" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-exclamation-triangle\\' style=\\'font-size:48px;color:#dc3545;\\'></i><p style=\\'color:#dc3545;margin-top:10px;\\'>Imagen no encontrada</p>'">`;
    }

    async saveProduct() {
        console.log('🔵 saveProduct() llamado');
        console.log('🔵 dbService existe:', !!this.dbService);
        console.log('🔵 editingProductId:', this.editingProductId);
        
        // Validate required fields
        const name = document.getElementById('newProductName')?.value?.trim();
        let category = document.getElementById('newProductCategory')?.value;
        const image = document.getElementById('newProductImage')?.value?.trim();
        const price = parseFloat(document.getElementById('newProductPrice')?.value);
        
        // Si categoría está vacía, usar valor por defecto
        if (!category) {
            category = 'Frutas Exóticas';
            console.log('⚠️ Categoría vacía, usando: Frutas Exóticas');
        }
        
        console.log('🔵 Valores del formulario:', { name, category, image, price });

        if (!name || !image || !price || price <= 0) {
            console.log('🔴 Validación fallida');
            this.showAlert('Por favor completa todos los campos obligatorios (*)', 'warning');
            return;
        }
        
        console.log('✅ Validación pasada');

        const productData = {
            name,
            category,
            description: document.getElementById('newProductDescription')?.value?.trim() || '',
            image_url: `/images/products/${image}`,
            price_per_kg: price,
            cost_per_kg: parseFloat(document.getElementById('newProductCost')?.value) || 0,
            stock_kg: parseFloat(document.getElementById('newProductStock')?.value) || 0,
            origin: document.getElementById('newProductOrigin')?.value?.trim() || 'Colombia',
            season: document.getElementById('newProductSeason')?.value?.trim() || null,
            is_organic: document.getElementById('newProductOrganic')?.checked || false,
            is_active: true
        };
        
        console.log('🔵 productData preparado:', productData);

        try {
            this.showLoading(this.editingProductId ? 'Actualizando producto...' : 'Creando producto...');
            
            console.log('🔵 Llamando a', this.editingProductId ? 'updateCompleteProduct' : 'createProduct');

            let result;
            if (this.editingProductId) {
                // Update existing product
                result = await this.dbService.updateCompleteProduct(this.editingProductId, productData);
            } else {
                // Create new product
                result = await this.dbService.createProduct(productData);
            }
            
            console.log('✅ Resultado:', result);

            if (result) {
                this.showAlert(this.editingProductId ? 'Producto actualizado correctamente' : 'Producto creado correctamente', 'success');
                this.cancelProductForm();
                await this.loadProducts();
            } else {
                console.log('🔴 No hay resultado');
                this.showAlert('Error guardando producto', 'danger');
            }
        } catch (error) {
            console.error('🔴 Error saving product:', error);
            this.showAlert(`Error: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    cancelProductForm() {
        // Clear all form fields
        document.getElementById('newProductName').value = '';
        document.getElementById('newProductCategory').value = '';
        document.getElementById('newProductDescription').value = '';
        document.getElementById('newProductImage').value = '';
        document.getElementById('newProductPrice').value = '';
        document.getElementById('newProductCost').value = '';
        document.getElementById('newProductStock').value = '0';
        document.getElementById('newProductOrigin').value = 'Colombia';
        document.getElementById('newProductSeason').value = '';
        document.getElementById('newProductOrganic').checked = false;
        
        // Reset preview
        this.updateImagePreview('');
        
        // Reset to create mode
        this.editingProductId = null;
        document.getElementById('formTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Crear Nuevo Producto';
        document.getElementById('saveBtnText').textContent = 'Crear Producto';
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
        // Show the form
        const container = document.getElementById('productFormContainer');
        const btn = document.getElementById('toggleFormBtn');
        if (container && container.style.display === 'none') {
            container.style.display = 'block';
            btn.innerHTML = '<i class="fas fa-minus"></i> Ocultar Formulario';
        }

        // Fill form fields
        document.getElementById('newProductName').value = product.name || '';
        document.getElementById('newProductCategory').value = product.category || '';
        document.getElementById('newProductDescription').value = product.description || '';
        
        // Extract image filename from URL
        const imageName = (product.image_url || '').split('/').pop();
        document.getElementById('newProductImage').value = imageName;
        this.updateImagePreview(imageName);
        
        document.getElementById('newProductPrice').value = product.price_per_kg || 0;
        document.getElementById('newProductCost').value = product.cost_per_kg || 0;
        document.getElementById('newProductStock').value = product.stock_kg || 0;
        document.getElementById('newProductOrigin').value = product.origin || 'Colombia';
        document.getElementById('newProductSeason').value = product.season || '';
        document.getElementById('newProductOrganic').checked = product.is_organic || false;

        // Set edit mode
        this.editingProductId = product.id;
        document.getElementById('formTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Producto';
        document.getElementById('saveBtnText').textContent = 'Actualizar Producto';

        // Scroll to form
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        // Separar productos activos e inactivos
        const activeProducts = this.products.filter(p => p.available !== false && p.is_active !== false);
        const inactiveProducts = this.products.filter(p => p.available === false || p.is_active === false);

        console.log('🔍 DEBUG - Productos cargados:', {
            total: this.products.length,
            activos: activeProducts.length,
            inactivos: inactiveProducts.length
        });

        // Log TODOS los productos para ver sus valores
        console.log('📊 ANÁLISIS COMPLETO DE PRODUCTOS:');
        console.table(this.products.map(p => ({
            id: p.id,
            nombre: p.name,
            is_active: p.is_active,
            available: p.available,
            estado: (p.available === false || p.is_active === false) ? '🔴 INACTIVO' : '✅ ACTIVO'
        })));

        // Log primeros 3 productos inactivos para debugging
        if (inactiveProducts.length > 0) {
            console.log('📋 Productos inactivos encontrados:', 
                inactiveProducts.slice(0, 3).map(p => ({
                    nombre: p.name,
                    is_active: p.is_active,
                    available: p.available,
                    inactive_reason: p.inactive_reason
                }))
            );
        } else {
            console.log('⚠️ NO SE ENCONTRARON PRODUCTOS INACTIVOS');
            console.log('Revisando cada producto individualmente:');
            this.products.forEach(p => {
                if (p.is_active === false || p.available === false) {
                    console.log(`🔴 ENCONTRADO: ${p.name}`, {
                        is_active: p.is_active,
                        available: p.available
                    });
                }
            });
        }

        // Actualizar contadores
        const activeCount = document.getElementById('activeCount');
        const inactiveCount = document.getElementById('inactiveCount');
        if (activeCount) activeCount.textContent = activeProducts.length;
        if (inactiveCount) inactiveCount.textContent = inactiveProducts.length;

        // Renderizar tabla de activos
        this.renderActiveProductsTable(activeProducts);
        
        // Renderizar tabla de inactivos
        this.renderInactiveProductsTable(inactiveProducts);
        
        // Guardar para búsqueda
        this.allInactiveProducts = inactiveProducts;
    }

    renderActiveProductsTable(products) {
        const tbody = document.querySelector('#activeProductsTable tbody');
        if (!tbody) return;

        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: #666; padding: 2rem;">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                        No hay productos activos
                    </td>
                </tr>
            `;
            return;
        }

        let rows = '';
        products.forEach(product => {
            const stock = Number(product.stock_kg || product.stock || 0);
            const minStock = Number(product.min_stock_kg || product.min_stock || 0);
            const price = Number(product.price_per_kg || product.price || 0);
            const isLow = stock <= minStock;

            const statusClass = isLow ? 'stock-low' : 'stock-good';
            const statusIcon = isLow ? 'fa-exclamation-triangle' : 'fa-check-circle';

            rows += `
                <tr>
                    <td>
                        <div class="product-cell">
                            <img src="/public/images/products/${product.image_url || 'default.png'}" 
                                 alt="${this.escapeHtml(product.name)}" 
                                 style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover; margin-right: 10px;">
                            <strong>${this.escapeHtml(product.name)}</strong>
                        </div>
                    </td>
                    <td>
                        <span class="category-badge">${this.escapeHtml(product.category || 'Sin categoría')}</span>
                    </td>
                    <td><strong>${this.formatPrice(price)}</strong></td>
                    <td>
                        <span class="${statusClass}">
                            <i class="fas ${statusIcon}"></i>
                            ${this.formatNumber(stock)} kg
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons-inline">
                            <button class="btn-sm btn-action" onclick="storeManagement.editProductQuick(${product.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-sm btn-outline" onclick="storeManagement.deactivateProduct(${product.id})" title="Desactivar">
                                <i class="fas fa-pause"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = rows;
    }

    renderInactiveProductsTable(products) {
        const tbody = document.querySelector('#inactiveProductsTable tbody');
        if (!tbody) return;

        // Verificar si es resultado de búsqueda
        const isSearching = document.getElementById('inactiveSearchInput')?.value.trim().length > 0;

        if (products.length === 0) {
            const emptyMessage = isSearching 
                ? `<i class="fas fa-search" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; color: #999;"></i>
                   No se encontraron productos inactivos con ese término`
                : `<i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 0.5rem; display: block; color: var(--success);"></i>
                   ¡Todos los productos están activos!`;

            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: #666; padding: 2rem;">
                        ${emptyMessage}
                    </td>
                </tr>
            `;
            return;
        }

        let rows = '';
        products.forEach(product => {
            const price = Number(product.price_per_kg || product.price || 0);
            const reason = product.inactive_reason || 'Fuera de temporada';

            rows += `
                <tr>
                    <td>
                        <div class="product-cell">
                            <img src="/public/images/products/${product.image_url || 'default.png'}" 
                                 alt="${this.escapeHtml(product.name)}" 
                                 style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover; margin-right: 10px; opacity: 0.6;">
                            <strong style="opacity: 0.7;">${this.escapeHtml(product.name)}</strong>
                        </div>
                    </td>
                    <td>
                        <span class="category-badge inactive">${this.escapeHtml(product.category || 'Sin categoría')}</span>
                    </td>
                    <td>${this.formatPrice(price)}</td>
                    <td>
                        <span class="reason-badge">
                            <i class="fas fa-info-circle"></i>
                            ${this.escapeHtml(reason)}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons-inline">
                            <button class="btn-sm btn-secondary" onclick="storeManagement.reactivateProduct(${product.id})" title="Reactivar">
                                <i class="fas fa-play"></i> Reactivar
                            </button>
                            <button class="btn-sm btn-action" onclick="storeManagement.editProductQuick(${product.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = rows;
    }

    switchTab(tab) {
        // Actualizar botones de pestañas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            }
        });

        // Actualizar contenido de pestañas
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        if (tab === 'active') {
            document.getElementById('activeProductsTab').classList.add('active');
        } else {
            document.getElementById('inactiveProductsTab').classList.add('active');
        }
    }

    async deactivateProduct(productId) {
        const reason = prompt('¿Por qué desactivas este producto? (Ej: Fuera de temporada, Escaso en mercado)');
        if (!reason) return;

        try {
            const product = this.products.find(p => p.id === productId);
            if (!product) return;

            await this.dbService.updateProduct(productId, { 
                is_active: false,
                available: false,
                inactive_reason: reason
            });

            this.showAlert(`✅ ${product.name} desactivado correctamente`, 'success');
            await this.loadProducts();
        } catch (error) {
            console.error('Error deactivating product:', error);
            this.showAlert('Error al desactivar producto: ' + error.message, 'danger');
        }
    }

    async reactivateProduct(productId) {
        try {
            const product = this.products.find(p => p.id === productId);
            if (!product) return;

            await this.dbService.updateProduct(productId, { 
                is_active: true,
                available: true,
                inactive_reason: null
            });

            this.showAlert(`✅ ${product.name} reactivado correctamente`, 'success');
            await this.loadProducts();
        } catch (error) {
            console.error('Error reactivating product:', error);
            this.showAlert('Error al reactivar producto: ' + error.message, 'danger');
        }
    }

    editProductQuick(productId) {
        // Utilizar el método existente
        this.editSelectedProductFromModal(productId);
    }

    searchInactiveProducts(query) {
        if (!this.allInactiveProducts) {
            console.warn('No hay productos inactivos cargados');
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            // Si no hay búsqueda, mostrar todos
            this.renderInactiveProductsTable(this.allInactiveProducts);
            return;
        }

        // Filtrar productos
        const filtered = this.allInactiveProducts.filter(p => {
            const name = (p.name || '').toLowerCase();
            const category = (p.category || '').toLowerCase();
            const reason = (p.inactive_reason || '').toLowerCase();
            
            return name.includes(searchTerm) || 
                   category.includes(searchTerm) || 
                   reason.includes(searchTerm);
        });

        console.log(`🔍 Búsqueda "${query}": ${filtered.length} resultados de ${this.allInactiveProducts.length} productos inactivos`);
        
        this.renderInactiveProductsTable(filtered);
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