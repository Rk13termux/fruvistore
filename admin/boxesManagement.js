/**
 * Boxes Management Module
 * Handles all box management operations
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

class BoxesManagement {
    constructor() {
        this.boxes = [];
        this.selectedBoxId = null;
        this.dbService = null;
    }

    async initialize(containerId = 'boxes-management-content') {
        try {
            // Check authentication first
            if (!checkAdminAuth()) {
                return; // Will redirect if not authenticated
            }

            console.log('🚀 Initializing Boxes Management...');

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
            await this.loadBoxes();

            // Setup event listeners
            this.setupEventListeners();

            console.log('✅ Boxes Management initialized successfully');
        } catch (error) {
            console.error('❌ Boxes Management initialization failed:', error);
            this.showAlert('Error inicializando gestión de cajas: ' + error.message, 'danger');
        }
    }

    renderInterface(container) {
        container.innerHTML = `
            <!-- Management Header -->
            <div class="management-header">
                <div class="header-title">
                    <h1><i class="fas fa-box"></i> Gestión de Cajas</h1>
                    <p>Administra cajas, precios y contenido</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-info" onclick="boxesManagement.refreshBoxes()">
                        <i class="fas fa-sync-alt"></i> Actualizar
                    </button>
                </div>
            </div>

            <!-- Alert Container -->
            <div id="alertContainer"></div>

            <!-- Quick Stats -->
            <div id="boxesStats" class="stats-grid">
                <!-- Stats will be populated here -->
            </div>

            <!-- Price Management Section -->
            <div class="management-section">
                <h3><i class="fas fa-tag"></i> Gestión de Precios</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="boxPriceSelect">Caja</label>
                        <select id="boxPriceSelect" class="form-control" onchange="boxesManagement.handleBoxPriceChange()">
                            <option value="">Cargando cajas...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="newBoxPriceCOP">Nuevo Precio (COP)</label>
                        <input type="number" id="newBoxPriceCOP" class="form-control" min="100" step="100" placeholder="Ej: 50000">
                    </div>
                    <div class="form-group">
                        <label for="newBoxPriceUSD">Nuevo Precio (USD)</label>
                        <input type="number" id="newBoxPriceUSD" class="form-control" min="1" step="0.01" placeholder="Ej: 12.50">
                    </div>
                    <div class="form-group">
                        <label for="boxPriceReason">Motivo</label>
                        <input type="text" id="boxPriceReason" class="form-control" placeholder="Actualización manual">
                    </div>
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <button class="btn btn-success" onclick="boxesManagement.updateBoxPrice()">
                            <i class="fas fa-save"></i> Actualizar Precio
                        </button>
                    </div>
                </div>
                <div id="currentBoxPriceInfo" class="info-display"></div>
            </div>

            <!-- Stock Management Section -->
            <div class="management-section">
                <h3><i class="fas fa-boxes"></i> Gestión de Inventario</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="boxStockSelect">Caja</label>
                        <select id="boxStockSelect" class="form-control" onchange="boxesManagement.handleBoxStockChange()">
                            <option value="">Cargando cajas...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="boxStockChange">Cambio de Stock</label>
                        <input type="number" id="boxStockChange" class="form-control" step="1" placeholder="Ej: 10 o -5">
                    </div>
                    <div class="form-group">
                        <label for="boxStockReason">Motivo</label>
                        <input type="text" id="boxStockReason" class="form-control" placeholder="Ajuste manual">
                    </div>
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <button class="btn btn-success" onclick="boxesManagement.updateBoxStock()">
                            <i class="fas fa-save"></i> Actualizar Stock
                        </button>
                    </div>
                </div>
                <div id="currentBoxStock" class="info-display"></div>
            </div>

            <!-- Box Management Section -->
            <div class="management-section">
                <h3><i class="fas fa-cogs"></i> Gestión de Cajas</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="boxManageSelect">Caja</label>
                        <select id="boxManageSelect" class="form-control" onchange="boxesManagement.handleBoxManageChange()">
                            <option value="">Cargando cajas...</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="boxStatus">Estado</label>
                        <select id="boxStatus" class="form-control">
                            <option value="available">Disponible</option>
                            <option value="unavailable">No disponible</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <div class="button-group">
                            <button class="btn btn-info" onclick="boxesManagement.editSelectedBox()">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-danger" onclick="boxesManagement.deleteSelectedBox()">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                            <button class="btn btn-success" onclick="boxesManagement.updateBoxStatus()">
                                <i class="fas fa-toggle-on"></i> Cambiar Estado
                            </button>
                        </div>
                    </div>
                </div>
                <div id="boxDetails" class="info-display"></div>
            </div>

            <!-- Content Management Section -->
            <div class="management-section">
                <h3><i class="fas fa-list"></i> Gestión de Contenido</h3>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="boxesManagement.viewBoxContents()">
                        <i class="fas fa-eye"></i> Ver Contenido
                    </button>
                    <button class="btn btn-warning" onclick="boxesManagement.editBoxContents()">
                        <i class="fas fa-edit"></i> Editar Contenido
                    </button>
                </div>
            </div>

            <!-- Reports Section -->
            <div class="management-section">
                <h3><i class="fas fa-chart-bar"></i> Reportes</h3>
                <div class="action-buttons">
                    <button class="btn btn-info" onclick="boxesManagement.showLowStockBoxes()">
                        <i class="fas fa-exclamation-triangle"></i> Stock Bajo
                    </button>
                    <button class="btn btn-primary" onclick="boxesManagement.loadBoxReport()">
                        <i class="fas fa-file-alt"></i> Reporte de Cajas
                    </button>
                    <button class="btn btn-success" onclick="boxesManagement.showAllBoxes()">
                        <i class="fas fa-list"></i> Catálogo Completo
                    </button>
                    <button class="btn btn-warning" onclick="boxesManagement.exportBoxes()">
                        <i class="fas fa-download"></i> Exportar CSV
                    </button>
                </div>
            </div>

            <!-- Boxes Table -->
            <div class="management-section">
                <h3><i class="fas fa-table"></i> Cajas Recientes</h3>
                <div class="table-container">
                    <table id="boxesTableContainer" class="data-table">
                        <thead>
                            <tr>
                                <th>Caja</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="6" style="text-align: center; color: #666;">
                                    <i class="fas fa-spinner fa-spin"></i> Cargando cajas...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal -->
            <div id="modal" class="modal" style="display: none;">
                <div class="modal-overlay" onclick="boxesManagement.closeModal()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Modal</h3>
                        <button onclick="boxesManagement.closeModal()" class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="modalContent" class="modal-body"></div>
                </div>
            </div>
        `;
    }

    async loadBoxes() {
        try {
            this.showLoading('Cargando cajas...');
            this.boxes = await this.dbService.getAllBoxes();
            this.renderBoxesTable();
            this.populateSelectors();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading boxes:', error);
            this.hideLoading();
            this.showAlert('Error cargando cajas: ' + error.message, 'danger');
        }
    }

    setupEventListeners() {
        // Auto-calculate USD price when COP price changes
        setTimeout(() => {
            const copInput = document.getElementById('newBoxPriceCOP');
            if (copInput) {
                copInput.addEventListener('input', () => {
                    const usdInput = document.getElementById('newBoxPriceUSD');
                    if (usdInput) {
                        const copValue = Number(copInput.value);
                        if (!isNaN(copValue) && copValue > 0) {
                            // Tasa de conversión: 1 USD = 4000 COP
                            const usdValue = (copValue / 4000).toFixed(2);
                            usdInput.value = usdValue;
                        }
                    }
                });
            }
        }, 500);
    }

    // ===== EVENT HANDLERS FOR ONCLICK ATTRIBUTES =====

    refreshBoxes() {
        this.loadBoxes();
    }

    handleBoxPriceChange() {
        this.prefillPriceFields();
    }

    handleBoxStockChange() {
        this.prefillStockFields();
    }

    handleBoxManageChange() {
        this.loadBoxDetails();
    }

    // ===== PRICE MANAGEMENT =====

    async updateBoxPrice() {
        const boxSelect = document.getElementById('boxPriceSelect');
        const priceCOPInput = document.getElementById('newBoxPriceCOP');
        const priceUSDInput = document.getElementById('newBoxPriceUSD');
        const reasonInput = document.getElementById('boxPriceReason');

        if (!boxSelect || !priceCOPInput || !priceUSDInput) return;

        const boxId = boxSelect.value;
        const newPriceCOP = Number(priceCOPInput.value);
        const newPriceUSD = Number(priceUSDInput.value);
        const reason = reasonInput?.value?.trim() || 'Actualización manual';

        if (!boxId) {
            this.showAlert('Por favor selecciona una caja.', 'warning');
            return;
        }

        if (Number.isNaN(newPriceCOP) || newPriceCOP <= 0) {
            this.showAlert('Por favor ingresa un precio válido en COP.', 'warning');
            return;
        }

        if (Number.isNaN(newPriceUSD) || newPriceUSD <= 0) {
            this.showAlert('Por favor ingresa un precio válido en USD.', 'warning');
            return;
        }

        try {
            this.showLoading('Actualizando precio de caja...');
            const result = await this.dbService.updateBoxPrice(boxId, newPriceCOP, newPriceUSD, reason);

            // Si result existe, la operación fue exitosa
            if (result) {
                this.showAlert(`Precio actualizado: $${this.formatNumber(newPriceCOP)} COP / $${newPriceUSD.toFixed(2)} USD`, 'success');
                await this.loadBoxes();
                priceCOPInput.value = '';
                priceUSDInput.value = '';
                if (reasonInput) reasonInput.value = '';
                this.updatePriceInfoDisplay();
            } else {
                this.showAlert('Error actualizando precio: No se recibió respuesta del servidor.', 'danger');
            }
        } catch (error) {
            console.error('Error updating box price:', error);
            this.showAlert(`Error actualizando precio: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    // ===== STOCK MANAGEMENT =====

    async updateBoxStock() {
        const boxSelect = document.getElementById('boxStockSelect');
        const changeInput = document.getElementById('boxStockChange');
        const reasonInput = document.getElementById('boxStockReason');

        if (!boxSelect || !changeInput) return;

        const boxId = boxSelect.value;
        const changeValue = Number(changeInput.value);
        const reason = reasonInput?.value?.trim() || 'Ajuste manual';

        if (!boxId || Number.isNaN(changeValue) || changeValue === 0) {
            this.showAlert('Ingresa una cantidad válida diferente de cero.', 'warning');
            return;
        }

        try {
            this.showLoading('Actualizando inventario de cajas...');
            const result = await this.dbService.updateBoxStock(boxId, changeValue, reason);

            // Si result existe, la operación fue exitosa
            if (result) {
                this.showAlert('Inventario de cajas actualizado correctamente.', 'success');
                changeInput.value = '';
                if (reasonInput) reasonInput.value = '';
                await this.loadBoxes();
            } else {
                this.showAlert('Error actualizando inventario: No se recibió respuesta del servidor.', 'danger');
            }
        } catch (error) {
            console.error('Error updating box stock:', error);
            this.showAlert(`Error actualizando inventario: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    // ===== BOX MANAGEMENT =====

    async editSelectedBox() {
        const select = document.getElementById('boxManageSelect');
        const boxId = select?.value;

        if (!boxId) {
            this.showAlert('Selecciona una caja para editar.', 'warning');
            return;
        }

        const box = this.getBoxById(boxId);
        if (!box) {
            this.showAlert('Caja no encontrada.', 'danger');
            return;
        }

        // Populate form with box data
        this.populateBoxForm(box);
        this.showAlert(`Preparado para editar: ${box.name}`, 'info');
    }

    async deleteSelectedBox() {
        const select = document.getElementById('boxManageSelect');
        const boxId = select?.value;

        if (!boxId) {
            this.showAlert('Selecciona una caja para eliminar.', 'warning');
            return;
        }

        const box = this.getBoxById(boxId);
        if (!box) {
            this.showAlert('Caja no encontrada.', 'danger');
            return;
        }

        if (!confirm(`¿Eliminar permanentemente "${box.name}"?`)) return;

        try {
            this.showLoading('Eliminando caja...');
            const result = await this.dbService.deleteBox(boxId);

            // Si result es true o existe, la operación fue exitosa
            if (result) {
                this.showAlert('Caja eliminada correctamente.', 'success');
                await this.loadBoxes();
            } else {
                this.showAlert('No se pudo eliminar la caja.', 'danger');
            }
        } catch (error) {
            console.error('Error deleting box:', error);
            this.showAlert(`Error eliminando caja: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async updateBoxStatus() {
        const select = document.getElementById('boxManageSelect');
        const statusSelect = document.getElementById('boxStatus');

        if (!select || !statusSelect) return;

        const boxId = select.value;
        const newStatus = statusSelect.value;

        if (!boxId || !newStatus) {
            this.showAlert('Selecciona una caja y un estado.', 'warning');
            return;
        }

        try {
            this.showLoading('Actualizando estado de la caja...');
            const result = await this.dbService.updateBoxStatus(boxId, newStatus);

            // Si result existe, la operación fue exitosa
            if (result) {
                this.showAlert('Estado de la caja actualizado.', 'success');
                statusSelect.value = '';
                await this.loadBoxes();
            } else {
                this.showAlert('No se pudo actualizar el estado.', 'danger');
            }
        } catch (error) {
            console.error('Error updating box status:', error);
            this.showAlert(`Error actualizando estado: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    // ===== CONTENT MANAGEMENT =====

    async viewBoxContents() {
        const select = document.getElementById('boxManageSelect');
        const boxId = select?.value;

        if (!boxId) {
            this.showAlert('Selecciona una caja para ver su contenido.', 'warning');
            return;
        }

        try {
            this.showLoading('Cargando contenido de la caja...');
            const boxWithContents = await this.dbService.getBoxWithContents(boxId);

            if (!boxWithContents) {
                this.showAlert('Caja no encontrada.', 'danger');
                return;
            }

            this.renderBoxContentsModal(boxWithContents);
        } catch (error) {
            console.error('Error loading box contents:', error);
            this.showAlert(`Error cargando contenido: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async editBoxContents() {
        const select = document.getElementById('boxManageSelect');
        const boxId = select?.value;

        if (!boxId) {
            this.showAlert('Selecciona una caja para editar su contenido.', 'warning');
            return;
        }

        try {
            this.showLoading('Cargando contenido para edición...');
            const boxWithContents = await this.dbService.getBoxWithContents(boxId);

            if (!boxWithContents) {
                this.showAlert('Caja no encontrada.', 'danger');
                return;
            }

            this.renderEditContentsModal(boxWithContents);
        } catch (error) {
            console.error('Error loading box contents for editing:', error);
            this.showAlert(`Error cargando contenido para edición: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    // ===== REPORTS =====

    async showLowStockBoxes() {
        try {
            this.showLoading('Cargando cajas con stock bajo...');
            const lowStockBoxes = this.boxes.filter(box => {
                const stock = Number(box.stock_quantity || 0);
                const minStock = Number(box.min_stock || 0);
                return stock <= minStock;
            });

            if (!lowStockBoxes.length) {
                this.showAlert('¡Excelente! No hay cajas con stock bajo.', 'success');
                return;
            }

            this.renderLowStockBoxesModal(lowStockBoxes);
        } catch (error) {
            console.error('Error loading low stock boxes:', error);
            this.showAlert(`Error cargando cajas con stock bajo: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async loadBoxReport() {
        try {
            this.showLoading('Generando reporte de cajas...');
            const analytics = await this.dbService.getBoxAnalytics();

            if (!analytics) {
                throw new Error('No se pudo generar el reporte de cajas.');
            }

            this.renderBoxReportModal(analytics);
        } catch (error) {
            console.error('Error generating box report:', error);
            this.showAlert(`Error generando reporte: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async showAllBoxes() {
        try {
            this.showLoading('Cargando catálogo completo de cajas...');
            const boxes = this.boxes || [];

            if (!boxes.length) {
                this.showAlert('No hay cajas registradas en la base de datos.', 'info');
                return;
            }

            this.renderAllBoxesModal(boxes);
        } catch (error) {
            console.error('Error loading all boxes:', error);
            this.showAlert(`Error cargando catálogo completo: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async exportBoxes() {
        try {
            this.showLoading('Generando archivo de exportación...');
            const csv = this.generateBoxesCSV(this.boxes || []);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `cajas_fruvi_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            this.showAlert('Archivo exportado correctamente.', 'success');
        } catch (error) {
            console.error('Error exporting boxes:', error);
            this.showAlert(`Error exportando cajas: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    // ===== UTILITY METHODS =====

    getBoxById(boxId) {
        if (!boxId) return null;
        return this.boxes.find(box => String(box.id) === String(boxId)) || null;
    }

    populateSelectors() {
        const priceSelect = document.getElementById('boxPriceSelect');
        const stockSelect = document.getElementById('boxStockSelect');
        const manageSelect = document.getElementById('boxManageSelect');

        if (priceSelect) {
            this.populateSelect(priceSelect, 'Seleccionar caja...', box => `${box.name} (${this.formatPrice(box.price_cop || 0)})`);
        }

        if (stockSelect) {
            this.populateSelect(stockSelect, 'Seleccionar caja...', box => `${box.name} (${this.formatNumber(box.stock_quantity || 0)} unidades)`);
        }

        if (manageSelect) {
            this.populateSelect(manageSelect, 'Seleccionar caja...', box => `${box.name} - ${box.available !== false ? 'Disponible' : 'No disponible'}`);
        }
    }

    populateSelect(selectElement, placeholder, labelFn) {
        const prevValue = selectElement.value;
        selectElement.innerHTML = '';

        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = placeholder;
        selectElement.appendChild(placeholderOption);

        this.boxes.forEach(box => {
            const option = document.createElement('option');
            option.value = box.id;
            option.textContent = labelFn(box);
            selectElement.appendChild(option);
        });

        if (prevValue && this.boxes.some(box => String(box.id) === String(prevValue))) {
            selectElement.value = prevValue;
        }
    }

    prefillPriceFields() {
        const priceSelect = document.getElementById('boxPriceSelect');
        const priceCOPInput = document.getElementById('newBoxPriceCOP');
        const priceUSDInput = document.getElementById('newBoxPriceUSD');
        const infoContainer = document.getElementById('currentBoxPriceInfo');
        
        if (!priceSelect || !priceCOPInput || !priceUSDInput) return;

        const box = this.getBoxById(priceSelect.value);
        if (!box) {
            if (infoContainer) {
                infoContainer.innerHTML = '<span style="color: #666;">Selecciona una caja para ver el precio actual.</span>';
            }
            priceCOPInput.value = '';
            priceUSDInput.value = '';
            return;
        }

        const currentPriceCOP = Number(box.price_cop || 0);
        const currentPriceUSD = Number(box.price_usd || 0);
        
        priceCOPInput.value = Math.round(currentPriceCOP);
        priceUSDInput.value = currentPriceUSD.toFixed(2);

        if (infoContainer) {
            infoContainer.innerHTML = `
                <div class="price-info">
                    <span style="color: #666;">
                        <i class="fas fa-info-circle"></i>
                        Precio actual: <strong>${this.formatPrice(currentPriceCOP)}</strong> COP / <strong>$${currentPriceUSD.toFixed(2)}</strong> USD
                    </span>
                </div>
            `;
        }
    }

    updatePriceInfoDisplay() {
        const infoContainer = document.getElementById('currentBoxPriceInfo');
        const priceSelect = document.getElementById('boxPriceSelect');
        
        if (infoContainer && priceSelect && priceSelect.value) {
            this.prefillPriceFields();
        }
    }

    prefillStockFields() {
        const stockSelect = document.getElementById('boxStockSelect');
        const infoContainer = document.getElementById('currentBoxStock');

        if (!stockSelect || !infoContainer) return;

        const box = this.getBoxById(stockSelect.value);
        if (!box) {
            infoContainer.innerHTML = '<span style="color: #666;">Selecciona una caja para ver el stock actual.</span>';
            return;
        }

        const currentStock = this.formatNumber(box.stock_quantity || 0);
        const minStock = this.formatNumber(box.min_stock || 0);
        const statusClass = (box.stock_quantity || 0) <= (box.min_stock || 0) ? 'stock-low' : 'stock-good';
        const icon = statusClass === 'stock-low' ? 'fa-exclamation-triangle' : 'fa-check-circle';

        infoContainer.innerHTML = `
            <div class="stock-status">
                <span class="${statusClass}">
                    <i class="fas ${icon}"></i>
                    Stock actual: ${currentStock} unidades
                </span>
            </div>
            <small style="color: #666;">Stock mínimo recomendado: ${minStock} unidades</small>
        `;
    }

    loadBoxDetails() {
        const select = document.getElementById('boxManageSelect');
        const detailsContainer = document.getElementById('boxDetails');

        if (!select || !detailsContainer) return;

        const box = this.getBoxById(select.value);
        if (!box) {
            detailsContainer.innerHTML = '<p style="color: #666;">Selecciona una caja para ver detalles.</p>';
            return;
        }

        detailsContainer.innerHTML = `
            <div class="box-details">
                <h4>${this.escapeHtml(box.name)}</h4>
                <p><strong>Descripción:</strong> ${this.escapeHtml(box.description || 'Sin descripción')}</p>
                <p><strong>Precio:</strong> ${this.formatPrice(box.price_cop || 0)}</p>
                <p><strong>Stock:</strong> ${this.formatNumber(box.stock_quantity || 0)} unidades</p>
                <p><strong>Estado:</strong> ${box.available !== false ? 'Disponible' : 'No disponible'}</p>
            </div>
        `;
    }

    populateBoxForm(box) {
        // This would populate a form for editing box details
        // Implementation depends on the specific form structure
        console.log('Populating form for box:', box);
    }

    // ===== MODAL RENDERING =====

    renderBoxContentsModal(boxWithContents) {
        const box = boxWithContents.box;
        const contents = boxWithContents.contents || [];

        let contentsRows = '';
        if (contents.length === 0) {
            contentsRows = '<tr><td colspan="4" style="text-align: center; color: #666;">Esta caja no tiene contenido definido.</td></tr>';
        } else {
            contentsRows = contents.map(content => {
                const product = content.management_products || {};
                return `
                    <tr>
                        <td>${this.escapeHtml(product.name || 'Producto desconocido')}</td>
                        <td>${this.escapeHtml(product.category || 'Sin categoría')}</td>
                        <td>${this.formatNumber(content.quantity || 0)} ${content.unit || 'kg'}</td>
                        <td>${this.formatPrice((product.price_per_kg || 0) * (content.quantity || 0))}</td>
                    </tr>
                `;
            }).join('');
        }

        const totalValue = contents.reduce((sum, content) => {
            const product = content.management_products || {};
            return sum + ((product.price_per_kg || 0) * (content.quantity || 0));
        }, 0);

        const html = `
            <h3>Contenido de la caja: ${this.escapeHtml(box.name)}</h3>
            <div class="box-info">
                <p><strong>Descripción:</strong> ${this.escapeHtml(box.description || 'Sin descripción')}</p>
                <p><strong>Precio total:</strong> ${this.formatPrice(box.price_cop || 0)}</p>
                <p><strong>Valor estimado del contenido:</strong> ${this.formatPrice(totalValue)}</p>
            </div>
            <h4>Productos incluidos (${contents.length})</h4>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Cantidad</th>
                            <th>Valor estimado</th>
                        </tr>
                    </thead>
                    <tbody>${contentsRows}</tbody>
                </table>
            </div>
        `;

        this.showModal(html);
    }

    renderEditContentsModal(boxWithContents) {
        // This would render a modal for editing box contents
        // For now, show a placeholder
        const html = `
            <h3>Editar contenido de la caja: ${this.escapeHtml(boxWithContents.box.name)}</h3>
            <p style="color: #666;">Funcionalidad de edición de contenido próximamente disponible.</p>
        `;

        this.showModal(html);
    }

    renderLowStockBoxesModal(boxes) {
        let rows = '';
        boxes.forEach(box => {
            rows += `
                <tr>
                    <td>
                        <div class="product-name">
                            <i class="fas fa-box" style="color: #2a5298;"></i>
                            ${this.escapeHtml(box.name)}
                        </div>
                    </td>
                    <td>${this.escapeHtml(box.description || 'Sin descripción')}</td>
                    <td>
                        <div class="stock-status">
                            <span class="stock-low">
                                <i class="fas fa-exclamation-triangle"></i>
                                ${this.formatNumber(box.stock_quantity || 0)} unidades
                            </span>
                        </div>
                    </td>
                    <td><span style="color: #666; font-weight: 500;">${this.formatNumber(box.min_stock || 0)} unidades</span></td>
                    <td>
                        <button class="btn-sm btn-success" onclick="boxesManagement.restockBox(${box.id}, ${(box.min_stock || 0) * 2})">
                            <i class="fas fa-plus"></i> Reabastecer
                        </button>
                    </td>
                </tr>
            `;
        });

        const html = `
            <h3>Cajas con stock bajo (${boxes.length})</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Caja</th>
                            <th>Descripción</th>
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

    renderBoxReportModal(analytics) {
        const html = `
            <h3>Reporte completo de cajas</h3>
            <div class="stats-grid mb-2">
                <div class="stat-card">
                    <div class="value">${analytics.totalBoxes}</div>
                    <div class="label">Total cajas</div>
                </div>
                <div class="stat-card">
                    <div class="value">${analytics.availableBoxes}</div>
                    <div class="label">Disponibles</div>
                </div>
                <div class="stat-card">
                    <div class="value">${analytics.lowStockBoxes}</div>
                    <div class="label">Stock bajo</div>
                </div>
                <div class="stat-card">
                    <div class="value">${this.formatPrice(analytics.totalValue)}</div>
                    <div class="label">Valor total inventario</div>
                </div>
            </div>
            <h4>Resumen por categoría</h4>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Cantidad</th>
                            <th>Valor promedio</th>
                            <th>Stock total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(analytics.categorySummary || {}).map(([category, data]) => `
                            <tr>
                                <td>${this.escapeHtml(category)}</td>
                                <td>${data.count} cajas</td>
                                <td>${this.formatPrice(data.avgPrice)}</td>
                                <td>${this.formatNumber(data.totalStock)} unidades</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.showModal(html);
    }

    renderAllBoxesModal(boxes) {
        let rows = '';
        let totalValue = 0;
        let lowStockCount = 0;
        let activeCount = 0;

        boxes.forEach(box => {
            const stock = Number(box.stock_quantity || 0);
            const minStock = Number(box.min_stock || 0);
            const price = Number(box.price_cop || 0);
            const isLow = stock <= minStock;
            const isActive = box.available !== false;

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
                            <i class="fas fa-box" style="color: #2a5298;"></i>
                            ${this.escapeHtml(box.name)}
                        </div>
                        <small style="color: #666; margin-left: 1.5rem;">${this.escapeHtml(box.description || 'Sin descripción')}</small>
                    </td>
                    <td>${this.formatPrice(price)}</td>
                    <td>
                        <div class="stock-status">
                            <span class="${statusClass}">
                                <i class="fas ${statusIcon}"></i>
                                ${this.formatNumber(stock)} unidades
                            </span>
                        </div>
                        <small style="color: #666;">Mín: ${this.formatNumber(minStock)} unidades</small>
                    </td>
                    <td>${availabilityBadge}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-sm btn-info" onclick="boxesManagement.editSelectedBoxFromModal(${box.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-sm btn-warning" onclick="boxesManagement.prepareUpdateBoxPrice(${box.id})">
                                <i class="fas fa-tag"></i>
                            </button>
                            <button class="btn-sm btn-success" onclick="boxesManagement.restockBox(${box.id}, ${(minStock || 0) * 2})">
                                <i class="fas fa-boxes"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        const html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3>Catálogo completo de cajas (${boxes.length})</h3>
                <div class="action-buttons">
                    <button class="btn-sm btn-success" onclick="boxesManagement.addNewBox()">
                        <i class="fas fa-plus"></i> Nueva caja
                    </button>
                    <button class="btn-sm btn-info" onclick="boxesManagement.exportBoxes()">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                </div>
            </div>
            <div class="table-container" style="max-height: 600px;">
                <table>
                    <thead>
                        <tr>
                            <th>Caja</th>
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
                    <div class="value">${boxes.length}</div>
                    <div class="label">Total cajas</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-check-circle"></i>
                    <div class="value">${activeCount}</div>
                    <div class="label">Activas</div>
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

    renderBoxesTable() {
        const container = document.getElementById('boxesTableContainer');
        if (!container) return;

        let rows = '';
        this.boxes.slice(0, 50).forEach(box => {
            const stock = Number(box.stock_quantity || 0);
            const minStock = Number(box.min_stock || 0);
            const price = Number(box.price_cop || 0);
            const isLow = stock <= minStock;
            const isActive = box.available !== false;

            const statusClass = isLow ? 'stock-low' : 'stock-good';
            const statusIcon = isLow ? 'fa-exclamation-triangle' : 'fa-check-circle';

            rows += `
                <tr>
                    <td>${this.escapeHtml(box.name)}</td>
                    <td>${this.escapeHtml(box.description || 'Sin descripción')}</td>
                    <td>${this.formatPrice(price)}</td>
                    <td>
                        <span class="${statusClass}">
                            <i class="fas ${statusIcon}"></i>
                            ${this.formatNumber(stock)} unidades
                        </span>
                    </td>
                    <td>${isActive ? 'Disponible' : 'No disponible'}</td>
                    <td>
                        <button class="btn-sm btn-info" onclick="boxesManagement.editSelectedBoxFromModal(${box.id})">
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
                        <th>Caja</th>
                        <th>Descripción</th>
                        <th>Precio</th>
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
                <i class="fas ${icon}"></i>
                ${message}
            </div>
        `;
    }

    showLoading(message = 'Cargando...') {
        // Loading animations disabled for better UX
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

    generateBoxesCSV(boxes) {
        const headers = [
            'ID',
            'Nombre',
            'Descripción',
            'Precio (COP)',
            'Stock',
            'Stock mínimo',
            'Disponible'
        ];

        const rows = boxes.map(box => [
            box.id,
            `"${box.name}"`,
            `"${box.description || ''}"`,
            Number(box.price_cop || 0),
            Number(box.stock_quantity || 0),
            Number(box.min_stock || 0),
            box.available !== false ? 'Sí' : 'No'
        ].join(','));

        return [headers.join(','), ...rows].join('\n');
    }

    getAdminUser() {
        return localStorage.getItem('adminUser') || 'admin';
    }

    // ===== EVENT HANDLERS =====

    handlePriceUpdate(event) {
        event.preventDefault();
        this.updateBoxPrice();
    }

    handleStockUpdate(event) {
        event.preventDefault();
        this.updateBoxStock();
    }

    handleBoxManagement(event) {
        event.preventDefault();
        // Handle box management form submission
        console.log('Box management form submitted');
    }

    // ===== ADDITIONAL METHODS =====

    editSelectedBoxFromModal(boxId) {
        this.closeModal();
        const manageSelect = document.getElementById('boxManageSelect');
        if (manageSelect) {
            manageSelect.value = String(boxId);
        }
        this.editSelectedBox();
    }

    prepareUpdateBoxPrice(boxId) {
        const select = document.getElementById('boxPriceSelect');
        const priceCOPInput = document.getElementById('newBoxPriceCOP');
        const priceUSDInput = document.getElementById('newBoxPriceUSD');

        if (!select || !priceCOPInput || !priceUSDInput) return;

        select.value = String(boxId);
        const box = this.getBoxById(boxId);
        if (box) {
            priceCOPInput.value = Math.round(box.price_cop || 0);
            priceUSDInput.value = (box.price_usd || 0).toFixed(2);
            this.updatePriceInfoDisplay();
            this.showAlert(`Preparado para actualizar el precio de ${this.escapeHtml(box.name)}.`, 'info');
        }

        this.closeModal();
    }

    restockBox(boxId, targetStock) {
        if (!boxId) return;

        // This would trigger the restock functionality
        console.log(`Restocking box ${boxId} to ${targetStock}`);
        this.showAlert('Funcionalidad de reabastecimiento próximamente disponible.', 'info');
    }

    addNewBox() {
        this.closeModal();
        // This would open the add box modal
        console.log('Add new box functionality');
        this.showAlert('Funcionalidad de agregar caja próximamente disponible.', 'info');
    }
}

// Create and export singleton instance
const boxesManagement = new BoxesManagement();
window.boxesManagement = boxesManagement;

export default boxesManagement;