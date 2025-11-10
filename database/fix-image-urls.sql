-- =====================================================
-- SCRIPT PARA CORREGIR URLS DE IMÁGENES
-- Normaliza todas las URLs a /images/products/ en minúsculas
-- =====================================================

-- Actualizar productos que tienen URLs con mayúsculas o formatos incorrectos
UPDATE management_products
SET image_url = LOWER(
  CASE 
    -- Si la URL ya empieza con /images/products/, solo convertir a minúsculas
    WHEN image_url LIKE '/images/products/%' THEN image_url
    -- Si empieza con http/https, extraer el nombre del archivo
    WHEN image_url LIKE 'http%' THEN '/images/products/' || SPLIT_PART(image_url, '/', -1)
    -- Si no tiene /, agregar el prefijo
    WHEN image_url NOT LIKE '/%' THEN '/images/products/' || image_url
    -- Cualquier otro caso, dejarlo como está
    ELSE image_url
  END
)
WHERE image_url IS NOT NULL;

-- Verificar el resultado
SELECT id, name, image_url 
FROM management_products 
ORDER BY category, name 
LIMIT 20;
