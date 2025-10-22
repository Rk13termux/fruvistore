// Script de prueba para actualización de precios
// Ejecutar en la consola del navegador

console.log('🧪 === PRUEBA DE ACTUALIZACIÓN DE PRECIOS ===');

async function testPriceUpdate() {
    try {
        if (!window.productsClient) {
            console.error('❌ Products client no disponible');
            return;
        }

        // 1. Obtener primer producto de current_products
        console.log('1. Obteniendo productos...');
        const { data: products, error: prodError } = await window.productsClient
            .from('current_products')
            .select('id, name, price_per_kg')
            .limit(1);

        if (prodError || !products || products.length === 0) {
            console.error('❌ Error obteniendo productos:', prodError);
            return;
        }

        const testProduct = products[0];
        console.log('✅ Producto de prueba:', testProduct);

        // 2. Buscar precio correspondiente
        console.log('\n2. Buscando precio en management_product_prices...');
        const { data: prices, error: priceError } = await window.productsClient
            .from('management_product_prices')
            .select('*')
            .eq('product_id', testProduct.id);

        if (priceError) {
            console.error('❌ Error buscando precios:', priceError);
        } else {
            console.log('✅ Precios encontrados:', prices);
        }

        // 3. Probar actualización (sin ejecutar realmente)
        console.log('\n3. Para probar actualización, ejecuta:');
        console.log(`window.updateProductPrice(${testProduct.id}, ${testProduct.price_per_kg + 100}, 'Prueba desde consola')`);

    } catch (err) {
        console.error('❌ Error:', err);
    }
}

// Ejecutar prueba
testPriceUpdate();