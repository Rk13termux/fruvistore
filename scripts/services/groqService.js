// Groq AI Service - Provides functions to query Groq for structured data
// Note: This file is loaded as a module from index.html

const DEFAULT_GROQ_API_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b';

// Environment variables for GitHub Pages
const GROQ_API_KEY = import.meta.env?.VITE_GROQ_API_KEY || window.__ENV__?.VITE_GROQ_API_KEY || 'placeholder-key-for-github-pages';

function getGroqBase() {
  return localStorage.getItem('fruvi_groq_base') || DEFAULT_GROQ_API_BASE;
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

// General chat completion for assistant
export async function chatCompletion(userMessage) {
  const systemPrompt = `Eres FreshBot, asistente de una tienda de frutas FreshFruits. Responde en español de forma clara, breve, útil y amigable. Puedes ayudar con precios, compras, envíos, nutrición y calidad. Si no tienes datos exactos, indícalo y ofrece una alternativa.`;

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
