-- =====================================================
-- TABLAS PARA GESTIÓN DE CAJAS - FRUVI STORE
-- Base de datos: xujenwuefrgxfsiqjqhl.supabase.co
-- =====================================================

-- Tabla principal de cajas (similar a current_products)
CREATE TABLE IF NOT EXISTS current_boxes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(50) DEFAULT 'Caja Premium',
    
    -- Precios
    price_cop DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Contenido de la caja
    total_items INTEGER DEFAULT 5,
    estimated_weight_kg DECIMAL(8,2) DEFAULT 2.5,
    
    -- Disponibilidad
    available BOOLEAN DEFAULT true,
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 10,
    min_stock INTEGER DEFAULT 2,
    
    -- SEO y Marketing
    slug VARCHAR(150) UNIQUE,
    tags TEXT[], -- Array de tags
    featured BOOLEAN DEFAULT false,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(100) DEFAULT 'admin'
);

-- Tabla de contenido de cajas (qué productos van en cada caja)
CREATE TABLE IF NOT EXISTS box_contents (
    id SERIAL PRIMARY KEY,
    box_id INTEGER REFERENCES current_boxes(id) ON DELETE CASCADE,
    product_id INTEGER, -- Referencia a current_products(id)
    product_name VARCHAR(100) NOT NULL,
    quantity_kg DECIMAL(8,2) NOT NULL DEFAULT 0.5,
    unit_price_cop DECIMAL(10,2),
    subtotal_cop DECIMAL(10,2),
    
    -- Orden de presentación
    display_order INTEGER DEFAULT 1,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de precios históricos de cajas
CREATE TABLE IF NOT EXISTS box_price_history (
    id SERIAL PRIMARY KEY,
    box_id INTEGER REFERENCES current_boxes(id) ON DELETE CASCADE,
    old_price_cop DECIMAL(10,2),
    new_price_cop DECIMAL(10,2),
    old_price_usd DECIMAL(10,2),
    new_price_usd DECIMAL(10,2),
    change_reason TEXT,
    updated_by VARCHAR(100) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de estadísticas de cajas
CREATE TABLE IF NOT EXISTS box_analytics (
    id SERIAL PRIMARY KEY,
    box_id INTEGER REFERENCES current_boxes(id) ON DELETE CASCADE,
    views_count INTEGER DEFAULT 0,
    add_to_cart_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    revenue_cop DECIMAL(12,2) DEFAULT 0,
    last_purchased_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_current_boxes_category ON current_boxes(category);
CREATE INDEX IF NOT EXISTS idx_current_boxes_available ON current_boxes(available);
CREATE INDEX IF NOT EXISTS idx_current_boxes_featured ON current_boxes(featured);
CREATE INDEX IF NOT EXISTS idx_current_boxes_slug ON current_boxes(slug);
CREATE INDEX IF NOT EXISTS idx_box_contents_box_id ON box_contents(box_id);
CREATE INDEX IF NOT EXISTS idx_box_price_history_box_id ON box_price_history(box_id);

-- Triggers para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_current_boxes_updated_at 
    BEFORE UPDATE ON current_boxes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_box_contents_updated_at 
    BEFORE UPDATE ON box_contents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_box_analytics_updated_at 
    BEFORE UPDATE ON box_analytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security) si es necesario
ALTER TABLE current_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE box_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE box_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE box_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo para autenticados)
CREATE POLICY "Allow all operations on current_boxes" ON current_boxes FOR ALL USING (true);
CREATE POLICY "Allow all operations on box_contents" ON box_contents FOR ALL USING (true);
CREATE POLICY "Allow all operations on box_price_history" ON box_price_history FOR ALL USING (true);
CREATE POLICY "Allow all operations on box_analytics" ON box_analytics FOR ALL USING (true);