-- ========================================
-- CORRECCIÓN COMPLETA SISTEMA DE PRODUCTOS INACTIVOS
-- Ejecutar TODO este script en Supabase SQL Editor
-- ========================================

-- PASO 1: Ver estructura actual de la tabla
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'management_products'
ORDER BY ordinal_position;

-- PASO 2: Agregar columnas necesarias SI NO EXISTEN
ALTER TABLE management_products 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

ALTER TABLE management_products 
ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT true;

ALTER TABLE management_products 
ADD COLUMN IF NOT EXISTS inactive_reason TEXT;

-- PASO 3: Actualizar valores NULL a true (productos activos por defecto)
UPDATE management_products 
SET is_active = true 
WHERE is_active IS NULL;

UPDATE management_products 
SET available = true 
WHERE available IS NULL;

-- PASO 4: Crear o reemplazar la vista current_products
DROP VIEW IF EXISTS current_products CASCADE;

CREATE VIEW current_products AS
SELECT 
    mp.id,
    mp.name,
    mp.category,
    mp.description,
    mp.image_url,
    mp.season,
    mp.is_active,
    mp.available,
    mp.inactive_reason,
    mp.created_at,
    mp.updated_at,
    mpp.price_per_kg,
    mpp.cost_per_kg,
    mpp.stock_kg,
    mpp.min_stock_kg,
    mpp.is_organic,
    mpp.rating,
    mpp.origin,
    mpp.supplier,
    mpp.updated_at as price_updated_at
FROM management_products mp
LEFT JOIN management_product_prices mpp 
    ON mp.id = mpp.product_id 
    AND mpp.is_current = true
ORDER BY mp.name;

-- PASO 5: Verificar que la vista funciona
SELECT 
    id,
    name,
    is_active,
    available,
    inactive_reason,
    CASE 
        WHEN is_active = false OR available = false THEN '🔴 INACTIVO'
        ELSE '✅ ACTIVO'
    END AS estado
FROM current_products
LIMIT 10;

-- PASO 6: Contar productos activos e inactivos
SELECT 
    CASE 
        WHEN is_active = false OR available = false THEN 'Inactivos'
        ELSE 'Activos'
    END AS tipo,
    COUNT(*) AS cantidad
FROM management_products
GROUP BY 
    CASE 
        WHEN is_active = false OR available = false THEN 'Inactivos'
        ELSE 'Activos'
    END;

-- PASO 7: Ver productos inactivos (si los hay)
SELECT 
    id,
    name,
    category,
    is_active,
    available,
    inactive_reason
FROM management_products
WHERE is_active = false OR available = false
ORDER BY name;

-- ========================================
-- PRUEBA: Desactivar un producto de prueba
-- ========================================

-- Opción A: Desactivar Aguacate Papelillo (si existe)
UPDATE management_products
SET 
    is_active = false,
    available = false,
    inactive_reason = 'Prueba de sistema - Fuera de temporada',
    updated_at = NOW()
WHERE name LIKE '%Aguacate Papelillo%'
RETURNING id, name, is_active, available, inactive_reason;

-- Opción B: Si Aguacate Papelillo no existe, desactivar cualquier producto para prueba
-- Descomenta la siguiente línea si necesitas probar:
-- UPDATE management_products SET is_active = false, available = false, inactive_reason = 'Prueba' WHERE id = 1;

-- PASO 8: Verificar que el producto se desactivó
SELECT 
    id,
    name,
    is_active,
    available,
    inactive_reason,
    updated_at
FROM management_products
WHERE is_active = false OR available = false
ORDER BY updated_at DESC
LIMIT 5;

-- PASO 9: Ver en la vista current_products
SELECT 
    id,
    name,
    category,
    is_active,
    available,
    inactive_reason,
    price_per_kg,
    stock_kg
FROM current_products
WHERE is_active = false OR available = false
ORDER BY name;

-- ========================================
-- RESUMEN DE VERIFICACIÓN
-- ========================================
SELECT 
    '✅ Total de productos' AS verificacion,
    COUNT(*)::text AS resultado
FROM management_products
UNION ALL
SELECT 
    '🔴 Productos inactivos' AS verificacion,
    COUNT(*)::text AS resultado
FROM management_products
WHERE is_active = false OR available = false
UNION ALL
SELECT 
    '✅ Productos activos' AS verificacion,
    COUNT(*)::text AS resultado
FROM management_products
WHERE is_active = true AND available = true
UNION ALL
SELECT 
    '📋 Vista current_products funciona' AS verificacion,
    CASE WHEN COUNT(*) > 0 THEN 'SÍ ✅' ELSE 'NO ❌' END AS resultado
FROM current_products
LIMIT 1;

-- ========================================
-- SI NECESITAS REACTIVAR TODOS LOS PRODUCTOS:
-- ========================================
-- Descomenta las siguientes líneas para reactivar todo:
-- UPDATE management_products SET is_active = true, available = true, inactive_reason = NULL;
-- SELECT 'Todos los productos reactivados' AS mensaje;
