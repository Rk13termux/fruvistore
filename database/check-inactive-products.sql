-- SCRIPT DE VERIFICACIÓN DE PRODUCTOS INACTIVOS
-- Ejecutar en Supabase SQL Editor para ver todos los productos y su estado

-- 1. Ver TODOS los productos (activos e inactivos)
SELECT 
    mp.id,
    mp.name AS "Nombre",
    mp.category AS "Categoría",
    mp.is_active AS "is_active",
    mpp.price_per_kg AS "Precio/kg",
    mpp.stock_kg AS "Stock",
    CASE 
        WHEN mp.is_active = false THEN '🔴 INACTIVO'
        ELSE '✅ ACTIVO'
    END AS "Estado"
FROM management_products mp
LEFT JOIN management_product_prices mpp 
    ON mp.id = mpp.product_id AND mpp.is_current = true
ORDER BY mp.is_active DESC, mp.name;

-- 2. Ver SOLO productos inactivos
SELECT 
    mp.id,
    mp.name AS "Nombre",
    mp.category AS "Categoría",
    mp.is_active,
    mpp.stock_kg AS "Stock"
FROM management_products mp
LEFT JOIN management_product_prices mpp 
    ON mp.id = mpp.product_id AND mpp.is_current = true
WHERE mp.is_active = false
ORDER BY mp.name;

-- 3. Buscar Aguacate Hass específicamente
SELECT 
    mp.id,
    mp.name,
    mp.category,
    mp.is_active,
    mpp.price_per_kg,
    mpp.stock_kg
FROM management_products mp
LEFT JOIN management_product_prices mpp 
    ON mp.id = mpp.product_id AND mpp.is_current = true
WHERE LOWER(mp.name) LIKE '%aguacate%';

-- 4. Buscar Uvas/Agras específicamente  
SELECT 
    mp.id,
    mp.name,
    mp.category,
    mp.is_active,
    mpp.price_per_kg,
    mpp.stock_kg
FROM management_products mp
LEFT JOIN management_product_prices mpp 
    ON mp.id = mpp.product_id AND mpp.is_current = true
WHERE LOWER(mp.name) LIKE '%uva%' OR LOWER(mp.name) LIKE '%agra%';

-- 5. Ver la vista current_products (la que usa el admin)
SELECT * FROM current_products
WHERE LOWER(name) LIKE '%aguacate%' OR LOWER(name) LIKE '%uva%'
ORDER BY name;

-- 6. Contar productos por estado
SELECT 
    CASE 
        WHEN is_active = true THEN 'Activos'
        WHEN is_active = false THEN 'Inactivos'
        ELSE 'NULL (problema)'
    END AS estado,
    COUNT(*) AS cantidad
FROM management_products
GROUP BY is_active
ORDER BY is_active DESC;
