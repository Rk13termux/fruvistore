// Script para inspeccionar las tablas de gestión
// Ejecutar en la consola del navegador

console.log('🔍 === INSPECCIÓN DE TABLAS DE GESTIÓN ===');

async function inspectManagementTables() {
    try {
        if (!window.productsClient) {
            console.error('❌ Products client no disponible');
            return;
        }

        console.log('1. Inspeccionando management_products...');
        
        // Inspeccionar management_products
        const { data: products, error: prodError } = await window.productsClient
            .from('management_products')
            .select('*')
            .limit(1);

        if (prodError) {
            console.error('❌ Error en management_products:', prodError);
        } else if (products && products.length > 0) {
            console.log('✅ Campos en management_products:', Object.keys(products[0]));
            console.table(products[0]);
        } else {
            console.log('⚠️ No hay datos en management_products');
        }

        console.log('\n2. Inspeccionando management_product_prices...');
        
        // Inspeccionar management_product_prices
        const { data: prices, error: priceError } = await window.productsClient
            .from('management_product_prices')
            .select('*')
            .limit(1);

        if (priceError) {
            console.error('❌ Error en management_product_prices:', priceError);
        } else if (prices && prices.length > 0) {
            console.log('✅ Campos en management_product_prices:', Object.keys(prices[0]));
            console.table(prices[0]);
        } else {
            console.log('⚠️ No hay datos en management_product_prices');
        }

    } catch (err) {
        console.error('❌ Error general:', err);
    }
}

// Ejecutar inspección
inspectManagementTables();