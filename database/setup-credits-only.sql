-- ===== SISTEMA DE CRÉDITOS DR. AI - SCRIPT SQL PURO =====
-- Ejecutar este script en Supabase SQL Editor para crear las tablas de créditos

-- Tabla principal de créditos de usuario
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

-- Tabla de historial de transacciones de créditos
CREATE TABLE IF NOT EXISTS credit_transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  reference_id VARCHAR(255),
  admin_user_id UUID REFERENCES auth.users(id),
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de clientes (registro de usuarios) - si no existe
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  zip_code VARCHAR(20),
  frequency VARCHAR(50) DEFAULT 'ocasional',
  favorite_fruits TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- ===== ÍNDICES PARA PERFORMANCE =====

CREATE INDEX IF NOT EXISTS idx_user_ai_credits_user ON user_ai_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created ON credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_user ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ===== ROW LEVEL SECURITY (RLS) =====

ALTER TABLE user_ai_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Políticas RLS

-- Usuarios pueden gestionar sus propios créditos
DROP POLICY IF EXISTS "Users can manage their own AI credits" ON user_ai_credits;
CREATE POLICY "Users can manage their own AI credits" ON user_ai_credits
  FOR ALL USING (auth.uid() = user_id);

-- Usuarios pueden leer su propio historial de transacciones
DROP POLICY IF EXISTS "Users can read their own credit transactions" ON credit_transactions;
CREATE POLICY "Users can read their own credit transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Usuarios pueden gestionar sus propios datos de cliente
DROP POLICY IF EXISTS "Users can manage their own customer data" ON customers;
CREATE POLICY "Users can manage their own customer data" ON customers
  FOR ALL USING (auth.uid() = user_id);

-- Políticas de administrador para gestión de créditos
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

-- ===== MENSAJE DE CONFIRMACIÓN =====
-- Script ejecutado exitosamente. Las tablas de créditos están listas.