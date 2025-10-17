// Página Individual de Receta
export function renderRecipeDetailPage(root, recipeId) {
  // Detectar si estamos en GitHub Pages o en local
  const isGitHubPages = window.location.hostname.includes('github.io');
  const imagePrefix = isGitHubPages ? '/fruvistore' : '';

  const recipes = {
    // Batidos Saludables
    'smoothie-1': {
      id: 'smoothie-1',
      title: 'Batido Tropical Energizante',
      category: 'Batidos Saludables',
      description: 'Una explosión de energía tropical que te llenará de vitalidad para todo el día.',
      longDescription: 'Este batido combina lo mejor de las frutas tropicales para crear una bebida energizante perfecta para el desayuno o como snack pre-entrenamiento. La piña aporta enzimas digestivas naturales, el mango añade cremosidad y dulzor, mientras que el plátano proporciona potasio y energía sostenida.',
      image: `${imagePrefix}/images/products/mango-ataulfo.png`,
      prepTime: '5 min',
      cookTime: '0 min',
      servings: '2 porciones',
      difficulty: 'Fácil',
      ingredients: [
        { amount: '1 taza', item: 'Piña fresca en trozos', icon: '🍍' },
        { amount: '1', item: 'Mango maduro', icon: '🥭' },
        { amount: '1', item: 'Plátano maduro', icon: '🍌' },
        { amount: '1 taza', item: 'Leche de almendras', icon: '🥛' },
        { amount: '1 cucharada', item: 'Miel (opcional)', icon: '🍯' },
        { amount: '1/2 taza', item: 'Hielo', icon: '🧊' }
      ],
      instructions: [
        'Pela y corta la piña en trozos pequeños.',
        'Pela el mango y extrae la pulpa.',
        'Pela el plátano y córtalo en rodajas.',
        'Coloca todos los ingredientes en una licuadora.',
        'Licúa a velocidad alta por 1-2 minutos hasta obtener una textura suave.',
        'Sirve inmediatamente y disfruta de tu batido energizante.'
      ],
      nutrition: {
        calories: '180 kcal',
        protein: '3g',
        carbs: '42g',
        fiber: '5g',
        vitaminC: '120% DV'
      },
      tips: [
        'Usa frutas bien maduras para un sabor más dulce.',
        'Si prefieres una textura más espesa, reduce la cantidad de leche.',
        'Puedes congelar las frutas con anticipación para un batido más frío.'
      ],
      featured: true
    },
    'smoothie-2': {
      id: 'smoothie-2',
      title: 'Batido Verde Detox',
      category: 'Batidos Saludables',
      description: 'Limpia tu organismo con este poderoso batido verde lleno de nutrientes.',
      longDescription: 'Este batido verde es perfecto para detoxificar tu cuerpo de manera natural. Las espinacas aportan hierro y vitaminas esenciales, la manzana verde añade fibra y frescura, mientras que el jengibre acelera el metabolismo y mejora la digestión.',
      image: `${imagePrefix}/images/products/kiwi-zespri.jpg`,
      prepTime: '7 min',
      cookTime: '0 min',
      servings: '1 porción',
      difficulty: 'Fácil',
      ingredients: [
        { amount: '2 tazas', item: 'Espinacas frescas', icon: '🥬' },
        { amount: '1', item: 'Manzana verde', icon: '🍏' },
        { amount: '1/2', item: 'Kiwi', icon: '🥝' },
        { amount: '1 cucharadita', item: 'Jengibre fresco rallado', icon: '🫚' },
        { amount: '1 taza', item: 'Agua de coco', icon: '🥥' },
        { amount: '1/2', item: 'Limón (jugo)', icon: '🍋' }
      ],
      instructions: [
        'Lava bien las espinacas y la manzana.',
        'Corta la manzana en trozos (con piel para más fibra).',
        'Pela el kiwi y córtalo en rodajas.',
        'Ralla el jengibre fresco.',
        'Exprime el jugo del limón.',
        'Licúa todos los ingredientes hasta obtener una mezcla homogénea.',
        'Sirve frío para mejores resultados.'
      ],
      nutrition: {
        calories: '95 kcal',
        protein: '4g',
        carbs: '22g',
        fiber: '8g',
        vitaminA: '180% DV'
      },
      tips: [
        'Bebe este batido en ayunas para maximizar sus efectos detox.',
        'Si es muy espeso, agrega un poco más de agua de coco.',
        'Prepara los ingredientes la noche anterior para ahorrar tiempo.'
      ],
      featured: true
    },

    // Ensaladas de Frutas
    'salad-1': {
      id: 'salad-1',
      title: 'Ensalada Tropical Refrescante',
      category: 'Ensaladas de Frutas',
      description: 'Una explosión de colores y sabores tropicales perfecta para el verano.',
      longDescription: 'Esta ensalada combina frutas tropicales frescas con un toque cítrico que realza todos los sabores. Es perfecta como postre ligero o como acompañamiento refrescante en días calurosos.',
      image: `${imagePrefix}/images/products/pina-golden.jpg`,
      prepTime: '15 min',
      cookTime: '0 min',
      servings: '4 porciones',
      difficulty: 'Media',
      ingredients: [
        { amount: '1/2', item: 'Piña fresca', icon: '🍍' },
        { amount: '2', item: 'Mangos maduros', icon: '🥭' },
        { amount: '3', item: 'Kiwi', icon: '🥝' },
        { amount: '1 taza', item: 'Fresas', icon: '🍓' },
        { amount: '2', item: 'Limas (jugo)', icon: '🍋' },
        { amount: '2 cucharadas', item: 'Miel', icon: '🍯' },
        { amount: '1/4 taza', item: 'Hojas de menta fresca', icon: '🌿' }
      ],
      instructions: [
        'Pela y corta la piña en cubos pequeños.',
        'Pela los mangos y córtalos en cubos.',
        'Pela los kiwis y córtalos en rodajas.',
        'Lava y corta las fresas en cuartos.',
        'Pica finamente las hojas de menta.',
        'En un bol grande, mezcla el jugo de lima con la miel.',
        'Agrega todas las frutas y la menta picada.',
        'Mezcla suavemente y deja reposar 5 minutos antes de servir.'
      ],
      nutrition: {
        calories: '120 kcal',
        protein: '2g',
        carbs: '30g',
        fiber: '4g',
        vitaminC: '150% DV'
      },
      tips: [
        'Corta las frutas en trozos similares para una presentación uniforme.',
        'Prepara la ensalada máximo 30 minutos antes de servir.',
        'Puedes agregar coco rallado para más textura tropical.'
      ],
      featured: true
    },

    // Batidos Medicinales
    'healing-1': {
      id: 'healing-1',
      title: 'Batido Anticatarral',
      category: 'Batidos Medicinales',
      description: 'Fortalece tu sistema inmunológico con esta poderosa combinación de vitamina C.',
      longDescription: 'Este batido está diseñado específicamente para combatir resfriados y fortalecer el sistema inmunológico. La alta concentración de vitamina C de las naranjas y limones, combinada con el poder antibacteriano del ajo, crea una bebida medicinal natural.',
      image: `${imagePrefix}/images/products/naranja_valecia.png`,
      prepTime: '8 min',
      cookTime: '0 min',
      servings: '1 porción',
      difficulty: 'Fácil',
      ingredients: [
        { amount: '3', item: 'Naranjas grandes', icon: '🍊' },
        { amount: '1', item: 'Limón', icon: '🍋' },
        { amount: '1 cucharadita', item: 'Miel cruda', icon: '🍯' },
        { amount: '1 diente', item: 'Ajo pequeño (opcional)', icon: '🧄' },
        { amount: '1 pizca', item: 'Pimienta de cayena', icon: '🌶️' },
        { amount: '1/2 taza', item: 'Agua tibia', icon: '💧' }
      ],
      instructions: [
        'Exprime el jugo de las naranjas y el limón.',
        'Si usas ajo, pícalo finamente o usa una prensa.',
        'Mezcla el jugo con la miel hasta que se disuelva completamente.',
        'Agrega el ajo picado y la pimienta de cayena.',
        'Diluye con agua tibia si lo prefieres menos concentrado.',
        'Revuelve bien y bebe inmediatamente.',
        'Toma 1-2 veces al día cuando sientas síntomas de resfriado.'
      ],
      nutrition: {
        calories: '140 kcal',
        protein: '2g',
        carbs: '35g',
        fiber: '1g',
        vitaminC: '300% DV'
      },
      tips: [
        'Bebe este batido al primer signo de resfriado.',
        'El ajo puede omitirse si no te agrada su sabor.',
        'Prepara cantidades pequeñas y consume inmediatamente.',
        'Combínalo con descanso y buena hidratación para mejores resultados.'
      ],
      featured: true
    }
  };

  const recipe = recipes[recipeId];

  if (!recipe) {
    root.innerHTML = `
      <section class="container" style="padding:20px 0;">
        <h2>Receta no encontrada</h2>
        <p>La receta que buscas no existe.</p>
        <p><a href="#/recetas">Volver al blog de recetas</a></p>
      </section>
    `;
    return;
  }

  root.innerHTML = `
    <section class="recipe-detail">
      <!-- Recipe Header -->
      <div class="recipe-header">
        <div class="container">
          <nav class="breadcrumb">
            <a href="#/recetas">
              <i class="fas fa-arrow-left"></i>
              Volver al Blog
            </a>
          </nav>

          <div class="recipe-hero">
            <div class="recipe-hero-content">
              <span class="recipe-category">${recipe.category}</span>
              <h1 class="recipe-title">${recipe.title}</h1>
              <p class="recipe-description">${recipe.longDescription}</p>

              <div class="recipe-meta">
                <div class="meta-item">
                  <i class="fas fa-clock"></i>
                  <span>Prep: ${recipe.prepTime}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-users"></i>
                  <span>${recipe.servings}</span>
                </div>
                <div class="meta-item difficulty ${recipe.difficulty.toLowerCase()}">
                  <i class="fas fa-signal"></i>
                  <span>${recipe.difficulty}</span>
                </div>
              </div>
            </div>

            <div class="recipe-hero-image">
              <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
              ${recipe.featured ? '<div class="featured-badge">⭐ Receta Destacada</div>' : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- Recipe Content -->
      <div class="recipe-content">
        <div class="container">
          <div class="content-grid">
            <!-- Ingredients -->
            <div class="ingredients-section">
              <h2 class="section-title">
                <i class="fas fa-shopping-basket"></i>
                Ingredientes
              </h2>
              <div class="ingredients-list">
                ${recipe.ingredients.map(ing => `
                  <div class="ingredient-item">
                    <span class="ingredient-amount">${ing.amount}</span>
                    <span class="ingredient-icon">${ing.icon}</span>
                    <span class="ingredient-name">${ing.item}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Instructions -->
            <div class="instructions-section">
              <h2 class="section-title">
                <i class="fas fa-list-ol"></i>
                Instrucciones
              </h2>
              <div class="instructions-list">
                ${recipe.instructions.map((instruction, index) => `
                  <div class="instruction-step">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">${instruction}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Nutrition & Tips -->
            <div class="additional-info">
              <!-- Nutrition Facts -->
              <div class="nutrition-section">
                <h3 class="subsection-title">
                  <i class="fas fa-chart-pie"></i>
                  Información Nutricional
                </h3>
                <div class="nutrition-facts">
                  ${Object.entries(recipe.nutrition).map(([key, value]) => `
                    <div class="nutrition-item">
                      <span class="nutrition-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                      <span class="nutrition-value">${value}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Tips -->
              <div class="tips-section">
                <h3 class="subsection-title">
                  <i class="fas fa-lightbulb"></i>
                  Consejos
                </h3>
                <div class="tips-list">
                  ${recipe.tips.map(tip => `
                    <div class="tip-item">
                      <i class="fas fa-check-circle"></i>
                      <span>${tip}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Recipes -->
      <div class="related-recipes">
        <div class="container">
          <h2 class="section-title">
            <i class="fas fa-thumbs-up"></i>
            También te puede gustar
          </h2>
          <div class="related-grid">
            ${Object.values(recipes)
              .filter(r => r.id !== recipeId && r.category === recipe.category)
              .slice(0, 2)
              .map(relatedRecipe => `
                <div class="related-card glass">
                  <div class="related-image">
                    <img src="${relatedRecipe.image}" alt="${relatedRecipe.title}" loading="lazy">
                  </div>
                  <div class="related-content">
                    <span class="related-category">${relatedRecipe.category}</span>
                    <h3 class="related-title">${relatedRecipe.title}</h3>
                    <p class="related-description">${relatedRecipe.description}</p>
                    <button class="btn-outline view-related" data-recipe-id="${relatedRecipe.id}">
                      <i class="fas fa-eye"></i>
                      Ver Receta
                    </button>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="recipe-cta">
        <div class="container">
          <div class="cta-content glass">
            <div class="cta-text">
              <h3>
                <i class="fas fa-shopping-cart"></i>
                ¿Te gustó esta receta?
              </h3>
              <p>Compra las frutas frescas que necesitas en nuestra tienda</p>
            </div>
            <div class="cta-actions">
              <button class="btn-primary" onclick="window.location.hash='#/tienda'">
                <i class="fas fa-store"></i>
                Ir a la Tienda
              </button>
              <button class="btn-outline" onclick="window.location.hash='#/recetas'">
                <i class="fas fa-book-open"></i>
                Más Recetas
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Setup interactions
  setupRecipeDetailInteractions(recipe);
}

// Recipe detail interactions
function setupRecipeDetailInteractions(recipe) {
  const viewRelatedButtons = document.querySelectorAll('.view-related');

  viewRelatedButtons.forEach(button => {
    button.addEventListener('click', () => {
      const recipeId = button.dataset.recipeId;
      window.location.hash = `#/receta/${recipeId}`;
    });
  });

  // Add smooth scrolling for instruction steps
  const instructionSteps = document.querySelectorAll('.instruction-step');
  instructionSteps.forEach(step => {
    step.addEventListener('click', () => {
      step.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}
