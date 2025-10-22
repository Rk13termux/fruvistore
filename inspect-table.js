// Script para inspeccionar la estructura de current_products
// Ejecutar en la consola del navegador

console.log('🔍 === INSPECCIÓN DE TABLA current_products ===');

async function inspectCurrentProducts() {
    try {
        if (!window.productsClient) {
            console.error('❌ Products client no disponible');
            return;
        }

        // Obtener algunos productos para ver su estructura
        const { data, error } = await window.productsClient
            .from('current_products')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Error:', error);
            return;
        }

        if (data && data.length > 0) {
            console.log('✅ Estructura de current_products:');
            console.log('Campos disponibles:', Object.keys(data[0]));
            console.log('Producto de ejemplo:');
            console.table(data[0]);
            
            // Mostrar tipos de datos
            const product = data[0];
            console.log('\n📋 Tipos de campos:');
            Object.keys(product).forEach(key => {
                console.log(`  ${key}: ${typeof product[key]} = ${product[key]}`);
            });
        } else {
            console.log('⚠️ No hay productos en current_products');
        }

    } catch (err) {
        console.error('❌ Error inspeccionando tabla:', err);
    }
}

// Ejecutar inspección
inspectCurrentProducts();