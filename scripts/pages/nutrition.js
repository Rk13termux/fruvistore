// Combined Nutrition Page: AI analysis + professional data table
import { getFruitNutritionJSON } from '../services/groqService.js';

// Expanded database for 20 common fruits
const fruitData = [
  { name: 'Fresa', calories: 32, carbs: 7.7, fiber: 2, sugar: 4.9, protein: 0.7, benefits: 'Salud del corazón, control de azúcar.' },
  { name: 'Kiwi', calories: 61, carbs: 14.7, fiber: 3, sugar: 9, protein: 1.1, benefits: 'Potencia sistema inmune, mejora digestión.' },
  { name: 'Naranja', calories: 47, carbs: 11.8, fiber: 2.4, sugar: 9.4, protein: 0.9, benefits: 'Poderoso antioxidante, protege la piel.' },
  { name: 'Mango', calories: 60, carbs: 15, fiber: 1.6, sugar: 13.7, protein: 0.8, benefits: 'Beneficia salud ocular, fortalece defensas.' },
  { name: 'Arándano', calories: 57, carbs: 14.5, fiber: 2.4, sugar: 10, protein: 0.7, benefits: 'Mejora memoria y función cerebral.' },
  { name: 'Manzana', calories: 52, carbs: 13.8, fiber: 2.4, sugar: 10.4, protein: 0.3, benefits: 'Ayuda a la digestión y al colesterol.' },
  { name: 'Plátano', calories: 89, carbs: 22.8, fiber: 2.6, sugar: 12.2, protein: 1.1, benefits: 'Fuente de energía, salud muscular.' },
  { name: 'Uva', calories: 69, carbs: 18.1, fiber: 0.9, sugar: 15.5, protein: 0.7, benefits: 'Protege el corazón y el cerebro.' },
  { name: 'Piña', calories: 50, carbs: 13.1, fiber: 1.4, sugar: 9.9, protein: 0.5, benefits: 'Ayuda a la digestión, antiinflamatoria.' },
  { name: 'Cereza', calories: 50, carbs: 12, fiber: 1.6, sugar: 8, protein: 1, benefits: 'Antiinflamatoria, puede ayudar a dormir.' },
  { name: 'Sandía', calories: 30, carbs: 7.6, fiber: 0.4, sugar: 6.2, protein: 0.6, benefits: 'Excelente para hidratación, rica en licopeno.' },
  { name: 'Pera', calories: 57, carbs: 15.2, fiber: 3.1, sugar: 9.8, protein: 0.4, benefits: 'Alta en fibra, promueve salud digestiva.' },
  { name: 'Limón', calories: 29, carbs: 9.3, fiber: 2.8, sugar: 2.5, protein: 1.1, benefits: 'Alcalinizante y detoxificante.' },
  { name: 'Melocotón', calories: 39, carbs: 9.5, fiber: 1.5, sugar: 8.4, protein: 0.9, benefits: 'Bueno para la piel y la vista.' },
  { name: 'Frambuesa', calories: 52, carbs: 11.9, fiber: 6.5, sugar: 4.4, protein: 1.2, benefits: 'Muy alta en fibra, baja en azúcar.' },
  { name: 'Aguacate', calories: 160, carbs: 8.5, fiber: 6.7, sugar: 0.7, protein: 2, benefits: 'Grasas saludables para corazón y cerebro.' },
  { name: 'Papaya', calories: 43, carbs: 10.8, fiber: 1.7, sugar: 7.8, protein: 0.5, benefits: 'Mejora la digestión de proteínas.' },
  { name: 'Granada', calories: 83, carbs: 18.7, fiber: 4, sugar: 13.7, protein: 1.7, benefits: 'Potentes antioxidantes (punicalaginas).' },
  { name: 'Higo', calories: 74, carbs: 19.2, fiber: 2.9, sugar: 16.3, protein: 0.8, benefits: 'Fuente de minerales, regula presión arterial.' },
  { name: 'Melón', calories: 34, carbs: 8.2, fiber: 0.9, sugar: 7.9, protein: 0.8, benefits: 'Excepcional fuente de Vitamina A y C.' }
];

// Full list of fruits for AI analysis, ensuring no duplicates and sorted alphabetically
const allFruitNames = [...new Set([...fruitData.map(f => f.name), ...['Albaricoque','Ciruela','Mora','Grosella','Guayaba','Maracuyá','Pitahaya','Lichi','Dátil','Caqui','Nectarina','Tamarindo','Carambola','Kumquat','Nance','Zapote','Tuna (cacto)','Guanábana','Mamey','Chirimoya','Mangostán','Rambután','Longán','Acerola','Physalis (Uchuva)','Membrillo','Pomelo rosado','Naranjilla','Feijoa','Camu camu','Jabuticaba','Atemoya','Yaca (Jackfruit)','Durión','Caimito','Lucuma','Pequi','Sapodilla (Níspero)','Cajú (Anacardo fruta)','Açaí','Maqui','Mora azul (Blueberry)','Arándano rojo','Boysenberry','Loganberry','Grosella negra','Grosella espinosa','Mora blanca','Uva verde','Uva negra','Uva moscatel','Banano rojo','Banano macho','Plátano dominico','Plátano manzano','Pitanga','Níspero japonés (Loquat)','Tamarillo','Uva Isabella','Uva Concord','Clementina','Satsuma','Mandarina Honey','Naranja Valencia','Naranja Sanguina','Manzana Fuji','Manzana Gala','Manzana Granny Smith','Manzana Pink Lady','Pera Anjou','Pera Bosc','Pera Williams','Melocotón blanco','Melocotón paraguayo','Ciruela roja','Ciruela amarilla','Ciruela negra','Cereza Bing','Cereza Rainier','Fresa silvestre','Frambuesa negra','Mora Boysen','Arándano silvestre','Grosella blanca','Papaya hawaiana','Papaya maradol','Mango ataulfo','Mango kent','Mango tommy','Kiwi dorado','Kiwi verde','Piña golden','Piña cayena','Pitahaya amarilla','Pitahaya roja','Guayaba fresa','Guayaba pera','Maracuyá morada','Maracuyá amarilla','Melón cantalupo','Melón honeydew','Pepino dulce','Melón galia','Sandía crimson','Sandía sin semillas']])].sort();

export function renderNutritionPage(root) {
  root.innerHTML = `
  <section class="ai-nutrition container">
    <div class="ai-nutrition__header">
      <h2>Analizador Nutricional con IA</h2>
      <p>Consulta datos de cualquier fruta para obtener un análisis detallado.</p>
    </div>

    <form id="nutritionSearch" class="ai-nutrition__search">
      <input type="text" id="fruitQuery" placeholder="Ej: Manzana, Pera, Fresa..." required />
      <button type="submit" class="cta-button">Analizar</button>
    </form>

    <div id="nutritionResults" class="ai-nutrition__results" style="display:none;">
      <div class="ai-nutrition__summary glass">
        <h3 id="fruitTitle">Fruta</h3>
        <p id="servingSize">Tamaño de porción</p>
        <ul id="notesList" class="ai-nutrition__notes"></ul>
      </div>

      <div class="ai-nutrition__charts">
        <div class="chart-card glass">
          <h4>Macronutrientes</h4>
          <canvas id="macrosChart" height="200"></canvas>
        </div>
        <div class="chart-card glass">
          <h4>Vitaminas</h4>
          <canvas id="vitaminsChart" height="200"></canvas>
        </div>
        <div class="chart-card glass">
          <h4>Minerales</h4>
          <canvas id="mineralsChart" height="200"></canvas>
        </div>
      </div>
    </div>

    <div id="nutritionLoading" class="ai-nutrition__loading" style="display:none;">
      <span class="loading"></span>
      <p>Consultando a nuestro experto AI...</p>
    </div>

    <div id="nutritionError" class="ai-nutrition__error" style="display:none;"></div>
  </section>

  <section class="nutrition container" style="padding-top: 20px;">
    <h2 class="section__title">Biblioteca de Datos Nutricionales</h2>
    <div class="filters-container glass" style="margin-bottom: 20px;">
        <div class="filter-item">
            <i class="fas fa-search"></i>
            <input type="text" id="tableFilter" placeholder="Buscar fruta en la tabla...">
        </div>
        <div class="filter-item">
            <i class="fas fa-sort-amount-down"></i>
            <select id="sortSelect">
              <option value="name_asc">Ordenar por: Nombre (A-Z)</option>
              <option value="calories_asc">Más Bajas en Calorías</option>
              <option value="sugar_asc">Más Bajas en Azúcar</option>
              <option value="fiber_desc">Más Altas en Fibra</option>
            </select>
        </div>
    </div>

    <div class="nutrition-table-container glass">
      <table class="nutrition-table professional" id="fruitsTable">
        <thead>
          <tr>
            <th data-sort="name">Fruta</th>
            <th data-sort="calories">Calorías</th>
            <th data-sort="carbs">Carbs (g)</th>
            <th data-sort="fiber">Fibra (g)</th>
            <th data-sort="sugar">Azúcar (g)</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </section>
  `;

  const tbody = root.querySelector('#fruitsTable tbody');
  const tableFilter = root.querySelector('#tableFilter');
  const sortSelect = root.querySelector('#sortSelect');

  function renderTable(data) {
    tbody.innerHTML = data.map(fruitName => {
      const knownFruit = fruitData.find(f => f.name === fruitName);
      return `
        <tr>
          <td>
            <strong>${fruitName}</strong>
            <small>${knownFruit?.benefits || 'Analizar para detalles'}</small>
          </td>
          <td>${knownFruit?.calories ?? '—'}</td>
          <td>${knownFruit?.carbs ?? '—'}</td>
          <td>${knownFruit?.fiber ?? '—'}</td>
          <td>${knownFruit?.sugar ?? '—'}</td>
          <td><button class="btn-primary btn-sm" data-fruit="${fruitName}">Analizar</button></td>
        </tr>
      `;
    }).join('');
  }

  function applyFiltersAndSort() {
    let data = [...allFruitNames];

    // Filter
    const query = tableFilter.value.toLowerCase();
    if (query) {
      data = data.filter(name => name.toLowerCase().includes(query));
    }

    // Sort
    const sortValue = sortSelect.value;
    data.sort((a, b) => {
      const fruitA = fruitData.find(f => f.name === a) || {};
      const fruitB = fruitData.find(f => f.name === b) || {};

      switch (sortValue) {
        case 'calories_asc': return (fruitA.calories ?? Infinity) - (fruitB.calories ?? Infinity);
        case 'sugar_asc': return (fruitA.sugar ?? Infinity) - (fruitB.sugar ?? Infinity);
        case 'fiber_desc': return (fruitB.fiber ?? 0) - (fruitA.fiber ?? 0);
        default: return a.localeCompare(b);
      }
    });

    renderTable(data);
  }

  tableFilter.addEventListener('input', applyFiltersAndSort);
  sortSelect.addEventListener('change', applyFiltersAndSort);

  // Initial render
  applyFiltersAndSort();

  // Delegated click on analyze buttons
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-fruit]');
    if (!btn) return;
    const fruitName = btn.getAttribute('data-fruit');
    root.querySelector('#fruitQuery').value = fruitName;
    analyze(fruitName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // AI analysis wiring (reused from nutritionAI)
  const form = root.querySelector('#nutritionSearch');
  const input = root.querySelector('#fruitQuery');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fruit = (input.value || '').trim();
    if (!fruit) return;
    analyze(fruit);
  });

  const results = root.querySelector('#nutritionResults');
  const loading = root.querySelector('#nutritionLoading');
  const errorBox = root.querySelector('#nutritionError');
  const title = root.querySelector('#fruitTitle');
  const servingEl = root.querySelector('#servingSize');
  const notesEl = root.querySelector('#notesList');

  let charts = { macros: null, vitamins: null, minerals: null };

  async function analyze(fruit) {
    results.style.display = 'none';
    errorBox.style.display = 'none';
    loading.style.display = 'flex';
    try {
      const data = await getFruitNutritionJSON(fruit);
      title.textContent = capitalize(data.fruit || fruit);
      servingEl.textContent = data.serving || '100 g';
      notesEl.innerHTML = '';
      (data.notes || []).forEach(n => { const li = document.createElement('li'); li.textContent = n; notesEl.appendChild(li); });

      const macros = normalizeMacros(data.macros || {});
      const vitamins = normalizeVitamins(data.vitamins || {});
      const minerals = normalizeMinerals(data.minerals || {});

      Object.values(charts).forEach(ch => ch && ch.destroy());
      charts.macros = new Chart(root.querySelector('#macrosChart'), {
        type: 'bar', data: { labels: Object.keys(macros), datasets: [{ label: 'g (o kcal)', data: Object.values(macros), backgroundColor: ['#27ae60','#2980b9','#f39c12','#8e44ad','#e67e22','#2c3e50'] }] }, options: { responsive:true, plugins:{ legend:{ display:false } } }
      });
      charts.vitamins = new Chart(root.querySelector('#vitaminsChart'), {
        type: 'radar', data: { labels: Object.keys(vitamins), datasets: [{ label: 'mg/µg (normalizado)', data: Object.values(vitamins), backgroundColor:'rgba(41,128,185,0.2)', borderColor:'#2980b9' }] }, options: { responsive:true, plugins:{ legend:{ display:false } } }
      });
      charts.minerals = new Chart(root.querySelector('#mineralsChart'), {
        type: 'line', data: { labels: Object.keys(minerals), datasets: [{ label: 'mg (normalizado)', data: Object.values(minerals), borderColor:'#e67e22', backgroundColor:'rgba(230,126,34,0.15)', tension:0.3, fill:true }] }, options: { responsive:true, plugins:{ legend:{ display:false } } }
      });

      results.style.display = 'block';
    } catch (err) {
      console.error(err);
      errorBox.style.display = 'block';
      errorBox.textContent = 'No pudimos obtener la información nutricional en este momento. Intenta nuevamente.';
    } finally {
      loading.style.display = 'none';
    }
  }
}

function normalizeMacros(m) {
  return { Calorías: safeNum(m.calories), Proteína_g: safeNum(m.protein_g), Carbohidratos_g: safeNum(m.carbs_g), Fibra_g: safeNum(m.fiber_g), Azúcares_g: safeNum(m.sugars_g), Grasas_g: safeNum(m.fat_g) };
}
function normalizeVitamins(v) {
  return { VitC_mg: safeNum(v.vitamin_c_mg), VitA_IU: safeNum(v.vitamin_a_iu)/100, VitE_mg: safeNum(v.vitamin_e_mg), VitK_µg: safeNum(v.vitamin_k_mcg)/10, Folato_µg: safeNum(v.folate_mcg)/10 };
}
function normalizeMinerals(m) {
  return { Potasio_mg: safeNum(m.potassium_mg), Magnesio_mg: safeNum(m.magnesium_mg), Calcio_mg: safeNum(m.calcium_mg), Hierro_mg: safeNum(m.iron_mg)*10 };
}
function safeNum(n) { const x = Number(n); return isFinite(x) ? Math.max(0, x) : 0; }
function capitalize(s) { return (s||'').charAt(0).toUpperCase() + (s||'').slice(1); }
