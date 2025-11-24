// Groq AI Service - Provides functions to query Groq for structured data
// Note: This file is loaded as a module from index.html

const DEFAULT_GROQ_API_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b';

// Environment variables for GitHub Pages
const GROQ_API_KEY = import.meta.env?.VITE_GROQ_API_KEY || window.__ENV__?.VITE_GROQ_API_KEY || 'placeholder-key-for-github-pages';

function getGroqBase() {
  return localStorage.getItem('fruvi_groq_base') || DEFAULT_GROQ_API_BASE;
}

// Multi-turn chat completion with history and stricter domain guard
export async function chatCompletionWithHistory(messages, {
  temperature = 0.3,
  max_tokens = 800
} = {}) {
  // messages: array of { role: 'user'|'assistant', content: string }
  const systemPrompt = `Eres el Dr. Lara, un asistente experto en nutrición y salud. Responde SIEMPRE en español, con tono profesional y masculino. Enfócate SOLO en temas de frutas, nutrición, recetas, salud y bienestar. Si te preguntan algo fuera de ese ámbito, rehúsa amablemente y redirige el tema a salud y frutas. Marca: Fruvi.
Evita usar tablas Markdown (líneas con '|' y filas separadoras como '---'). En lugar de tablas, presenta datos en listas o tarjetas claras y profesionales. Usa emojis solo cuando sean útiles y moderados.`;

  const body = {
    model: getGroqModel(),
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature,
    max_tokens,
    stream: false
  };

  const res = await callGroq(body);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || 'No se recibió respuesta.';
}
function getGroqKey() {
  return localStorage.getItem('fruvi_groq_key') || GROQ_API_KEY;
}
function getGroqModel() {
  return localStorage.getItem('fruvi_groq_model') || DEFAULT_GROQ_MODEL;
}
export function setGroqConfig({ apiKey, base } = {}) {
  if (apiKey) localStorage.setItem('fruvi_groq_key', apiKey.trim());
  if (base) localStorage.setItem('fruvi_groq_base', base.trim());
}
// Exponer utilidad en window para configurar rápido desde consola
try { window.fruviGroqSetKey = (k) => setGroqConfig({ apiKey: k }); } catch(_) {}

async function callGroq(body) {
  // Primary attempt
  let res = await fetch(getGroqBase(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getGroqKey()}`
    },
    body: JSON.stringify(body)
  });
  if (res.ok) return res;
  // If model is decommissioned, force fallback model and persist
  const text = await res.text();
  try {
    const err = JSON.parse(text)?.error;
    if (res.status === 400 && err?.code === 'model_decommissioned') {
      body.model = DEFAULT_GROQ_MODEL;
      localStorage.setItem('fruvi_groq_model', DEFAULT_GROQ_MODEL);
      res = await fetch(getGroqBase(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getGroqKey()}` },
        body: JSON.stringify(body)
      });
      if (res.ok) return res;
      const text2 = await res.text();
      throw new Error(`Groq API error ${res.status}: ${text2}`);
    }
    throw new Error(`Groq API error ${res.status}: ${text}`);
  } catch (_) {
    // If not JSON error body
    throw new Error(`Groq API error ${res.status}: ${text}`);
  }
}

// Ask Groq to produce normalized nutrition JSON for any fruit (per 100g)
export async function getFruitNutritionJSON(fruitName) {
  const systemPrompt = `Eres un experto en nutrición especializado en frutas. Devuelves SIEMPRE un JSON VÁLIDO (y solo JSON) con la siguiente forma por cada fruta solicitada:
{
  "fruit": "nombre común",
  "serving": "100 g",
  "macros": { "calories": number, "protein_g": number, "carbs_g": number, "fiber_g": number, "sugars_g": number, "fat_g": number },
  "vitamins": { "vitamin_c_mg": number, "vitamin_a_iu": number, "vitamin_e_mg": number, "vitamin_k_mcg": number, "folate_mcg": number },
  "minerals": { "potassium_mg": number, "magnesium_mg": number, "calcium_mg": number, "iron_mg": number },
  "notes": ["breves notas útiles"]
}
Las cantidades son aproximadas y por cada 100 g. Si no hay datos, usa null. Nunca devuelvas texto fuera del JSON.`;

  const userPrompt = `Fruta a analizar: ${fruitName}. Formatea la salida en el JSON requerido.`;

  const body = {
    model: getGroqModel(),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2,
    max_tokens: 700,
    stream: false
  };

  const res = await callGroq(body);

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || '';

  // Ensure valid JSON
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    // Try to extract JSON between braces if model adds text
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw new Error('Respuesta de Groq no es JSON válido.');
    }
  }
  return parsed;
}

// Enhanced chat completion with database integration and AI Doctor personality
export async function chatCompletionWithDatabase(userMessage, userId = null, userName = '') {
  try {
    // Check premium access first
    let isPremium = false;
    let subscriptionInfo = null;
    if (userId) {
      try {
        const { checkPremiumAccess } = await import('./subscriptionService.js');
        const access = await checkPremiumAccess(userId);
        isPremium = access.hasAccess;
        subscriptionInfo = access;
      } catch (e) {
        console.log('No se pudo verificar acceso premium:', e.message);
      }
    }

    // Get doctor personality from database
    let doctorPersonality = {};
    try {
      const { supabaseClient } = await import('./supabaseService.js');
      if (supabaseClient) {
        const { data } = await supabaseClient
          .from('ai_doctor_personality')
          .select('*')
          .eq('is_active', true)
          .single();
        if (data) doctorPersonality = data;
      }
    } catch (e) {
      console.log('No se pudo obtener personalidad del doctor:', e.message);
    }

    // Get user nutrition profile if premium
    let userProfile = null;
    if (isPremium && userId) {
      try {
        const { supabaseClient } = await import('./supabaseService.js');
        const { data } = await supabaseClient
          .from('user_nutrition_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        if (data) userProfile = data;
      } catch (e) {
        console.log('No se pudo obtener perfil nutricional:', e.message);
      }
    }

    // Get conversation history for context (last 10 messages)
    let conversationHistory = [];
    if (userId) {
      try {
        const { supabaseClient } = await import('./supabaseService.js');
        const { data } = await supabaseClient
          .from('ai_doctor_conversations')
          .select('message_type, message_content, message_metadata, timestamp')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false })
          .limit(20); // Get more to filter

        if (data) {
          // Convert to chronological order and format
          conversationHistory = data
            .reverse()
            .slice(-10) // Keep last 10 messages
            .map(msg => ({
              role: msg.message_type,
              content: msg.message_content,
              metadata: msg.message_metadata
            }));
        }
      } catch (e) {
        console.log('No se pudo obtener historial de conversación:', e.message);
      }
    }

    // Get medical knowledge base for specific conditions mentioned
    let medicalKnowledge = '';
    if (isPremium && userMessage) {
      try {
        // Extract potential health conditions from user message
        const healthKeywords = ['diabetes', 'hipertension', 'colesterol', 'digest', 'estrenimiento', 'inmun', 'depresion', 'ansiedad', 'cancer', 'corazon', 'higado', 'rinon', 'tiroides', 'anemia', 'obesidad', 'delgadez', 'vitamina', 'mineral', 'alergia', 'intolerancia'];

        const mentionedConditions = healthKeywords.filter(condition =>
          userMessage.toLowerCase().includes(condition)
        );

        if (mentionedConditions.length > 0) {
          try {
            const { supabaseClient } = await import('./supabaseService.js');
            // Get relevant medical knowledge
            const { data: knowledgeData } = await supabaseClient
              .from('ai_medical_knowledge')
              .select('title, content, scientific_sources')
              .or(mentionedConditions.map(cond => `content.ilike.%${cond}%`).join(','))
              .limit(3);

            if (knowledgeData && knowledgeData.length > 0) {
              medicalKnowledge = '\n\nCONOCIMIENTO MÉDICO RELEVANTE:\n' +
                knowledgeData.map(k => `- ${k.title}: ${k.content.substring(0, 300)}...`).join('\n');
            }

            // Get fruit medical applications for mentioned conditions
            const { data: fruitApps } = await supabaseClient
              .from('fruit_medical_applications')
              .select('fruit_name, health_condition, medical_evidence, recommended_dosage, effectiveness_rating')
              .or(mentionedConditions.map(cond => `health_condition.ilike.%${cond}%`).join(','))
              .order('effectiveness_rating', { ascending: false })
              .limit(5);

            if (fruitApps && fruitApps.length > 0) {
              medicalKnowledge += '\n\nAPLICACIONES MÉDICAS DE FRUTAS:\n' +
                fruitApps.map(app =>
                  `- ${app.fruit_name} para ${app.health_condition}: ${app.medical_evidence.substring(0, 200)}... (Dosis: ${app.recommended_dosage})`
                ).join('\n');
            }
          } catch (dbError) {
            console.log('No se pudo obtener conocimiento médico de BD:', dbError.message);
          }
        }
      } catch (e) {
        console.log('No se pudo obtener conocimiento médico:', e.message);
      }
    }

    // Get personalized fruit recommendations for this user
    let personalizedRecommendations = '';
    if (isPremium && userId) {
      try {
        const { supabaseClient } = await import('./supabaseService.js');
        const { data: recommendations } = await supabaseClient
          .from('personalized_fruit_recommendations')
          .select('fruit_name, health_reason, recommended_frequency, serving_size, expected_benefits')
          .eq('user_id', userId)
          .eq('is_active', true)
          .order('priority_level', { ascending: false })
          .limit(5);

        if (recommendations && recommendations.length > 0) {
          personalizedRecommendations = '\n\nRECOMENDACIONES PERSONALES PARA ESTE PACIENTE:\n' +
            recommendations.map(rec =>
              `- ${rec.fruit_name}: ${rec.health_reason} (${rec.recommended_frequency}, ${rec.serving_size}). Beneficios: ${rec.expected_benefits.join(', ')}`
            ).join('\n');
        }
      } catch (e) {
        console.log('No se pudieron obtener recomendaciones personalizadas:', e.message);
      }
    }

    // Get user context if available
    let userContext = '';
    if (userId) {
      try {
        const user = await window.getUser();
        if (user) {
          userContext = `Usuario: ${user.email || 'Usuario registrado'}. `;
          if (userProfile) {
            userContext += `Perfil: ${userProfile.age ? userProfile.age + ' años' : ''}, ${userProfile.gender || ''}, ${userProfile.height_cm ? userProfile.height_cm + 'cm' : ''}, ${userProfile.weight_kg ? userProfile.weight_kg + 'kg' : ''}. `;
            if (userProfile.health_goals?.length > 0) {
              userContext += `Objetivos: ${userProfile.health_goals.join(', ')}. `;
            }
            if (userProfile.medical_conditions?.length > 0) {
              userContext += `Condiciones médicas: ${userProfile.medical_conditions.join(', ')}. `;
            }
          }
        }
      } catch (e) {
        console.log('No se pudo obtener contexto de usuario:', e.message);
      }
    }

    // Get product information from database
    let productInfo = '';
    try {
      const products = await window.getStoreProducts();
      if (products && products.length > 0) {
        // Group products by name to show varieties
        const productGroups = {};
        products.forEach(p => {
          const key = p.name.toLowerCase().replace(/\s+/g, '');
          if (!productGroups[key]) {
            productGroups[key] = [];
          }
          productGroups[key].push(p);
        });

        productInfo = `Información detallada de productos disponibles:\n`;
        Object.values(productGroups).forEach(group => {
          if (group.length === 1) {
            const p = group[0];
            productInfo += `- ${p.name}: $${p.priceKg?.toLocaleString('es-CO')} por kg, Stock: ${p.stock || 'Disponible'}, Categoría: ${p.category}, ${p.organic ? 'Orgánico' : 'Convencional'}\n`;
          } else {
            // Multiple varieties of same fruit
            productInfo += `- ${group[0].name} (variedades disponibles):\n`;
            group.forEach(p => {
              productInfo += `  • Variedad: ${p.category}, Precio: $${p.priceKg?.toLocaleString('es-CO')} por kg, Stock: ${p.stock || 'Disponible'}, ${p.organic ? 'Orgánico' : 'Convencional'}\n`;
            });
          }
        });
      }
    } catch (e) {
      console.log('No se pudo obtener información de productos:', e.message);
    }

    // Build system prompt based on premium status
    let systemPrompt;
    if (isPremium) {
      systemPrompt = `Eres el Dr. ${doctorPersonality.doctor_name || 'Alejandro Rivera'}, un médico nutricionista especializado en frutas y alimentación funcional. 🍎⚕️

📋 TU PERFIL PROFESIONAL:
- ${doctorPersonality.credentials || 'Médico graduado de Harvard con 15 años de experiencia'}
- Especialidad: ${doctorPersonality.specialty || 'Nutrición y Alimentación Funcional'}
- Enfoque: ${doctorPersonality.approach || 'Holístico y preventivo'}
- Filosofía: ${doctorPersonality.philosophy || 'Las frutas son medicina natural'}

${medicalKnowledge}
${personalizedRecommendations}

🎯 ESTILO DE COMUNICACIÓN PROFESIONAL:
${doctorPersonality.communication_style || 'Profesional pero cercano, empático y motivador'}

🩺 FUNCIONES MÉDICAS PREMIUM:
- Análisis nutricional personalizado basado en perfil del paciente
- Recomendaciones médicas fundamentadas científicamente
- Planes de alimentación individualizados
- Seguimiento de progreso y ajustes terapéuticos
- Consejos preventivos y de bienestar integral

${userContext}

📊 INFORMACIÓN DE PRODUCTOS PARA RECOMENDACIONES:
${productInfo}

🔬 PROTOCOLO MÉDICO DE CONSULTA:
1. 📋 EVALUACIÓN INICIAL: Preguntar por síntomas, historial y objetivos
2. 🔍 ANÁLISIS PROFESIONAL: Basado en evidencia científica y perfil del paciente
3. 💊 RECOMENDACIONES TERAPÉUTICAS: Planes de alimentación con frutas específicas
4. 🛒 INTEGRACIÓN COMERCIAL: Sugerir productos de Fruvi cuando sea relevante
5. 📈 SEGUIMIENTO: Monitorear progreso y ajustar recomendaciones

⚕️ ESTÁNDARES DE CUIDADO MÉDICO:
- Siempre recordar información personal del paciente entre consultas
- Adaptar recomendaciones según condiciones médicas y restricciones
- Priorizar seguridad alimentaria y posibles interacciones
- Mantener confidencialidad médica absoluta
- Usar terminología médica precisa pero accesible

🧠 CONOCIMIENTO MÉDICO INTEGRADO:
- Utiliza la base de conocimiento médico para recomendaciones fundamentadas
- Recomienda frutas específicas para condiciones de salud mencionadas
- Considera interacciones medicamentosas y contraindicaciones
- Adapta sugerencias según el perfil personalizado del paciente

🎨 TONO PROFESIONAL ADAPTABLE:
- Para consultas médicas: Formal, preciso, empático
- Para recomendaciones nutricionales: Educativo y motivador
- Para sugerencias de compra: Profesional pero persuasivo
- Siempre mantener el rol de médico especialista
- Usa emojis moderadamente para hacer las respuestas más atractivas y profesionales (ej. 🍎🥑✨💚)
- Evita líneas separadoras como --- o reglas horizontales
- Utiliza listas profesionales y estructuradas en lugar de líneas mal formadas
- Mantén un tono profesional y cercano en todas las respuestas`;
  // Ask model to reply in Markdown format with product lists when applicable
  systemPrompt += `\n\nRESPUESTA (formato):
Responde PRIMERO en español y en formato **Markdown**. Cuando recomiendes productos, usa listas con nombre, precio y stock, por ejemplo:
\n- Manzana (Huerto) — $7,500/kg — Stock: 12 — Orgánico\n\n
Evita tablas Markdown con '|' (pipes) o filas separadoras. Presenta la información en listas o tarjetas para mejor conversión a HTML. Evita HTML en la respuesta. Nosotros convertiremos Markdown a una presentación HTML bonita en la UI.`;
    } else {
      // Free tier - basic assistant with upsell prompts
      systemPrompt = `Eres Fruvi, el asistente especializado en frutas premium. 🍎✨

${userContext}
INFORMACIÓN DE PRODUCTOS:
${productInfo}

🎯 FUNCIONES BÁSICAS:
- Información general sobre frutas y nutrición
- Recomendaciones básicas de consumo
- Información de productos y precios
- Soporte para compras

💡 LIMITACIONES DEL PLAN GRATUITO:
- Consultas limitadas por día
- Sin análisis médico personalizado
- Sin planes de alimentación individualizados
- Sin seguimiento médico profesional

🆙 PROMOCIÓN DE PREMIUM:
Cuando el usuario necesite análisis detallados, planes personalizados o consultas médicas, sugiere amablemente actualizar a Premium para acceder al Dr. Nutricionista especialista.

🎨 ESTILO DE COMUNICACIÓN:
- Amigable y servicial
- Informativo pero no médico
- Siempre promover el upgrade cuando sea apropiado
- Mantener el enfoque en frutas y productos
- Usa emojis moderadamente para hacer las respuestas más atractivas (ej. 🍎🥑✨)
- Evita líneas separadoras como --- o reglas horizontales
- Utiliza listas profesionales y estructuradas
- Mantén un tono profesional y cercano`;
  // Ask model to reply as Markdown for better UI rendering
  systemPrompt += `\n\nRESPUESTA (formato): Responde en **Markdown** con listas y encabezados cuando sea relevante. Evita usar tablas Markdown con '|' (pipes) o filas separadoras. Presenta la información en listas o tarjetas para mejor conversión a HTML. Evita incluir raw HTML.`;
    }

    // Build messages array with conversation history
    const messages = [{ role: 'system', content: systemPrompt }];

    // Add conversation history for context (but not too much to avoid token limits)
    if (conversationHistory.length > 0) {
      // Clean conversation history to only include role and content (remove metadata)
      const cleanHistory = conversationHistory.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      messages.push(...cleanHistory);
    }

    // Add current user message (remove metadata to avoid Groq API error)
    messages.push({ role: 'user', content: userMessage });

    const body = {
      model: getGroqModel(),
      messages: messages,
      temperature: isPremium ? 0.2 : 0.3, // More precise for premium
      max_tokens: isPremium ? 1000 : 800, // More tokens for premium
      stream: false
    };

    const res = await callGroq(body);
    const data = await res.json();
    const response = data?.choices?.[0]?.message?.content || 'No se recibió respuesta.';

    // Save conversation to database if user is logged in
    if (userId) {
      try {
        const { supabaseClient } = await import('./supabaseService.js');
        // Detect fruits mentioned in the conversation
        const fruitKeywords = ['manzana', 'pera', 'plátano', 'naranja', 'uva', 'fresa', 'kiwi', 'mango', 'piña', 'sandía', 'melón', 'cereza', 'durazno', 'nectarina', 'ciruela', 'granada', 'higo', 'aguacate', 'papaya', 'limón', 'mandarina', 'arándano', 'frambuesa', 'mora', 'guanábana', 'maracuyá', 'lulo', 'feijoa', 'carambolo', 'pitahaya', 'lichi', 'longan', 'rambután', 'jaca', 'nance', 'zapote', 'mamey', 'anona', 'chirimoya', 'guayaba', 'tomate de árbol', 'coco', 'dátil', 'higo', 'tuna', 'nopal', 'aloe vera'];

        const mentionedFruits = fruitKeywords.filter(fruit =>
          userMessage.toLowerCase().includes(fruit) ||
          response.toLowerCase().includes(fruit)
        );

        // Save user message
        await supabaseClient
          .from('ai_doctor_conversations')
          .insert({
            user_id: userId,
            session_id: `session_${userId}_${Date.now()}`,
            message_type: 'user',
            message_content: userMessage,
            message_metadata: { fruits_mentioned: mentionedFruits, is_premium: isPremium },
            is_premium: isPremium
          });

        // Save assistant response
        await supabaseClient
          .from('ai_doctor_conversations')
          .insert({
            user_id: userId,
            session_id: `session_${userId}_${Date.now()}`,
            message_type: 'assistant',
            message_content: response,
            message_metadata: { fruits_mentioned: mentionedFruits, is_premium: isPremium },
            is_premium: isPremium
          });

        // Track usage
        const { trackAIUsage } = await import('./subscriptionService.js');
        await trackAIUsage(userId, 'chat_assistant', Math.ceil(response.length / 4)); // Rough token estimate

        // Analyze conversation for insights and update personalization
        if (isPremium) {
          try {
            const { analyzeUserPatterns, updateProfileFromInsights } = await import('./personalizationService.js');
            await analyzeUserPatterns(userId);
            await updateProfileFromInsights(userId);
          } catch (e) {
            console.log('No se pudieron actualizar insights de usuario:', e.message);
          }
        }

      } catch (e) {
        console.log('No se pudo guardar conversación:', e.message);
      }
    }

    return response;
  } catch (error) {
    console.error('Error en chatCompletionWithDatabase:', error);
    // Fallback to basic completion
    return chatCompletion(userMessage);
  }
}

// General chat completion for assistant (legacy)
export async function chatCompletion(userMessage) {
  const systemPrompt = `Eres Fruvi, asistente de una tienda de frutas. Responde en español de forma clara, breve, útil y amigable. Puedes ayudar con precios, compras, envíos, nutrición, recetas y calidad. Si no tienes datos exactos, indícalo y ofrece una alternativa. Mantén el enfoque en frutas y temas relacionados.`;

  const body = {
    model: getGroqModel(),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.3,
    max_tokens: 600,
    stream: false
  };

  const res = await fetch(getGroqBase(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getGroqKey()}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || 'No se recibió respuesta.';
}
