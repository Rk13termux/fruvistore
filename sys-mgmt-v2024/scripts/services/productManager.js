// =====================================================
// ADMIN PANEL - Gestión de productos y precios
// Sistema completo para actualizar inventario diariamente
// =====================================================

class ProductManager {
  constructor() {
    this.supabase = window.productsClient;
    this.init();
  }

  async init() {
    if (!this.supabase) {
      console.error('❌ Products client not initialized');
      return false;
    }
    console.log('✅ Product Manager initialized');
    return true;
  }

  // ==================== CONSULTAS ====================
  
  async getAllProducts() {
    try {
      // Use products client directly
      if (window.productsClient) {
        const { data, error } = await window.productsClient
          .from('current_products')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
      } else {
        throw new Error('Products client not available');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProductsByCategory(category) {
    try {
      const { data, error } = await this.supabase
        .from('current_products')
        .select('*')
        .eq('category', category)
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  async getLowStockProducts() {
    try {
      // Use the global getAllProducts and filter for low stock
      if (typeof window.getAllProducts === 'function') {
        const products = await window.getAllProducts();
        return products.filter(p => p.stock_kg <= p.min_stock_kg).sort((a, b) => a.stock_kg - b.stock_kg);
      } else {
        throw new Error('getAllProducts function not available from storeService');
      }
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  }

  async getPriceHistory(productId, days = 30) {
    try {
      const { data, error } = await this.supabase
        .from('price_updates_log')
        .select('*')
        .eq('product_id', productId)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching price history:', error);
      return [];
    }
  }

  // ==================== ACTUALIZACIÓN DE PRECIOS ====================

  async updateProductPrice(productId, newPrice, reason = 'Manual update', updatedBy = 'admin') {
    try {
      console.log(`🔄 Updating price for product ${productId}: $${newPrice}`);

      // Use the global updateProductPrice function from storeService
      if (typeof window.updateProductPrice === 'function') {
        const result = await window.updateProductPrice(productId, newPrice, reason, updatedBy);
        return result;
      } else {
        throw new Error('updateProductPrice function not available from storeService');
      }
    } catch (error) {
      console.error('Error updating product price:', error);
      return { success: false, error: error.message };
    }
  }

  async bulkUpdatePrices(updates) {
    const results = [];
    
    for (const update of updates) {
      const result = await this.updateProductPrice(
        update.productId,
        update.newPrice,
        update.reason || 'Bulk price update',
        update.updatedBy || 'admin'
      );
      results.push({ ...update, ...result });
    }

    return results;
  }

  async applyPriceIncrease(categoryOrProductIds, increasePercent, reason) {
    try {
      let products;
      
      if (Array.isArray(categoryOrProductIds)) {
        // Actualizar productos específicos por ID
        const { data, error } = await this.supabase
          .from('current_products')
          .select('id, name, price_per_kg')
          .in('id', categoryOrProductIds);
        
        if (error) throw error;
        products = data;
      } else {
        // Actualizar toda una categoría
        const { data, error } = await this.supabase
          .from('current_products')
          .select('id, name, price_per_kg')
          .eq('category', categoryOrProductIds);
        
        if (error) throw error;
        products = data;
      }

      const updates = products.map(product => ({
        productId: product.id,
        newPrice: Math.round(product.price_per_kg * (1 + increasePercent / 100)),
        reason: reason || `Price increase ${increasePercent}%`,
        oldPrice: product.price_per_kg
      }));

      return await this.bulkUpdatePrices(updates);
    } catch (error) {
      console.error('Error applying price increase:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== GESTIÓN DE INVENTARIO ====================

  async updateStock(productId, quantityChange, reason = 'Manual adjustment') {
    try {
      console.log(`🔄 Updating stock for product ${productId}: ${quantityChange > 0 ? '+' : ''}${quantityChange}kg`);

      // Use the global updateStock function from storeService
      if (typeof window.updateStock === 'function') {
        const result = await window.updateStock(productId, quantityChange, reason);
        return result;
      } else {
        throw new Error('updateStock function not available from storeService');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      return { success: false, error: error.message };
    }
  }

  async addStock(productId, quantity, reason = 'Stock replenishment') {
    return await this.updateStock(productId, Math.abs(quantity), reason);
  }

  async removeStock(productId, quantity, reason = 'Stock adjustment') {
    return await this.updateStock(productId, -Math.abs(quantity), reason);
  }

  async restockProduct(productId, targetStock, reason = 'Restock to target level') {
    try {
      const { data, error } = await this.supabase
        .from('current_products')
        .select('stock_kg')
        .eq('id', productId)
        .single();

      if (error) throw error;

      const currentStock = data.stock_kg;
      const difference = targetStock - currentStock;

      if (difference !== 0) {
        return await this.updateStock(productId, difference, reason);
      }

      return { success: true, message: 'Stock already at target level' };
    } catch (error) {
      console.error('Error restocking product:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== REPORTES Y ANÁLISIS ====================

  async getDailyPriceReport() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await this.supabase
        .from('price_updates_log')
        .select(`
          *,
          management_products(name, category)
        `)
        .gte('created_at', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating daily price report:', error);
      return [];
    }
  }

  async getInventoryReport() {
    try {
      // Call storeService function directly (avoid recursion)
      if (typeof window.productsClient !== 'undefined' && window.productsClient) {
        // Use storeService's getInventoryReport directly
        const { data, error } = await window.productsClient
          .from('current_products')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;

        const report = {
          totalProducts: data.length,
          totalStock: data.reduce((sum, p) => sum + (p.stock || 0), 0),
          lowStockProducts: data.filter(p => (p.stock || 0) <= (p.min_stock || 0)),
          outOfStockProducts: data.filter(p => (p.stock || 0) === 0),
          totalValue: data.reduce((sum, p) => sum + ((p.stock || 0) * (p.price_per_kg || 0)), 0)
        };

        return { report, products: data };
      } else {
        throw new Error('Products client not available');
      }
    } catch (error) {
      console.error('Error generating inventory report:', error);
      return { report: null, products: [] };
    }
  }

  // ==================== IMPORTACIÓN DE PRECIOS ====================

  async importPricesFromCSV(csvData, updatedBy = 'bulk_import') {
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Esperamos columnas: product_id, product_name, new_price, reason
      const requiredHeaders = ['product_id', 'new_price'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
      }

      const updates = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index];
        });

        if (row.product_id && row.new_price) {
          updates.push({
            productId: parseInt(row.product_id),
            newPrice: parseFloat(row.new_price),
            reason: row.reason || 'CSV import',
            updatedBy
          });
        }
      }

      console.log(`📊 Processing ${updates.length} price updates from CSV`);
      return await this.bulkUpdatePrices(updates);
    } catch (error) {
      console.error('Error importing prices from CSV:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== UTILIDADES ====================

  formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  generateStockAlert(product) {
    if (product.low_stock) {
      return {
        level: 'warning',
        message: `⚠️ ${product.name}: Stock bajo (${product.stock_kg}kg). Mínimo: ${product.min_stock_kg}kg`
      };
    }
    return null;
  }
}

// ==================== FUNCIONES GLOBALES ====================

// Inicializar manager globalmente
window.initProductManager = function() {
  if (!window.productsClient) {
    console.error('❌ Products client required');
    return null;
  }
  
  window.productManager = new ProductManager();
  return window.productManager;
};

// NO crear funciones window que conflicten con storeService.js
// storeService.js ya maneja estas funciones globalmente

// Función para aplicar aumentos de precios por inflación
window.applyInflationIncrease = async function(percent = 5, category = null) {
  if (!window.productManager) {
    window.initProductManager();
  }
  
  console.log(`📈 Applying ${percent}% price increase${category ? ` to category: ${category}` : ' to all products'}`);
  
  if (category) {
    return await window.productManager.applyPriceIncrease(
      category, 
      percent, 
      `Inflation adjustment ${percent}% - ${category}`
    );
  } else {
    // Aplicar a todas las categorías
    const categories = ['Bayas', 'Bananos', 'Cítricas', 'Exóticas', 'Frutas Dulces', 'Tropicales', 'Uvas'];
    const results = [];
    
    for (const cat of categories) {
      const result = await window.productManager.applyPriceIncrease(
        cat, 
        percent, 
        `Inflation adjustment ${percent}%`
      );
      results.push({ category: cat, result });
    }
    
    return results;
  }
};

console.log('🏪 Product Manager loaded');
console.log('💡 Available functions:');
console.log('   - initProductManager()');
console.log('   - updatePrice(productId, newPrice, reason)');
console.log('   - addStock(productId, quantity, reason)');
console.log('   - getInventoryReport()');
console.log('   - getLowStock()');
console.log('   - applyInflationIncrease(percent, category)');