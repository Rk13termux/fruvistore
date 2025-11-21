-- =============================================
-- SISTEMA DE CONOCIMIENTO DR. PRIMA AI
-- Tablas para almacenar conocimiento de marca, respuestas estructuradas y filtros
-- =============================================

-- ===== TABLA 1: company_knowledge =====
-- Almacena todo el conocimiento sobre la empresa, políticas, estructura y FAQs
CREATE TABLE IF NOT EXISTS public.company_knowledge (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL CHECK (
    category IN (
      'quienes_somos',
      'principios',
      'contacto',
      'faq',
      'estructura_web',
      'politicas'
    )
  ),
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_company_knowledge_category 
  ON public.company_knowledge(category);

CREATE INDEX IF NOT EXISTS idx_company_knowledge_updated 
  ON public.company_knowledge(updated_at DESC);

-- Comentarios
COMMENT ON TABLE public.company_knowledge IS 
  'Conocimiento corporativo de Fruvi para el Dr. Prima AI: historia, valores, políticas, contacto';

COMMENT ON COLUMN public.company_knowledge.category IS 
  'Categoría del conocimiento: quienes_somos, principios, contacto, faq, estructura_web, politicas';

COMMENT ON COLUMN public.company_knowledge.content IS 
  'Contenido en texto plano o markdown que el AI debe conocer y usar en respuestas';

-- ===== TABLA 2: ai_knowledge_base =====
-- Base de conocimiento estructurado para respuestas del AI
CREATE TABLE IF NOT EXISTS public.ai_knowledge_base (
  id BIGSERIAL PRIMARY KEY,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda eficiente
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_topic 
  ON public.ai_knowledge_base(topic);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_priority 
  ON public.ai_knowledge_base(priority DESC);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_tags 
  ON public.ai_knowledge_base USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_ai_knowledge_active 
  ON public.ai_knowledge_base(is_active) 
  WHERE is_active = TRUE;

-- Comentarios
COMMENT ON TABLE public.ai_knowledge_base IS 
  'Base de conocimiento temático premium para respuestas de Dr. Prima AI';

COMMENT ON COLUMN public.ai_knowledge_base.topic IS 
  'Tema o título del conocimiento (ej: "Beneficios del aguacate Hass", "Cómo elegir mangos maduros")';

COMMENT ON COLUMN public.ai_knowledge_base.content IS 
  'Contenido detallado que el AI debe usar en respuestas (tono premium, datos reales)';

COMMENT ON COLUMN public.ai_knowledge_base.priority IS 
  'Prioridad del conocimiento (1-10): 10 = crítico, debe mencionarse siempre; 1 = complementario';

COMMENT ON COLUMN public.ai_knowledge_base.tags IS 
  'Etiquetas para búsqueda semántica (ej: ["aguacate", "nutrición", "premium", "colombia"])';

-- ===== TABLA 3: ai_forbidden_responses =====
-- Filtro de respuestas prohibidas o patrones a evitar
CREATE TABLE IF NOT EXISTS public.ai_forbidden_responses (
  id BIGSERIAL PRIMARY KEY,
  forbidden_phrase TEXT NOT NULL,
  reason TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (
    severity IN ('low', 'medium', 'high')
  ),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_forbidden_responses_severity 
  ON public.ai_forbidden_responses(severity);

CREATE INDEX IF NOT EXISTS idx_forbidden_responses_active 
  ON public.ai_forbidden_responses(is_active) 
  WHERE is_active = TRUE;

-- Comentarios
COMMENT ON TABLE public.ai_forbidden_responses IS 
  'Frases prohibidas y patrones que el Dr. Prima AI NO debe usar nunca';

COMMENT ON COLUMN public.ai_forbidden_responses.forbidden_phrase IS 
  'Frase o patrón prohibido (ej: "Lo siento, no puedo ayudarte", "No tengo esa información")';

COMMENT ON COLUMN public.ai_forbidden_responses.reason IS 
  'Razón por la que está prohibida (ej: "Degrada la imagen premium", "Rompe el rol de experto")';

COMMENT ON COLUMN public.ai_forbidden_responses.severity IS 
  'Severidad: low = evitar si es posible, medium = evitar siempre, high = crítico, bloquear respuesta';

-- ===== ROW LEVEL SECURITY (RLS) =====
ALTER TABLE public.company_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_forbidden_responses ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos los usuarios autenticados pueden leer
DROP POLICY IF EXISTS "allow_authenticated_read_company_knowledge" ON public.company_knowledge;
CREATE POLICY "allow_authenticated_read_company_knowledge" 
  ON public.company_knowledge
  FOR SELECT 
  USING (true); -- Público para que el AI pueda acceder sin autenticación

DROP POLICY IF EXISTS "allow_authenticated_read_ai_knowledge" ON public.ai_knowledge_base;
CREATE POLICY "allow_authenticated_read_ai_knowledge" 
  ON public.ai_knowledge_base
  FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "allow_authenticated_read_forbidden" ON public.ai_forbidden_responses;
CREATE POLICY "allow_authenticated_read_forbidden" 
  ON public.ai_forbidden_responses
  FOR SELECT 
  USING (is_active = true);

-- Políticas de escritura: Solo service_role (para admins desde backend)
DROP POLICY IF EXISTS "service_role_manage_company_knowledge" ON public.company_knowledge;
CREATE POLICY "service_role_manage_company_knowledge" 
  ON public.company_knowledge
  FOR ALL 
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_manage_ai_knowledge" ON public.ai_knowledge_base;
CREATE POLICY "service_role_manage_ai_knowledge" 
  ON public.ai_knowledge_base
  FOR ALL 
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_manage_forbidden" ON public.ai_forbidden_responses;
CREATE POLICY "service_role_manage_forbidden" 
  ON public.ai_forbidden_responses
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- ===== FUNCIÓN DE ACTUALIZACIÓN AUTOMÁTICA DE TIMESTAMP =====
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_company_knowledge_modtime ON public.company_knowledge;
CREATE TRIGGER update_company_knowledge_modtime
  BEFORE UPDATE ON public.company_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_ai_knowledge_modtime ON public.ai_knowledge_base;
CREATE TRIGGER update_ai_knowledge_modtime
  BEFORE UPDATE ON public.ai_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

DROP TRIGGER IF EXISTS update_forbidden_modtime ON public.ai_forbidden_responses;
CREATE TRIGGER update_forbidden_modtime
  BEFORE UPDATE ON public.ai_forbidden_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

-- =============================================
-- ✅ TABLAS CREADAS EXITOSAMENTE
-- =============================================
-- 
-- PRÓXIMOS PASOS:
-- 1. Ejecutar este SQL en Supabase SQL Editor
-- 2. Insertar datos iniciales usando seed-ai-knowledge.json
-- 3. Actualizar Edge Function para consultar estas tablas
-- 4. Integrar en el sistema prompt del Dr. Prima AI
-- =============================================
