// Script de prueba para verificar que todo funciona
// Ejecutar en la consola del navegador

console.log('🧪 === PRUEBA DE FUNCIONES CORREGIDAS ===');

// Esperar un poco para que se carguen todos los scripts
setTimeout(async () => {
    console.log('1. Verificando storeService...');
    
    // Verificar que storeService está cargado
    if (typeof window.getStoreProducts === 'function') {
        console.log('✅ window.getStoreProducts disponible');
    } else {
        console.log('❌ window.getStoreProducts NO disponible');
    }
    
    if (typeof window.getAllProducts === 'function') {
        console.log('✅ window.getAllProducts disponible');
    } else {
        console.log('❌ window.getAllProducts NO disponible');
    }
    
    if (typeof window.getInventoryReport === 'function') {
        console.log('✅ window.getInventoryReport disponible');
    } else {
        console.log('❌ window.getInventoryReport NO disponible');
    }
    
    // Probar conexión
    console.log('2. Probando conexión...');
    try {
        const config = window.checkProductsConfig();
        console.log('Config:', config);
    } catch (e) {
        console.log('Error config:', e.message);
    }
    
    // Probar obtener productos
    console.log('3. Probando obtener productos...');
    try {
        const products = await window.getStoreProducts();
        console.log(`✅ Productos obtenidos: ${products.length}`);
        if (products.length > 0) {
            console.table(products.slice(0, 2));
        } else {
            console.log('⚠️ No hay productos en la base de datos');
        }
    } catch (e) {
        console.error('❌ Error obteniendo productos:', e);
    }
    
    // Si no hay productos, mostrar cómo insertarlos
    console.log('4. Si no hay productos, ejecuta:');
    console.log('// Ir a insert-products-test.js y copiar el contenido aquí');
    
}, 2000);