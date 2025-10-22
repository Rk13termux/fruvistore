// Diagnóstico completo del problema de actualización
// Ejecutar en la consola del navegador paso a paso

console.log('🚀 === DIAGNÓSTICO COMPLETO DE ACTUALIZACIÓN ===');

// PASO 1: Verificar conexión
console.log('\n📡 PASO 1: Verificando conexión...');
if (window.productsClient) {
    console.log('✅ Products client disponible');
    console.log('URL:', window.productsClient.supabaseUrl);
} else {
    console.log('❌ Products client NO disponible');
}

// PASO 2: Verificar datos
async function step2_checkData() {
    console.log('\n📊 PASO 2: Verificando datos...');
    
    try {
        // Ver productos
        const { data: products, error: prodError } = await window.productsClient
            .from('current_products')
            .select('id, name, price_per_kg')
            .limit(3);
            
        if (prodError) {
            console.error('❌ Error obteniendo productos:', prodError);
            return;
        }
        
        console.log('✅ Productos disponibles:');
        console.table(products);
        
        // Ver precios
        const { data: prices, error: priceError } = await window.productsClient
            .from('management_product_prices')
            .select('id, product_id, price_per_kg, is_current')
            .limit(3);
            
        if (priceError) {
            console.error('❌ Error obteniendo precios:', priceError);
            return;
        }
        
        console.log('✅ Precios disponibles:');
        console.table(prices);
        
        return { products, prices };
        
    } catch (err) {
        console.error('❌ Error en paso 2:', err);
    }
}

// PASO 3: Probar actualización real
async function step3_testUpdate(productId, newPrice) {
    console.log(`\n🔧 PASO 3: Probando actualización (ID: ${productId}, Precio: ${newPrice})...`);
    
    try {
        const result = await window.updateProductPrice(productId, newPrice, 'Prueba diagnóstico');
        console.log('📤 Resultado de actualización:', result);
        
        // Verificar si realmente se actualizó
        console.log('🔍 Verificando actualización...');
        const { data: updatedPrice, error } = await window.productsClient
            .from('management_product_prices')
            .select('price_per_kg')
            .eq('product_id', productId)
            .eq('is_current', true)
            .single();
            
        if (error) {
            console.error('❌ Error verificando:', error);
        } else {
            console.log(`✅ Precio actual en BD: ${updatedPrice.price_per_kg}`);
            console.log(`¿Se actualizó? ${updatedPrice.price_per_kg == newPrice ? '✅ SÍ' : '❌ NO'}`);
        }
        
    } catch (err) {
        console.error('❌ Error en paso 3:', err);
    }
}

// Ejecutar diagnóstico automático
async function runDiagnosis() {
    const data = await step2_checkData();
    
    if (data && data.products && data.products.length > 0) {
        const testProduct = data.products[0];
        const newTestPrice = testProduct.price_per_kg + 1000;
        
        console.log(`\n🎯 Ejecutando prueba automática con:`);
        console.log(`   Producto: ${testProduct.name} (ID: ${testProduct.id})`);
        console.log(`   Precio actual: ${testProduct.price_per_kg}`);
        console.log(`   Precio nuevo: ${newTestPrice}`);
        
        await step3_testUpdate(testProduct.id, newTestPrice);
        
        console.log('\n📋 RESUMEN:');
        console.log('1. Si ves errores arriba, cópialos y pégalos');
        console.log('2. Si no hay errores pero no se actualiza, puede ser un problema de permisos');
        console.log('3. Si se actualiza correctamente, el problema puede estar en el UI del admin');
    }
}

// Ejecutar diagnóstico
runDiagnosis();