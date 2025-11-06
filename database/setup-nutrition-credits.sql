-- Tabla para almacenar los planes de nutrición personalizados de cada usuario
CREATE TABLE IF NOT EXISTS public.nutrition_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal TEXT,
  duration TEXT DEFAULT '30 días',
  meals JSONB DEFAULT '[]'::jsonb,
  smoothies JSONB DEFAULT '[]'::jsonb,
  improvements JSONB DEFAULT '[]'::jsonb,
  tips JSONB DEFAULT '[]'::jsonb,
  query TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_user_id ON public.nutrition_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_created_at ON public.nutrition_plans(created_at DESC);

-- Tabla para almacenar el historial de interacciones con el asistente nutricional
CREATE TABLE IF NOT EXISTS public.nutrition_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para el historial
CREATE INDEX IF NOT EXISTS idx_nutrition_interactions_user_id ON public.nutrition_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_interactions_created_at ON public.nutrition_interactions(created_at DESC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_nutrition_plans_updated_at
  BEFORE UPDATE ON public.nutrition_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security) para seguridad
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_interactions ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden ver y modificar sus propios planes
CREATE POLICY "Users can view their own nutrition plans"
  ON public.nutrition_plans
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition plans"
  ON public.nutrition_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition plans"
  ON public.nutrition_plans
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutrition plans"
  ON public.nutrition_plans
  FOR DELETE
  USING (auth.uid() = user_id);

-- Los usuarios solo pueden ver su propio historial
CREATE POLICY "Users can view their own nutrition interactions"
  ON public.nutrition_interactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition interactions"
  ON public.nutrition_interactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Comentarios para documentación
COMMENT ON TABLE public.nutrition_plans IS 'Almacena los planes de nutrición personalizados generados por IA para cada usuario';
COMMENT ON TABLE public.nutrition_interactions IS 'Registra todas las interacciones del usuario con el asistente nutricional para análisis y mejora';

COMMENT ON COLUMN public.nutrition_plans.meals IS 'Array JSON con el plan de comidas diario: [{time, name, description, calories}]';
COMMENT ON COLUMN public.nutrition_plans.smoothies IS 'Array JSON con batidos personalizados: [{name, ingredients[], benefits}]';
COMMENT ON COLUMN public.nutrition_plans.improvements IS 'Array JSON con mejoras esperadas: [{title, description, timeline}]';
COMMENT ON COLUMN public.nutrition_plans.tips IS 'Array JSON con consejos nutricionales personalizados';
