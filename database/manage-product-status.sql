-- SCRIPT PARA GESTIONAR PRODUCTOS ACTIVOS/INACTIVOS
-- Ejecutar en Supabase SQL Editor

-- ===== OPCIÓN 1: DESACTIVAR UN PRODUCTO =====
-- Copia y modifica este comando con el nombre exacto del producto

-- Ejemplo: Desactivar Aguacate Hass
UPDATE management_products
SET is_active = false
WHERE name = 'Aguacate Hass';

-- Ejemplo: Desactivar Uvas
UPDATE management_products
SET is_active = false
WHERE name = 'Uvas';


-- ===== OPCIÓN 2: REACTIVAR UN PRODUCTO =====
-- Copia y modifica este comando con el nombre exacto del producto

-- Ejemplo: Reactivar Aguacate Hass
UPDATE management_products
SET is_active = true
WHERE name = 'Aguacate Hass';

-- Ejemplo: Reactivar Uvas
UPDATE management_products
SET is_active = true
WHERE name = 'Uvas';


-- ===== OPCIÓN 3: DESACTIVAR MÚLTIPLES PRODUCTOS =====
-- Puedes desactivar varios productos a la vez

UPDATE management_products
SET is_active = false
WHERE name IN ('Aguacate Hass', 'Uvas', 'Mango');


-- ===== OPCIÓN 4: REACTIVAR TODOS LOS PRODUCTOS INACTIVOS =====
-- ⚠️ CUIDADO: Esto reactiva TODOS los productos inactivos

UPDATE management_products
SET is_active = true
WHERE is_active = false;


-- ===== VERIFICACIÓN DESPUÉS DE ACTUALIZAR =====
-- Ejecuta esto para ver que los cambios se aplicaron correctamente

SELECT 
    id,
    name,
    category,
    is_active,
    CASE 
        WHEN is_active = true THEN '✅ ACTIVO'
        ELSE '🔴 INACTIVO'
    END AS estado
FROM management_products
ORDER BY is_active DESC, name;
