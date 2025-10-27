// 🛒 Fruvi Store - Products Database Service
// ============================================================================
// Este servicio maneja ÚNICAMENTE la base de datos de PRODUCTOS:
// - Catálogo de productos para la tienda  
// - Precios e inventario para administración
// - Separado del sistema de usuarios (login/registro)
// ============================================================================

console.log('🛒 Inicializando servicio de tienda (productos)...');

// 🛒 PRODUCTS DATABASE CONFIGURATION  
// Fallback configuration when environment variables are not available
const PRODUCTS_SUPABASE_URL = import.meta.env?.VITE_SUPABASE_PRODUCTS_URL || 
                              window.__ENV__?.VITE_SUPABASE_PRODUCTS_URL || 
                              'https://xujenwuefrgxfsiqjqhl.supabase.co';
const PRODUCTS_SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_PRODUCTS_ANON_KEY || 
                                   window.__ENV__?.VITE_SUPABASE_PRODUCTS_ANON_KEY || 
                                   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1amVud3VlZnJneGZzaXFqcWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTExNTYsImV4cCI6MjA3NjU2NzE1Nn0.89UAEW8CVBkz8lEAdnJzt0XJNo0C4lCrZMBBcRYKmMs';

// Validation function for environment variables
function isValidEnvVar(value) {
  if (!value || typeof value !== 'string') return false;
  if (value.includes('${{') || value.includes('secrets.')) return false;
  if (value === 'placeholder') return false;
  // En desarrollo local, aceptar cualquier valor que no sea claramente inválido
  return true;
}

// Initialize products Supabase client
let productsClient = null;

// 🛒 PRODUCTS CLIENT INITIALIZATION
function initializeProductsClient() {
  try {
    console.log('🔄 Intentando inicializar cliente de productos...');
    console.log('📋 Variables detectadas:', {
      url: PRODUCTS_SUPABASE_URL,
      keyLength: PRODUCTS_SUPABASE_ANON_KEY ? PRODUCTS_SUPABASE_ANON_KEY.length : 0,
      urlValid: isValidEnvVar(PRODUCTS_SUPABASE_URL),
      keyValid: isValidEnvVar(PRODUCTS_SUPABASE_ANON_KEY)
    });

    if (isValidEnvVar(PRODUCTS_SUPABASE_URL) && isValidEnvVar(PRODUCTS_SUPABASE_ANON_KEY)) {
      productsClient = supabase.createClient(PRODUCTS_SUPABASE_URL, PRODUCTS_SUPABASE_ANON_KEY);
      console.log('✅ Cliente de productos inicializado:', PRODUCTS_SUPABASE_URL);
      return true;
    } else {
      console.warn('⚠️ Variables de productos no válidas:', {
        url: PRODUCTS_SUPABASE_URL ? 'configurada' : 'faltante',
        key: PRODUCTS_SUPABASE_ANON_KEY ? 'configurada' : 'faltante',
        urlValid: isValidEnvVar(PRODUCTS_SUPABASE_URL),
        keyValid: isValidEnvVar(PRODUCTS_SUPABASE_ANON_KEY)
      });
      return false;
    }
  } catch (error) {
    console.error('❌ Error inicializando cliente de productos:', error);
    return false;
  }
}

// Auto-initialize products client
const productsInitialized = initializeProductsClient();

console.log('📊 Estado de inicialización de productos:', productsInitialized ? '✅' : '❌');

// ============================================================================
// 🛒 STORE PRODUCTS FUNCTIONS (Uses Products Database)
// ============================================================================

window.getStoreProducts = async function getStoreProducts() {
  try {
    if (!productsClient) {
      console.warn('⚠️ Cliente de productos no inicializado, usando productos de respaldo');
      // Return fallback products if products client is not available
      return getColombianFruits();
    }

    console.log('🔄 Obteniendo productos de la base de datos...');

        const { data, error } = await productsClient
      .from('current_products')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Error obteniendo productos:', error);
      // Fallback to local products on error
      console.log('🔄 Usando productos de respaldo...');
      return getColombianFruits();
    }

    if (!data || data.length === 0) {
      console.log('📦 No hay productos en la base de datos, usando productos de respaldo');
      return getColombianFruits();
    }

    // Transform data to match store format
    const products = data.map(product => ({
      id: product.id,
      category: product.category,
      img: product.image_url || '/images/products/placeholder.jpg',
      name: product.name,
      desc: product.description || '',
      priceKg: parseFloat(product.price_per_kg || 0),
      organic: product.is_organic || false,
      rating: parseFloat(product.rating || 4.0),
      origin: product.origin || 'Colombia',
      stock: parseInt(product.stock || 0)
    }));

    console.log(`✅ Cargados ${products.length} productos de la base de datos`);
    return products;

  } catch (error) {
    console.error('❌ Error en getStoreProducts:', error);
    console.log('🔄 Usando productos de respaldo debido al error...');
    return getColombianFruits();
  }
};

// Get product by ID
window.getProductById = async function getProductById(productId) {
  try {
    if (!productsClient) {
      // Fallback to local products
      const allProducts = getColombianFruits();
      return allProducts.find(p => p.id === productId) || null;
    }

    const { data, error } = await productsClient
      .from('current_products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('❌ Error obteniendo producto por ID:', error);
      return null;
    }

    if (!data) return null;

    // Transform data to match store format
    return {
      id: data.id,
      category: data.category,
      img: data.image_url || '/images/products/placeholder.jpg',
      name: data.name,
      desc: data.description || '',
      priceKg: parseFloat(data.price_per_kg || 0),
      costKg: parseFloat(data.cost_per_kg || 0),
      organic: data.is_organic || false,
      rating: parseFloat(data.rating || 4.0),
      origin: data.origin || 'Colombia',
      stockKg: parseFloat(data.stock || 0),
      minStockKg: parseFloat(data.min_stock || 0),
      stock: parseInt(data.stock || 0)
    };

  } catch (error) {
    console.error('❌ Error en getProductById:', error);
    return null;
  }
};

// Get products by category
window.getProductsByCategory = async function getProductsByCategory(category) {
  try {
    const allProducts = await getStoreProducts();
    return allProducts.filter(product => product.category === category);
  } catch (error) {
    console.error('❌ Error obteniendo productos por categoría:', error);
    return [];
  }
};

// Search products by name
window.searchProducts = async function searchProducts(query) {
  try {
    if (!productsClient) {
      // Fallback to local products
      const allProducts = getColombianFruits();
      return allProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.desc.toLowerCase().includes(query.toLowerCase())
      );
    }

    const { data, error } = await productsClient
      .from('current_products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) {
      console.error('❌ Error buscando productos:', error);
      return [];
    }

    // Transform data to match store format
    const products = data.map(product => ({
      id: product.id,
      category: product.category,
      img: product.image_url || '/images/products/placeholder.jpg',
      name: product.name,
      desc: product.description || '',
      priceKg: parseFloat(product.price_per_kg || 0),
      organic: product.is_organic || false,
      rating: parseFloat(product.rating || 4.0),
      origin: product.management_product_prices[0]?.origin || 'Colombia'
    }));

    return products;

  } catch (error) {
    console.error('❌ Error en searchProducts:', error);
    return [];
  }
};

// Get available categories
window.getProductCategories = async function getProductCategories() {
  try {
    if (!productsClient) {
      // Fallback categories
      return ['Cítricas', 'Tropicales', 'Bayas', 'Bananos', 'Exóticas', 'Frutas Dulces', 'Uvas'];
    }

    const { data, error } = await productsClient
      .from('current_products')
      .select('category')
      .eq('is_active', true);

    if (error) {
      console.error('❌ Error obteniendo categorías:', error);
      return ['Cítricas', 'Tropicales', 'Bayas', 'Bananos', 'Exóticas', 'Frutas Dulces', 'Uvas'];
    }

    // Get unique categories
    const categories = [...new Set(data.map(item => item.category))].sort();
    return categories;

  } catch (error) {
    console.error('❌ Error en getProductCategories:', error);
    return ['Cítricas', 'Tropicales', 'Bayas', 'Bananos', 'Exóticas', 'Frutas Dulces', 'Uvas'];
  }
};

// ============================================================================
// 🔧 ADMIN FUNCTIONS FOR PRODUCTS DATABASE
// ============================================================================

// Get all products for admin (using unified products table)
window.getAllProducts = async function getAllProducts() {
  if (!productsClient) {
    throw new Error('Cliente de productos no inicializado. Verifica VITE_SUPABASE_PRODUCTS_URL y VITE_SUPABASE_PRODUCTS_ANON_KEY');
  }

  console.log('🔍 Consultando productos de la base de datos...');

  try {
    // Get all products from the main products table
    const { data, error } = await productsClient
      .from('current_products')
      .select('*')
      .order('name');

    if (error) {
      console.error('❌ Error consultando productos:', error.message);
      throw error;
    }

    console.log(`📊 Encontrados ${data?.length || 0} productos en la base de datos`);
    
    if (!data || data.length === 0) {
      console.warn('⚠️ No hay productos en la base de datos.');
      return [];
    }

    // Transform data for admin interface
    return (data || []).map(product => {
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        image_url: product.image_url || product.image,
        is_active: product.available !== false,
        available: product.available !== false,
        price_per_kg: parseFloat(product.price || product.price_per_kg || 0),
        cost_per_kg: parseFloat(product.cost_per_kg || 0),
        organic: product.organic || false,
        rating: parseFloat(product.rating || 4.0),
        origin: product.origin || 'Colombia',
        stock_kg: parseFloat(product.stock || product.stock_kg || 0),
        min_stock_kg: parseFloat(product.min_stock || product.min_stock_kg || 10)
      };
    });

  } catch (error) {
    console.error('❌ Error en getAllProducts:', error);
    throw error;
  }
};

// Transform products data to admin format
function transformProductsData(products) {
  return products.map(product => ({
    id: product.id,
    name: product.name || product.title,
    category: product.category,
    description: product.description,
    image_url: product.image_url || product.image,
    is_active: product.is_active !== false,
    available: product.available !== false,
    price_per_kg: parseFloat(product.price_per_kg || product.price || 0),
    cost_per_kg: parseFloat(product.cost_per_kg || product.cost || 0),
    organic: product.organic || product.is_organic || false,
    rating: parseFloat(product.rating || 4.0),
    origin: product.origin || 'Colombia',
    stock_kg: parseFloat(product.stock_kg || product.stock || 100),
    min_stock_kg: parseFloat(product.min_stock_kg || product.min_stock || 10)
  }));
}

// Update product price (using products database)
window.updateProductPrice = async function updateProductPrice(productId, newPrice, reason = 'Manual update', updatedBy = 'admin') {
  if (!productsClient) {
    return { success: false, error: 'Cliente de productos no inicializado' };
  }

  try {
    console.log('🔄 Actualizando precio del producto:', { productId, newPrice, reason });
    
    // Primero verificar si existe el producto y su precio actual
    const { data: existingProduct, error: checkError } = await productsClient
      .from('current_products')
      .select('id, name, price_per_kg')
      .eq('id', productId)
      .single();

    if (checkError) {
      console.error('Error verificando producto:', checkError);
      return { success: false, error: `Error verificando producto: ${checkError.message}` };
    }

    if (!existingProduct) {
      console.error('❌ Producto no encontrado en current_products');
      return { success: false, error: `Producto con ID ${productId} no encontrado` };
    }

    console.log('✅ Producto encontrado:', existingProduct);

    // Ahora actualizar el precio en management_product_prices
    const { data, error } = await productsClient
      .from('management_product_prices')
      .update({ 
        price_per_kg: parseFloat(newPrice)
      })
      .eq('product_id', productId)
      .eq('is_current', true)
      .select();

    if (error) {
      console.error('Error updating price:', error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      console.error('❌ No se encontró registro de precio para actualizar');
      
      // Intentar crear un registro de precio si no existe
      console.log('🔄 Intentando crear registro de precio...');
      const { data: newPriceData, error: createError } = await productsClient
        .from('management_product_prices')
        .insert([{
          product_id: productId,
          price_per_kg: parseFloat(newPrice),
          cost_per_kg: parseFloat(newPrice) * 0.6, // Estimar costo como 60% del precio
          stock_kg: 0,
          min_stock_kg: 10,
          is_current: true,
          rating: 4.0,
          origin: 'Colombia'
        }])
        .select();

      if (createError) {
        console.error('Error creando registro de precio:', createError);
        return { success: false, error: `No se pudo crear registro de precio: ${createError.message}` };
      }

      console.log('✅ Registro de precio creado:', newPriceData[0]);
      return { success: true, message: `Precio creado y establecido en $${newPrice}`, data: newPriceData[0] };
    }

    console.log('✅ Precio actualizado correctamente:', data[0]);
    return { success: true, message: `Precio actualizado de $${existingProduct.price_per_kg} a $${newPrice}`, data: data[0] };
  } catch (error) {
    console.error('Error updating product price:', error);
    return { success: false, error: error.message };
  }
};

// Update stock (using products database)
window.updateStock = async function updateStock(productId, quantityChange, reason = 'Manual adjustment') {
  if (!productsClient) {
    return { success: false, error: 'Cliente de productos no inicializado' };
  }

  try {
    console.log('🔄 Actualizando stock del producto:', { productId, quantityChange, reason });
    
    // Primero verificar si existe el producto
    const { data: existingProduct, error: checkError } = await productsClient
      .from('current_products')
      .select('id, name, stock_kg')
      .eq('id', productId)
      .single();

    if (checkError) {
      console.error('Error verificando producto:', checkError);
      return { success: false, error: `Error verificando producto: ${checkError.message}` };
    }

    if (!existingProduct) {
      console.error('❌ Producto no encontrado en current_products');
      return { success: false, error: `Producto con ID ${productId} no encontrado` };
    }

    const currentStock = existingProduct.stock_kg || 0;
    const newStock = currentStock + quantityChange;
    
    if (newStock < 0) {
      return { success: false, error: 'El stock no puede ser negativo' };
    }

    console.log('📊 Stock actual:', currentStock, 'Cambio:', quantityChange, 'Nuevo stock:', newStock);

    // Update stock in management_product_prices
    // El trigger update_prices_modtime actualizará updated_at automáticamente
    const { data, error } = await productsClient
      .from('management_product_prices')
      .update({ 
        stock_kg: newStock
      })
      .eq('product_id', productId)
      .eq('is_current', true)
      .select();

    if (error) {
      console.error('Error updating stock:', error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      console.error('❌ No se encontró registro de precio para actualizar stock');
      return { success: false, error: `No se encontró registro de precio activo para el producto ${productId}` };
    }

    console.log('✅ Stock actualizado correctamente:', data[0]);
    return { success: true, newStock };
  } catch (error) {
    console.error('Error updating stock:', error);
    return { success: false, error: error.message };
  }
};

// Get inventory report
window.getInventoryReport = async function getInventoryReport() {
  try {
    if (!productsClient) {
      return { report: null, products: [] };
    }

    const products = await getAllProducts();
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock_kg * p.price_per_kg), 0);
    const lowStockCount = products.filter(p => p.stock_kg <= p.min_stock_kg).length;
    
    // Group by categories
    const categories = {};
    products.forEach(p => {
      if (!categories[p.category]) {
        categories[p.category] = {
          count: 0,
          totalStock: 0,
          totalValue: 0,
          lowStock: 0
        };
      }
      categories[p.category].count++;
      categories[p.category].totalStock += p.stock_kg;
      categories[p.category].totalValue += (p.stock_kg * p.price_per_kg);
      if (p.stock_kg <= p.min_stock_kg) {
        categories[p.category].lowStock++;
      }
    });

    return {
      report: { 
        totalProducts, 
        totalValue, 
        lowStockCount,
        categories 
      },
      products: products
    };
  } catch (error) {
    console.error('❌ Error en getInventoryReport:', error);
    return { report: null, products: [] };
  }
};

// Get low stock products
window.getLowStockProducts = async function getLowStockProducts() {
  try {
    const products = await getAllProducts();
    return products.filter(p => p.stock_kg <= p.min_stock_kg);
  } catch (error) {
    console.error('❌ Error en getLowStockProducts:', error);
    return [];
  }
};

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

// Configuration check functions
window.checkProductsConfig = function checkProductsConfig() {
  const config = {
    configured: isValidEnvVar(PRODUCTS_SUPABASE_URL) && isValidEnvVar(PRODUCTS_SUPABASE_ANON_KEY),
    initialized: productsClient !== null,
    url: PRODUCTS_SUPABASE_URL
  };

  console.log('🔍 Configuración de productos:', config);
  return config;
};

// Test products connection
window.testProductsConnection = async function testProductsConnection() {
  console.log('🧪 Probando conexión de productos...');
  
  let result = false;

  if (productsClient) {
    try {
      const { data, error } = await productsClient
        .from('management_products')
        .select('count', { count: 'exact', head: true });
      
      if (!error) {
        result = true;
        console.log('✅ Conexión de productos funcionando');
        console.log(`📊 Productos en la base de datos: ${data?.length || 'N/A'}`);
      } else {
        console.error('❌ Error en conexión de productos:', error.message);
        if (error.message.includes('relation "management_products" does not exist')) {
          console.error('📋 Las tablas de productos no existen. Necesitas ejecutar:');
          console.error('   1. setup-supabase-products.sql');
          console.error('   2. insert-colombian-fruits.sql');
        }
      }
    } catch (error) {
      console.error('❌ Error probando productos:', error);
    }
  } else {
    console.warn('⚠️ Cliente de productos no inicializado');
  }

  console.log('📊 Resultado de prueba de productos:', result);
  return result;
};

// Diagnostic function to check database structure
window.diagnosticProductsDatabase = async function diagnosticProductsDatabase() {
  console.log('🔍 === DIAGNÓSTICO DE BASE DE DATOS DE PRODUCTOS ===');
  
  if (!productsClient) {
    console.error('❌ Cliente de productos no inicializado');
    return;
  }

  // Test management_products table
  console.log('🔍 Probando tabla management_products...');
  try {
    const { data: products, error: productsError } = await productsClient
      .from('management_products')
      .select('id, name, category, is_active')
      .limit(5);

    if (productsError) {
      console.error('❌ Tabla management_products:', productsError.message);
    } else {
      console.log(`✅ Tabla management_products: ${products?.length || 0} productos (mostrando 5)`);
      if (products && products.length > 0) {
        console.table(products);
      }
    }
  } catch (e) {
    console.error('❌ Error consultando management_products:', e.message);
  }

  // Test management_product_prices table
  console.log('🔍 Probando tabla management_product_prices...');
  try {
    const { data: prices, error: pricesError } = await productsClient
      .from('management_product_prices')
      .select('product_id, price_per_kg, stock_kg, is_current')
      .limit(5);

    if (pricesError) {
      console.error('❌ Tabla management_product_prices:', pricesError.message);
    } else {
      console.log(`✅ Tabla management_product_prices: ${prices?.length || 0} registros (mostrando 5)`);
      if (prices && prices.length > 0) {
        console.table(prices);
      }
    }
  } catch (e) {
    console.error('❌ Error consultando management_product_prices:', e.message);
  }

  console.log('🔍 === FIN DEL DIAGNÓSTICO ===');
};

// Create new product
window.createProduct = async function createProduct(productData) {
  try {
    if (!productsClient) {
      return { success: false, error: 'Cliente de productos no inicializado' };
    }

    // Insert product in management_products table first
    const { data: product, error: productError } = await productsClient
      .from('management_products')
      .insert([{
        name: productData.name,
        category: productData.category,
        description: productData.description,
        image_url: productData.image_url,
        is_active: productData.is_active
      }])
      .select()
      .single();

    if (productError) throw productError;

    // Insert price record in management_product_prices
    const { data: priceData, error: priceError } = await productsClient
      .from('management_product_prices')
      .insert([{
        product_id: product.id,
        price_per_kg: productData.price_per_kg || 0,
        cost_per_kg: productData.cost_per_kg || null,
        stock_kg: productData.stock_kg || 0,
        min_stock_kg: productData.min_stock_kg || 10,
        origin: productData.origin || null,
        rating: productData.rating || 4.0,
        is_organic: productData.is_organic || false,
        supplier: productData.supplier || null,
        is_current: true
      }])
      .select();

    if (priceError) throw priceError;

    if (productError) throw productError;

    return { success: true, product: product };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message };
  }
};

// Update complete product (both management_products and management_product_prices)
window.updateCompleteProduct = async function updateCompleteProduct(productId, productData) {
  try {
    if (!productsClient) {
      return { success: false, error: 'Cliente de productos no inicializado' };
    }

    console.log('🔄 Actualizando producto completo:', { productId, productData });

    // Update management_products table
    const productFields = {};
    if (productData.name !== undefined) productFields.name = productData.name;
    if (productData.category !== undefined) productFields.category = productData.category;
    if (productData.description !== undefined) productFields.description = productData.description;
    if (productData.image_url !== undefined) productFields.image_url = productData.image_url;
    if (productData.is_active !== undefined) productFields.is_active = productData.is_active;

    let productUpdateResult = null;
    if (Object.keys(productFields).length > 0) {
      const { data: productData, error: productError } = await productsClient
        .from('management_products')
        .update(productFields)
        .eq('id', productId)
        .select();

      if (productError) throw productError;
      productUpdateResult = productData;
    }

    // Update management_product_prices table
    const priceFields = {};
    if (productData.price_per_kg !== undefined) priceFields.price_per_kg = parseFloat(productData.price_per_kg);
    if (productData.cost_per_kg !== undefined) priceFields.cost_per_kg = parseFloat(productData.cost_per_kg);
    if (productData.stock_kg !== undefined) priceFields.stock_kg = parseInt(productData.stock_kg);
    if (productData.min_stock_kg !== undefined) priceFields.min_stock_kg = parseInt(productData.min_stock_kg);
    if (productData.origin !== undefined) priceFields.origin = productData.origin;
    if (productData.rating !== undefined) priceFields.rating = parseFloat(productData.rating);
    if (productData.is_organic !== undefined) priceFields.is_organic = productData.is_organic;
    if (productData.supplier !== undefined) priceFields.supplier = productData.supplier;

    let priceUpdateResult = null;
    if (Object.keys(priceFields).length > 0) {
      const { data: priceData, error: priceError } = await productsClient
        .from('management_product_prices')
        .update(priceFields)
        .eq('product_id', productId)
        .eq('is_current', true)
        .select();

      if (priceError) throw priceError;
      priceUpdateResult = priceData;
    }

    console.log('✅ Producto actualizado completamente:', { productUpdateResult, priceUpdateResult });

    return { 
      success: true, 
      message: 'Producto actualizado completamente',
      productData: productUpdateResult,
      priceData: priceUpdateResult
    };

  } catch (error) {
    console.error('Error updating complete product:', error);
    return { success: false, error: error.message };
  }
};

// Delete product (soft delete)
window.deleteProduct = async function deleteProduct(productId) {
  try {
    if (!productsClient) {
      return { success: false, error: 'Cliente de productos no inicializado' };
    }

    const { error } = await productsClient
      .from('management_products')
      .update({ 
        is_active: false
      })
      .eq('id', productId);

    return { success: !error, error: error?.message };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
};

// Make products client available globally for debugging
window.productsClient = productsClient;

console.log('🎉 Servicio de tienda (productos) inicializado correctamente');
console.log('💡 Usa checkProductsConfig() para verificar la configuración');
// Función de diagnóstico para verificar datos
window.diagnoseProductData = async function diagnoseProductData(productId) {
  if (!productsClient) {
    console.error('❌ Cliente de productos no inicializado');
    return;
  }

  console.log('🔍 Diagnosticando producto ID:', productId);

  try {
    // 1. Verificar en management_products
    const { data: productData, error: productError } = await productsClient
      .from('management_products')
      .select('*')
      .eq('id', productId);

    console.log('📦 management_products:', productData, productError);

    // 2. Verificar en management_product_prices
    const { data: priceData, error: priceError } = await productsClient
      .from('management_product_prices')
      .select('*')
      .eq('product_id', productId);

    console.log('💰 management_product_prices:', priceData, priceError);

    // 3. Verificar en current_products
    const { data: currentData, error: currentError } = await productsClient
      .from('current_products')
      .select('*')
      .eq('id', productId);

    console.log('👁️ current_products:', currentData, currentError);

    // 4. Verificar todos los productos en current_products
    const { data: allCurrent, error: allError } = await productsClient
      .from('current_products')
      .select('id, name, price_per_kg')
      .limit(10);

    console.log('📋 Primeros 10 productos en current_products:', allCurrent, allError);

    return {
      productData,
      priceData,
      currentData,
      allCurrent
    };

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
  }
};

console.log('🧪 Usa testProductsConnection() para probar la conexión');
console.log('🔍 Usa diagnoseProductData(productId) para diagnosticar un producto específico');