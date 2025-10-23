// Blog de Recetas - Página Principal
export function renderRecipesBlogPage(root) {
  // Detectar si estamos en GitHub Pages o en local
  const isGitHubPages = window.location.hostname.includes('github.io');
  const imagePrefix = isGitHubPages ? '/fruvistore' : '';

  const recipes = [
    // Batidos Saludables
    {
      id: 'smoothie-1',
      title: 'Batido Tropical Energizante',
      category: 'Batidos Saludables',
      description: 'Una explosión de energía tropical con piña, mango y plátano.',
      image: `${imagePrefix}/images/products/mango-ataulfo.png`,
      prepTime: '5 min',
      servings: '2 porciones',
      difficulty: 'Fácil',
      featured: true
    },
    {
      id: 'smoothie-2',
      title: 'Batido Verde Detox',
      category: 'Batidos Saludables',
      description: 'Limpia tu organismo con espinacas, manzana verde y jengibre.',
      image: `${imagePrefix}/images/products/kiwi-zespri.jpg`,
      prepTime: '7 min',
      servings: '1 porción',
      difficulty: 'Fácil',
      featured: true
    },
    {
      id: 'smoothie-3',
      title: 'Batido de Bayas Antioxidante',
      category: 'Batidos Saludables',
      description: 'Mezcla de fresas, arándanos y frambuesas para combatir radicales libres.',
      image: `${imagePrefix}/images/products/fresa-premium.jpg`,
      prepTime: '5 min',
      servings: '2 porciones',
      difficulty: 'Fácil',
      featured: false
    },

    // Ensaladas de Frutas
    {
      id: 'salad-1',
      title: 'Ensalada Tropical Refrescante',
      category: 'Ensaladas de Frutas',
      description: 'Combinación perfecta de frutas tropicales con toque cítrico.',
      image: `${imagePrefix}/images/products/pina-golden.jpg`,
      prepTime: '15 min',
      servings: '4 porciones',
      difficulty: 'Media',
      featured: true
    },
    {
      id: 'salad-2',
      title: 'Ensalada de Frutas del Bosque',
      category: 'Ensaladas de Frutas',
      description: 'Bayas frescas con menta y yogur natural.',
      image: `${imagePrefix}/images/products/arandanos-azules.jpg`,
      prepTime: '10 min',
      servings: '3 porciones',
      difficulty: 'Fácil',
      featured: false
    },

    // Batidos Medicinales
    {
      id: 'healing-1',
      title: 'Batido Anticatarral',
      category: 'Batidos Medicinales',
      description: 'Fortalece tu sistema inmunológico con vitamina C natural.',
      image: `${imagePrefix}/images/products/naranja_valecia.png`,
      prepTime: '8 min',
      servings: '1 porción',
      difficulty: 'Fácil',
      featured: true
    },
    {
      id: 'healing-2',
      title: 'Batido Antiinflamatorio',
      category: 'Batidos Medicinales',
      description: 'Reduce inflamaciones con piña, jengibre y cúrcuma.',
      image: `${imagePrefix}/images/products/limon-eureka.png`,
      prepTime: '10 min',
      servings: '1 porción',
      difficulty: 'Media',
      featured: false
    }
  ];

  const categories = ['Todos', 'Batidos Saludables', 'Ensaladas de Frutas', 'Batidos Medicinales'];

  root.innerHTML = `
    <section class="recipes-blog">
      <!-- Hero Section -->
      <div class="recipes-hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">
              <i class="fas fa-seedling"></i>
              Blog de Recetas Frutales
            </h1>
            <p class="hero-subtitle">
              Descubre recetas innovadoras y saludables con las mejores frutas de temporada
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">${recipes.length}</span>
                <span class="stat-label">Recetas</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">3</span>
                <span class="stat-label">Categorías</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">100%</span>
                <span class="stat-label">Natural</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="recipes-controls glass">
        <div class="container">
          <div class="controls-content">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input type="text" id="recipeSearch" placeholder="Buscar recetas...">
            </div>
            <div class="category-filters">
              ${categories.map(cat => `
                <button class="filter-btn ${cat === 'Todos' ? 'active' : ''}" data-category="${cat}">
                  ${cat}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Recipes -->
      <div class="featured-recipes">
        <div class="container">
          <h2 class="section-title">
            <i class="fas fa-star"></i>
            Recetas Destacadas
          </h2>
          <div class="featured-grid">
            ${recipes.filter(recipe => recipe.featured).map(recipe => `
              <div class="featured-card glass fade-in-up" data-category="${recipe.category}">
                <div class="card-badge">
                  <i class="fas fa-fire"></i>
                  Destacada
                </div>
                <div class="card-image">
                  <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
                  <div class="card-overlay">
                    <span class="recipe-category">${recipe.category}</span>
                  </div>
                </div>
                <div class="card-content">
                  <h3 class="card-title">${recipe.title}</h3>
                  <p class="card-description">${recipe.description}</p>
                  <div class="card-meta">
                    <span class="meta-item">
                      <i class="fas fa-clock"></i>
                      ${recipe.prepTime}
                    </span>
                    <span class="meta-item">
                      <i class="fas fa-users"></i>
                      ${recipe.servings}
                    </span>
                    <span class="meta-item difficulty ${recipe.difficulty.toLowerCase()}">
                      <i class="fas fa-signal"></i>
                      ${recipe.difficulty}
                    </span>
                  </div>
                  <button class="btn-primary view-recipe" data-recipe-id="${recipe.id}">
                    <i class="fas fa-eye"></i>
                    Ver Receta
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- All Recipes -->
      <div class="all-recipes">
        <div class="container">
          <h2 class="section-title">
            <i class="fas fa-th-large"></i>
            Todas las Recetas
          </h2>
          <div class="recipes-grid" id="recipesGrid">
            ${recipes.map(recipe => `
              <div class="recipe-card glass fade-in-up" data-category="${recipe.category}">
                <div class="card-image">
                  <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
                  ${recipe.featured ? '<div class="card-badge small">⭐ Destacada</div>' : ''}
                </div>
                <div class="card-content">
                  <span class="recipe-category">${recipe.category}</span>
                  <h3 class="card-title">${recipe.title}</h3>
                  <p class="card-description">${recipe.description}</p>
                  <div class="card-meta">
                    <span class="meta-item">
                      <i class="fas fa-clock"></i>
                      ${recipe.prepTime}
                    </span>
                    <span class="meta-item">
                      <i class="fas fa-users"></i>
                      ${recipe.servings}
                    </span>
                  </div>
                  <button class="btn-outline view-recipe" data-recipe-id="${recipe.id}">
                    <i class="fas fa-eye"></i>
                    Ver Receta
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Newsletter Section -->
      <div class="newsletter-section">
        <div class="container">
          <div class="newsletter-content glass">
            <div class="newsletter-text">
              <h3>
                <i class="fas fa-envelope"></i>
                ¡Suscríbete a Nuestras Recetas!
              </h3>
              <p>Recibe nuevas recetas directamente en tu correo cada semana</p>
            </div>
            <div class="newsletter-form">
              <input type="email" placeholder="Tu correo electrónico" id="newsletterEmail">
              <button class="btn-primary" id="subscribeBtn">
                <i class="fas fa-bell"></i>
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Setup interactions
  setupRecipeInteractions(recipes);
}

// Recipe interactions and filtering
function setupRecipeInteractions(recipes) {
  const searchInput = document.getElementById('recipeSearch');
  const categoryButtons = document.querySelectorAll('.filter-btn');
  const viewRecipeButtons = document.querySelectorAll('.view-recipe');
  const subscribeBtn = document.getElementById('subscribeBtn');
  const recipesGrid = document.getElementById('recipesGrid');

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterRecipes(recipes, searchTerm, 'Todos');
  });

  // Category filtering
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const category = button.dataset.category;
      const searchTerm = searchInput.value.toLowerCase();
      filterRecipes(recipes, searchTerm, category);
    });
  });

  // View recipe buttons
  viewRecipeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const recipeId = button.dataset.recipeId;
      window.location.hash = `#/receta/${recipeId}`;
    });
  });

  // Newsletter subscription
  subscribeBtn.addEventListener('click', () => {
    const email = document.getElementById('newsletterEmail').value;
    if (email) {
      showNotification('¡Gracias por suscribirte! Recibirás nuestras recetas semanalmente.');
      document.getElementById('newsletterEmail').value = '';
    } else {
      showNotification('Por favor ingresa tu correo electrónico.', false);
    }
  });
}

// Filter recipes based on search and category
function filterRecipes(recipes, searchTerm, category) {
  const filtered = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm) ||
                         recipe.description.toLowerCase().includes(searchTerm) ||
                         recipe.category.toLowerCase().includes(searchTerm);

    const matchesCategory = category === 'Todos' || recipe.category === category;

    return matchesSearch && matchesCategory;
  });

  // Update grid (simplified for demo)
  const grid = document.getElementById('recipesGrid');
  if (grid) {
    grid.innerHTML = filtered.map(recipe => `
      <div class="recipe-card glass fade-in-up" data-category="${recipe.category}">
        <div class="card-image">
          <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
        </div>
        <div class="card-content">
          <span class="recipe-category">${recipe.category}</span>
          <h3 class="card-title">${recipe.title}</h3>
          <p class="card-description">${recipe.description}</p>
          <div class="card-meta">
            <span class="meta-item">
              <i class="fas fa-clock"></i>
              ${recipe.prepTime}
            </span>
            <span class="meta-item">
              <i class="fas fa-users"></i>
              ${recipe.servings}
            </span>
          </div>
          <button class="btn-outline view-recipe" data-recipe-id="${recipe.id}">
            <i class="fas fa-eye"></i>
            Ver Receta
          </button>
        </div>
      </div>
    `).join('');

    // Re-wire buttons
    grid.querySelectorAll('.view-recipe').forEach(button => {
      button.addEventListener('click', () => {
        const recipeId = button.dataset.recipeId;
        window.location.hash = `#/receta/${recipeId}`;
      });
    });
  }
}

// Notification system
function showNotification(message, success = true) {
  const notification = document.createElement('div');
  notification.className = `notification ${success ? 'success' : 'error'} fade-in`;
  notification.innerHTML = `
    <i class="fas ${success ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
