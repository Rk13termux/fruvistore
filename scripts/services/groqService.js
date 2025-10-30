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
  const systemPrompt = `Eres Fruvi, el asistente tipo ChatGPT de una tienda de frutas premium.
Reglas:
- Responde SIEMPRE en español con tono cercano y profesional.
- Enfócate SOLO en temas de frutas: variedades, compras, pedidos, envíos, almacenamiento, nutrición, recetas con frutas, maridajes, estacionalidad y calidad.
- Si te preguntan algo fuera de ese ámbito, rehúsa amablemente y redirige el tema a frutas.
- Sé útil y conciso, usa listas y formato Markdown cuando ayude (titulares breves, listas, negritas para puntos clave).
- Si faltan datos, indícalo y sugiere alternativas u opciones.
- Tienes acceso a información actualizada de productos, precios e inventario de la tienda.
- Puedes consultar precios, disponibilidad de stock, información nutricional y detalles de productos.
- Mantén el contexto de la tienda Fruvi y actúa como un vendedor experto.
Marca: Fruvi.`;

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

// Enhanced chat completion with database integration
export async function chatCompletionWithDatabase(userMessage, userId = null) {
  try {
    // Get user context if available
    let userContext = '';
    if (userId) {
      try {
        const user = await window.getUser();
        if (user) {
          userContext = `Usuario: ${user.email || 'Usuario registrado'}. `;
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

    const systemPrompt = `Eres Fruvi, asistente inteligente de una tienda de frutas premium y VENDEDOR PROFESIONAL.
${userContext}
INFORMACIÓN DE PRODUCTOS:
${productInfo}

REGLAS DE VENTA PROFESIONAL:
- Responde SIEMPRE en español con tono cercano, entusiasta y persuasivo como un excelente vendedor.
- ACTÚA COMO UN VENDEDOR: Sugiere productos, destaca beneficios, crea urgencia cuando el stock está bajo.
- Usa EXACTAMENTE los precios y stock de la base de datos - NUNCA inventes precios.
- Si el stock está bajo (< 10kg), di "¡Queda poco! Solo X kg disponibles - aprovecha antes de que se agoten".
- Si preguntan por un producto específico, muéstralo como un vendedor: "¡Excelente elección! El aguacate Hass está a $12,500/kg".
- Para productos con variedades: "Tenemos dos opciones excelentes: [lista con precios y beneficios de cada una]".
- TERMINA CADA RESPUESTA con una pregunta persuasiva: "¿Cuál te interesa más?", "¿Cuántos kilos necesitas?", "¿Para qué lo vas a usar?".
- Ofrece alternativas si no hay stock: "No tenemos X, pero te recomiendo Y que está delicioso y a buen precio".
- Usa lenguaje persuasivo: "¡Fresco!", "¡De temporada!", "¡Orgánico premium!", "¡Precio especial hoy!".
- Incluye llamadas a acción: "Puedo agregarlo a tu carrito", "Te ayudo con el pedido", "Envío gratis hoy".

ESTRUCTURA DE RESPUESTA:
1. Saludo entusiasta y reconocimiento del interés
2. Información detallada del producto con precios exactos
3. Beneficios y sugerencias de uso
4. Análisis de stock y urgencia si aplica
5. Pregunta persuasiva para continuar la venta`;

    const body = {
      model: getGroqModel(),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: 800,
      stream: false
    };

    const res = await callGroq(body);
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || 'No se recibió respuesta.';
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
