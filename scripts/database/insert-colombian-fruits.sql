-- =====================================================
-- INSERTAR FRUTAS COLOMBIANAS EN SUPABASE
-- Datos completos con precios y categorías organizadas
-- =====================================================

-- Primero insertar proveedores (ejemplos)
INSERT INTO suppliers (name, contact_person, phone, email, city, department) VALUES
('Frutícola Antioquia', 'Carlos Muñoz', '3001234567', 'carlos@fruticola.com', 'Medellín', 'Antioquia'),
('Frutas del Valle', 'María González', '3109876543', 'maria@frutasvalle.com', 'Cali', 'Valle del Cauca'),
('Boyacá Fresh', 'Luis Rodríguez', '3151234567', 'luis@boyacafresh.com', 'Tunja', 'Boyacá'),
('Frutas Tolima', 'Ana Pérez', '3201234567', 'ana@frutastolima.com', 'Ibagué', 'Tolima'),
('Chocó Orgánico', 'Pedro Moreno', '3131234567', 'pedro@chocoorganico.com', 'Quibdó', 'Chocó'),
('Huila Premium', 'Laura Castro', '3171234567', 'laura@huilapremium.com', 'Neiva', 'Huila'),
('Caldas Cítricos', 'Juan Torres', '3161234567', 'juan@caldascitricos.com', 'Manizales', 'Caldas'),
('Santander Frutas', 'Rosa Jiménez', '3191234567', 'rosa@santanderfrutas.com', 'Bucaramanga', 'Santander');

-- Insertar productos base (sin precios aún)
INSERT INTO management_products (name, category, description, image_url, season) VALUES
-- BAYAS
('Agraz', 'Bayas', 'Pequeña baya azulada andina, rica en antioxidantes.', '/images/products/agraz.jpg', 'Junio-Agosto'),
('Arándano', 'Bayas', 'Arándano azul cultivado en altura, superfood.', '/images/products/arandano.jpg', 'Octubre-Diciembre'),
('Frambuesa', 'Bayas', 'Frambuesa roja delicada de clima frío.', '/images/products/frambuesa.jpg', 'Noviembre-Febrero'),
('Fresa', 'Bayas', 'Fresas rojas dulces de clima frío.', '/images/products/fresa.jpg', 'Diciembre-Abril'),
('Mora de Castilla', 'Bayas', 'Mora andina dulce-ácida, rica en antioxidantes.', '/images/products/mora.jpg', 'Junio-Septiembre'),
('Uchuva', 'Bayas', 'Fruta dorada andina dulce y nutritiva.', '/images/products/uchuva.jpg', 'Todo el año'),

-- BANANOS
('Banano Bocadillo', 'Bananos', 'Banano pequeño y muy dulce, ideal para postres.', '/images/products/banano_bocadillo.jpg', 'Todo el año'),
('Banano Criollo', 'Bananos', 'Banano tradicional colombiano, resistente.', '/images/products/banano_criollo.jpg', 'Todo el año'),
('Banano Guineo', 'Bananos', 'Banano corto y grueso, muy nutritivo.', '/images/products/banano_guineo.jpg', 'Todo el año'),
('Banano Urabá', 'Bananos', 'Banano premium de la región de Urabá, dulce y cremoso.', '/images/products/banano_uraba.jpg', 'Todo el año'),
('Plátano Dominico', 'Bananos', 'Plátano dulce maduro, excelente para freír.', '/images/products/platano_dominico.jpg', 'Todo el año'),
('Plátano Hartón', 'Bananos', 'Plátano verde tradicional, perfecto para cocinar.', '/images/products/platano_hartón.jpg', 'Todo el año'),
('Plátano Popocho', 'Bananos', 'Plátano gigante para cocción, típico de la costa.', '/images/products/platano_popocho.jpg', 'Todo el año'),

-- CÍTRICAS
('Bergamota', 'Cítricas', 'Cítrico aromático usado para aceites esenciales.', '/images/products/bergamota.jpg', 'Enero-Marzo'),
('Cidra', 'Cítricas', 'Cítrico grande aromático, usado en conservas.', '/images/products/cidra.jpg', 'Mayo-Julio'),
('Lima Ácida', 'Cítricas', 'Lima pequeña muy ácida, ideal para aderezos.', '/images/products/lima_acida.jpg', 'Todo el año'),
('Limón Común', 'Cítricas', 'Limón amarillo tradicional, muy ácido.', '/images/products/limon_comun.jpg', 'Todo el año'),
('Limón Mandarino', 'Cítricas', 'Híbrido cítrico, mezcla de limón y mandarina.', '/images/products/limon_mandarino.jpg', 'Febrero-Abril'),
('Limón Tahití', 'Cítricas', 'Limón verde aromático, perfecto para bebidas.', '/images/products/limon_tahiti.jpg', 'Todo el año'),
('Mandarina Arrayana', 'Cítricas', 'Mandarina dulce de temporada, muy jugosa.', '/images/products/mandarina_arrayana.jpg', 'Mayo-Julio'),
('Mandarina Oneco', 'Cítricas', 'Mandarina tradicional colombiana, fácil de pelar.', '/images/products/mandarina_oneco.jpg', 'Abril-Junio'),
('Naranja Ombligo', 'Cítricas', 'Naranja sin semillas, dulce y fácil de pelar.', '/images/products/naranja_ombligo.jpg', 'Enero-Abril'),
('Naranja Valencia', 'Cítricas', 'Naranja jugosa del Valle, rica en vitamina C.', '/images/products/naranja_valencia.jpg', 'Marzo-Agosto'),
('Toronja Rosada', 'Cítricas', 'Toronja jugosa con pulpa rosada, refrescante.', '/images/products/toronja.jpg', 'Febrero-Mayo'),

-- EXÓTICAS
('Arazá', 'Exóticas', 'Fruta amazónica ácida, muy aromática.', '/images/products/araza.jpg', 'Septiembre-Noviembre'),
('Borojó', 'Exóticas', 'Superfruit del Pacífico, energizante natural.', '/images/products/borojo.jpg', 'Abril-Agosto'),
('Caimito', 'Exóticas', 'Fruta morada cremosa con sabor dulce único.', '/images/products/caimito.jpg', 'Marzo-Mayo'),
('Chirimoya', 'Exóticas', 'Fruta cremosa y dulce de clima frío.', '/images/products/chirimoya.jpg', 'Abril-Junio'),
('Copoazú', 'Exóticas', 'Prima del cacao, pulpa cremosa y aromática.', '/images/products/copoazu.jpg', 'Junio-Agosto'),
('Feijoa', 'Exóticas', 'Fruta aromática andina, sabor único.', '/images/products/feijoa.jpg', 'Marzo-Mayo'),
('Gulupa', 'Exóticas', 'Fruta de la pasión morada, dulce y aromática.', '/images/products/gulupa.jpg', 'Todo el año'),
('Mangostino', 'Exóticas', 'Reina de las frutas, pulpa blanca exquisita.', '/images/products/mangostino.jpg', 'Octubre-Diciembre'),
('Níspero', 'Exóticas', 'Fruta dulce de árbol perenne, muy nutritiva.', '/images/products/nispero.jpg', 'Enero-Marzo'),
('Pitahaya', 'Exóticas', 'Fruta del dragón, refrescante y exótica.', '/images/products/pitahaya.jpg', 'Julio-Octubre'),
('Rambután', 'Exóticas', 'Fruta peluda asiática cultivada en Colombia.', '/images/products/rambutan.jpg', 'Agosto-Octubre'),
('Zapote', 'Exóticas', 'Fruta tropical cremosa, sabor a chocolate.', '/images/products/zapote.jpg', 'Mayo-Julio'),

-- FRUTAS DULCES
('Breva', 'Frutas Dulces', 'Higo grande y dulce de clima frío.', '/images/products/breva.jpg', 'Noviembre-Enero'),
('Ciruela', 'Frutas Dulces', 'Ciruela tropical dulce y jugosa.', '/images/products/ciruela.jpg', 'Febrero-Abril'),
('Curuba', 'Frutas Dulces', 'Fruta andina ácida, ideal para jugos.', '/images/products/curuba.jpg', 'Marzo-Agosto'),
('Durazno', 'Frutas Dulces', 'Durazno de clima frío, dulce y aromático.', '/images/products/durazno.jpg', 'Diciembre-Febrero'),
('Granadilla', 'Frutas Dulces', 'Fruta dulce de pulpa gelatinosa y aromática.', '/images/products/granadilla.jpg', 'Todo el año'),
('Lulo', 'Frutas Dulces', 'Fruta ácida tradicional, perfecta para jugos.', '/images/products/lulo.jpg', 'Todo el año'),
('Manzana Anna', 'Frutas Dulces', 'Manzana tropical cultivada en Colombia.', '/images/products/manzana_anna.jpg', 'Diciembre-Febrero'),
('Pera', 'Frutas Dulces', 'Pera jugosa de clima templado.', '/images/products/pera.jpg', 'Noviembre-Enero'),
('Tomate de Árbol', 'Frutas Dulces', 'Fruta ácida perfecta para jugos y salsas.', '/images/products/tomate_arbol.jpg', 'Todo el año'),

-- TROPICALES
('Aguacate Fortuna', 'Tropicales', 'Aguacate grande tradicional colombiano.', '/images/products/aguacate_fortuna.jpg', 'Febrero-Mayo'),
('Aguacate Hass', 'Tropicales', 'Aguacate cremoso de exportación.', '/images/products/aguacate_hass.jpg', 'Todo el año'),
('Anón', 'Tropicales', 'Fruta cremosa dulce, prima de la chirimoya.', '/images/products/anon.jpg', 'Abril-Junio'),
('Badea', 'Tropicales', 'Fruta de la pasión gigante, refrescante.', '/images/products/badea.jpg', 'Marzo-Junio'),
('Banano Morado', 'Tropicales', 'Banano exótico de piel morada, muy dulce.', '/images/products/banano_morado.jpg', 'Todo el año'),
('Carambolo', 'Tropicales', 'Fruta estrella, decorativa y refrescante.', '/images/products/carambolo.jpg', 'Agosto-Octubre'),
('Coco', 'Tropicales', 'Coco fresco de la costa, agua natural.', '/images/products/coco.jpg', 'Todo el año'),
('Guama', 'Tropicales', 'Vaina dulce tropical, pulpa algodonosa.', '/images/products/guama.jpg', 'Enero-Marzo'),
('Guanábana', 'Tropicales', 'Fruta grande cremosa, ideal para jugos.', '/images/products/guanabana.jpg', 'Todo el año'),
('Guayaba Agria', 'Tropicales', 'Guayaba ácida pequeña, rica en vitamina C.', '/images/products/guayaba_agria.jpg', 'Septiembre-Noviembre'),
('Guayaba Pera', 'Tropicales', 'Guayaba aromática, perfecta para jugos.', '/images/products/guayaba_pera.jpg', 'Octubre-Febrero'),
('Mango Azúcar', 'Tropicales', 'Mango pequeño muy dulce, variedad criolla.', '/images/products/mango_azucar.jpg', 'Abril-Junio'),
('Mango Keitt', 'Tropicales', 'Mango grande y jugoso, de larga duración.', '/images/products/mango_keitt.jpg', 'Agosto-Octubre'),
('Mango Tommy', 'Tropicales', 'Mango dulce y jugoso, variedad premium.', '/images/products/mango_tommy.jpg', 'Marzo-Junio'),
('Maracuyá', 'Tropicales', 'Fruta de la pasión, intensa y aromática.', '/images/products/maracuya.jpg', 'Todo el año'),
('Papaya Hawaiana', 'Tropicales', 'Papaya pequeña muy dulce, pulpa anaranjada.', '/images/products/papaya_hawaiana.jpg', 'Todo el año'),
('Papaya Maradol', 'Tropicales', 'Papaya grande y dulce, rica en enzimas.', '/images/products/papaya_maradol.jpg', 'Todo el año'),
('Piña MD2', 'Tropicales', 'Piña extra dulce, variedad premium.', '/images/products/pina_md2.jpg', 'Todo el año'),
('Piña Perolera', 'Tropicales', 'Piña tradicional colombiana, muy aromática.', '/images/products/pina_perolera.jpg', 'Todo el año'),

-- UVAS
('Uva Negra', 'Uvas', 'Uva oscura dulce, rica en antioxidantes.', '/images/products/uva_negra.jpg', 'Enero-Marzo'),
('Uva Roja Isabella', 'Uvas', 'Uva roja dulce y jugosa, cultivada en clima frío.', '/images/products/uva_roja.jpg', 'Noviembre-Febrero'),
('Uva Verde Thompson', 'Uvas', 'Uva verde sin semillas, crujiente y dulce.', '/images/products/uva_verde.jpg', 'Diciembre-Marzo');

-- Ahora insertar precios actuales para todos los productos
-- Usar los IDs generados automáticamente
INSERT INTO management_product_prices (
    product_id, price_per_kg, cost_per_kg, is_organic, rating, origin, stock_kg, min_stock_kg, supplier, is_current
)
SELECT 
    p.id,
    CASE p.name
        -- BAYAS
        WHEN 'Agraz' THEN 18000.00
        WHEN 'Arándano' THEN 25000.00
        WHEN 'Frambuesa' THEN 32000.00
        WHEN 'Fresa' THEN 12500.00
        WHEN 'Mora de Castilla' THEN 8000.00
        WHEN 'Uchuva' THEN 15000.00
        -- BANANOS
        WHEN 'Banano Bocadillo' THEN 3500.00
        WHEN 'Banano Criollo' THEN 2800.00
        WHEN 'Banano Guineo' THEN 3200.00
        WHEN 'Banano Urabá' THEN 2200.00
        WHEN 'Plátano Dominico' THEN 2000.00
        WHEN 'Plátano Hartón' THEN 1800.00
        WHEN 'Plátano Popocho' THEN 1500.00
        -- CÍTRICAS
        WHEN 'Bergamota' THEN 12000.00
        WHEN 'Cidra' THEN 5500.00
        WHEN 'Lima Ácida' THEN 4800.00
        WHEN 'Limón Común' THEN 3800.00
        WHEN 'Limón Mandarino' THEN 5200.00
        WHEN 'Limón Tahití' THEN 4500.00
        WHEN 'Mandarina Arrayana' THEN 3800.00
        WHEN 'Mandarina Oneco' THEN 3200.00
        WHEN 'Naranja Ombligo' THEN 2800.00
        WHEN 'Naranja Valencia' THEN 2500.00
        WHEN 'Toronja Rosada' THEN 3000.00
        -- EXÓTICAS
        WHEN 'Arazá' THEN 22000.00
        WHEN 'Borojó' THEN 8500.00
        WHEN 'Caimito' THEN 14500.00
        WHEN 'Chirimoya' THEN 12000.00
        WHEN 'Copoazú' THEN 16000.00
        WHEN 'Feijoa' THEN 9500.00
        WHEN 'Gulupa' THEN 8200.00
        WHEN 'Mangostino' THEN 45000.00
        WHEN 'Níspero' THEN 7800.00
        WHEN 'Pitahaya' THEN 18500.00
        WHEN 'Rambután' THEN 28000.00
        WHEN 'Zapote' THEN 11500.00
        -- FRUTAS DULCES
        WHEN 'Breva' THEN 11000.00
        WHEN 'Ciruela' THEN 6500.00
        WHEN 'Curuba' THEN 5500.00
        WHEN 'Durazno' THEN 9500.00
        WHEN 'Granadilla' THEN 7200.00
        WHEN 'Lulo' THEN 6800.00
        WHEN 'Manzana Anna' THEN 7500.00
        WHEN 'Pera' THEN 8200.00
        WHEN 'Tomate de Árbol' THEN 4500.00
        -- TROPICALES
        WHEN 'Aguacate Fortuna' THEN 4200.00
        WHEN 'Aguacate Hass' THEN 6800.00
        WHEN 'Anón' THEN 9800.00
        WHEN 'Badea' THEN 3800.00
        WHEN 'Banano Morado' THEN 5500.00
        WHEN 'Carambolo' THEN 8500.00
        WHEN 'Coco' THEN 2500.00
        WHEN 'Guama' THEN 4200.00
        WHEN 'Guanábana' THEN 6500.00
        WHEN 'Guayaba Agria' THEN 3500.00
        WHEN 'Guayaba Pera' THEN 4000.00
        WHEN 'Mango Azúcar' THEN 3200.00
        WHEN 'Mango Keitt' THEN 3800.00
        WHEN 'Mango Tommy' THEN 4200.00
        WHEN 'Maracuyá' THEN 6500.00
        WHEN 'Papaya Hawaiana' THEN 3500.00
        WHEN 'Papaya Maradol' THEN 2800.00
        WHEN 'Piña MD2' THEN 3500.00
        WHEN 'Piña Perolera' THEN 2800.00
        -- UVAS
        WHEN 'Uva Negra' THEN 9800.00
        WHEN 'Uva Roja Isabella' THEN 8500.00
        WHEN 'Uva Verde Thompson' THEN 9200.00
        ELSE 5000.00
    END as price_per_kg,
    -- Costo aproximado (70% del precio de venta)
    CASE p.name
        WHEN 'Agraz' THEN 12600.00
        WHEN 'Arándano' THEN 17500.00
        WHEN 'Frambuesa' THEN 22400.00
        WHEN 'Fresa' THEN 8750.00
        WHEN 'Mora de Castilla' THEN 5600.00
        WHEN 'Uchuva' THEN 10500.00
        ELSE (CASE p.name
            WHEN 'Banano Bocadillo' THEN 3500.00
            WHEN 'Banano Criollo' THEN 2800.00
            WHEN 'Banano Guineo' THEN 3200.00
            WHEN 'Banano Urabá' THEN 2200.00
            WHEN 'Plátano Dominico' THEN 2000.00
            WHEN 'Plátano Hartón' THEN 1800.00
            WHEN 'Plátano Popocho' THEN 1500.00
            ELSE 3500.00
        END * 0.7)
    END as cost_per_kg,
    -- Orgánico (algunas frutas premium)
    CASE 
        WHEN p.name IN ('Arándano', 'Frambuesa', 'Fresa', 'Mora de Castilla', 'Uchuva', 'Banano Bocadillo', 
                       'Limón Tahití', 'Limón Mandarino', 'Arazá', 'Borojó', 'Copoazú', 'Gulupa', 
                       'Mangostino', 'Rambután', 'Curuba', 'Tomate de Árbol', 'Aguacate Hass', 
                       'Banano Morado', 'Guanábana', 'Maracuyá', 'Papaya Hawaiana', 'Piña MD2', 
                       'Uva Negra', 'Uva Verde Thompson') THEN true
        ELSE false
    END as is_organic,
    -- Rating (4.0 a 4.9)
    ROUND((4.0 + (RANDOM() * 0.9))::numeric, 1) as rating,
    -- Origen por categoría
    CASE p.category
        WHEN 'Bayas' THEN CASE 
            WHEN p.name IN ('Agraz', 'Uchuva') THEN 'Boyacá'
            WHEN p.name = 'Arándano' THEN 'Antioquia'
            ELSE 'Cundinamarca'
        END
        WHEN 'Bananos' THEN CASE
            WHEN p.name = 'Banano Urabá' THEN 'Antioquia'
            WHEN p.name = 'Banano Bocadillo' THEN 'Quindío'
            WHEN p.name = 'Banano Guineo' THEN 'Chocó'
            WHEN p.name = 'Plátano Popocho' THEN 'Atlántico'
            ELSE 'Valle del Cauca'
        END
        WHEN 'Cítricas' THEN CASE
            WHEN p.name LIKE '%Limón%' OR p.name LIKE '%Mandarina%' THEN 'Caldas'
            WHEN p.name LIKE '%Naranja%' OR p.name = 'Toronja Rosada' THEN 'Valle del Cauca'
            ELSE 'Santander'
        END
        WHEN 'Exóticas' THEN CASE
            WHEN p.name IN ('Arazá', 'Copoazú') THEN 'Amazonas'
            WHEN p.name IN ('Borojó', 'Mangostino', 'Rambután') THEN 'Chocó'
            WHEN p.name = 'Pitahaya' OR p.name = 'Zapote' THEN 'Magdalena'
            ELSE 'Nariño'
        END
        WHEN 'Frutas Dulces' THEN CASE
            WHEN p.name IN ('Curuba', 'Lulo') THEN 'Nariño'
            WHEN p.name = 'Tomate de Árbol' THEN 'Cundinamarca'
            ELSE 'Boyacá'
        END
        WHEN 'Tropicales' THEN CASE
            WHEN p.name LIKE '%Mango%' THEN 'Magdalena'
            WHEN p.name LIKE '%Aguacate%' THEN 'Caldas'
            WHEN p.name LIKE '%Papaya%' THEN 'Santander'
            WHEN p.name LIKE '%Piña%' THEN 'Meta'
            WHEN p.name = 'Coco' THEN 'Atlántico'
            WHEN p.name IN ('Maracuyá', 'Gulupa') THEN 'Huila'
            ELSE 'Valle del Cauca'
        END
        WHEN 'Uvas' THEN 'Boyacá'
        ELSE 'Colombia'
    END as origin,
    -- Stock inicial aleatorio entre 50-200 kg
    (50 + (RANDOM() * 150))::integer as stock_kg,
    -- Stock mínimo entre 10-30 kg
    (10 + (RANDOM() * 20))::integer as min_stock_kg,
    -- Proveedor aleatorio
    (SELECT name FROM suppliers ORDER BY RANDOM() LIMIT 1) as supplier,
    true as is_current
FROM management_products p
WHERE p.is_active = true;