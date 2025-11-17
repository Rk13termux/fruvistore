-- Insertar Aguacate Hass y Uvas en la base de datos
-- Ejecutar estos comandos en Supabase SQL Editor

-- 1. Insertar Aguacate Hass en management_products
INSERT INTO management_products (name, category, description, image_url, season, is_active)
VALUES (
    'Aguacate Hass',
    'Frutas Tropicales',
    'Aguacate Hass cremoso y delicioso, perfecto para guacamole, ensaladas y tostadas. Rico en grasas saludables y vitaminas.',
    'aguacate-hass.png',
    'Todo el año',
    false  -- Inactivo por defecto
)
ON CONFLICT (name) DO NOTHING;

-- 2. Insertar precio y stock para Aguacate Hass
INSERT INTO management_product_prices (
    product_id,
    price_per_kg,
    cost_per_kg,
    stock_kg,
    min_stock_kg,
    is_organic,
    rating,
    origin,
    supplier,
    is_current
)
SELECT 
    id,
    8500,  -- Precio por kg
    5000,  -- Costo por kg
    0,     -- Stock inicial en 0 (inactivo)
    15,    -- Stock mínimo
    false, -- No es orgánico
    4.5,   -- Rating
    'Colombia',
    'Fruver Central',
    true   -- Precio actual
FROM management_products
WHERE name = 'Aguacate Hass'
ON CONFLICT (product_id, is_current) 
WHERE is_current = true 
DO NOTHING;

-- 3. Insertar Uvas en management_products
INSERT INTO management_products (name, category, description, image_url, season, is_active)
VALUES (
    'Uvas',
    'Frutas Importadas',
    'Uvas dulces y jugosas, perfectas como snack saludable. Ricas en antioxidantes y fibra.',
    'uvas.png',
    'Verano - Otoño',
    false  -- Inactivo por defecto
)
ON CONFLICT (name) DO NOTHING;

-- 4. Insertar precio y stock para Uvas
INSERT INTO management_product_prices (
    product_id,
    price_per_kg,
    cost_per_kg,
    stock_kg,
    min_stock_kg,
    is_organic,
    rating,
    origin,
    supplier,
    is_current
)
SELECT 
    id,
    12000, -- Precio por kg
    7000,  -- Costo por kg
    0,     -- Stock inicial en 0 (inactivo)
    10,    -- Stock mínimo
    false, -- No es orgánico
    4.3,   -- Rating
    'Chile',
    'Importadora Global',
    true   -- Precio actual
FROM management_products
WHERE name = 'Uvas'
ON CONFLICT (product_id, is_current) 
WHERE is_current = true 
DO NOTHING;

-- 5. Verificar productos insertados
SELECT 
    mp.id,
    mp.name,
    mp.category,
    mp.is_active,
    mpp.price_per_kg,
    mpp.stock_kg
FROM management_products mp
LEFT JOIN management_product_prices mpp ON mp.id = mpp.product_id AND mpp.is_current = true
WHERE mp.name IN ('Aguacate Hass', 'Uvas')
ORDER BY mp.name;
