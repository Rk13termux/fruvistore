/**
 * Admin Database Service
 * Centralized database service for all admin operations
 * Provides unified access to products, boxes, credits, and analytics
 * Uses the database distributor pattern from supabaseService.js
 */

import { getUsersClient, getProductsClient, initializeDatabases } from './supabaseService.js';

class AdminDatabaseService {
    constructor() {
        this.initialized = false;
        this.usersClient = null;
        this.productsClient = null;
    }

    async initialize() {
        if (this.initialized) return true;

        try {
            console.log('🔄 Initializing Admin Database Service with direct imports...');

            // Initialize databases directly
            const clients = await initializeDatabases();
            this.usersClient = clients.usersClient;
            this.productsClient = clients.productsClient;

            this.initialized = true;
            console.log('✅ Admin Database Service initialized with direct imports');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Admin Database Service:', error);
            throw error;
        }
    }

    // ===== PRODUCTS MANAGEMENT =====

    async getAllProducts() {
        await this.ensureInitialized();
        try {
            console.log('🔎 Consultando current_products en Supabase...');
            const { data, error } = await this.productsClient
                .from('current_products')
                .select('*')
                .order('name');

            if (error) {
                console.error('❌ Error en query de productos:', error);
                throw error;
            }
            
            console.log('✅ Productos recibidos de Supabase:', {
                total: data?.length || 0,
                primeros_3: data?.slice(0, 3).map(p => ({
                    id: p.id,
                    nombre: p.name,
                    is_active: p.is_active,
                    available: p.available
                }))
            });
            
            // Contar inactivos en los datos recibidos
            const inactivosEnDB = data?.filter(p => p.is_active === false || p.available === false).length || 0;
            console.log(`📊 Productos inactivos en la base de datos: ${inactivosEnDB}`);
            
            return data || [];
        } catch (error) {
            console.error('❌ Error fetching products:', error);
            throw error;
        }
    }

    async updateProductPrice(productId, newPrice, reason = 'Manual update', updatedBy = 'admin') {
        await this.ensureInitialized();
        try {
            // Get current price from view
            const { data: current } = await this.productsClient
                .from('current_products')
                .select('price_per_kg')
                .eq('id', productId)
                .single();

            // Log price change in price_updates_log
            try {
                await this.productsClient
                    .from('price_updates_log')
                    .insert([{
                        product_id: productId,
                        old_price: current?.price_per_kg || 0,
                        new_price: newPrice,
                        update_reason: reason,
                        updated_by: updatedBy
                    }]);
            } catch (logError) {
                console.warn('Price history logging failed:', logError.message);
            }

            // Update product price in management_product_prices (where is_current = true)
            const { data, error } = await this.productsClient
                .from('management_product_prices')
                .update({
                    price_per_kg: newPrice,
                    updated_at: new Date().toISOString()
                })
                .eq('product_id', productId)
                .eq('is_current', true)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating product price:', error);
            throw error;
        }
    }

    async updateStock(productId, quantityChange, reason) {
        await this.ensureInitialized();
        try {
            const { data: current } = await this.productsClient
                .from('current_products')
                .select('stock_kg')
                .eq('id', productId)
                .single();

            const currentStock = current?.stock_kg || 0;
            const newStock = Math.max(0, currentStock + quantityChange);

            // Update stock in management_product_prices (where is_current = true)
            const { data, error } = await this.productsClient
                .from('management_product_prices')
                .update({
                    stock_kg: newStock,
                    updated_at: new Date().toISOString()
                })
                .eq('product_id', productId)
                .eq('is_current', true)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating stock:', error);
            throw error;
        }
    }

    async createProduct(productData) {
        await this.ensureInitialized();
        try {
            // Separar datos entre producto y precio
            const productInfo = {
                name: productData.name,
                category: productData.category,
                description: productData.description,
                image_url: productData.image_url,
                season: productData.season,
                is_active: productData.is_active !== undefined ? productData.is_active : true
            };

            const priceInfo = {
                price_per_kg: productData.price_per_kg || 0,
                cost_per_kg: productData.cost_per_kg || 0,
                stock_kg: productData.stock_kg || 0,
                min_stock_kg: productData.min_stock_kg || 10,
                is_organic: productData.is_organic || false,
                rating: productData.rating || 4.0,
                origin: productData.origin || 'Colombia',
                supplier: productData.supplier || null,
                is_current: true
            };

            // 1. Crear producto básico
            const { data: product, error: productError } = await this.productsClient
                .from('management_products')
                .insert([productInfo])
                .select()
                .single();

            if (productError) throw productError;

            // 2. Crear precio asociado
            priceInfo.product_id = product.id;
            const { data: price, error: priceError } = await this.productsClient
                .from('management_product_prices')
                .insert([priceInfo])
                .select()
                .single();

            if (priceError) throw priceError;

            return { ...product, ...price };
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    async updateProduct(productId, updates) {
        await this.ensureInitialized();
        try {
            console.log('🔧 Updating product:', productId, updates);
            
            // Separar actualizaciones entre producto y precio
            const productUpdates = {};
            const priceUpdates = {};

            // Campos de management_products
            const productFields = ['name', 'category', 'description', 'image_url', 'season', 'is_active', 'available', 'inactive_reason'];
            // Campos de management_product_prices
            const priceFields = ['price_per_kg', 'cost_per_kg', 'stock_kg', 'min_stock_kg', 'is_organic', 'rating', 'origin', 'supplier'];

            Object.keys(updates).forEach(key => {
                if (productFields.includes(key)) {
                    productUpdates[key] = updates[key];
                } else if (priceFields.includes(key)) {
                    priceUpdates[key] = updates[key];
                }
            });

            // Actualizar tabla de productos si hay cambios
            if (Object.keys(productUpdates).length > 0) {
                productUpdates.updated_at = new Date().toISOString();
                console.log('📝 Updating management_products:', productUpdates);
                
                const { data, error } = await this.productsClient
                    .from('management_products')
                    .update(productUpdates)
                    .eq('id', productId)
                    .select()
                    .single();

                if (error) {
                    console.error('❌ Error updating product:', error);
                    throw error;
                }
                console.log('✅ Product updated:', data);
            }

            // Actualizar tabla de precios si hay cambios
            if (Object.keys(priceUpdates).length > 0) {
                priceUpdates.updated_at = new Date().toISOString();
                console.log('📝 Updating management_product_prices:', priceUpdates);
                
                const { data, error } = await this.productsClient
                    .from('management_product_prices')
                    .update(priceUpdates)
                    .eq('product_id', productId)
                    .eq('is_current', true)
                    .select()
                    .single();

                if (error) {
                    console.error('❌ Error updating price:', error);
                    throw error;
                }
                console.log('✅ Price updated:', data);
            }

            return true;
        } catch (error) {
            console.error('❌ Error in updateProduct:', error);
            throw error;
        }
    }

    async updateCompleteProduct(productId, updates) {
        await this.ensureInitialized();
        try {
            // Separar actualizaciones entre producto y precio
            const productUpdates = {};
            const priceUpdates = {};

            // Campos de management_products
            const productFields = ['name', 'category', 'description', 'image_url', 'season', 'is_active'];
            // Campos de management_product_prices
            const priceFields = ['price_per_kg', 'cost_per_kg', 'stock_kg', 'min_stock_kg', 'is_organic', 'rating', 'origin', 'supplier'];

            Object.keys(updates).forEach(key => {
                if (productFields.includes(key)) {
                    productUpdates[key] = updates[key];
                } else if (priceFields.includes(key)) {
                    priceUpdates[key] = updates[key];
                }
            });

            let productResult = null;
            let priceResult = null;

            // Actualizar tabla de productos si hay cambios
            if (Object.keys(productUpdates).length > 0) {
                productUpdates.updated_at = new Date().toISOString();
                const { data, error } = await this.productsClient
                    .from('management_products')
                    .update(productUpdates)
                    .eq('id', productId)
                    .select()
                    .single();

                if (error) throw error;
                productResult = data;
            }

            // Actualizar tabla de precios si hay cambios
            if (Object.keys(priceUpdates).length > 0) {
                priceUpdates.updated_at = new Date().toISOString();
                const { data, error } = await this.productsClient
                    .from('management_product_prices')
                    .update(priceUpdates)
                    .eq('product_id', productId)
                    .eq('is_current', true)
                    .select()
                    .single();

                if (error) throw error;
                priceResult = data;
            }

            return { ...productResult, ...priceResult };
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async deleteProduct(productId) {
        await this.ensureInitialized();
        try {
            // Eliminar producto (los precios se eliminarán en cascada por la FK)
            const { error } = await this.productsClient
                .from('management_products')
                .delete()
                .eq('id', productId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    // ===== BOXES MANAGEMENT =====

    async getAllBoxes() {
        await this.ensureInitialized();
        try {
            const { data, error } = await this.productsClient
                .from('current_boxes')
                .select('*')
                .order('featured', { ascending: false })
                .order('name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching boxes:', error);
            throw error;
        }
    }

    async getBoxWithContents(boxId) {
        await this.ensureInitialized();
        try {
            const { data: box, error: boxError } = await this.productsClient
                .from('current_boxes')
                .select('*')
                .eq('id', boxId)
                .single();

            if (boxError) throw boxError;

            const { data: contents, error: contentsError } = await this.productsClient
                .from('box_contents')
                .select('*')
                .eq('box_id', boxId)
                .order('display_order');

            if (contentsError) throw contentsError;

            return { ...box, contents: contents || [] };
        } catch (error) {
            console.error('Error fetching box with contents:', error);
            throw error;
        }
    }

    async createBox(boxData) {
        await this.ensureInitialized();
        try {
            const { data, error } = await this.productsClient
                .from('current_boxes')
                .insert([boxData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating box:', error);
            throw error;
        }
    }

    async updateBox(boxId, updates) {
        await this.ensureInitialized();
        try {
            const { data, error } = await this.productsClient
                .from('current_boxes')
                .update(updates)
                .eq('id', boxId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating box:', error);
            throw error;
        }
    }

    async deleteBox(boxId) {
        await this.ensureInitialized();
        try {
            const { error } = await this.productsClient
                .from('current_boxes')
                .delete()
                .eq('id', boxId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting box:', error);
            throw error;
        }
    }

    async updateBoxPrice(boxId, newPriceCOP, reasonOrNewPriceUSD, reason) {
        await this.ensureInitialized();
        try {
            // Permitir flexibilidad: si el tercer parámetro es string, es el reason
            // Si es número, es newPriceUSD
            let newPriceUSD;
            let updateReason;
            
            if (typeof reasonOrNewPriceUSD === 'string') {
                // Solo se pasó precio COP y reason
                updateReason = reasonOrNewPriceUSD;
                // Calcular USD automáticamente (tasa aproximada: 1 USD = 4000 COP)
                newPriceUSD = Math.round((newPriceCOP / 4000) * 100) / 100;
            } else if (typeof reasonOrNewPriceUSD === 'number') {
                // Se pasaron ambos precios
                newPriceUSD = reasonOrNewPriceUSD;
                updateReason = reason || 'Manual update';
            } else {
                // Por defecto
                updateReason = 'Manual update';
                newPriceUSD = Math.round((newPriceCOP / 4000) * 100) / 100;
            }

            const { data: currentBox } = await this.productsClient
                .from('current_boxes')
                .select('price_cop, price_usd')
                .eq('id', boxId)
                .single();

            // Intentar registrar en historial (puede fallar si la tabla no existe)
            try {
                await this.productsClient
                    .from('box_price_history')
                    .insert([{
                        box_id: boxId,
                        old_price_cop: currentBox?.price_cop || 0,
                        new_price_cop: newPriceCOP,
                        old_price_usd: currentBox?.price_usd || 0,
                        new_price_usd: newPriceUSD,
                        change_reason: updateReason,
                        updated_by: 'admin'
                    }]);
            } catch (logError) {
                console.warn('Box price history logging failed:', logError.message);
            }

            const { data, error } = await this.productsClient
                .from('current_boxes')
                .update({
                    price_cop: newPriceCOP,
                    price_usd: newPriceUSD,
                    updated_at: new Date().toISOString()
                })
                .eq('id', boxId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating box price:', error);
            throw error;
        }
    }

    async updateBoxStock(boxId, change) {
        await this.ensureInitialized();
        try {
            const { data: current, error: fetchError } = await this.productsClient
                .from('current_boxes')
                .select('stock_quantity, available')
                .eq('id', boxId)
                .single();

            if (fetchError) throw fetchError;

            const delta = Number(change || 0);
            const previousStock = Number(current?.stock_quantity || 0);
            const newStock = Math.max(0, previousStock + delta);

            const updates = {
                stock_quantity: newStock,
                in_stock: newStock > 0,
                updated_at: new Date().toISOString()
            };

            if (newStock <= 0) {
                updates.available = false;
            }

            const { data, error } = await this.productsClient
                .from('current_boxes')
                .update(updates)
                .eq('id', boxId)
                .select('id, name, category, stock_quantity, available')
                .single();

            if (error) throw error;

            return {
                box: data,
                previousStock,
                newStock,
                change: delta
            };
        } catch (error) {
            console.error('Error adjusting box stock:', error);
            throw error;
        }
    }

    async updateBoxStatus(boxId, status) {
        await this.ensureInitialized();
        try {
            let updates = {};

            switch(status) {
                case 'active':
                    updates = { available: true, in_stock: true };
                    break;
                case 'inactive':
                    updates = { available: false };
                    break;
                case 'featured':
                    updates = { featured: true };
                    break;
                case 'unfeatured':
                    updates = { featured: false };
                    break;
            }

            const { data, error } = await this.productsClient
                .from('current_boxes')
                .update(updates)
                .eq('id', boxId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating box status:', error);
            throw error;
        }
    }

    async updateBoxContents(boxId, items) {
        await this.ensureInitialized();
        try {
            const entries = Array.isArray(items) ? items : [];
            const sanitized = entries
                .map((item, index) => {
                    const name = typeof item === 'string'
                        ? item.trim()
                        : (item && item.product_name ? String(item.product_name).trim() : '');
                    if (!name) {
                        return null;
                    }
                    return {
                        box_id: boxId,
                        product_name: name,
                        display_order: index + 1
                    };
                })
                .filter(Boolean);

            await this.productsClient
                .from('box_contents')
                .delete()
                .eq('box_id', boxId);

            if (!sanitized.length) {
                return [];
            }

            const { data, error } = await this.productsClient
                .from('box_contents')
                .insert(sanitized)
                .select();

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error updating box contents:', error);
            throw error;
        }
    }

    // ===== CREDITS MANAGEMENT =====

    async getUsersCredits() {
        await this.ensureInitialized();
        try {
            console.log('📊 Cargando usuarios con créditos desde BD...');
            
            // Get credits data
            const { data: creditsData, error: creditsError } = await this.usersClient
                .from('user_ai_credits')
                .select('*')
                .order('created_at', { ascending: false });

            if (creditsError) throw creditsError;

            console.log(`✅ ${creditsData?.length || 0} registros de créditos encontrados`);

            // Get customer info for all users
            const userIds = creditsData?.map(c => c.user_id) || [];
            if (userIds.length === 0) {
                console.log('⚠️ No hay usuarios con créditos');
                return [];
            }

            const { data: customersData, error: customersError } = await this.usersClient
                .from('customers')
                .select('user_id, id, email, full_name, phone, created_at')
                .in('user_id', userIds);

            if (customersError) {
                console.warn('⚠️ No se pudo obtener datos de customers:', customersError);
            }

            // Create map for easy lookup
            const customerMap = new Map(customersData?.map(c => [c.user_id, c]) || []);

            // Transform to format expected by admin panel
            const transformedData = creditsData.map(credit => {
                const customer = customerMap.get(credit.user_id);
                return {
                    id: credit.user_id, // IMPORTANT: usar user_id como id para búsquedas
                    user_id: credit.user_id,
                    name: customer?.full_name || 'Usuario',
                    email: customer?.email || 'Sin email',
                    phone: customer?.phone || '',
                    credits: credit.credits_balance,
                    credits_balance: credit.credits_balance,
                    total_credits_earned: credit.total_credits_earned,
                    total_credits_spent: credit.total_credits_spent,
                    last_activity: credit.last_credit_update,
                    created_at: customer?.created_at || credit.created_at,
                    // Incluir los datos originales también
                    _credit_record: credit,
                    _customer_record: customer
                };
            });

            console.log(`✅ ${transformedData.length} usuarios transformados correctamente`);
            return transformedData;
        } catch (error) {
            console.error('❌ Error fetching users credits:', error);
            throw error;
        }
    }

    async addCredits(userId, amount, reason, addedBy = 'admin') {
        await this.ensureInitialized();
        try {
            console.log(`💰 Agregando ${amount} créditos a usuario ${userId}`);

            // 1. Get current credits balance
            const { data: currentData, error: fetchError } = await this.usersClient
                .from('user_ai_credits')
                .select('credits_balance, total_credits_earned, total_credits_spent')
                .eq('user_id', userId)
                .maybeSingle();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            // 2. If user doesn't exist in user_ai_credits, create with initial + new credits
            if (!currentData) {
                console.log(`🆕 Usuario no existe en user_ai_credits, creando con ${25 + amount} créditos`);
                
                // Get user name
                const { data: customer } = await this.usersClient
                    .from('customers')
                    .select('full_name')
                    .eq('user_id', userId)
                    .maybeSingle();

                const userName = customer?.full_name || 'Usuario';
                const initialCredits = 25;
                const totalCredits = initialCredits + amount;

                const { data: newData, error: insertError } = await this.usersClient
                    .from('user_ai_credits')
                    .insert({
                        user_id: userId,
                        credits_balance: totalCredits,
                        total_credits_earned: totalCredits,
                        total_credits_spent: 0,
                        last_credit_update: new Date().toISOString(),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;

                // Record transactions
                try {
                    await this.usersClient
                        .from('credit_transactions')
                        .insert([
                            {
                                user_id: userId,
                                transaction_type: 'initial_credits',
                                amount: initialCredits,
                                description: `🎁 Créditos iniciales bienvenida para ${userName}`,
                                balance_before: 0,
                                balance_after: initialCredits,
                                created_at: new Date().toISOString()
                            },
                            {
                                user_id: userId,
                                transaction_type: 'purchase',
                                amount: amount,
                                description: reason || `💳 Compra de ${amount} créditos por ${addedBy}`,
                                balance_before: initialCredits,
                                balance_after: totalCredits,
                                created_at: new Date().toISOString()
                            }
                        ]);
                } catch (txError) {
                    console.warn('No se pudo registrar transacción:', txError);
                }

                console.log(`✅ Usuario creado con ${totalCredits} créditos (${initialCredits} iniciales + ${amount} comprados)`);
                return newData;
            }

            // 3. User exists - ADD to existing balance (SUMA, no reemplaza)
            const oldBalance = currentData.credits_balance || 0;
            const newBalance = oldBalance + amount;
            const isAddition = amount > 0;

            console.log(`📊 Balance actual: ${oldBalance} → Nuevo balance: ${newBalance}`);

            // Update credits - SUMA o RESTA según amount
            const updates = {
                credits_balance: newBalance,
                last_credit_update: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Update totals
            if (isAddition) {
                updates.total_credits_earned = (currentData.total_credits_earned || 0) + amount;
            } else {
                updates.total_credits_spent = (currentData.total_credits_spent || 0) + Math.abs(amount);
            }

            const { data: updatedData, error: updateError } = await this.usersClient
                .from('user_ai_credits')
                .update(updates)
                .eq('user_id', userId)
                .select()
                .single();

            if (updateError) throw updateError;

            // 4. Record transaction
            try {
                await this.usersClient
                    .from('credit_transactions')
                    .insert({
                        user_id: userId,
                        transaction_type: isAddition ? 'purchase' : 'deduction',
                        amount: amount,
                        description: reason || `${isAddition ? '💳 Compra' : '📤 Deducción'} de ${Math.abs(amount)} créditos por ${addedBy}`,
                        balance_before: oldBalance,
                        balance_after: newBalance,
                        created_at: new Date().toISOString()
                    });
            } catch (txError) {
                console.warn('No se pudo registrar transacción:', txError);
            }

            console.log(`✅ Créditos actualizados: ${oldBalance} → ${newBalance}`);
            return updatedData;

        } catch (error) {
            console.error('❌ Error adding credits:', error);
            throw error;
        }
    }

    async updateCredits(userId, newBalance, reason, updatedBy = 'admin') {
        await this.ensureInitialized();
        try {
            console.log(`🔄 Estableciendo balance de créditos a ${newBalance} para usuario ${userId}`);

            // Get current balance
            const { data: currentData, error: fetchError } = await this.usersClient
                .from('user_ai_credits')
                .select('credits_balance, total_credits_earned, total_credits_spent')
                .eq('user_id', userId)
                .maybeSingle();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            const oldBalance = currentData?.credits_balance || 0;
            const difference = newBalance - oldBalance;

            // Update balance
            const updates = {
                credits_balance: newBalance,
                last_credit_update: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Adjust totals based on difference
            if (difference > 0) {
                // Adding credits
                updates.total_credits_earned = (currentData?.total_credits_earned || 0) + difference;
            } else if (difference < 0) {
                // Removing credits
                updates.total_credits_spent = (currentData?.total_credits_spent || 0) + Math.abs(difference);
            }

            const { data, error } = await this.usersClient
                .from('user_ai_credits')
                .update(updates)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;

            // Record transaction
            try {
                await this.usersClient
                    .from('credit_transactions')
                    .insert({
                        user_id: userId,
                        transaction_type: 'admin_adjustment',
                        amount: difference,
                        description: reason || `⚙️ Ajuste manual de saldo por ${updatedBy}`,
                        balance_before: oldBalance,
                        balance_after: newBalance,
                        created_at: new Date().toISOString()
                    });
            } catch (txError) {
                console.warn('No se pudo registrar transacción:', txError);
            }

            console.log(`✅ Balance actualizado: ${oldBalance} → ${newBalance}`);
            return data;
        } catch (error) {
            console.error('Error updating credits:', error);
            throw error;
        }
    }

    async deleteCredits(creditId) {
        await this.ensureInitialized();
        try {
            const { error } = await this.usersClient
                .from('user_ai_credits')
                .delete()
                .eq('id', creditId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting credits:', error);
            throw error;
        }
    }

    // ===== ANALYTICS & REPORTS =====

    async getInventoryReport() {
        await this.ensureInitialized();
        try {
            const { data, error } = await this.productsClient
                .from('current_products')
                .select('id, name, stock_kg, min_stock_kg, price_per_kg, category')
                .order('stock_kg', { ascending: true });

            if (error) throw error;

            const report = {
                totalProducts: data.length,
                inStock: data.filter(p => p.stock_kg > 0).length,
                outOfStock: data.filter(p => !p.stock_kg || p.stock_kg <= 0).length,
                lowStock: data.filter(p => p.stock_kg > 0 && p.stock_kg < (p.min_stock_kg || 10)).length,
                totalValue: data.reduce((sum, p) => sum + ((p.stock_kg || 0) * (p.price_per_kg || 0)), 0)
            };

            return { report, products: data };
        } catch (error) {
            console.error('Error generating inventory report:', error);
            throw error;
        }
    }

    async getLowStockProducts() {
        await this.ensureInitialized();
        try {
            const { data, error } = await this.productsClient
                .from('current_products')
                .select('*')
                .or('stock_kg.lt.10,stock_kg.is.null')
                .order('stock_kg', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching low stock products:', error);
            throw error;
        }
    }

    async getDailyPriceReport() {
        await this.ensureInitialized();
        try {
            const { data, error } = await this.productsClient
                .from('product_price_history')
                .select(`
                    *,
                    products:product_id (name, category)
                `)
                .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching daily price report:', error);
            throw error;
        }
    }

    async getDashboardSummary({ startDate = null, endDate = null, period = 'month' } = {}) {
        await this.ensureInitialized();
        const summary = {
            products: 0,
            productsActive: 0,
            productsInactive: 0,
            boxes: 0,
            boxesActive: 0,
            boxesFeatured: 0,
            inventoryValue: 0,
            totalStockKg: 0,
            lowStockProducts: 0,
            customers: 0,
            customersWithCredits: 0,
            creditsTotal: 0,
            creditsPurchased: 0,
            ordersCount: 0,
            revenue: 0,
            salesByDay: [],
            avgOrderValue: 0,
            categoriesCount: 0
        };

        try {
            // Products count and details
            try {
                const { data: productsData } = await this.productsClient
                    .from('current_products')
                    .select('id, category, is_active');
                
                summary.products = (productsData || []).length;
                summary.productsActive = (productsData || []).filter(p => p.is_active !== false).length;
                summary.productsInactive = summary.products - summary.productsActive;
                
                // Count unique categories
                const categories = new Set((productsData || []).map(p => p.category).filter(Boolean));
                summary.categoriesCount = categories.size;
            } catch (err) {
                console.error('Error fetching products:', err);
            }

            // Boxes count and details
            try {
                const { data: boxesData } = await this.productsClient
                    .from('current_boxes')
                    .select('id, available, featured');
                
                summary.boxes = (boxesData || []).length;
                summary.boxesActive = (boxesData || []).filter(b => b.available !== false).length;
                summary.boxesFeatured = (boxesData || []).filter(b => b.featured === true).length;
            } catch (err) {
                console.error('Error fetching boxes:', err);
            }

            // Inventory value and stock details
            try {
                const { data: priceRows } = await this.productsClient
                    .from('management_product_prices')
                    .select('stock_kg, cost_per_kg, min_stock_kg')
                    .eq('is_current', true);

                summary.inventoryValue = (priceRows || []).reduce((sum, r) => {
                    return sum + ((r.stock_kg || 0) * (r.cost_per_kg || 0));
                }, 0);
                
                summary.totalStockKg = (priceRows || []).reduce((sum, r) => sum + (r.stock_kg || 0), 0);
                summary.lowStockProducts = (priceRows || []).filter(r => 
                    (r.stock_kg || 0) <= (r.min_stock_kg || 10)
                ).length;
            } catch (err) {
                console.error('Error fetching inventory:', err);
            }

            // Customers count
            try {
                const { count } = await this.usersClient
                    .from('customers')
                    .select('id', { count: 'exact', head: true });
                summary.customers = count || 0;
            } catch (err) {
                const { data: customersData } = await this.usersClient.from('customers').select('id');
                summary.customers = (customersData || []).length;
            }

            // Credits details
            try {
                const { data: creditsData } = await this.usersClient
                    .from('user_ai_credits')
                    .select('credits_balance, total_credits_earned, total_credits_spent');
                
                summary.creditsTotal = (creditsData || []).reduce((s, r) => s + (r.credits_balance || 0), 0);
                summary.customersWithCredits = (creditsData || []).filter(r => (r.credits_balance || 0) > 0).length;
                
                // Credits purchased = total earned
                summary.creditsPurchased = (creditsData || []).reduce((s, r) => s + (r.total_credits_earned || 0), 0);
            } catch (err) {
                console.error('Error fetching credits:', err);
            }

            // Orders & revenue
            try {
                let query = this.usersClient.from('orders').select('total, created_at');
                if (startDate) query = query.gte('created_at', startDate);
                if (endDate) query = query.lte('created_at', endDate);
                const { data: ordersData, error: ordersError } = await query;
                
                if (!ordersError && ordersData) {
                    summary.ordersCount = ordersData.length;
                    summary.revenue = (ordersData || []).reduce((s, o) => s + (Number(o.total) || 0), 0);
                    summary.avgOrderValue = summary.ordersCount > 0 ? summary.revenue / summary.ordersCount : 0;

                    // Aggregate sales by day
                    const map = new Map();
                    (ordersData || []).forEach(o => {
                        const d = new Date(o.created_at).toISOString().slice(0,10);
                        map.set(d, (map.get(d) || 0) + (Number(o.total) || 0));
                    });
                    summary.salesByDay = Array.from(map.entries()).map(([date, val]) => ({ date, value: val }));
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
            }

        } catch (error) {
            console.error('Error building dashboard summary:', error);
        }

        return summary;
    }

    async getBoxAnalytics() {
        await this.ensureInitialized();
        try {
            const { data, error } = await this.productsClient
                .from('current_boxes')
                .select(`
                    id,
                    name,
                    category,
                    price_cop,
                    price_usd,
                    stock_quantity,
                    featured,
                    available
                `)
                .order('price_cop', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching box analytics:', error);
            return [];
        }
    }

    // ===== UTILITY METHODS =====

    async ensureInitialized() {
        if (!this.initialized) {
            await this.initialize();
        }
    }
}

// Create and export singleton instance
const adminDatabaseService = new AdminDatabaseService();
window.adminDatabaseService = adminDatabaseService;

// Auto-initialize when module loads
adminDatabaseService.initialize().catch(err => {
    console.error('Failed to auto-initialize adminDatabaseService:', err);
});

export default adminDatabaseService;
