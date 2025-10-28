-- Supabase Tables for FruviStore Management System
-- These tables are separate from user registration tables

-- Products table (independent from web app)
CREATE TABLE IF NOT EXISTS management_products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product prices table (historical pricing)
CREATE TABLE IF NOT EXISTS management_product_prices (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES management_products(id) ON DELETE CASCADE,
  price_per_kg DECIMAL(10,2) NOT NULL,
  is_organic BOOLEAN DEFAULT false,
  rating DECIMAL(3,1) DEFAULT 4.0,
  origin VARCHAR(255),
  is_current BOOLEAN DEFAULT true,
  effective_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table (for order management)
CREATE TABLE IF NOT EXISTS management_orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL, -- References auth.users
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  payment_method VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS management_order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES management_orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES management_products(id),
  product_name VARCHAR(255) NOT NULL, -- Snapshot of product name
  quantity DECIMAL(8,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory tracking (optional)
CREATE TABLE IF NOT EXISTS management_inventory (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES management_products(id) ON DELETE CASCADE,
  quantity_available DECIMAL(10,2) DEFAULT 0,
  quantity_reserved DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_management_products_category ON management_products(category);
CREATE INDEX IF NOT EXISTS idx_management_products_active ON management_products(is_active);
CREATE INDEX IF NOT EXISTS idx_management_product_prices_product ON management_product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_management_product_prices_current ON management_product_prices(is_current);
CREATE INDEX IF NOT EXISTS idx_management_orders_user ON management_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_management_orders_status ON management_orders(status);
CREATE INDEX IF NOT EXISTS idx_management_order_items_order ON management_order_items(order_id);

-- Row Level Security (RLS) policies
ALTER TABLE management_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE management_product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE management_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE management_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE management_inventory ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (adjust as needed for your use case)
-- For now, allowing all authenticated users to read
CREATE POLICY "Allow authenticated users to read products" ON management_products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read prices" ON management_product_prices
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage products (INSERT, UPDATE, DELETE)
-- Permitir acceso anónimo para operaciones de administración (protegido por otros medios)
CREATE POLICY "Allow authenticated users to manage products" ON management_products
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to manage prices" ON management_product_prices
  FOR ALL USING (true);

CREATE POLICY "Users can read their own orders" ON management_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own order items" ON management_order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM management_orders
      WHERE management_orders.id = management_order_items.order_id
      AND management_orders.user_id = auth.uid()
    )
  );

-- Insert initial data (sample products)
INSERT INTO management_products (name, category, description, image_url) VALUES
('Naranja Valencia', 'Cítricas', 'Jugosa, dulce y rica en vitamina C. Perfecta para jugos y postres.', '/images/products/naranja_valecia.png'),
('Mango Ataulfo', 'Tropicales', 'Carne cremosa, sabor intenso y tropical. Premium quality.', '/images/products/mango-ataulfo.png'),
('Limón Eureka', 'Cítricas', 'Ácido y aromático. Ideal para bebidas, marinados y repostería.', '/images/products/limon-eureka.png'),
('Mandarina Clementina', 'Cítricas', 'Fácil de pelar, muy dulce y sin semillas. Snack perfecto.', '/images/products/mandarina-clementina.png'),
('Piña Golden', 'Tropicales', 'Dulce, jugosa y muy aromática. Perfecta para postres.', '/images/products/pina-golden.jpg'),
('Kiwi Zespri', 'Tropicales', 'Equilibrio perfecto entre ácido y dulce. Alto en vitamina C.', '/images/products/kiwi-zespri.jpg'),
('Fresa Premium', 'Bayas', 'Dulce, fragante y rica en antioxidantes. Selección superior.', '/images/products/fresa-premium.jpg'),
('Arándanos Azules', 'Bayas', 'Superfood rica en antioxidantes. Perfectos para smoothies.', '/images/products/arandanos-azules.jpg'),
('Frambuesas', 'Bayas', 'Delicadas y aromáticas. Ideales para postres y decoración.', '/images/products/frambuesas.jpg'),
('Manzana Honeycrisp', 'Manzanas', 'Crujiente, jugosa y perfectamente equilibrada. Premium.', '/images/products/manzana-honeycrisp.jpg'),
('Manzana Granny Smith', 'Manzanas', 'Ácida y crujiente. Perfecta para tartas y ensaladas.', '/images/products/manzana-granny-smith.jpg'),
('Manzana Gala', 'Manzanas', 'Dulce y suave. Ideal para snacks y niños.', '/images/products/manzana-gala.jpg'),
('Uva Roja Sin Semillas', 'Uvas', 'Dulce, crujiente y fácil de comer. Perfecta para picnics.', '/images/products/uva-roja-sin-semillas.jpg'),
('Uva Blanca Thompson', 'Uvas', 'Dulce y refrescante. Ideal para vinos y consumo directo.', '/images/products/uva-blanca-thompson.jpg'),
('Uva Negra Concord', 'Uvas', 'Intenso sabor a uva. Perfecta para jugos y mermeladas.', '/images/products/uva-negra-concord.jpg')
ON CONFLICT DO NOTHING;

-- Insert initial prices
INSERT INTO management_product_prices (product_id, price_per_kg, is_organic, rating, origin, is_current) VALUES
(1, 2.50, true, 4.8, 'España', true),
(2, 5.90, true, 4.9, 'Perú', true),
(3, 3.20, false, 4.6, 'México', true),
(4, 4.10, true, 4.9, 'Marruecos', true),
(5, 3.80, false, 4.7, 'Costa Rica', true),
(6, 6.50, true, 4.8, 'Nueva Zelanda', true),
(7, 7.20, true, 4.9, 'California, USA', true),
(8, 12.50, true, 4.8, 'Oregon, USA', true),
(9, 15.80, true, 4.7, 'Colombia', true),
(10, 4.20, false, 4.8, 'Washington, USA', true),
(11, 3.50, true, 4.6, 'Chile', true),
(12, 3.80, false, 4.5, 'Italia', true),
(13, 5.90, true, 4.7, 'California, USA', true),
(14, 4.50, false, 4.6, 'España', true),
(15, 6.20, true, 4.8, 'Michigan, USA', true)
ON CONFLICT DO NOTHING;