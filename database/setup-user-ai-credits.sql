-- =============================================
-- SISTEMA DE CRÉDITOS DR. AI - user_ai_credits
-- =============================================
-- ESTRUCTURA REAL DE LA BASE DE DATOS (YA EXISTE)
-- Este archivo documenta la estructura existente y proporciona consultas útiles

-- ===== TABLA EXISTENTE: user_ai_credits =====
-- LA TABLA YA EXISTE EN LA BASE DE DATOS CON ESTA ESTRUCTURA:

CREATE TABLE IF NOT EXISTS public.user_ai_credits (
  id serial NOT NULL,
  user_id uuid NOT NULL,
  credits_balance integer NOT NULL DEFAULT 0,
  total_credits_earned integer NOT NULL DEFAULT 0,
  total_credits_spent integer NOT NULL DEFAULT 0,
  last_credit_update timestamp with time zone NULL DEFAULT now(),
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT user_ai_credits_pkey PRIMARY KEY (id),
  CONSTRAINT user_ai_credits_user_id_key UNIQUE (user_id),
  CONSTRAINT user_ai_credits_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_user_ai_credits_user 
  ON public.user_ai_credits USING btree (user_id) 
  TABLESPACE pg_default;

-- ===== TABLA DE TRANSACCIONES: credit_transactions =====
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  transaction_type varchar(50) NOT NULL,
  amount integer NOT NULL,
  description text NULL,
  reference_id varchar(255) NULL,
  balance_before integer NOT NULL DEFAULT 0,
  balance_after integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT credit_transactions_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- ===== ÍNDICES PARA PERFORMANCE =====
CREATE INDEX IF NOT EXISTS idx_user_ai_credits_user_id 
  ON public.user_ai_credits(user_id);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id 
  ON public.credit_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_type 
  ON public.credit_transactions(transaction_type);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_created 
  ON public.credit_transactions(created_at DESC);

-- ===== COMENTARIOS EN LAS TABLAS =====
COMMENT ON TABLE public.user_ai_credits IS 
  'Tabla de balance de créditos para Dr. AI. Los usuarios se crean automáticamente con 25 créditos iniciales al iniciar el chat.';

COMMENT ON COLUMN public.user_ai_credits.credits_balance IS 
  'Balance actual de créditos disponibles para usar';

COMMENT ON COLUMN public.user_ai_credits.total_credits_earned IS 
  'Total acumulado de créditos ganados/comprados (incluye los 25 iniciales)';

COMMENT ON COLUMN public.user_ai_credits.total_credits_spent IS 
  'Total acumulado de créditos gastados en consultas';

COMMENT ON TABLE public.credit_transactions IS 
  'Historial completo de todas las transacciones de créditos (compras, gastos, ajustes)';

-- ===== ROW LEVEL SECURITY (RLS) =====
ALTER TABLE public.user_ai_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver y actualizar sus propios créditos
DROP POLICY IF EXISTS "users_manage_own_credits" ON public.user_ai_credits;
CREATE POLICY "users_manage_own_credits" 
  ON public.user_ai_credits
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios pueden ver su propio historial de transacciones
DROP POLICY IF EXISTS "users_view_own_transactions" ON public.credit_transactions;
CREATE POLICY "users_view_own_transactions" 
  ON public.credit_transactions
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política: Sistema puede insertar transacciones
DROP POLICY IF EXISTS "service_role_insert_transactions" ON public.credit_transactions;
CREATE POLICY "service_role_insert_transactions" 
  ON public.credit_transactions
  FOR INSERT 
  WITH CHECK (true);

-- ===== FUNCIÓN PARA AUTO-INICIALIZAR CRÉDITOS =====
-- Esta función se puede llamar desde un trigger si lo deseas
CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar 25 créditos iniciales cuando se crea un nuevo usuario en customers
  INSERT INTO public.user_ai_credits (
    user_id, 
    credits_balance, 
    total_credits_earned,
    total_credits_spent
  )
  VALUES (
    NEW.user_id, 
    25, 
    25,
    0
  )
  ON CONFLICT (user_id) DO NOTHING; -- Si ya existe, no hacer nada
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger opcional: auto-crear créditos cuando se registra un customer
-- Comentado por defecto - descomentar si quieres que sea automático al registrarse
/*
DROP TRIGGER IF EXISTS trigger_initialize_credits ON public.customers;
CREATE TRIGGER trigger_initialize_credits
  AFTER INSERT ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_user_credits();
*/

-- ===== CONSULTAS ÚTILES DE VERIFICACIÓN =====

-- Ver todos los usuarios con sus créditos
/*
SELECT 
  c.full_name,
  c.email,
  uac.user_id,
  uac.credits_balance,
  uac.total_credits_earned,
  uac.total_credits_spent,
  uac.created_at,
  uac.last_credit_update
FROM user_ai_credits uac
JOIN customers c ON c.user_id = uac.user_id
ORDER BY uac.created_at DESC;
*/

-- Ver historial de transacciones
/*
SELECT 
  ct.created_at,
  c.full_name,
  ct.transaction_type,
  ct.amount,
  ct.description,
  ct.balance_before,
  ct.balance_after
FROM credit_transactions ct
JOIN customers c ON c.user_id = ct.user_id
ORDER BY ct.created_at DESC
LIMIT 50;
*/

-- Ver usuarios sin créditos inicializados
/*
SELECT 
  c.user_id,
  c.full_name,
  c.email
FROM customers c
LEFT JOIN user_ai_credits uac ON c.user_id = uac.user_id
WHERE uac.user_id IS NULL;
*/

-- =============================================
-- ✅ TABLAS CREADAS EXITOSAMENTE
-- =============================================
-- 
-- SISTEMA DE FUNCIONAMIENTO:
-- 1. Usuario inicia chat → Se crea automáticamente en user_ai_credits con 25 créditos
-- 2. Usuario compra créditos → Se SUMAN a los existentes (balance_actual + créditos_comprados)
-- 3. Usuario usa créditos → Se descuentan del balance_actual
-- 4. Todas las operaciones quedan registradas en credit_transactions
--
-- IMPORTANTE: 
-- - NO reemplazar créditos existentes al comprar
-- - SIEMPRE sumar: nuevo_balance = balance_actual + créditos_comprados
-- =============================================
