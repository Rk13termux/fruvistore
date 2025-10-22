-- =====================================================
-- INSERTAR FRUTAS COLOMBIANAS EN LA TABLA PRODUCTS
-- Script actualizado para la tabla unificada
-- =====================================================

-- Insertar productos directamente en la tabla 'products'
INSERT INTO products (
    name, category, description, image_url, price_per_kg, cost_per_kg, 
    is_organic, rating, origin, stock, min_stock, is_active, created_at, last_updated, updated_by
) VALUES
-- BAYAS
('Agraz', 'Bayas', 'Pequeña baya azulada andina, rica en antioxidantes.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 18000.00, 12600.00, false, 4.5, 'Boyacá', 85, 15, true, NOW(), NOW(), 'system'),
('Arándano', 'Bayas', 'Arándano azul cultivado en altura, superfood.', 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400', 25000.00, 17500.00, true, 4.8, 'Antioquia', 65, 12, true, NOW(), NOW(), 'system'),
('Frambuesa', 'Bayas', 'Frambuesa roja delicada de clima frío.', 'https://images.unsplash.com/photo-1577003811926-53b90e9e8dfc?w=400', 32000.00, 22400.00, true, 4.6, 'Cundinamarca', 45, 10, true, NOW(), NOW(), 'system'),
('Fresa', 'Bayas', 'Fresas rojas dulces de clima frío.', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', 12500.00, 8750.00, true, 4.7, 'Cundinamarca', 120, 20, true, NOW(), NOW(), 'system'),
('Mora de Castilla', 'Bayas', 'Mora andina dulce-ácida, rica en antioxidantes.', 'https://images.unsplash.com/photo-1605023001907-7c180e58c2e9?w=400', 8000.00, 5600.00, true, 4.4, 'Boyacá', 95, 18, true, NOW(), NOW(), 'system'),
('Uchuva', 'Bayas', 'Fruta dorada andina dulce y nutritiva.', 'https://images.unsplash.com/photo-1599467500090-a17fd9a0b2e0?w=400', 15000.00, 10500.00, true, 4.5, 'Boyacá', 75, 15, true, NOW(), NOW(), 'system'),

-- BANANOS
('Banano Bocadillo', 'Bananos', 'Banano pequeño y muy dulce, ideal para postres.', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', 3500.00, 2450.00, true, 4.3, 'Quindío', 200, 30, true, NOW(), NOW(), 'system'),
('Banano Criollo', 'Bananos', 'Banano tradicional colombiano, resistente.', 'https://images.unsplash.com/photo-1602883008925-e4b18c70e4db?w=400', 2800.00, 1960.00, false, 4.2, 'Valle del Cauca', 180, 25, true, NOW(), NOW(), 'system'),
('Banano Urabá', 'Bananos', 'Banano premium de la región de Urabá, dulce y cremoso.', 'https://images.unsplash.com/photo-1586824123413-87d3c1c6dc13?w=400', 2200.00, 1540.00, false, 4.6, 'Antioquia', 220, 35, true, NOW(), NOW(), 'system'),
('Plátano Hartón', 'Bananos', 'Plátano verde tradicional, perfecto para cocinar.', 'https://images.unsplash.com/photo-1606065725176-0b2b2bb8e82d?w=400', 1800.00, 1260.00, false, 4.1, 'Valle del Cauca', 250, 40, true, NOW(), NOW(), 'system'),

-- CÍTRICAS
('Limón Tahití', 'Cítricas', 'Limón verde aromático, perfecto para bebidas.', 'https://images.unsplash.com/photo-1565623833406-d4de3e0c066a?w=400', 4500.00, 3150.00, true, 4.4, 'Caldas', 150, 25, true, NOW(), NOW(), 'system'),
('Mandarina Oneco', 'Cítricas', 'Mandarina tradicional colombiana, fácil de pelar.', 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400', 3200.00, 2240.00, false, 4.3, 'Caldas', 130, 20, true, NOW(), NOW(), 'system'),
('Naranja Valencia', 'Cítricas', 'Naranja jugosa del Valle, rica en vitamina C.', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400', 2500.00, 1750.00, false, 4.2, 'Valle del Cauca', 190, 30, true, NOW(), NOW(), 'system'),
('Toronja Rosada', 'Cítricas', 'Toronja jugosa con pulpa rosada, refrescante.', 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=400', 3000.00, 2100.00, false, 4.1, 'Valle del Cauca', 110, 18, true, NOW(), NOW(), 'system'),

-- EXÓTICAS
('Gulupa', 'Exóticas', 'Fruta de la pasión morada, dulce y aromática.', 'https://images.unsplash.com/photo-1632313188363-90ef8ad14a25?w=400', 8200.00, 5740.00, true, 4.5, 'Huila', 80, 15, true, NOW(), NOW(), 'system'),
('Pitahaya', 'Exóticas', 'Fruta del dragón, refrescante y exótica.', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', 18500.00, 12950.00, false, 4.7, 'Magdalena', 55, 10, true, NOW(), NOW(), 'system'),
('Feijoa', 'Exóticas', 'Fruta aromática andina, sabor único.', 'https://images.unsplash.com/photo-1638701055071-2a0d2e0ff41e?w=400', 9500.00, 6650.00, false, 4.3, 'Nariño', 70, 12, true, NOW(), NOW(), 'system'),
('Chirimoya', 'Exóticas', 'Fruta cremosa y dulce de clima frío.', 'https://images.unsplash.com/photo-1639149000089-c6e5b7c8b3b8?w=400', 12000.00, 8400.00, false, 4.6, 'Nariño', 60, 10, true, NOW(), NOW(), 'system'),

-- FRUTAS DULCES
('Granadilla', 'Frutas Dulces', 'Fruta dulce de pulpa gelatinosa y aromática.', 'https://images.unsplash.com/photo-1633073952903-8a1c2b8b48b3?w=400', 7200.00, 5040.00, false, 4.4, 'Boyacá', 95, 15, true, NOW(), NOW(), 'system'),
('Lulo', 'Frutas Dulces', 'Fruta ácida tradicional, perfecta para jugos.', 'https://images.unsplash.com/photo-1602491673980-73aa38de027a?w=400', 6800.00, 4760.00, false, 4.2, 'Nariño', 85, 12, true, NOW(), NOW(), 'system'),
('Tomate de Árbol', 'Frutas Dulces', 'Fruta ácida perfecta para jugos y salsas.', 'https://images.unsplash.com/photo-1606914737558-79c1b3d29458?w=400', 4500.00, 3150.00, true, 4.3, 'Cundinamarca', 105, 18, true, NOW(), NOW(), 'system'),
('Curuba', 'Frutas Dulces', 'Fruta andina ácida, ideal para jugos.', 'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?w=400', 5500.00, 3850.00, true, 4.1, 'Nariño', 90, 15, true, NOW(), NOW(), 'system'),

-- TROPICALES
('Aguacate Hass', 'Tropicales', 'Aguacate cremoso de exportación.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', 6800.00, 4760.00, true, 4.8, 'Caldas', 140, 25, true, NOW(), NOW(), 'system'),
('Mango Tommy', 'Tropicales', 'Mango dulce y jugoso, variedad premium.', 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', 4200.00, 2940.00, false, 4.6, 'Magdalena', 160, 28, true, NOW(), NOW(), 'system'),
('Papaya Maradol', 'Tropicales', 'Papaya grande y dulce, rica en enzimas.', 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400', 2800.00, 1960.00, false, 4.3, 'Santander', 180, 30, true, NOW(), NOW(), 'system'),
('Piña MD2', 'Tropicales', 'Piña extra dulce, variedad premium.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', 3500.00, 2450.00, true, 4.7, 'Meta', 170, 25, true, NOW(), NOW(), 'system'),
('Maracuyá', 'Tropicales', 'Fruta de la pasión, intensa y aromática.', 'https://images.unsplash.com/photo-1623740455382-8e7b6dc49a33?w=400', 6500.00, 4550.00, true, 4.5, 'Huila', 100, 18, true, NOW(), NOW(), 'system'),
('Guanábana', 'Tropicales', 'Fruta grande cremosa, ideal para jugos.', 'https://images.unsplash.com/photo-1602491686197-b1a25accfb1a?w=400', 6500.00, 4550.00, true, 4.4, 'Valle del Cauca', 75, 12, true, NOW(), NOW(), 'system'),

-- UVAS
('Uva Isabella', 'Uvas', 'Uva dulce y jugosa, cultivada en clima frío.', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400', 8500.00, 5950.00, false, 4.3, 'Boyacá', 65, 10, true, NOW(), NOW(), 'system'),
('Uva Verde Thompson', 'Uvas', 'Uva verde sin semillas, crujiente y dulce.', 'https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?w=400', 9200.00, 6440.00, true, 4.6, 'Boyacá', 55, 8, true, NOW(), NOW(), 'system');

-- Verificar la inserción
SELECT COUNT(*) as total_productos FROM products WHERE is_active = true;