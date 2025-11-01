-- Script para solucionar el error 406 en user_subscriptions
-- Ejecutar en SQL Editor de Supabase

-- Asegurar que la tabla existe
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  payment_method VARCHAR(100),
  last_payment_date TIMESTAMP WITH TIME ZONE,
  next_payment_date TIMESTAMP WITH TIME ZONE,
  usage_limits JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- Habilitar RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Eliminar política anterior si existe y crear nueva
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can manage their own subscriptions" ON user_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Verificar que la tabla funciona
SELECT COUNT(*) as total_subscriptions FROM user_subscriptions;