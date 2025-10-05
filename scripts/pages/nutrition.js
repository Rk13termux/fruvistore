// Combined Nutrition Page: AI analysis + large fruits table
import { getFruitNutritionJSON } from '../services/groqService.js';

export function renderNutritionPage(root) {
  root.innerHTML = `
  <section class="ai-nutrition container">
    <div class="ai-nutrition__header">
      <h2>Nutrición</h2>
      <p>Consulta información nutricional por cada 100 g de cualquier fruta y explora nuestra biblioteca.</p>
    </div>

    <form id="nutritionSearch" class="ai-nutrition__search">
      <input type="text" id="fruitQuery" placeholder="Ej: manzana, durián, guayaba, pitahaya..." required />
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
    <h2 class="section__title">Biblioteca de frutas (120+)</h2>
    <div style="margin-bottom:10px; display:flex; gap:10px; align-items:center;">
      <input id="tableFilter" placeholder="Filtrar por nombre..." style="flex:1; padding:10px 12px; border-radius:10px; border:1px solid var(--border); background:rgba(255,255,255,0.06); color:var(--txt);" />
    </div>
    <div class="nutrition-table-container glass">
      <table class="nutrition-table" id="fruitsTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Fruta</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </section>
  `;

  // Fruits list (120+ distinct)
  const FRUITS = [
    'Manzana','Plátano','Naranja','Fresa','Mango','Piña','Kiwi','Uva','Pera','Durazno','Albaricoque','Cereza','Ciruela','Frambuesa','Mora','Arándano','Grosella','Papaya','Guayaba','Maracuyá','Pitahaya','Lichi','Granada','Melón','Sandía','Limón','Lima','Mandarina','Pomelo','Coco','Higo','Dátil','Caqui','Nectarina','Tamarindo','Carambola','Kumquat','Nance','Zapote','Tuna (cacto)','Guanábana','Mamey','Chirimoya','Mangostán','Rambután','Longán','Acerola','Physalis (Uchuva)','Membrillo','Pomelo rosado','Naranjilla','Feijoa','Camu camu','Jabuticaba','Atemoya','Yaca (Jackfruit)','Durión','Caimito','Lucuma','Pequi','Sapodilla (Níspero)','Cajú (Anacardo fruta)','Açaí','Maqui','Mora azul (Blueberry)','Arándano rojo','Boysenberry','Loganberry','Grosella negra','Grosella espinosa','Mora blanca','Uva verde','Uva negra','Uva moscatel','Banano rojo','Banano macho','Plátano dominico','Plátano manzano','Pitanga','Níspero japonés (Loquat)','Tamarillo','Uva Isabella','Uva Concord','Clementina','Satsuma','Mandarina Honey','Naranja Valencia','Naranja Sanguina','Manzana Fuji','Manzana Gala','Manzana Granny Smith','Manzana Pink Lady','Pera Anjou','Pera Bosc','Pera Williams','Melocotón','Melocotón blanco','Melocotón paraguayo','Ciruela roja','Ciruela amarilla','Ciruela negra','Cereza Bing','Cereza Rainier','Fresa silvestre','Frambuesa negra','Mora Boysen','Arándano silvestre','Grosella blanca','Papaya hawaiana','Papaya maradol','Mango ataulfo','Mango kent','Mango tommy','Kiwi dorado','Kiwi verde','Piña golden','Piña cayena','Pitahaya amarilla','Pitahaya roja','Guayaba fresa','Guayaba pera','Maracuyá morada','Maracuyá amarilla','Melón cantalupo','Melón honeydew','Pepino dulce','Melón galia','Sandía crimson','Sandía sin semillas'
  ];

  // Render table rows
  const tbody = root.querySelector('#fruitsTable tbody');
  const renderRows = (list) => {
    tbody.innerHTML = '';
    list.forEach((name, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="idx"><span class="badge-index">${i + 1}</span></td>
        <td class="fruit-name">${name}</td>
        <td><button class="btn-primary btn-sm" data-fruit="${name}">Analizar</button></td>
      `;
      tbody.appendChild(tr);
    });
  };
  renderRows(FRUITS);

  // Filter
  const filter = root.querySelector('#tableFilter');
  filter.addEventListener('input', () => {
    const q = filter.value.toLowerCase();
    const filtered = FRUITS.filter(f => f.toLowerCase().includes(q));
    renderRows(filtered);
  });

  // Delegated click on analyze buttons
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-fruit]');
    if (!btn) return;
    analyze(btn.getAttribute('data-fruit'));
    window.scrollTo({ top: 120, behavior: 'smooth' });
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
