/**
 * Credits Management Module
 * Handles all user credits operations
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

class CreditsManagement {
    constructor() {
        this.users = [];
        this.selectedUserId = null;
        this.dbService = null;
    }

    async initialize(containerId = 'credits-management-content') {
        try {
            // Check authentication first
            if (!checkAdminAuth()) {
                return; // Will redirect if not authenticated
            }

            console.log('🚀 Initializing Credits Management...');

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
            await this.loadUsersCredits();

            // Setup event listeners
            this.setupEventListeners();

            console.log('✅ Credits Management initialized successfully');
        } catch (error) {
            console.error('❌ Credits Management initialization failed:', error);
            this.showAlert('Error inicializando gestión de créditos: ' + error.message, 'danger');
        }
    }

    renderInterface(container) {
        container.innerHTML = `
            <!-- Management Header -->
            <div class="management-header">
                <div class="header-title">
                    <h1><i class="fas fa-coins"></i> Gestión de Créditos</h1>
                    <p>Administra créditos de usuarios</p>
                </div>
                <div class="header-actions">
                    <button class="btn btn-info" onclick="creditsManagement.refreshCredits()">
                        <i class="fas fa-sync-alt"></i> Actualizar
                    </button>
                </div>
            </div>

            <!-- Alert Container -->
            <div id="alertContainer"></div>

            <!-- Quick Stats -->
            <div id="creditsStats" class="stats-grid">
                <!-- Stats will be populated here -->
            </div>

            <!-- Credit Management Section -->
            <div class="management-section">
                <h3><i class="fas fa-credit-card"></i> Gestión de Créditos</h3>
                
                <!-- Quick Add by User ID -->
                <div class="quick-add-section" style="background: rgba(42, 82, 152, 0.08); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 4px solid #2a5298;">
                    <h4 style="margin: 0 0 1rem 0; color: #2a5298;">
                        <i class="fas fa-zap"></i> Agregar Créditos Rápido (por User ID)
                    </h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="quickUserId">User ID</label>
                            <input type="text" id="quickUserId" class="form-control" 
                                   placeholder="Ejemplo: 497e4ec0-a1c9-4ffb-af31-4244868d4c71"
                                   oninput="creditsManagement.handleQuickUserIdInput()">
                            <small style="color: #666; display: block; margin-top: 0.5rem;">
                                <i class="fas fa-info-circle"></i> Pega aquí el ID del usuario que te enviaron por WhatsApp
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="quickCreditAmount">Cantidad de Créditos</label>
                            <input type="number" id="quickCreditAmount" class="form-control" 
                                   min="1" step="1" placeholder="100">
                        </div>
                        <div class="form-group">
                            <label for="quickCreditReason">Motivo</label>
                            <input type="text" id="quickCreditReason" class="form-control" 
                                   placeholder="Compra por WhatsApp">
                        </div>
                        <div class="form-group">
                            <label>&nbsp;</label>
                            <button class="btn btn-success" onclick="creditsManagement.quickAddCredits()" style="width: 100%;">
                                <i class="fas fa-bolt"></i> Agregar Créditos Ahora
                            </button>
                        </div>
                    </div>
                    <div id="quickUserPreview" style="margin-top: 1rem;"></div>
                </div>

                <!-- Traditional Credit Management -->
                <div class="traditional-management" style="padding-top: 1rem; border-top: 2px solid #e9ecef;">
                    <h4 style="margin: 0 0 1rem 0; color: #495057;">
                        <i class="fas fa-sliders-h"></i> Gestión Avanzada
                    </h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="userSelect">Usuario</label>
                            <select id="userSelect" class="form-control" onchange="creditsManagement.handleUserChange()">
                                <option value="">Cargando usuarios...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="creditAmount">Cantidad</label>
                            <input type="number" id="creditAmount" class="form-control" min="1" step="1">
                        </div>
                        <div class="form-group">
                            <label for="creditReason">Motivo</label>
                            <input type="text" id="creditReason" class="form-control" placeholder="Operación manual">
                        </div>
                        <div class="form-group">
                            <label>&nbsp;</label>
                            <div class="button-group">
                                <button class="btn btn-success" onclick="creditsManagement.addCredits()">
                                    <i class="fas fa-plus"></i> Agregar
                                </button>
                                <button class="btn btn-warning" onclick="creditsManagement.subtractCredits()">
                                    <i class="fas fa-minus"></i> Restar
                                </button>
                                <button class="btn btn-info" onclick="creditsManagement.setCredits()">
                                    <i class="fas fa-equals"></i> Establecer
                                </button>
                                <button class="btn btn-danger" onclick="creditsManagement.resetCredits()">
                                    <i class="fas fa-undo"></i> Reiniciar
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="userDetails" class="info-display"></div>
                </div>
            </div>

            <!-- Search Section -->
            <div class="management-section">
                <h3><i class="fas fa-search"></i> Búsqueda de Usuarios</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="userSearch">Buscar por nombre o email</label>
                        <input type="text" id="userSearch" class="form-control" placeholder="Escribe para buscar..." oninput="creditsManagement.filterUsers()">
                    </div>
                </div>
            </div>

            <!-- Reports Section -->
            <div class="management-section">
                <h3><i class="fas fa-chart-bar"></i> Reportes</h3>
                <div class="action-buttons">
                    <button class="btn btn-info" onclick="creditsManagement.showAllUsers()">
                        <i class="fas fa-users"></i> Todos los Usuarios
                    </button>
                    <button class="btn btn-success" onclick="creditsManagement.showUsersWithCredits()">
                        <i class="fas fa-coins"></i> Con Créditos
                    </button>
                    <button class="btn btn-warning" onclick="creditsManagement.showUsersWithoutCredits()">
                        <i class="fas fa-circle"></i> Sin Créditos
                    </button>
                    <button class="btn btn-primary" onclick="creditsManagement.loadCreditsReport()">
                        <i class="fas fa-file-alt"></i> Reporte General
                    </button>
                    <button class="btn btn-secondary" onclick="creditsManagement.exportCredits()">
                        <i class="fas fa-download"></i> Exportar CSV
                    </button>
                </div>
            </div>

            <!-- Credits Table -->
            <div class="management-section">
                <h3><i class="fas fa-table"></i> Usuarios Recientes</h3>
                <div class="table-container">
                    <table id="creditsTableContainer" class="data-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Créditos</th>
                                <th>Última actividad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="5" style="text-align: center; color: #666;">
                                    <i class="fas fa-spinner fa-spin"></i> Cargando usuarios...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal -->
            <div id="modal" class="modal" style="display: none;">
                <div class="modal-overlay" onclick="creditsManagement.closeModal()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Modal</h3>
                        <button onclick="creditsManagement.closeModal()" class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="modalContent" class="modal-body"></div>
                </div>
            </div>
        `;
    }

    async loadUsersCredits() {
        try {
            this.showLoading('Cargando créditos de usuarios...');
            this.users = await this.dbService.getUsersCredits();
            this.renderCreditsTable();
            this.populateSelectors();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading users credits:', error);
            this.hideLoading();
            this.showAlert('Error cargando créditos: ' + error.message, 'danger');
        }
    }

    setupEventListeners() {
        // Event listeners are now handled by onclick attributes in the rendered HTML
        // This method can be used for any additional dynamic event binding if needed
    }

    // ===== EVENT HANDLERS FOR ONCLICK ATTRIBUTES =====

    refreshCredits() {
        this.loadUsersCredits();
    }

    handleUserChange() {
        this.loadUserDetails();
    }

    async handleQuickUserIdInput() {
        const userIdInput = document.getElementById('quickUserId');
        const previewContainer = document.getElementById('quickUserPreview');
        
        if (!userIdInput || !previewContainer) return;

        const userId = userIdInput.value.trim();

        if (!userId) {
            previewContainer.innerHTML = '';
            return;
        }

        // First check if it looks like a valid UUID
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidPattern.test(userId)) {
            previewContainer.innerHTML = `
                <div style="background: rgba(255, 193, 7, 0.1); padding: 1rem; border-radius: 8px; border: 2px solid #ffc107;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <i class="fas fa-info-circle" style="color: #ffc107; font-size: 1.5rem;"></i>
                        <div>
                            <div style="font-weight: 600; color: #856404;">Formato de ID inválido</div>
                            <div style="font-size: 0.9rem; color: #666;">El ID debe tener formato UUID (ej: 497e4ec0-a1c9-4ffb-af31-4244868d4c71)</div>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // Show loading state
        previewContainer.innerHTML = `
            <div style="background: rgba(0, 123, 255, 0.1); padding: 1rem; border-radius: 8px; border: 2px solid #007bff;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-spinner fa-spin" style="color: #007bff; font-size: 1.5rem;"></i>
                    <div style="color: #007bff; font-weight: 600;">Verificando usuario en base de datos...</div>
                </div>
            </div>
        `;

        // Search DIRECTLY in database instead of in-memory array
        try {
            const userInfo = await this.searchUserInDatabase(userId);
            
            if (userInfo) {
                previewContainer.innerHTML = `
                    <div style="background: rgba(40, 167, 69, 0.1); padding: 1rem; border-radius: 8px; border: 2px solid #28a745;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <i class="fas fa-check-circle" style="color: #28a745; font-size: 1.5rem;"></i>
                            <div>
                                <div style="font-weight: 600; color: #28a745;">✅ Usuario encontrado en BD</div>
                                <div style="font-size: 0.9rem; color: #666;">${this.escapeHtml(userInfo.name || 'Usuario')}</div>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9rem; color: #495057;">
                            <div><strong>Email:</strong> ${this.escapeHtml(userInfo.email || 'N/A')}</div>
                            <div><strong>Créditos actuales:</strong> <span style="color: #28a745; font-weight: 600;">${this.formatNumber(userInfo.credits || 0)}</span></div>
                            <div style="grid-column: 1 / -1;">
                                <strong>User ID:</strong> 
                                <code style="background: rgba(0,0,0,0.05); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem;">${this.escapeHtml(userInfo.user_id)}</code>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                previewContainer.innerHTML = `
                    <div style="background: rgba(220, 53, 69, 0.1); padding: 1rem; border-radius: 8px; border: 2px solid #dc3545;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <i class="fas fa-exclamation-triangle" style="color: #dc3545; font-size: 1.5rem;"></i>
                            <div>
                                <div style="font-weight: 600; color: #dc3545;">Usuario no encontrado en BD</div>
                                <div style="font-size: 0.9rem; color: #666;">
                                    Este user_id no existe en la tabla customers.<br>
                                    El usuario debe registrarse primero o crear su cuenta.
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error searching user:', error);
            previewContainer.innerHTML = `
                <div style="background: rgba(220, 53, 69, 0.1); padding: 1rem; border-radius: 8px; border: 2px solid #dc3545;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <i class="fas fa-times-circle" style="color: #dc3545; font-size: 1.5rem;"></i>
                        <div>
                            <div style="font-weight: 600; color: #dc3545;">Error de conexión</div>
                            <div style="font-size: 0.9rem; color: #666;">${this.escapeHtml(error.message)}</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // NEW: Search user directly in database
    async searchUserInDatabase(userId) {
        try {
            // First check customers table
            const { data: customer, error: customerError } = await this.dbService.usersClient
                .from('customers')
                .select('user_id, full_name, email, phone')
                .eq('user_id', userId)
                .maybeSingle();

            if (customerError && customerError.code !== 'PGRST116') {
                throw customerError;
            }

            if (!customer) {
                return null; // User not found
            }

            // Check if has credits record
            const { data: credits, error: creditsError } = await this.dbService.usersClient
                .from('user_ai_credits')
                .select('credits_balance, total_credits_earned, total_credits_spent')
                .eq('user_id', userId)
                .maybeSingle();

            if (creditsError && creditsError.code !== 'PGRST116') {
                console.warn('Error fetching credits:', creditsError);
            }

            return {
                user_id: customer.user_id,
                name: customer.full_name,
                email: customer.email,
                phone: customer.phone,
                credits: credits?.credits_balance || 0,
                total_earned: credits?.total_credits_earned || 0,
                total_spent: credits?.total_credits_spent || 0
            };
        } catch (error) {
            console.error('Error searching user in database:', error);
            throw error;
        }
    }

    async quickAddCredits() {
        const userIdInput = document.getElementById('quickUserId');
        const amountInput = document.getElementById('quickCreditAmount');
        const reasonInput = document.getElementById('quickCreditReason');

        if (!userIdInput || !amountInput) return;

        const userId = userIdInput.value.trim();
        const amount = Number(amountInput.value);
        const reason = reasonInput?.value?.trim() || 'Compra por WhatsApp';

        // Validate user ID
        if (!userId) {
            this.showAlert('Por favor ingresa el User ID del usuario.', 'warning');
            return;
        }

        // Validate UUID format
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidPattern.test(userId)) {
            this.showAlert('El formato del User ID no es válido. Debe ser un UUID.', 'warning');
            return;
        }

        // Validate amount
        if (Number.isNaN(amount) || amount <= 0) {
            this.showAlert('Ingresa una cantidad válida de créditos (mayor a 0).', 'warning');
            return;
        }

        try {
            // Search user in database first
            this.showLoading('Verificando usuario...');
            const userInfo = await this.searchUserInDatabase(userId);

            if (!userInfo) {
                this.hideLoading();
                this.showAlert('❌ Usuario no encontrado en la base de datos. Verifica que el user_id exista en la tabla customers.', 'danger');
                return;
            }

            // Confirm action
            const confirmMessage = `¿Agregar ${this.formatNumber(amount)} créditos a ${this.escapeHtml(userInfo.name || userInfo.email)}?\n\nBalance actual: ${userInfo.credits} créditos\nNuevo balance: ${userInfo.credits + amount} créditos`;
            if (!confirm(confirmMessage)) {
                this.hideLoading();
                return;
            }

            // Add credits
            this.showLoading('Agregando créditos...');
            const result = await this.dbService.addCredits(userId, amount, reason, this.getAdminUser());

            if (result) {
                this.showAlert(
                    `✅ ${this.formatNumber(amount)} créditos agregados exitosamente a ${this.escapeHtml(userInfo.name || userInfo.email)}.\n\nBalance anterior: ${userInfo.credits}\nBalance nuevo: ${result.credits_balance || (userInfo.credits + amount)} créditos`,
                    'success'
                );
                
                // Clear inputs
                userIdInput.value = '';
                amountInput.value = '';
                if (reasonInput) reasonInput.value = '';
                document.getElementById('quickUserPreview').innerHTML = '';
                
                // Reload data
                await this.loadUsersCredits();
            } else {
                this.showAlert('Error agregando créditos: No se recibió respuesta del servidor.', 'danger');
            }
        } catch (error) {
            console.error('Error in quickAddCredits:', error);
            this.showAlert(`❌ Error agregando créditos: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    // ===== CREDIT MANAGEMENT =====

    async addCredits() {
        const userSelect = document.getElementById('userSelect');
        const amountInput = document.getElementById('creditAmount');
        const reasonInput = document.getElementById('creditReason');

        if (!userSelect || !amountInput) return;

        const userId = userSelect.value;
        const amount = Number(amountInput.value);
        const reason = reasonInput?.value?.trim() || 'Créditos agregados manualmente';

        if (!userId || Number.isNaN(amount) || amount <= 0) {
            this.showAlert('Selecciona un usuario e ingresa una cantidad válida positiva.', 'warning');
            return;
        }

        try {
            this.showLoading('Agregando créditos...');
            const result = await this.dbService.addCredits(userId, amount, reason, this.getAdminUser());

            // Si result existe, la operación fue exitosa
            if (result) {
                this.showAlert(`Créditos agregados correctamente.`, 'success');
                await this.loadUsersCredits();
                amountInput.value = '';
                if (reasonInput) reasonInput.value = '';
            } else {
                this.showAlert('Error agregando créditos: No se recibió respuesta del servidor.', 'danger');
            }
        } catch (error) {
            console.error('Error adding credits:', error);
            this.showAlert(`Error agregando créditos: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async subtractCredits() {
        const userSelect = document.getElementById('userSelect');
        const amountInput = document.getElementById('creditAmount');
        const reasonInput = document.getElementById('creditReason');

        if (!userSelect || !amountInput) return;

        const userId = userSelect.value;
        const amount = Number(amountInput.value);
        const reason = reasonInput?.value?.trim() || 'Créditos restados manualmente';

        if (!userId || Number.isNaN(amount) || amount <= 0) {
            this.showAlert('Selecciona un usuario e ingresa una cantidad válida positiva.', 'warning');
            return;
        }

        const user = this.getUserById(userId);
        if (user && amount > (user.credits || 0)) {
            this.showAlert('No se pueden restar más créditos de los que el usuario tiene.', 'warning');
            return;
        }

        try {
            this.showLoading('Restando créditos...');
            const result = await this.dbService.addCredits(userId, -amount, reason, this.getAdminUser());

            // Si result existe, la operación fue exitosa
            if (result) {
                this.showAlert(`Créditos restados correctamente.`, 'success');
                await this.loadUsersCredits();
                amountInput.value = '';
                if (reasonInput) reasonInput.value = '';
            } else {
                this.showAlert('Error restando créditos: No se recibió respuesta del servidor.', 'danger');
            }
        } catch (error) {
            console.error('Error subtracting credits:', error);
            this.showAlert(`Error restando créditos: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async setCredits() {
        const userSelect = document.getElementById('userSelect');
        const amountInput = document.getElementById('creditAmount');
        const reasonInput = document.getElementById('creditReason');

        if (!userSelect || !amountInput) return;

        const userId = userSelect.value;
        const newAmount = Number(amountInput.value);
        const reason = reasonInput?.value?.trim() || 'Saldo establecido manualmente';

        if (!userId || Number.isNaN(newAmount) || newAmount < 0) {
            this.showAlert('Selecciona un usuario e ingresa una cantidad válida (mayor o igual a cero).', 'warning');
            return;
        }

        try {
            this.showLoading('Estableciendo saldo de créditos...');
            const result = await this.dbService.updateCredits(userId, newAmount, reason, this.getAdminUser());

            // Si result existe, la operación fue exitosa
            if (result) {
                this.showAlert(`Saldo establecido correctamente.`, 'success');
                await this.loadUsersCredits();
                amountInput.value = '';
                if (reasonInput) reasonInput.value = '';
            } else {
                this.showAlert('Error estableciendo saldo: No se recibió respuesta del servidor.', 'danger');
            }
        } catch (error) {
            console.error('Error setting credits:', error);
            this.showAlert(`Error estableciendo saldo: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async resetCredits() {
        const userSelect = document.getElementById('userSelect');
        const reasonInput = document.getElementById('creditReason');

        if (!userSelect) return;

        const userId = userSelect.value;
        const reason = reasonInput?.value?.trim() || 'Saldo reiniciado a cero';

        if (!userId) {
            this.showAlert('Selecciona un usuario para reiniciar su saldo.', 'warning');
            return;
        }

        const user = this.getUserById(userId);
        if (!user) {
            this.showAlert('Usuario no encontrado.', 'danger');
            return;
        }

        if (!confirm(`¿Reiniciar el saldo de ${this.escapeHtml(user.name || user.email)} a cero?`)) return;

        try {
            this.showLoading('Reiniciando saldo...');
            const result = await this.dbService.updateCredits(userId, 0, reason, this.getAdminUser());

            // Si result existe, la operación fue exitosa
            if (result) {
                this.showAlert('Saldo reiniciado correctamente.', 'success');
                await this.loadUsersCredits();
                if (reasonInput) reasonInput.value = '';
            } else {
                this.showAlert('Error reiniciando saldo: No se recibió respuesta del servidor.', 'danger');
            }
        } catch (error) {
            console.error('Error resetting credits:', error);
            this.showAlert(`Error reiniciando saldo: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    // ===== REPORTS =====

    async showAllUsers() {
        try {
            this.showLoading('Cargando todos los usuarios...');
            const users = this.users || [];

            if (!users.length) {
                this.showAlert('No hay usuarios registrados en la base de datos.', 'info');
                return;
            }

            this.renderAllUsersModal(users);
        } catch (error) {
            console.error('Error loading all users:', error);
            this.showAlert(`Error cargando usuarios: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async showUsersWithCredits() {
        try {
            this.showLoading('Cargando usuarios con créditos...');
            const usersWithCredits = this.users.filter(user => (user.credits || 0) > 0);

            if (!usersWithCredits.length) {
                this.showAlert('No hay usuarios con créditos actualmente.', 'info');
                return;
            }

            this.renderUsersWithCreditsModal(usersWithCredits);
        } catch (error) {
            console.error('Error loading users with credits:', error);
            this.showAlert(`Error cargando usuarios con créditos: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async showUsersWithoutCredits() {
        try {
            this.showLoading('Cargando usuarios sin créditos...');
            const usersWithoutCredits = this.users.filter(user => (user.credits || 0) === 0);

            if (!usersWithoutCredits.length) {
                this.showAlert('¡Excelente! Todos los usuarios tienen créditos.', 'success');
                return;
            }

            this.renderUsersWithoutCreditsModal(usersWithoutCredits);
        } catch (error) {
            console.error('Error loading users without credits:', error);
            this.showAlert(`Error cargando usuarios sin créditos: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async exportCredits() {
        try {
            this.showLoading('Generando archivo de exportación...');
            const csv = this.generateCreditsCSV(this.users || []);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `creditos_usuarios_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            this.showAlert('Archivo exportado correctamente.', 'success');
        } catch (error) {
            console.error('Error exporting credits:', error);
            this.showAlert(`Error exportando créditos: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async loadCreditsReport() {
        try {
            this.showLoading('Generando reporte de créditos...');
            // Note: This would need to be implemented in the database service
            // For now, calculate basic stats from current data
            const totalUsers = this.users.length;
            const usersWithCredits = this.users.filter(user => (user.credits || 0) > 0).length;
            const totalCredits = this.users.reduce((sum, user) => sum + (user.credits || 0), 0);
            const averageCredits = totalUsers > 0 ? totalCredits / totalUsers : 0;

            this.renderCreditsReportModal({
                totalUsers,
                usersWithCredits,
                usersWithoutCredits: totalUsers - usersWithCredits,
                totalCredits,
                averageCredits
            });
        } catch (error) {
            console.error('Error generating credits report:', error);
            this.showAlert(`Error generando reporte: ${error.message}`, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    // ===== UTILITY METHODS =====

    getUserById(userId) {
        if (!userId) return null;
        return this.users.find(user => String(user.id) === String(userId)) || null;
    }

    populateSelectors() {
        const userSelect = document.getElementById('userSelect');

        if (userSelect) {
            this.populateUserSelect(userSelect, 'Seleccionar usuario...');
        }
    }

    populateUserSelect(selectElement, placeholder) {
        const prevValue = selectElement.value;
        selectElement.innerHTML = '';

        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = placeholder;
        selectElement.appendChild(placeholderOption);

        this.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.name || user.email} (${this.formatNumber(user.credits || 0)} créditos)`;
            selectElement.appendChild(option);
        });

        if (prevValue && this.users.some(user => String(user.id) === String(prevValue))) {
            selectElement.value = prevValue;
        }
    }

    loadUserDetails() {
        const select = document.getElementById('userSelect');
        const detailsContainer = document.getElementById('userDetails');

        if (!select || !detailsContainer) return;

        const user = this.getUserById(select.value);
        if (!user) {
            detailsContainer.innerHTML = '<p style="color: #666;">Selecciona un usuario para ver detalles.</p>';
            return;
        }

        const lastActivity = user.last_activity ? this.formatDate(user.last_activity) : 'Nunca';
        const registrationDate = user.created_at ? this.formatDate(user.created_at) : 'Desconocida';

        detailsContainer.innerHTML = `
            <div class="user-details">
                <h4>${this.escapeHtml(user.name || 'Usuario')}</h4>
                <p><strong>Email:</strong> ${this.escapeHtml(user.email)}</p>
                <p><strong>User ID:</strong> <code style="background: rgba(0,0,0,0.05); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem; user-select: all;">${this.escapeHtml(user.id)}</code></p>
                <p><strong>Créditos actuales:</strong> <span class="credits-amount">${this.formatNumber(user.credits || 0)}</span></p>
                <p><strong>Última actividad:</strong> ${lastActivity}</p>
                <p><strong>Fecha de registro:</strong> ${registrationDate}</p>
            </div>
        `;
    }

    filterUsers() {
        const searchInput = document.getElementById('userSearch');
        const searchTerm = searchInput?.value?.toLowerCase() || '';

        if (!searchTerm) {
            this.renderCreditsTable();
            return;
        }

        const filteredUsers = this.users.filter(user =>
            (user.name || '').toLowerCase().includes(searchTerm) ||
            (user.email || '').toLowerCase().includes(searchTerm)
        );

        this.renderCreditsTable(filteredUsers);
    }

    // ===== MODAL RENDERING =====

    renderAllUsersModal(users) {
        let rows = '';
        let totalCredits = 0;
        let activeUsers = 0;

        users.forEach(user => {
            const credits = Number(user.credits || 0);
            totalCredits += credits;
            if (credits > 0) activeUsers += 1;

            const lastActivity = user.last_activity ? this.formatDate(user.last_activity) : 'Nunca';
            const statusBadge = credits > 0
                ? '<span style="background: rgba(40, 167, 69, 0.12); color: #28a745; padding: 0.25rem 0.6rem; border-radius: 8px; font-weight: 600;"><i class="fas fa-coins"></i> Con créditos</span>'
                : '<span style="background: rgba(108, 117, 125, 0.12); color: #6c757d; padding: 0.25rem 0.6rem; border-radius: 8px; font-weight: 600;"><i class="fas fa-circle"></i> Sin créditos</span>';

            rows += `
                <tr>
                    <td>
                        <div class="user-name">
                            <i class="fas fa-user" style="color: #2a5298;"></i>
                            ${this.escapeHtml(user.name || 'Usuario')}
                        </div>
                        <small style="color: #666; margin-left: 1.5rem;">${this.escapeHtml(user.email)}</small>
                        <small style="color: #999; margin-left: 1.5rem; font-family: monospace; font-size: 0.75rem;">ID: ${this.escapeHtml(user.id)}</small>
                    </td>
                    <td>
                        <span class="credits-display">${this.formatNumber(credits)}</span>
                    </td>
                    <td>${statusBadge}</td>
                    <td>${lastActivity}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-sm btn-info" onclick="creditsManagement.selectUser('${user.id}')" title="Seleccionar usuario">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-sm btn-success" onclick="creditsManagement.copyUserId('${user.id}')" title="Copiar User ID">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="btn-sm btn-warning" onclick="creditsManagement.addCreditsToUser('${user.id}', 100)" title="Agregar 100 créditos">
                                <i class="fas fa-plus"></i> +100
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        const html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3>Todos los usuarios (${users.length})</h3>
                <div class="action-buttons">
                    <button class="btn-sm btn-success" onclick="creditsManagement.addNewUser()">
                        <i class="fas fa-user-plus"></i> Nuevo usuario
                    </button>
                    <button class="btn-sm btn-info" onclick="creditsManagement.exportCredits()">
                        <i class="fas fa-download"></i> Exportar
                    </button>
                </div>
            </div>
            <div class="table-container" style="max-height: 600px;">
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Créditos</th>
                            <th>Estado</th>
                            <th>Última actividad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <div class="stats-grid" style="margin-top: 1.5rem;">
                <div class="stat-card">
                    <i class="fas fa-users"></i>
                    <div class="value">${users.length}</div>
                    <div class="label">Total usuarios</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-coins"></i>
                    <div class="value">${activeUsers}</div>
                    <div class="label">Con créditos</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-circle"></i>
                    <div class="value">${users.length - activeUsers}</div>
                    <div class="label">Sin créditos</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-calculator"></i>
                    <div class="value">${this.formatNumber(totalCredits)}</div>
                    <div class="label">Total créditos</div>
                </div>
            </div>
        `;

        this.showModal(html);
    }

    renderUsersWithCreditsModal(users) {
        let rows = '';
        let totalCredits = 0;

        users.forEach(user => {
            const credits = Number(user.credits || 0);
            totalCredits += credits;

            const lastActivity = user.last_activity ? this.formatDate(user.last_activity) : 'Nunca';

            rows += `
                <tr>
                    <td>
                        <div class="user-name">
                            <i class="fas fa-user" style="color: #28a745;"></i>
                            ${this.escapeHtml(user.name || 'Usuario')}
                        </div>
                        <small style="color: #666; margin-left: 1.5rem;">${this.escapeHtml(user.email)}</small>
                    </td>
                    <td>
                        <span class="credits-display credits-positive">${this.formatNumber(credits)}</span>
                    </td>
                    <td>${lastActivity}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-sm btn-info" onclick="creditsManagement.selectUser(${user.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-sm btn-warning" onclick="creditsManagement.subtractCreditsFromUser(${user.id}, 50)">
                                <i class="fas fa-minus"></i> -50
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        const html = `
            <h3>Usuarios con créditos (${users.length})</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Créditos</th>
                            <th>Última actividad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <div class="stats-summary" style="margin-top: 1.5rem; padding: 1rem; background: rgba(40, 167, 69, 0.1); border-radius: 8px;">
                <h4 style="margin: 0 0 0.5rem 0; color: #28a745;">Resumen</h4>
                <p style="margin: 0; font-weight: 600;">Total de créditos en circulación: ${this.formatNumber(totalCredits)}</p>
                <p style="margin: 0.25rem 0 0 0; color: #666;">Promedio por usuario: ${this.formatNumber(totalCredits / users.length)}</p>
            </div>
        `;

        this.showModal(html);
    }

    renderUsersWithoutCreditsModal(users) {
        let rows = '';

        users.forEach(user => {
            const lastActivity = user.last_activity ? this.formatDate(user.last_activity) : 'Nunca';
            const registrationDate = user.created_at ? this.formatDate(user.created_at) : 'Desconocida';

            rows += `
                <tr>
                    <td>
                        <div class="user-name">
                            <i class="fas fa-user" style="color: #6c757d;"></i>
                            ${this.escapeHtml(user.name || 'Usuario')}
                        </div>
                        <small style="color: #666; margin-left: 1.5rem;">${this.escapeHtml(user.email)}</small>
                    </td>
                    <td>${lastActivity}</td>
                    <td>${registrationDate}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-sm btn-success" onclick="creditsManagement.addCreditsToUser(${user.id}, 100)">
                                <i class="fas fa-coins"></i> Dar créditos
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        const html = `
            <h3>Usuarios sin créditos (${users.length})</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Última actividad</th>
                            <th>Fecha de registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <div class="stats-summary" style="margin-top: 1.5rem; padding: 1rem; background: rgba(255, 193, 7, 0.1); border-radius: 8px;">
                <h4 style="margin: 0 0 0.5rem 0; color: #856404;">Oportunidad</h4>
                <p style="margin: 0;">Estos usuarios podrían beneficiarse de una promoción o regalo de créditos de bienvenida.</p>
            </div>
        `;

        this.showModal(html);
    }

    renderCreditsReportModal(report) {
        const html = `
            <h3>Reporte de créditos</h3>
            <div class="stats-grid mb-2">
                <div class="stat-card">
                    <i class="fas fa-users"></i>
                    <div class="value">${report.totalUsers}</div>
                    <div class="label">Total usuarios</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-coins"></i>
                    <div class="value">${report.usersWithCredits}</div>
                    <div class="label">Con créditos</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-circle"></i>
                    <div class="value">${report.usersWithoutCredits}</div>
                    <div class="label">Sin créditos</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-calculator"></i>
                    <div class="value">${this.formatNumber(report.totalCredits)}</div>
                    <div class="label">Total créditos</div>
                </div>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fas fa-chart-line"></i>
                    <div class="value">${Math.round((report.usersWithCredits / report.totalUsers) * 100)}%</div>
                    <div class="label">Usuarios activos</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-balance-scale"></i>
                    <div class="value">${this.formatNumber(report.averageCredits)}</div>
                    <div class="label">Promedio por usuario</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-trophy"></i>
                    <div class="value">${this.formatNumber(Math.max(...this.users.map(u => u.credits || 0)))}</div>
                    <div class="label">Máximo individual</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-percentage"></i>
                    <div class="value">${Math.round((report.usersWithoutCredits / report.totalUsers) * 100)}%</div>
                    <div class="label">Sin actividad</div>
                </div>
            </div>
        `;

        this.showModal(html);
    }

    renderCreditsTable(users = null) {
        const container = document.getElementById('creditsTableContainer');
        if (!container) return;

        const displayUsers = users || this.users;
        let rows = '';

        displayUsers.slice(0, 50).forEach(user => {
            const credits = Number(user.credits || 0);
            const lastActivity = user.last_activity ? this.formatDate(user.last_activity) : 'Nunca';

            const creditsClass = credits > 0 ? 'credits-positive' : 'credits-zero';

            rows += `
                <tr>
                    <td>
                        <div>${this.escapeHtml(user.name || 'Usuario')}</div>
                        <small style="color: #666; font-size: 0.85rem;">${this.escapeHtml(user.email)}</small>
                        <small style="color: #999; font-family: monospace; font-size: 0.75rem; display: block; margin-top: 0.25rem;">
                            ID: ${this.escapeHtml(user.id)}
                        </small>
                    </td>
                    <td>
                        <span class="credits-display ${creditsClass}">${this.formatNumber(credits)}</span>
                    </td>
                    <td>${lastActivity}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-sm btn-info" onclick="creditsManagement.selectUser('${user.id}')" title="Seleccionar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-sm btn-success" onclick="creditsManagement.copyUserId('${user.id}')" title="Copiar ID">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Créditos</th>
                        <th>Última actividad</th>
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

    generateCreditsCSV(users) {
        const headers = [
            'ID',
            'Nombre',
            'Email',
            'Créditos',
            'Última actividad',
            'Fecha de registro'
        ];

        const rows = users.map(user => [
            user.id,
            `"${user.name || ''}"`,
            `"${user.email}"`,
            Number(user.credits || 0),
            user.last_activity || '',
            user.created_at || ''
        ].join(','));

        return [headers.join(','), ...rows].join('\n');
    }

    getAdminUser() {
        return localStorage.getItem('adminUser') || 'admin';
    }

    // ===== EVENT HANDLERS =====

    handleCreditManagement(event) {
        event.preventDefault();
        // Handle credit management form submission
        console.log('Credit management form submitted');
    }

    // ===== ADDITIONAL METHODS =====

    selectUser(userId) {
        this.closeModal();
        const userSelect = document.getElementById('userSelect');
        if (userSelect) {
            userSelect.value = String(userId);
        }
        this.loadUserDetails();
        
        // Also populate the quick add section
        const quickUserIdInput = document.getElementById('quickUserId');
        if (quickUserIdInput) {
            quickUserIdInput.value = String(userId);
            this.handleQuickUserIdInput();
        }
        
        this.showAlert('Usuario seleccionado para gestión.', 'info');
        
        // Scroll to management section
        const managementSection = document.querySelector('.management-section');
        if (managementSection) {
            managementSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    async copyUserId(userId) {
        try {
            await navigator.clipboard.writeText(userId);
            this.showAlert(`User ID copiado: ${userId}`, 'success');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            
            // Fallback: create temporary input
            const tempInput = document.createElement('input');
            tempInput.value = userId;
            tempInput.style.position = 'absolute';
            tempInput.style.left = '-9999px';
            document.body.appendChild(tempInput);
            tempInput.select();
            
            try {
                document.execCommand('copy');
                this.showAlert(`User ID copiado: ${userId}`, 'success');
            } catch (err) {
                this.showAlert('Error copiando el User ID. Por favor cópialo manualmente.', 'danger');
            }
            
            document.body.removeChild(tempInput);
        }
    }

    addCreditsToUser(userId, amount) {
        this.closeModal();
        const userSelect = document.getElementById('userSelect');
        const amountInput = document.getElementById('creditAmount');

        if (userSelect && amountInput) {
            userSelect.value = String(userId);
            amountInput.value = amount;
            this.loadUserDetails();
            this.showAlert(`Preparado para agregar ${this.formatNumber(amount)} créditos.`, 'info');
        }
    }

    subtractCreditsFromUser(userId, amount) {
        this.closeModal();
        const userSelect = document.getElementById('userSelect');
        const amountInput = document.getElementById('creditAmount');

        if (userSelect && amountInput) {
            userSelect.value = String(userId);
            amountInput.value = amount;
            this.loadUserDetails();
            this.showAlert(`Preparado para restar ${this.formatNumber(amount)} créditos.`, 'info');
        }
    }

    viewUserHistory(userId) {
        this.closeModal();
        // This would open user credit history modal
        console.log('View user history for:', userId);
        this.showAlert('Funcionalidad de historial próximamente disponible.', 'info');
    }

    addNewUser() {
        this.closeModal();
        // This would open add user modal
        console.log('Add new user functionality');
        this.showAlert('Funcionalidad de agregar usuario próximamente disponible.', 'info');
    }
}

// Create and export singleton instance
const creditsManagement = new CreditsManagement();
window.creditsManagement = creditsManagement;

export default creditsManagement;