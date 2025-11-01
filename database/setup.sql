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
DROP POLICY IF EXISTS "Allow authenticated users to read products" ON management_products;
CREATE POLICY "Allow authenticated users to read products" ON management_products
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to read prices" ON management_product_prices;
CREATE POLICY "Allow authenticated users to read prices" ON management_product_prices
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage products (INSERT, UPDATE, DELETE)
-- Permitir acceso anónimo para operaciones de administración (protegido por otros medios)
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON management_products;
CREATE POLICY "Allow authenticated users to manage products" ON management_products
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage prices" ON management_product_prices;
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

-- ===== AI DOCTOR NUTRITIONIST SYSTEM TABLES =====

-- Doctor personality and expertise configuration
CREATE TABLE IF NOT EXISTS ai_doctor_personality (
  id SERIAL PRIMARY KEY,
  doctor_name VARCHAR(255) NOT NULL DEFAULT 'Dr. Alejandro Rivera',
  specialty VARCHAR(255) NOT NULL DEFAULT 'Nutrición y Alimentación Funcional',
  credentials TEXT NOT NULL DEFAULT 'Médico Nutricionista graduado de Harvard University. Especialista en nutrición preventiva y terapéutica. Miembro de la Asociación Americana de Nutrición y Dietética.',
  experience_years INTEGER NOT NULL DEFAULT 15,
  approach TEXT NOT NULL DEFAULT 'Enfoque holístico que combina ciencia nutricional con medicina preventiva. Creo en el poder curativo de los alimentos naturales, especialmente las frutas frescas.',
  philosophy TEXT NOT NULL DEFAULT 'La nutrición no es solo comer bien, es vivir mejor. Cada fruta tiene un propósito nutricional específico y cuando se combina correctamente, puede transformar tu salud.',
  communication_style TEXT NOT NULL DEFAULT 'Profesional pero cercano, empático y motivador. Uso lenguaje accesible pero preciso, evitando jerga médica innecesaria.',
  expertise_areas TEXT[] NOT NULL DEFAULT ARRAY['Nutrición preventiva', 'Alimentación funcional', 'Control de peso', 'Salud digestiva', 'Sistema inmunológico', 'Envejecimiento saludable'],
  languages TEXT[] NOT NULL DEFAULT ARRAY['es', 'en'],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User nutrition profiles
CREATE TABLE IF NOT EXISTS user_nutrition_profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER,
  gender VARCHAR(20),
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  activity_level VARCHAR(50), -- sedentary, lightly_active, moderately_active, very_active, extremely_active
  health_goals TEXT[],
  dietary_restrictions TEXT[],
  allergies TEXT[],
  medical_conditions TEXT[],
  medications TEXT[],
  preferred_fruits TEXT[],
  disliked_fruits TEXT[],
  daily_water_intake_ml INTEGER,
  sleep_hours DECIMAL(3,1),
  stress_level VARCHAR(20), -- low, moderate, high
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Conversation history for AI doctor
CREATE TABLE IF NOT EXISTS ai_doctor_conversations (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  message_type VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  message_content TEXT NOT NULL,
  message_metadata JSONB, -- Store additional data like detected fruits, health metrics, etc.
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT false
);

-- Nutrition assessments and recommendations
CREATE TABLE IF NOT EXISTS nutrition_assessments (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type VARCHAR(100) NOT NULL, -- daily_check, weekly_review, monthly_assessment
  assessment_data JSONB NOT NULL, -- Store assessment results, scores, etc.
  recommendations TEXT[],
  follow_up_date DATE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personalized nutrition plans
CREATE TABLE IF NOT EXISTS nutrition_plans (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name VARCHAR(255) NOT NULL,
  plan_type VARCHAR(100) NOT NULL, -- weight_loss, muscle_gain, health_improvement, etc.
  duration_days INTEGER,
  daily_calories INTEGER,
  macro_distribution JSONB, -- {protein_g: X, carbs_g: Y, fat_g: Z}
  fruit_recommendations JSONB, -- Daily fruit intake recommendations
  meal_suggestions JSONB, -- Structured meal plans
  exercise_recommendations TEXT[],
  progress_tracking JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions for premium AI features
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type VARCHAR(50) NOT NULL, -- free, premium_monthly, premium_yearly
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, cancelled, expired, trial
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  payment_method VARCHAR(100),
  last_payment_date TIMESTAMP WITH TIME ZONE,
  next_payment_date TIMESTAMP WITH TIME ZONE,
  usage_limits JSONB, -- {ai_queries_per_day: X, conversations_per_month: Y}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- AI usage tracking
CREATE TABLE IF NOT EXISTS ai_usage_tracking (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_used VARCHAR(100) NOT NULL, -- chat_assistant, nutrition_analysis, meal_planning
  tokens_used INTEGER,
  query_count INTEGER DEFAULT 1,
  usage_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User credits system for Dr. AI
CREATE TABLE IF NOT EXISTS user_ai_credits (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_balance INTEGER NOT NULL DEFAULT 0,
  total_credits_earned INTEGER NOT NULL DEFAULT 0,
  total_credits_spent INTEGER NOT NULL DEFAULT 0,
  last_credit_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Credit transaction history
CREATE TABLE IF NOT EXISTS credit_transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'usage', 'admin_add', 'admin_deduct', 'refund'
  amount INTEGER NOT NULL, -- positive for additions, negative for deductions
  description TEXT,
  reference_id VARCHAR(255), -- order_id, conversation_id, etc.
  admin_user_id UUID REFERENCES auth.users(id), -- who performed admin action
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_doctor_conversations_user_session ON ai_doctor_conversations(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_ai_doctor_conversations_timestamp ON ai_doctor_conversations(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_nutrition_profiles_user ON user_nutrition_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_assessments_user ON nutrition_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_user ON nutrition_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_user_date ON ai_usage_tracking(user_id, usage_date);
CREATE INDEX IF NOT EXISTS idx_user_ai_credits_user ON user_ai_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created ON credit_transactions(created_at);

-- Row Level Security for new tables
ALTER TABLE ai_doctor_personality ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_nutrition_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_doctor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ai_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Doctor personality: readable by all authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to read doctor personality" ON ai_doctor_personality;
CREATE POLICY "Allow authenticated users to read doctor personality" ON ai_doctor_personality
  FOR SELECT USING (auth.role() = 'authenticated');

-- User nutrition profiles: users can only access their own data
DROP POLICY IF EXISTS "Users can manage their own nutrition profiles" ON user_nutrition_profiles;
CREATE POLICY "Users can manage their own nutrition profiles" ON user_nutrition_profiles
  FOR ALL USING (auth.uid() = user_id);

-- AI conversations: users can only access their own conversations
DROP POLICY IF EXISTS "Users can manage their own conversations" ON ai_doctor_conversations;
CREATE POLICY "Users can manage their own conversations" ON ai_doctor_conversations
  FOR ALL USING (auth.uid() = user_id);

-- Nutrition assessments: users can only access their own assessments
DROP POLICY IF EXISTS "Users can manage their own assessments" ON nutrition_assessments;
CREATE POLICY "Users can manage their own assessments" ON nutrition_assessments
  FOR ALL USING (auth.uid() = user_id);

-- Nutrition plans: users can only access their own plans
DROP POLICY IF EXISTS "Users can manage their own nutrition plans" ON nutrition_plans;
CREATE POLICY "Users can manage their own nutrition plans" ON nutrition_plans
  FOR ALL USING (auth.uid() = user_id);

-- User subscriptions: users can only access their own subscriptions
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can manage their own subscriptions" ON user_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- AI usage tracking: users can only access their own usage data
DROP POLICY IF EXISTS "Users can read their own usage tracking" ON ai_usage_tracking;
CREATE POLICY "Users can read their own usage tracking" ON ai_usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- User AI credits: users can only access their own credits
DROP POLICY IF EXISTS "Users can manage their own AI credits" ON user_ai_credits;
CREATE POLICY "Users can manage their own AI credits" ON user_ai_credits
  FOR ALL USING (auth.uid() = user_id);

-- Credit transactions: users can only access their own transaction history
DROP POLICY IF EXISTS "Users can read their own credit transactions" ON credit_transactions;
CREATE POLICY "Users can read their own credit transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Admin policies for credit management (allow admin users to manage all credits)
DROP POLICY IF EXISTS "Admins can manage all AI credits" ON user_ai_credits;
CREATE POLICY "Admins can manage all AI credits" ON user_ai_credits
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.uid() IN (
    SELECT user_id FROM user_subscriptions WHERE subscription_type = 'admin'
  ));

DROP POLICY IF EXISTS "Admins can manage all credit transactions" ON credit_transactions;
CREATE POLICY "Admins can manage all credit transactions" ON credit_transactions
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.uid() IN (
    SELECT user_id FROM user_subscriptions WHERE subscription_type = 'admin'
  ));

-- Insert default doctor personality
INSERT INTO ai_doctor_personality (
  doctor_name, specialty, credentials, experience_years, approach, philosophy,
  communication_style, expertise_areas, languages
) VALUES (
  'Dr. Alejandro Rivera',
  'Nutrición y Alimentación Funcional',
  'Médico Nutricionista graduado de Harvard University. Especialista en nutrición preventiva y terapéutica. Miembro de la Asociación Americana de Nutrición y Dietética. Certificado en Medicina Funcional y Nutrición Ortomolecular.',
  15,
  'Enfoque holístico que combina ciencia nutricional con medicina preventiva. Creo en el poder curativo de los alimentos naturales, especialmente las frutas frescas como herramienta principal para el bienestar.',
  'La nutrición no es solo comer bien, es vivir mejor. Cada fruta tiene un propósito nutricional específico y cuando se combina correctamente, puede transformar tu salud desde la raíz.',
  'Profesional pero cercano, empático y motivador. Uso lenguaje accesible pero preciso, evitando jerga médica innecesaria. Me enfoco en soluciones prácticas y sostenibles.',
  ARRAY['Nutrición preventiva', 'Alimentación funcional', 'Control de peso', 'Salud digestiva', 'Sistema inmunológico', 'Envejecimiento saludable', 'Medicina antiinflamatoria', 'Nutrición deportiva'],
  ARRAY['es', 'en']
) ON CONFLICT DO NOTHING;

-- ===== AI MEDICAL KNOWLEDGE BASE =====

-- Comprehensive medical knowledge for AI doctor
CREATE TABLE IF NOT EXISTS ai_medical_knowledge (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL, -- 'fruit_nutrition', 'health_condition', 'medical_protocol', 'supplement_info'
  subcategory VARCHAR(100), -- specific fruit name, condition name, etc.
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL, -- detailed medical/scientific information
  scientific_sources TEXT[], -- references, studies, etc.
  confidence_level VARCHAR(20) DEFAULT 'high', -- high, medium, low
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fruit-specific medical applications
CREATE TABLE IF NOT EXISTS fruit_medical_applications (
  id SERIAL PRIMARY KEY,
  fruit_name VARCHAR(100) NOT NULL,
  scientific_name VARCHAR(150),
  health_condition VARCHAR(100) NOT NULL,
  medical_evidence TEXT NOT NULL,
  recommended_dosage VARCHAR(255),
  preparation_method TEXT,
  contraindications TEXT[],
  interactions TEXT[],
  studies_references TEXT[],
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  confidence_level VARCHAR(20) DEFAULT 'high',
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-specific medical insights and patterns
CREATE TABLE IF NOT EXISTS user_medical_insights (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL, -- 'symptom_pattern', 'nutrient_deficiency', 'food_sensitivity', 'progress_indicator'
  insight_title VARCHAR(255) NOT NULL,
  insight_description TEXT NOT NULL,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  related_fruits TEXT[],
  recommended_actions TEXT[],
  follow_up_date DATE,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personalized fruit recommendations based on user profile
CREATE TABLE IF NOT EXISTS personalized_fruit_recommendations (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fruit_name VARCHAR(100) NOT NULL,
  health_reason VARCHAR(255) NOT NULL,
  priority_level INTEGER CHECK (priority_level >= 1 AND priority_level <= 5), -- 1=low, 5=critical
  recommended_frequency VARCHAR(100), -- 'daily', '3x_week', 'as_needed', etc.
  serving_size VARCHAR(100),
  best_time_to_consume VARCHAR(100),
  preparation_tips TEXT,
  expected_benefits TEXT[],
  potential_side_effects TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for AI knowledge base
CREATE INDEX IF NOT EXISTS idx_ai_medical_knowledge_category ON ai_medical_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_ai_medical_knowledge_subcategory ON ai_medical_knowledge(subcategory);
CREATE INDEX IF NOT EXISTS idx_fruit_medical_applications_fruit ON fruit_medical_applications(fruit_name);
CREATE INDEX IF NOT EXISTS idx_fruit_medical_applications_condition ON fruit_medical_applications(health_condition);
CREATE INDEX IF NOT EXISTS idx_user_medical_insights_user ON user_medical_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_personalized_recommendations_user ON personalized_fruit_recommendations(user_id);

-- Row Level Security for knowledge base tables
ALTER TABLE ai_medical_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE fruit_medical_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_medical_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_fruit_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Medical knowledge readable by authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to read medical knowledge" ON ai_medical_knowledge;
CREATE POLICY "Allow authenticated users to read medical knowledge" ON ai_medical_knowledge
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to read fruit applications" ON fruit_medical_applications;
CREATE POLICY "Allow authenticated users to read fruit applications" ON fruit_medical_applications
  FOR SELECT USING (auth.role() = 'authenticated');

-- User medical insights: users can only access their own data
DROP POLICY IF EXISTS "Users can manage their own medical insights" ON user_medical_insights;
CREATE POLICY "Users can manage their own medical insights" ON user_medical_insights
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own fruit recommendations" ON personalized_fruit_recommendations;
CREATE POLICY "Users can manage their own fruit recommendations" ON personalized_fruit_recommendations
  FOR ALL USING (auth.uid() = user_id);

-- Insert comprehensive medical knowledge base
INSERT INTO ai_medical_knowledge (category, subcategory, title, content, scientific_sources) VALUES
('fruit_nutrition', 'general', 'Base Científica de la Nutrición Frutal',
 'Las frutas constituyen una fuente esencial de micronutrientes, fitonutrientes y fibra dietética. Su composición bioquímica incluye vitaminas hidrosolubles (C, B), minerales, antioxidantes fenólicos, carotenoides y compuestos sulfurados. La biodisponibilidad de estos compuestos varía según el procesamiento, maduración y combinación con otros alimentos.',
 ARRAY['USDA FoodData Central', 'European Food Information Resource', 'Journal of Agricultural and Food Chemistry']),

('health_condition', 'diabetes', 'Manejo Nutricional de la Diabetes Tipo 2',
 'El índice glucémico y la carga glucémica son factores críticos. Frutas con IG bajo (<55): manzana, pera, berries, cítricos. Evitar jugos concentrados. La fibra soluble ayuda a regular la absorción de glucosa. Combinar con proteínas magras para estabilidad glucémica.',
 ARRAY['American Diabetes Association Guidelines 2023', 'Diabetes Care Journal', 'Journal of Nutrition']),

('health_condition', 'hypertension', 'Frutas en el Control de la Hipertensión',
 'Frutas ricas en potasio, magnesio y flavonoides ayudan a regular la presión arterial. El potasio contrarresta efectos del sodio. Frutas destacadas: plátano, naranja, papaya, mango. Los flavonoides mejoran la función endotelial.',
 ARRAY['DASH Diet Research', 'American Heart Association', 'Hypertension Journal']),

('medical_protocol', 'detoxification', 'Protocolos de Desintoxicación con Frutas',
 'La desintoxicación hepática y renal se facilita con frutas ricas en antioxidantes y compuestos sulfurados. El limón y cítricos estimulan la producción de bilis. Las berries protegen contra daño oxidativo. Protocolo: cítricos en ayunas, berries durante el día.',
 ARRAY['Liver Toxicology Research', 'Journal of Hepatology', 'Antioxidants & Redox Signaling']);

-- Insert fruit medical applications
INSERT INTO fruit_medical_applications (
  fruit_name, scientific_name, health_condition, medical_evidence,
  recommended_dosage, preparation_method, contraindications, effectiveness_rating
) VALUES
('Arándano', 'Vaccinium corymbosum', 'Infecciones Urinarias',
 'Los proantocianidinas del arándano inhiben la adhesión de E. coli a las paredes vesicales. Estudios clínicos demuestran reducción del 50% en recurrencia de ITU.',
 '300-500mg de extracto estandarizado diario, o 1 taza de arándanos frescos',
 'Consumir frescos o como jugo puro. Mejor con el estómago vacío.',
 ARRAY['Diabetes no controlada', 'Interacción con warfarina'],
 5),

('Kiwi', 'Actinidia deliciosa', 'Sistema Inmune',
 'Contiene vitamina C (2x que naranja), además de enzimas proteolíticas que mejoran absorción de nutrientes. Estudios muestran reducción de infecciones respiratorias.',
 '1-2 kiwis diarios, preferiblemente con cáscara comestible',
 'Consumir maduros a temperatura ambiente. La cáscara contiene fibra adicional.',
 ARRAY['Alergia al látex (posible cross-reactivity)'],
 4),

('Papaya', 'Carica papaya', 'Digestión',
 'La papaína facilita la digestión de proteínas. Rica en fibra soluble e insoluble. Ayuda en síndrome de intestino irritable y digestión pesada.',
 '1/2 papaya mediana diaria, preferiblemente en ayunas',
 'Consumir fresca y madura. Evitar papaya verde (toxico).',
 ARRAY['Embarazo (estimula contracciones)', 'Alergia a látex'],
 4),

('Limón', 'Citrus limon', 'Desintoxicación Hepática',
 'Ácido cítrico estimula producción de bilis. Vitamina C actúa como antioxidante. Alcaliniza el organismo y mejora función renal.',
 'Jugo de 1/2 limón en agua tibia, 2-3 veces diario',
 'Diluir siempre en agua. Consumir 30 min antes de comidas.',
 ARRAY['ERGE severo', 'Úlceras gástricas activas'],
 4),

('Manzana', 'Malus domestica', 'Colesterol Alto',
 'Pectina (fibra soluble) reduce absorción de colesterol LDL. Polifenoles mejoran perfil lipídico. Efecto comparable a estatinas naturales.',
 '1-2 manzanas diarias con cáscara',
 'Consumir con cáscara para máximo beneficio de fibra.',
 ARRAY['Ninguna significativa'],
 4);