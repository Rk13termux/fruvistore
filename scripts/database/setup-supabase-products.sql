-- =====================================================
-- SETUP SUPABASE PRODUCTS DATABASE
-- Estructura completa para manejo de productos y precios
-- =====================================================

-- 1. TABLA DE PRODUCTOS (Información básica)
CREATE TABLE IF NOT EXISTS management_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    season VARCHAR(100),
    nutritional_info JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE PRECIOS (Historial de precios y control de inventario)
CREATE TABLE IF NOT EXISTS management_product_prices (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES management_products(id) ON DELETE CASCADE,
    price_per_kg DECIMAL(10,2) NOT NULL,
    cost_per_kg DECIMAL(10,2), -- Costo para calcular margen
    is_organic BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 4.0,
    origin VARCHAR(100),
    stock_kg INTEGER DEFAULT 0, -- Inventario en kilos
    min_stock_kg INTEGER DEFAULT 10, -- Stock mínimo
    supplier VARCHAR(255),
    is_current BOOLEAN DEFAULT true, -- Solo un precio activo por producto
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE PROVEEDORES
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    department VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 4.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA DE ACTUALIZACIONES DE PRECIOS (Log de cambios)
CREATE TABLE IF NOT EXISTS price_updates_log (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES management_products(id),
    old_price DECIMAL(10,2),
    new_price DECIMAL(10,2),
    update_reason VARCHAR(255),
    updated_by VARCHAR(255), -- Email del usuario que actualizó
    market_source VARCHAR(100), -- 'manual', 'api', 'bulk_import'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ÍNDICES para mejor performance
CREATE INDEX IF NOT EXISTS idx_products_category ON management_products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON management_products(is_active);
CREATE INDEX IF NOT EXISTS idx_prices_current ON management_product_prices(is_current);
CREATE INDEX IF NOT EXISTS idx_prices_product ON management_product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_stock ON management_product_prices(stock_kg);

-- 6. TRIGGERS para mantener consistencia
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON management_products
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_prices_modtime BEFORE UPDATE ON management_product_prices
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 7. FUNCIÓN para actualizar precios manteniendo historial
CREATE OR REPLACE FUNCTION update_product_price(
    p_product_id INTEGER,
    p_new_price DECIMAL,
    p_update_reason VARCHAR DEFAULT 'Manual update',
    p_updated_by VARCHAR DEFAULT 'system'
)
RETURNS VOID AS $$
DECLARE
    old_price_record RECORD;
BEGIN
    -- Obtener precio actual
    SELECT price_per_kg INTO old_price_record
    FROM management_product_prices
    WHERE product_id = p_product_id AND is_current = true;

    -- Marcar precio actual como no vigente
    UPDATE management_product_prices
    SET is_current = false,
        valid_until = NOW(),
        updated_at = NOW()
    WHERE product_id = p_product_id AND is_current = true;

    -- Insertar nuevo precio
    INSERT INTO management_product_prices (
        product_id, price_per_kg, is_current, valid_from
    ) VALUES (
        p_product_id, p_new_price, true, NOW()
    );

    -- Log del cambio
    INSERT INTO price_updates_log (
        product_id, old_price, new_price, update_reason, updated_by
    ) VALUES (
        p_product_id,
        old_price_record.price_per_kg,
        p_new_price,
        p_update_reason,
        p_updated_by
    );
END;
$$ LANGUAGE plpgsql;

-- 8. FUNCIÓN para actualizar inventario
CREATE OR REPLACE FUNCTION update_stock(
    p_product_id INTEGER,
    p_quantity_change INTEGER, -- Positivo para añadir, negativo para restar
    p_reason VARCHAR DEFAULT 'Manual adjustment'
)
RETURNS VOID AS $$
BEGIN
    UPDATE management_product_prices
    SET stock_kg = stock_kg + p_quantity_change,
        updated_at = NOW()
    WHERE product_id = p_product_id AND is_current = true;

    -- Opcional: Log de cambios de inventario
    INSERT INTO price_updates_log (
        product_id,
        update_reason,
        updated_by,
        created_at
    ) VALUES (
        p_product_id,
        p_reason || ' - Stock change: ' || p_quantity_change || 'kg',
        'system',
        NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- 9. VISTA para consulta rápida de productos con precios actuales
CREATE OR REPLACE VIEW current_products AS
SELECT
    p.id,
    p.name,
    p.category,
    p.description,
    p.image_url,
    p.season,
    p.is_active,
    pr.price_per_kg,
    pr.cost_per_kg,
    pr.is_organic,
    pr.rating,
    pr.origin,
    pr.stock_kg,
    pr.min_stock_kg,
    pr.supplier,
    (pr.stock_kg <= pr.min_stock_kg) as low_stock,
    ROUND(((pr.price_per_kg - pr.cost_per_kg) / pr.price_per_kg * 100), 2) as profit_margin
FROM management_products p
LEFT JOIN management_product_prices pr ON p.id = pr.product_id
WHERE p.is_active = true AND pr.is_current = true;

-- 10. RLS (Row Level Security) - Opcional para multi-tenant
ALTER TABLE management_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE management_product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_updates_log ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública de productos activos
CREATE POLICY "Public products are viewable" ON management_products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public current prices are viewable" ON management_product_prices
    FOR SELECT USING (is_current = true);

-- Políticas para permitir operaciones de admin (INSERT, UPDATE, DELETE)
-- Permitir acceso anónimo para operaciones de administración (protegido por otros medios)
CREATE POLICY "Admin can manage products" ON management_products
    FOR ALL USING (true);

CREATE POLICY "Admin can manage product prices" ON management_product_prices
    FOR ALL USING (true);

CREATE POLICY "Admin can manage suppliers" ON suppliers
    FOR ALL USING (true);

CREATE POLICY "Admin can manage price logs" ON price_updates_log
    FOR ALL USING (true);

-- Políticas adicionales para INSERT explícito (por si las anteriores no cubren todos los casos)
CREATE POLICY "Allow authenticated users to insert products" ON management_products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert product prices" ON management_product_prices
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert suppliers" ON suppliers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert price logs" ON price_updates_log
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para admin (requiere autenticación)
-- CREATE POLICY "Admin full access" ON management_products
--     FOR ALL USING (auth.role() = 'admin');

COMMENT ON TABLE management_products IS 'Catálogo de productos - información básica';
COMMENT ON TABLE management_product_prices IS 'Precios e inventario con historial completo';
COMMENT ON TABLE suppliers IS 'Proveedores de productos';
COMMENT ON TABLE price_updates_log IS 'Log de cambios de precios para auditoría';
COMMENT ON FUNCTION update_product_price IS 'Actualiza precio manteniendo historial';
COMMENT ON FUNCTION update_stock IS 'Actualiza inventario con registro de cambios';