// Script simple para probar actualización directa
// Ejecutar línea por línea en la consola del navegador

console.log('🔧 === PRUEBA DIRECTA DE ACTUALIZACIÓN ===');

// 1. Verificar que tenemos acceso
console.log('Cliente disponible:', !!window.productsClient);
console.log('Función disponible:', typeof window.updateProductPrice);

// 2. Probar lectura de datos
async function testRead() {
    console.log('\n📖 Probando LECTURA...');
    
    const { data, error } = await window.productsClient
        .from('management_product_prices')
        .select('id, product_id, price_per_kg, is_current')
        .eq('is_current', true)
        .limit(1);
    
    if (error) {
        console.error('❌ Error leyendo:', error);
        return null;
    }
    
    console.log('✅ Datos leídos:', data);
    return data[0];
}

// 3. Probar escritura directa (sin funciones intermedias)
async function testWrite(priceRecord) {
    if (!priceRecord) return;
    
    console.log('\n✏️ Probando ESCRITURA DIRECTA...');
    console.log('Actualizando precio de', priceRecord.price_per_kg, 'a', priceRecord.price_per_kg + 500);
    
    const { data, error } = await window.productsClient
        .from('management_product_prices')
        .update({ 
            price_per_kg: priceRecord.price_per_kg + 500
        })
        .eq('id', priceRecord.id)
        .select();
    
    if (error) {
        console.error('❌ Error escribiendo:', error);
        console.log('Detalles del error:', error.message);
        console.log('Código:', error.code);
        console.log('Hint:', error.hint);
    } else {
        console.log('✅ Escritura exitosa:', data);
    }
}

// Ejecutar pruebas
async function runTest() {
    const record = await testRead();
    await testWrite(record);
}

// Ejecutar
runTest();