-- ========================================
-- CORRECCIÓN COMPLETA SISTEMA DE CAJAS INACTIVAS
-- Ejecutar TODO este script en Supabase SQL Editor
-- ========================================

-- PASO 1: Ver estructura actual de la tabla
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'management_boxes'
ORDER BY ordinal_position;

-- PASO 2: Agregar columnas necesarias SI NO EXISTEN
ALTER TABLE management_boxes 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

ALTER TABLE management_boxes 
ADD COLUMN IF NOT EXISTS inactive_reason TEXT;

-- PASO 3: Actualizar valores NULL a true (cajas activas por defecto)
UPDATE management_boxes 
SET is_active = true 
WHERE is_active IS NULL;

UPDATE management_boxes 
SET available = true 
WHERE available IS NULL;

-- PASO 4: Crear o reemplazar la vista current_boxes
DROP VIEW IF EXISTS current_boxes CASCADE;

CREATE VIEW current_boxes AS
SELECT 
    id,
    name,
    description,
    price_cop,
    price_usd,
    stock_quantity,
    min_stock,
    image_url,
    featured,
    available,
    is_active,
    inactive_reason,
    created_at,
    updated_at
FROM management_boxes
ORDER BY featured DESC, name;

-- PASO 5: Verificar que la vista funciona
SELECT 
    id,
    name,
    is_active,
    available,
    inactive_reason,
    CASE 
        WHEN is_active = false OR available = false THEN '🔴 INACTIVA'
        ELSE '✅ ACTIVA'
    END AS estado
FROM current_boxes
LIMIT 10;

-- PASO 6: Contar cajas activas e inactivas
SELECT 
    CASE 
        WHEN is_active = false OR available = false THEN 'Inactivas'
        ELSE 'Activas'
    END AS tipo,
    COUNT(*) AS cantidad
FROM management_boxes
GROUP BY 
    CASE 
        WHEN is_active = false OR available = false THEN 'Inactivas'
        ELSE 'Activas'
    END;

-- PASO 7: Ver cajas inactivas (si las hay)
SELECT 
    id,
    name,
    description,
    is_active,
    available,
    inactive_reason
FROM management_boxes
WHERE is_active = false OR available = false
ORDER BY name;

-- ========================================
-- PRUEBA: Desactivar una caja de prueba
-- ========================================

-- Opción A: Desactivar la primera caja para prueba
UPDATE management_boxes
SET 
    is_active = false,
    available = false,
    inactive_reason = 'Prueba de sistema - Temporalmente no disponible',
    updated_at = NOW()
WHERE id = (SELECT id FROM management_boxes LIMIT 1)
RETURNING id, name, is_active, available, inactive_reason;

-- PASO 8: Verificar que la caja se desactivó
SELECT 
    id,
    name,
    is_active,
    available,
    inactive_reason,
    updated_at
FROM management_boxes
WHERE is_active = false OR available = false
ORDER BY updated_at DESC
LIMIT 5;

-- PASO 9: Ver en la vista current_boxes
SELECT 
    id,
    name,
    description,
    is_active,
    available,
    inactive_reason,
    price_cop,
    stock_quantity
FROM current_boxes
WHERE is_active = false OR available = false
ORDER BY name;

-- ========================================
-- RESUMEN DE VERIFICACIÓN
-- ========================================
SELECT 
    '✅ Total de cajas' AS verificacion,
    COUNT(*)::text AS resultado
FROM management_boxes
UNION ALL
SELECT 
    '🔴 Cajas inactivas' AS verificacion,
    COUNT(*)::text AS resultado
FROM management_boxes
WHERE is_active = false OR available = false
UNION ALL
SELECT 
    '✅ Cajas activas' AS verificacion,
    COUNT(*)::text AS resultado
FROM management_boxes
WHERE is_active = true AND available = true
UNION ALL
SELECT 
    '📋 Vista current_boxes funciona' AS verificacion,
    CASE WHEN COUNT(*) > 0 THEN 'SÍ ✅' ELSE 'NO ❌' END AS resultado
FROM current_boxes
LIMIT 1;

-- ========================================
-- SI NECESITAS REACTIVAR TODAS LAS CAJAS:
-- ========================================
-- Descomenta las siguientes líneas para reactivar todo:
-- UPDATE management_boxes SET is_active = true, available = true, inactive_reason = NULL;
-- SELECT 'Todas las cajas reactivadas' AS mensaje;
