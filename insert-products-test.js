// Script para insertar productos de prueba directamente en Supabase
// Ejecutar en la consola del navegador después de cargar la página

console.log('🌱 === INSERCIÓN DE PRODUCTOS DE PRUEBA ===');

// Productos de prueba
const productos = [
    // BAYAS
    { name: 'Agraz', category: 'Bayas', description: 'Pequeña baya azulada andina, rica en antioxidantes.', image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', price_per_kg: 18000, cost_per_kg: 12600, is_organic: false, rating: 4.5, origin: 'Boyacá', stock: 85, min_stock: 15 },
    { name: 'Arándano', category: 'Bayas', description: 'Arándano azul cultivado en altura, superfood.', image_url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400', price_per_kg: 25000, cost_per_kg: 17500, is_organic: true, rating: 4.8, origin: 'Antioquia', stock: 65, min_stock: 12 },
    { name: 'Fresa', category: 'Bayas', description: 'Fresas rojas dulces de clima frío.', image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', price_per_kg: 12500, cost_per_kg: 8750, is_organic: true, rating: 4.7, origin: 'Cundinamarca', stock: 120, min_stock: 20 },
    { name: 'Mora de Castilla', category: 'Bayas', description: 'Mora andina dulce-ácida, rica en antioxidantes.', image_url: 'https://images.unsplash.com/photo-1605023001907-7c180e58c2e9?w=400', price_per_kg: 8000, cost_per_kg: 5600, is_organic: true, rating: 4.4, origin: 'Boyacá', stock: 95, min_stock: 18 },
    { name: 'Uchuva', category: 'Bayas', description: 'Fruta dorada andina dulce y nutritiva.', image_url: 'https://images.unsplash.com/photo-1599467500090-a17fd9a0b2e0?w=400', price_per_kg: 15000, cost_per_kg: 10500, is_organic: true, rating: 4.5, origin: 'Boyacá', stock: 75, min_stock: 15 },

    // BANANOS
    { name: 'Banano Bocadillo', category: 'Bananos', description: 'Banano pequeño y muy dulce, ideal para postres.', image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', price_per_kg: 3500, cost_per_kg: 2450, is_organic: true, rating: 4.3, origin: 'Quindío', stock: 200, min_stock: 30 },
    { name: 'Banano Criollo', category: 'Bananos', description: 'Banano tradicional colombiano, resistente.', image_url: 'https://images.unsplash.com/photo-1602883008925-e4b18c70e4db?w=400', price_per_kg: 2800, cost_per_kg: 1960, is_organic: false, rating: 4.2, origin: 'Valle del Cauca', stock: 180, min_stock: 25 },
    { name: 'Banano Urabá', category: 'Bananos', description: 'Banano premium de la región de Urabá, dulce y cremoso.', image_url: 'https://images.unsplash.com/photo-1586824123413-87d3c1c6dc13?w=400', price_per_kg: 2200, cost_per_kg: 1540, is_organic: false, rating: 4.6, origin: 'Antioquia', stock: 220, min_stock: 35 },
    { name: 'Plátano Hartón', category: 'Bananos', description: 'Plátano verde tradicional, perfecto para cocinar.', image_url: 'https://images.unsplash.com/photo-1606065725176-0b2b2bb8e82d?w=400', price_per_kg: 1800, cost_per_kg: 1260, is_organic: false, rating: 4.1, origin: 'Valle del Cauca', stock: 250, min_stock: 40 },

    // CÍTRICAS
    { name: 'Limón Tahití', category: 'Cítricas', description: 'Limón verde aromático, perfecto para bebidas.', image_url: 'https://images.unsplash.com/photo-1565623833406-d4de3e0c066a?w=400', price_per_kg: 4500, cost_per_kg: 3150, is_organic: true, rating: 4.4, origin: 'Caldas', stock: 150, min_stock: 25 },
    { name: 'Mandarina Oneco', category: 'Cítricas', description: 'Mandarina tradicional colombiana, fácil de pelar.', image_url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400', price_per_kg: 3200, cost_per_kg: 2240, is_organic: false, rating: 4.3, origin: 'Caldas', stock: 130, min_stock: 20 },
    { name: 'Naranja Valencia', category: 'Cítricas', description: 'Naranja jugosa del Valle, rica en vitamina C.', image_url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400', price_per_kg: 2500, cost_per_kg: 1750, is_organic: false, rating: 4.2, origin: 'Valle del Cauca', stock: 190, min_stock: 30 },

    // TROPICALES
    { name: 'Aguacate Hass', category: 'Tropicales', description: 'Aguacate cremoso de exportación.', image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', price_per_kg: 6800, cost_per_kg: 4760, is_organic: true, rating: 4.8, origin: 'Caldas', stock: 140, min_stock: 25 },
    { name: 'Mango Tommy', category: 'Tropicales', description: 'Mango dulce y jugoso, variedad premium.', image_url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', price_per_kg: 4200, cost_per_kg: 2940, is_organic: false, rating: 4.6, origin: 'Magdalena', stock: 160, min_stock: 28 },
    { name: 'Papaya Maradol', category: 'Tropicales', description: 'Papaya grande y dulce, rica en enzimas.', image_url: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400', price_per_kg: 2800, cost_per_kg: 1960, is_organic: false, rating: 4.3, origin: 'Santander', stock: 180, min_stock: 30 },
    { name: 'Piña MD2', category: 'Tropicales', description: 'Piña extra dulce, variedad premium.', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', price_per_kg: 3500, cost_per_kg: 2450, is_organic: true, rating: 4.7, origin: 'Meta', stock: 170, min_stock: 25 },
    { name: 'Maracuyá', category: 'Tropicales', description: 'Fruta de la pasión, intensa y aromática.', image_url: 'https://images.unsplash.com/photo-1623740455382-8e7b6dc49a33?w=400', price_per_kg: 6500, cost_per_kg: 4550, is_organic: true, rating: 4.5, origin: 'Huila', stock: 100, min_stock: 18 },

    // FRUTAS DULCES
    { name: 'Granadilla', category: 'Frutas Dulces', description: 'Fruta dulce de pulpa gelatinosa y aromática.', image_url: 'https://images.unsplash.com/photo-1633073952903-8a1c2b8b48b3?w=400', price_per_kg: 7200, cost_per_kg: 5040, is_organic: false, rating: 4.4, origin: 'Boyacá', stock: 95, min_stock: 15 },
    { name: 'Lulo', category: 'Frutas Dulces', description: 'Fruta ácida tradicional, perfecta para jugos.', image_url: 'https://images.unsplash.com/photo-1602491673980-73aa38de027a?w=400', price_per_kg: 6800, cost_per_kg: 4760, is_organic: false, rating: 4.2, origin: 'Nariño', stock: 85, min_stock: 12 },
    { name: 'Tomate de Árbol', category: 'Frutas Dulces', description: 'Fruta ácida perfecta para jugos y salsas.', image_url: 'https://images.unsplash.com/photo-1606914737558-79c1b3d29458?w=400', price_per_kg: 4500, cost_per_kg: 3150, is_organic: true, rating: 4.3, origin: 'Cundinamarca', stock: 105, min_stock: 18 }
];

// Función para insertar productos
async function insertarProductos() {
    console.log('🔄 Iniciando inserción de productos...');
    
    if (!window.productsClient) {
        console.error('❌ Cliente de productos no disponible');
        return;
    }

    let exitosos = 0;
    let errores = 0;

    for (const producto of productos) {
        try {
            const { data, error } = await window.productsClient
                .from('products')
                .insert([{
                    ...producto,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    last_updated: new Date().toISOString(),
                    updated_by: 'system'
                }]);

            if (error) {
                console.error(`❌ Error insertando ${producto.name}:`, error);
                errores++;
            } else {
                console.log(`✅ ${producto.name} insertado correctamente`);
                exitosos++;
            }
        } catch (err) {
            console.error(`❌ Error insertando ${producto.name}:`, err);
            errores++;
        }
    }

    console.log(`📊 Resumen: ${exitosos} exitosos, ${errores} errores`);
    
    // Verificar productos insertados
    if (exitosos > 0) {
        console.log('🔍 Verificando productos en la base de datos...');
        const productos_db = await window.getStoreProducts();
        console.log(`✅ Total productos en DB: ${productos_db.length}`);
        console.table(productos_db.slice(0, 5));
    }
}

// Ejecutar inserción
insertarProductos();