-- =====================================================
-- INSERTAR CAJAS PREMIUM INICIAL - FRUVI STORE
-- Cajas predefinidas con contenido variado
-- =====================================================

-- Insertar cajas base
INSERT INTO current_boxes (name, description, image_url, category, price_cop, price_usd, total_items, estimated_weight_kg, available, stock_quantity, featured, slug, tags) VALUES

-- Caja Premium Antioxidante
('Caja Premium Antioxidante', 
 'Selección especial de frutas ricas en antioxidantes para una vida saludable. Incluye bayas andinas, frutas exóticas y cítricos premium.', 
 '/images/boxes/caja-antioxidante.jpg', 
 'Caja Premium', 
 89900, 22.50, 6, 3.0, true, 15, true, 
 'caja-premium-antioxidante',
 ARRAY['antioxidantes', 'saludable', 'bayas', 'premium', 'wellness']),

-- Caja Tropical Exótica
('Caja Tropical Exótica', 
 'Viaje de sabores tropicales con las frutas más exóticas de Colombia. Perfecta para descubrir nuevos sabores únicos.', 
 '/images/boxes/caja-tropical.jpg', 
 'Caja Exótica', 
 75900, 19.00, 5, 2.5, true, 12, true, 
 'caja-tropical-exotica',
 ARRAY['tropical', 'exótica', 'colombia', 'sabores', 'frutas']),

-- Caja Familiar Grande
('Caja Familiar Grande', 
 'Perfecta para familias que aman las frutas frescas. Variedad amplia con las frutas favoritas de todos en casa.', 
 '/images/boxes/caja-familiar.jpg', 
 'Caja Familiar', 
 129900, 32.50, 8, 5.0, true, 8, false, 
 'caja-familiar-grande',
 ARRAY['familia', 'grande', 'variedad', 'fresco', 'hogar']),

-- Caja Detox Natural
('Caja Detox Natural', 
 'Frutas purificantes ideales para dietas detox y alimentación limpia. Cuidadosamente seleccionadas por nutricionistas.', 
 '/images/boxes/caja-detox.jpg', 
 'Caja Wellness', 
 67900, 17.00, 4, 2.0, true, 10, false, 
 'caja-detox-natural',
 ARRAY['detox', 'natural', 'diet', 'limpio', 'salud']),

-- Caja Premium Ejecutiva
('Caja Premium Ejecutiva', 
 'Selección elegante de frutas premium para profesionales exigentes. Presentación exclusiva y calidad superior.', 
 '/images/boxes/caja-ejecutiva.jpg', 
 'Caja Premium', 
 149900, 37.50, 5, 2.8, true, 6, true, 
 'caja-premium-ejecutiva',
 ARRAY['ejecutiva', 'premium', 'profesional', 'elegante', 'exclusiva']),

-- Caja Dulces Naturales
('Caja Dulces Naturales', 
 'Las frutas más dulces y deliciosas de la temporada. Perfecta para satisfacer antojos de forma saludable.', 
 '/images/boxes/caja-dulces.jpg', 
 'Caja Dulce', 
 58900, 14.75, 4, 2.2, true, 20, false, 
 'caja-dulces-naturales',
 ARRAY['dulce', 'natural', 'antojo', 'temporada', 'delicioso']);

-- Insertar contenido para Caja Premium Antioxidante (ID: 1)
INSERT INTO box_contents (box_id, product_name, quantity_kg, unit_price_cop, subtotal_cop, display_order) VALUES
(1, 'Agraz', 0.3, 18900, 5670, 1),
(1, 'Arándano', 0.5, 24900, 12450, 2),
(1, 'Frambuesa', 0.4, 19900, 7960, 3),
(1, 'Mora de Castilla', 0.6, 14900, 8940, 4),
(1, 'Uchuva', 0.8, 16900, 13520, 5),
(1, 'Fresa', 0.4, 12900, 5160, 6);

-- Insertar contenido para Caja Tropical Exótica (ID: 2)
INSERT INTO box_contents (box_id, product_name, quantity_kg, unit_price_cop, subtotal_cop, display_order) VALUES
(2, 'Pitahaya', 0.8, 28900, 23120, 1),
(2, 'Maracuyá', 0.4, 9900, 3960, 2),
(2, 'Guayaba', 0.6, 8900, 5340, 3),
(2, 'Lulo', 0.4, 11900, 4760, 4),
(2, 'Curuba', 0.3, 13900, 4170, 5);

-- Insertar contenido para Caja Familiar Grande (ID: 3)
INSERT INTO box_contents (box_id, product_name, quantity_kg, unit_price_cop, subtotal_cop, display_order) VALUES
(3, 'Banana Común', 1.0, 3900, 3900, 1),
(3, 'Manzana Verde', 0.8, 7900, 6320, 2),
(3, 'Naranja Valencia', 1.2, 5900, 7080, 3),
(3, 'Pera', 0.6, 9900, 5940, 4),
(3, 'Mango Tommy', 0.8, 8900, 7120, 5),
(3, 'Papaya', 0.6, 6900, 4140, 6);

-- Insertar contenido para Caja Detox Natural (ID: 4)
INSERT INTO box_contents (box_id, product_name, quantity_kg, unit_price_cop, subtotal_cop, display_order) VALUES
(4, 'Limón Tahití', 0.3, 6900, 2070, 1),
(4, 'Piña Dorada', 0.8, 7900, 6320, 2),
(4, 'Papaya', 0.6, 6900, 4140, 3),
(4, 'Apio', 0.3, 4900, 1470, 4);

-- Insertar contenido para Caja Premium Ejecutiva (ID: 5)
INSERT INTO box_contents (box_id, product_name, quantity_kg, unit_price_cop, subtotal_cop, display_order) VALUES
(5, 'Pitahaya', 0.6, 28900, 17340, 1),
(5, 'Arándano', 0.4, 24900, 9960, 2),
(5, 'Mango Keitt', 0.8, 12900, 10320, 3),
(5, 'Uva Isabella', 0.6, 18900, 11340, 4),
(5, 'Kiwi', 0.4, 21900, 8760, 5);

-- Insertar contenido para Caja Dulces Naturales (ID: 6)
INSERT INTO box_contents (box_id, product_name, quantity_kg, unit_price_cop, subtotal_cop, display_order) VALUES
(6, 'Fresa', 0.6, 12900, 7740, 1),
(6, 'Mango Tommy', 0.8, 8900, 7120, 2),
(6, 'Banana Bocadillo', 0.4, 5900, 2360, 3),
(6, 'Uva Isabella', 0.4, 18900, 7560, 4);

-- Insertar analytics iniciales para cada caja
INSERT INTO box_analytics (box_id, views_count, add_to_cart_count, purchase_count, revenue_cop) VALUES
(1, 245, 67, 23, 2067700),
(2, 189, 45, 18, 1366200),
(3, 156, 34, 12, 1558800),
(4, 134, 28, 15, 1018500),
(5, 98, 22, 8, 1199200),
(6, 167, 41, 19, 1119100);

-- Crear vista para consultas optimizadas de cajas con contenido
CREATE OR REPLACE VIEW box_details_view AS
SELECT 
    b.id,
    b.name,
    b.description,
    b.image_url,
    b.category,
    b.price_cop,
    b.price_usd,
    b.discount_percentage,
    b.total_items,
    b.estimated_weight_kg,
    b.available,
    b.in_stock,
    b.stock_quantity,
    b.featured,
    b.slug,
    b.tags,
    b.created_at,
    b.updated_at,
    
    -- Agregaciones del contenido
    COUNT(bc.id) as actual_items_count,
    SUM(bc.quantity_kg) as actual_weight_kg,
    SUM(bc.subtotal_cop) as content_cost_cop,
    
    -- Analytics
    COALESCE(ba.views_count, 0) as views_count,
    COALESCE(ba.add_to_cart_count, 0) as add_to_cart_count,
    COALESCE(ba.purchase_count, 0) as purchase_count,
    COALESCE(ba.revenue_cop, 0) as revenue_cop
    
FROM current_boxes b
LEFT JOIN box_contents bc ON b.id = bc.box_id
LEFT JOIN box_analytics ba ON b.id = ba.box_id
GROUP BY b.id, ba.views_count, ba.add_to_cart_count, ba.purchase_count, ba.revenue_cop
ORDER BY b.featured DESC, b.created_at DESC;