// Script para entender la relación entre current_products y management_product_prices
// Ejecutar en la consola del navegador

console.log('🔍 === ANALIZANDO RELACIÓN ENTRE TABLAS ===');

async function analyzeTableRelation() {
    try {
        if (!window.productsClient) {
            console.error('❌ Products client no disponible');
            return;
        }

        console.log('1. Obteniendo estructura de current_products...');
        const { data: currentProducts, error: currentError } = await window.productsClient
            .from('current_products')
            .select('*')
            .limit(3);

        if (currentError) {
            console.error('❌ Error:', currentError);
        } else {
            console.log('✅ current_products (primeros 3):');
            console.table(currentProducts);
            if (currentProducts.length > 0) {
                console.log('Campos:', Object.keys(currentProducts[0]));
            }
        }

        console.log('\n2. Obteniendo estructura de management_product_prices...');
        const { data: priceData, error: priceError } = await window.productsClient
            .from('management_product_prices')
            .select('*')
            .limit(3);

        if (priceError) {
            console.error('❌ Error:', priceError);
        } else {
            console.log('✅ management_product_prices (primeros 3):');
            console.table(priceData);
            if (priceData.length > 0) {
                console.log('Campos:', Object.keys(priceData[0]));
            }
        }

        console.log('\n3. Verificando si current_products tiene product_id...');
        if (currentProducts && currentProducts.length > 0) {
            const firstProduct = currentProducts[0];
            console.log('Producto ID:', firstProduct.id);
            console.log('¿Tiene product_id?', 'product_id' in firstProduct);
            
            // Buscar precio relacionado
            if (priceData && priceData.length > 0) {
                console.log('\nPrimer precio - product_id:', priceData[0].product_id);
                console.log('¿Coincide con current_products ID?', firstProduct.id === priceData[0].product_id);
            }
        }

    } catch (err) {
        console.error('❌ Error:', err);
    }
}

// Ejecutar análisis
analyzeTableRelation();