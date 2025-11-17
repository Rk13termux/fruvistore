-- AGREGAR CAMPOS FALTANTES PARA PRODUCTOS INACTIVOS
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si la tabla management_products tiene los campos necesarios
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'management_products'
  AND column_name IN ('is_active', 'available', 'inactive_reason')
ORDER BY column_name;

-- 2. Agregar campo 'available' si no existe (para compatibilidad)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'management_products' 
        AND column_name = 'available'
    ) THEN
        ALTER TABLE management_products 
        ADD COLUMN available BOOLEAN DEFAULT true;
        
        RAISE NOTICE 'Campo "available" agregado a management_products';
    ELSE
        RAISE NOTICE 'Campo "available" ya existe en management_products';
    END IF;
END $$;

-- 3. Agregar campo 'inactive_reason' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'management_products' 
        AND column_name = 'inactive_reason'
    ) THEN
        ALTER TABLE management_products 
        ADD COLUMN inactive_reason TEXT;
        
        RAISE NOTICE 'Campo "inactive_reason" agregado a management_products';
    ELSE
        RAISE NOTICE 'Campo "inactive_reason" ya existe en management_products';
    END IF;
END $$;

-- 4. Asegurar que is_active existe y tiene valor por defecto
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'management_products' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE management_products 
        ADD COLUMN is_active BOOLEAN DEFAULT true;
        
        RAISE NOTICE 'Campo "is_active" agregado a management_products';
    ELSE
        RAISE NOTICE 'Campo "is_active" ya existe en management_products';
    END IF;
END $$;

-- 5. Actualizar productos que tengan is_active = NULL
UPDATE management_products 
SET is_active = true 
WHERE is_active IS NULL;

-- 6. Actualizar productos que tengan available = NULL
UPDATE management_products 
SET available = true 
WHERE available IS NULL;

-- 7. Verificar la estructura final
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'management_products'
  AND column_name IN ('is_active', 'available', 'inactive_reason', 'name', 'category')
ORDER BY 
    CASE column_name
        WHEN 'name' THEN 1
        WHEN 'category' THEN 2
        WHEN 'is_active' THEN 3
        WHEN 'available' THEN 4
        WHEN 'inactive_reason' THEN 5
    END;

-- 8. Ver productos inactivos (si los hay)
SELECT 
    id,
    name,
    category,
    is_active,
    available,
    inactive_reason,
    CASE 
        WHEN is_active = false OR available = false THEN '🔴 INACTIVO'
        ELSE '✅ ACTIVO'
    END AS estado
FROM management_products
WHERE is_active = false OR available = false
ORDER BY name;

-- 9. IMPORTANTE: Actualizar la vista current_products para incluir nuevos campos
CREATE OR REPLACE VIEW current_products AS
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

-- 10. Verificar que la vista funciona correctamente
SELECT * FROM current_products LIMIT 5;

RAISE NOTICE '✅ Configuración completada. Los campos available e inactive_reason están listos.';
