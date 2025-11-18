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
WHERE table_name = 'current_boxes'
ORDER BY ordinal_position;

-- PASO 2: Agregar columnas necesarias SI NO EXISTEN
ALTER TABLE current_boxes 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

ALTER TABLE current_boxes 
ADD COLUMN IF NOT EXISTS inactive_reason TEXT;

-- PASO 3: Actualizar valores NULL a true (cajas activas por defecto)
UPDATE current_boxes 
SET is_active = true 
WHERE is_active IS NULL;

UPDATE current_boxes 
SET available = true 
WHERE available IS NULL;

-- PASO 4: Verificar columnas agregadas
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'current_boxes'
  AND column_name IN ('is_active', 'available', 'inactive_reason')
ORDER BY column_name;

-- PASO 5: Contar cajas activas e inactivas
SELECT 
    CASE 
        WHEN is_active = false OR available = false THEN 'Inactivas'
        ELSE 'Activas'
    END AS tipo,
    COUNT(*) AS cantidad
FROM current_boxes
GROUP BY 
    CASE 
        WHEN is_active = false OR available = false THEN 'Inactivas'
        ELSE 'Activas'
    END;

-- PASO 6: Ver cajas inactivas (si las hay)
SELECT 
    id,
    name,
    description,
    is_active,
    available,
    inactive_reason
FROM current_boxes
WHERE is_active = false OR available = false
ORDER BY name;

-- ========================================
-- PRUEBA: Desactivar una caja de prueba
-- ========================================

-- Opción A: Desactivar la primera caja para prueba
UPDATE current_boxes
SET 
    is_active = false,
    available = false,
    inactive_reason = 'Prueba de sistema - Temporalmente no disponible',
    updated_at = NOW()
WHERE id = (SELECT id FROM current_boxes ORDER BY id LIMIT 1)
RETURNING id, name, is_active, available, inactive_reason;

-- PASO 7: Verificar que la caja se desactivó
SELECT 
    id,
    name,
    is_active,
    available,
    inactive_reason,
    updated_at
FROM current_boxes
WHERE is_active = false OR available = false
ORDER BY updated_at DESC
LIMIT 5;

-- PASO 8: Ver todas las cajas con su estado
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
ORDER BY is_active DESC, available DESC, name;

-- ========================================
-- RESUMEN DE VERIFICACIÓN
-- ========================================
SELECT 
    '✅ Total de cajas' AS verificacion,
    COUNT(*)::text AS resultado
FROM current_boxes
UNION ALL
SELECT 
    '🔴 Cajas inactivas' AS verificacion,
    COUNT(*)::text AS resultado
FROM current_boxes
WHERE is_active = false OR available = false
UNION ALL
SELECT 
    '✅ Cajas activas' AS verificacion,
    COUNT(*)::text AS resultado
FROM current_boxes
WHERE is_active = true AND available = true;

-- ========================================
-- SI NECESITAS REACTIVAR TODAS LAS CAJAS:
-- ========================================
-- Descomenta las siguientes líneas para reactivar todo:
-- UPDATE current_boxes SET is_active = true, available = true, inactive_reason = NULL;
-- SELECT 'Todas las cajas reactivadas' AS mensaje;
