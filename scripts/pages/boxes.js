const IS_GITHUB_PAGES = window.location.hostname.includes('github.io');
const IMAGE_PREFIX = IS_GITHUB_PAGES ? '/fruvistore' : '';

let cartBoxes = JSON.parse(localStorage.getItem('fruvi_cart_boxes') || '[]');
window.cartBoxes = cartBoxes;

export async function renderBoxesPage(root) {
	const userStatus = await getUserStatusSafe();
	root.innerHTML = '';

	let boxes = [];
	try {
		boxes = await loadBoxesFromDatabase();
	} catch (error) {
		console.error('❌ Error cargando cajas desde la base de datos:', error);
	}

	if (!Array.isArray(boxes) || boxes.length === 0) {
		boxes = getFallbackBoxes();
	}

	const categories = buildCategoryList(boxes);
	renderBoxesHTML(root, boxes, categories, userStatus);
	setupBoxesInteractions(boxes);
	setupCart();
	updateCartDisplay();
}

function buildCategoryList(boxes) {
	const values = new Set();
	boxes.forEach(box => {
		const category = (box.category || '').trim();
		if (category) {
			values.add(category);
		}
	});
	const sorted = Array.from(values).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
	return ['Todas', ...sorted];
}

async function getUserStatusSafe() {
	try {
		if (typeof window.getUserStatus === 'function') {
			const status = await window.getUserStatus();
			return status || { isGuest: false };
		}
	} catch (error) {
		console.warn('⚠️ No se pudo obtener el estado del usuario:', error);
	}
	return { isGuest: false };
}

function renderBoxesHTML(root, boxes, categories, userStatus) {
	const featuredBoxes = boxes.filter(box => box.featured).slice(0, 6);
	const avgRating = boxes.length
		? boxes.reduce((sum, box) => sum + (Number.isFinite(box.rating) ? box.rating : 0), 0) / boxes.length
		: 0;
	const ratingStat = avgRating > 0 ? avgRating.toFixed(1) : '4.8';

	const heroStats = `
		<div class="hero-stats">
			<div class="stat-item">
				<span class="stat-number">${boxes.length}</span>
				<span class="stat-label">Cajas activas</span>
			</div>
			<div class="stat-item">
				<span class="stat-number">${Math.max(0, categories.length - 1)}</span>
				<span class="stat-label">Categorías</span>
			</div>
			<div class="stat-item">
				<span class="stat-number">${ratingStat}</span>
				<span class="stat-label">Calificación media</span>
			</div>
		</div>
	`;

	const heroGallery = featuredBoxes.length ? `
		<div class="best-sellers-gallery boxes-gallery">
			<h2 class="gallery-title">Cajas destacadas</h2>
			<div class="gallery-scroll infinite-scroll">
				<div class="gallery-track">
					${featuredBoxes.map(box => `
						<div class="gallery-item">
							<img src="${box.img}" alt="${box.name}" loading="lazy">
							<div class="gallery-item-info">
								<h4>${box.name}</h4>
								<span class="gallery-price">$${box.totalPrice.toFixed(2)}</span>
							</div>
						</div>
					`).join('')}
					${featuredBoxes.map(box => `
						<div class="gallery-item">
							<img src="${box.img}" alt="${box.name}" loading="lazy">
							<div class="gallery-item-info">
								<h4>${box.name}</h4>
								<span class="gallery-price">$${box.totalPrice.toFixed(2)}</span>
							</div>
						</div>
					`).join('')}
				</div>
			</div>
		</div>
	` : '';

	const registrationBanner = userStatus.isGuest ? `
		<div class="registration-banner glass">
			<div class="banner-content">
				<div class="banner-icon">
					<i class="fas fa-user-plus"></i>
				</div>
				<div class="banner-text">
					<h3>Regístrate y recibe beneficios exclusivos</h3>
					<p>Accede a descuentos, entregas preferenciales y soporte prioritario para tus pedidos de cajas.</p>
				</div>
				<div class="banner-actions">
					<button class="btn-primary register-now" onclick="window.location.hash='#/registro'">
						<i class="fas fa-rocket"></i>
						Registrarme ahora
					</button>
				</div>
			</div>
			<div class="benefits-grid">
				${window.getRegistrationBenefits().map(benefit => `
					<div class="benefit-card glass">
						<div class="benefit-icon"><i class="${benefit.icon}"></i></div>
						<div class="benefit-content">
							<h4>${benefit.title}</h4>
							<p>${benefit.description}</p>
						</div>
					</div>
				`).join('')}
			</div>
		</div>
	` : '';

	const categoryOptions = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
	const boxesHTML = boxes.map(getBoxCardHTML).join('');
	const { totalItems, totalPrice } = getCartTotals();

	root.innerHTML = `
		<section class="store boxes-store">
			<!-- Hero Section - Optimizado psicológicamente -->
			<div class="store-hero hero-optimized">
				<div class="container">
					<div class="hero-content-optimized">
						<!-- Badge Premium -->
						<div class="hero-badge-premium boxes-badge">
							<i class="fas fa-box-open"></i>
							<span>Combinaciones Perfectas</span>
						</div>

						<!-- Título Principal - Enfoque en conveniencia -->
						<h1 class="hero-title-optimized">
							<span class="title-line-1 boxes-color">FruviBox</span>
							<span class="title-line-2 boxes-gradient">Seleccionadas</span>
						</h1>

						<!-- Subtítulo - Propuesta de valor -->
						<p class="hero-subtitle-optimized">
							Combinaciones listas para compartir, preparadas con frutas frescas y balanceadas nutricionalmente
						</p>

						<!-- Features - Beneficios clave -->
						<div class="hero-features-optimized">
							<div class="feature-item-optimized boxes-feature">
								<i class="fas fa-balance-scale"></i>
								<span>Balanceadas</span>
							</div>
							<div class="feature-item-optimized boxes-feature">
								<i class="fas fa-clock"></i>
								<span>Listas Ya</span>
							</div>
							<div class="feature-item-optimized boxes-feature">
								<i class="fas fa-piggy-bank"></i>
								<span>Mejor Precio</span>
							</div>
						</div>

						<!-- Stats - Prueba social -->
						<div class="hero-stats-optimized">
							<div class="stat-item-optimized boxes-stat">
								<div class="stat-number">${boxes.length}</div>
								<div class="stat-label">FruviBox activas</div>
							</div>
							<div class="stat-item-optimized boxes-stat">
								<div class="stat-number">${Math.max(0, categories.length - 1)}</div>
								<div class="stat-label">Categorías</div>
							</div>
							<div class="stat-item-optimized boxes-stat">
								<div class="stat-number">${ratingStat}</div>
								<div class="stat-label">Calificación</div>
							</div>
						</div>

						<!-- Trust badges - Credibilidad -->
						<div class="hero-trust-optimized">
							<div class="trust-badge-optimized boxes-trust">
								<i class="fas fa-apple-alt"></i>
								<span>Variedad</span>
							</div>
							<div class="trust-badge-optimized boxes-trust">
								<i class="fas fa-heart"></i>
								<span>Nutritivo</span>
							</div>
							<div class="trust-badge-optimized boxes-trust">
								<i class="fas fa-users"></i>
								<span>Para Compartir</span>
							</div>
						</div>

						<!-- Urgency banner - Escasez y ahorro -->
						<div class="hero-urgency-optimized boxes-urgency">
							<i class="fas fa-tags"></i>
							<span>Ahorra hasta 20% vs frutas individuales</span>
						</div>
					</div>
				</div>

				<!-- Featured Boxes Gallery -->
				${featuredBoxes.length ? `
					<div class="best-sellers-gallery boxes-gallery" style="margin-top: 60px;">
						<h2 class="gallery-title" style="text-align: center; font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 32px; display: flex; align-items: center; justify-content: center; gap: 12px;">
							<i class="fas fa-star" style="color: #a8e063;"></i>
							FruviBox Destacadas
							<span class="featured-badge" style="background: linear-gradient(135deg, #a8e063 0%, #56ab2f 100%); color: #000; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 800;">POPULARES</span>
						</h2>
						<div class="gallery-scroll infinite-scroll">
							<div class="gallery-track">
								${featuredBoxes.map(box => `
									<div class="gallery-item">
										<img src="${box.img}" alt="${box.name}" loading="lazy">
										<div class="gallery-item-info">
											<h4>${box.name}</h4>
											<span class="gallery-price">$${box.totalPrice.toFixed(2)}</span>
										</div>
									</div>
								`).join('')}
								${featuredBoxes.map(box => `
									<div class="gallery-item">
										<img src="${box.img}" alt="${box.name}" loading="lazy">
										<div class="gallery-item-info">
											<h4>${box.name}</h4>
											<span class="gallery-price">$${box.totalPrice.toFixed(2)}</span>
										</div>
									</div>
								`).join('')}
							</div>
						</div>
					</div>
				` : ''}
			</div>

			<div class="container">
				<div class="store-header">
					<h2>FruviBox Premium</h2>
					<p class="store-subtitle">Combinaciones perfectamente balanceadas de frutas frescas. Diseñadas por nutricionistas para máxima frescura y valor nutricional.</p>
					${registrationBanner}
				</div>

				<!-- Filters Section - Rediseñada -->
				<div class="store-filters-container">
					<div class="filters-header">
						<h3>
							<i class="fas fa-filter"></i>
							Encuentra Tu FruviBox Perfecta
						</h3>
						<p>Personaliza tu selección con nuestros filtros inteligentes para encontrar la caja ideal</p>
					</div>
					
					<div class="store-filters glass">
						<!-- Grid de filtros vertical -->
						<div class="filters-grid">
							<!-- Categoría -->
							<div class="filter-group">
								<label>
									<i class="fas fa-tags"></i>
									CATEGORÍA:
								</label>
								<select id="categoryFilter" class="filter-select">
									${categoryOptions}
								</select>
							</div>

							<!-- Ordenar por -->
							<div class="filter-group">
								<label>
									<i class="fas fa-sort"></i>
									ORDENAR POR:
								</label>
								<select id="sortFilter" class="filter-select">
									<option value="featured" selected>Destacadas Primero</option>
									<option value="price-low">Precio: Menor a Mayor</option>
									<option value="price-high">Precio: Mayor a Menor</option>
									<option value="rating">Mejor Calificadas</option>
									<option value="name">Nombre A-Z</option>
								</select>
							</div>

							<!-- Solo Orgánicas -->
							<div class="filter-group checkbox-group">
								<label>
									<i class="fas fa-leaf"></i>
									FILTROS ADICIONALES:
								</label>
								<label class="checkbox-label">
									<input type="checkbox" id="organicFilter">
									<span class="checkbox-custom"></span>
									<span class="checkbox-text">
										<i class="fas fa-leaf"></i>
										Solo FruviBox Orgánicas
									</span>
								</label>
							</div>

							<!-- Contador de Resultados -->
							<div class="filter-group results-count">
								<label>
									<i class="fas fa-box"></i>
									RESULTADOS:
								</label>
								<span id="resultsCount" class="count-badge">${boxes.length} FruviBox Disponibles</span>
							</div>
						</div>
					</div>
				</div>

				<div class="products-grid" id="boxesGrid">
					${boxesHTML}
				</div>
			</div>

			<div class="cart-summary glass" id="cartSummary">
				<div class="cart-header">
					<i class="fas fa-shopping-basket"></i>
					<span>Carrito</span>
					<span class="cart-count" id="cartCount">${totalItems}</span>
				</div>
				<div class="cart-total">
					<span>Total:</span>
					<span class="cart-amount" id="cartTotal">$${totalPrice.toFixed(2)}</span>
				</div>
				<button class="btn-primary cart-checkout" id="cartCheckout">
					Proceder al pago
				</button>
			</div>
		</section>
	`;
}

function setupBoxesInteractions(boxes) {
	const categoryFilter = document.getElementById('categoryFilter');
	const sortFilter = document.getElementById('sortFilter');
	const organicFilter = document.getElementById('organicFilter');
	const boxesGrid = document.getElementById('boxesGrid');
	const resultsCount = document.getElementById('resultsCount');

	if (!categoryFilter || !sortFilter || !organicFilter || !boxesGrid || !resultsCount) {
		return;
	}

	const boxesMap = new Map();
	boxes.forEach(box => boxesMap.set(Number(box.id), box));

	const sortBoxes = (list, sortValue) => {
		const sorted = [...list];
		sorted.sort((a, b) => {
			switch (sortValue) {
				case 'price-low':
					return a.totalPrice - b.totalPrice;
				case 'price-high':
					return b.totalPrice - a.totalPrice;
				case 'rating':
					return b.rating - a.rating;
				case 'name':
					return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
				case 'featured':
				default:
					return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
			}
		});
		return sorted;
	};

	const attachQuantityControls = () => {
		boxesGrid.querySelectorAll('.product-card').forEach(card => {
			const minusBtn = card.querySelector('.qty-btn.minus');
			const plusBtn = card.querySelector('.qty-btn.plus');
			const qtyInput = card.querySelector('.qty-input');
			const totalEl = card.querySelector('.total-price');

			if (!qtyInput || !totalEl) {
				return;
			}

			const unitPrice = parseFloat(card.dataset.price) || 0;
			const stock = parseInt(card.dataset.stock, 10);
			const maxStock = Number.isFinite(stock) && stock > 0 ? stock : Infinity;

			const updateTotal = () => {
				const safeQuantity = Math.max(1, Math.min(maxStock, parseInt(qtyInput.value, 10) || 1));
				qtyInput.value = safeQuantity.toString();
				totalEl.textContent = `Total: $${(unitPrice * safeQuantity).toFixed(2)}`;
			};

			updateTotal();

			minusBtn?.addEventListener('click', () => {
				const current = Math.max(1, parseInt(qtyInput.value, 10) || 1);
				if (current > 1) {
					qtyInput.value = String(current - 1);
					updateTotal();
				}
			});

			plusBtn?.addEventListener('click', () => {
				const current = Math.max(1, parseInt(qtyInput.value, 10) || 1);
				if (current >= maxStock) {
					qtyInput.value = String(maxStock);
					updateTotal();
					return;
				}
				qtyInput.value = String(current + 1);
				updateTotal();
			});
		});
	};

	const attachAddToCartListeners = () => {
		boxesGrid.querySelectorAll('.add-to-cart:not(.disabled)').forEach(btn => {
			btn.addEventListener('click', () => {
				const card = btn.closest('.product-card');
				if (!card) {
					return;
				}

				const boxId = Number(btn.dataset.id || card.dataset.id);
				const box = boxesMap.get(boxId);
				if (!box) {
					return;
				}

				const qtyInput = card.querySelector('.qty-input');
				const quantity = Math.max(1, parseInt(qtyInput?.value || '1', 10));
				const unitPrice = parseFloat(card.dataset.price) || box.totalPrice;

				addToCart({
					id: box.id,
					name: box.name,
					price: unitPrice,
					quantity,
					image: box.img,
					type: 'box'
				});

				if (qtyInput) {
					qtyInput.value = '1';
				}
				const totalEl = card.querySelector('.total-price');
				if (totalEl) {
					totalEl.textContent = `Total: $${unitPrice.toFixed(2)}`;
				}
			});
		});
	};

	const wireCardInteractions = () => {
		attachQuantityControls();
		attachAddToCartListeners();
	};

	const applyFilters = () => {
		const categoryValue = categoryFilter.value;
		const sortValue = sortFilter.value;
		const organicOnly = organicFilter.checked;

		let filtered = boxes.filter(box => {
			if (categoryValue !== 'Todas' && box.category !== categoryValue) {
				return false;
			}
			if (organicOnly && !box.organic) {
				return false;
			}
			return true;
		});

		filtered = sortBoxes(filtered, sortValue);
		resultsCount.textContent = `${filtered.length} FruviBox encontradas`;

		boxesGrid.innerHTML = filtered.map(getBoxCardHTML).join('');
		wireCardInteractions();
	};

	categoryFilter.addEventListener('change', applyFilters);
	sortFilter.addEventListener('change', applyFilters);
	organicFilter.addEventListener('change', applyFilters);

	applyFilters();
}

function getBoxCardHTML(box) {
	const rating = Number.isFinite(box.rating) ? Math.max(0, box.rating) : 0;
	const filledStars = Math.min(5, Math.floor(rating));
	const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75 && rating < 5;
	const emptyStars = Math.max(0, 5 - Math.ceil(rating));
	const stars = `${'<i class="fas fa-star"></i>'.repeat(filledStars)}${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}${'<i class="far fa-star"></i>'.repeat(emptyStars)}`;

	const contents = Array.isArray(box.contents) ? box.contents : [];
	const displayedContents = contents.slice(0, 4).map(item => `<span class="content-item">${item}</span>`).join('');
	const moreContents = contents.length > 4 ? `<span class="content-item more">+${contents.length - 4} más</span>` : '';
	const stockInfo = box.stockQuantity > 0
		? `<div class="product-origin"><i class="fas fa-boxes"></i><span>Stock: ${box.stockQuantity}</span></div>`
		: '';
	const inStock = box.available !== false && box.inStock !== false && box.stockQuantity !== 0;
	const disabledClass = inStock ? '' : 'disabled';
	const disabledAttr = inStock ? '' : 'disabled';

	return `
		<div class="product-card glass fade-in-up" data-id="${box.id}" data-category="${box.category}" data-organic="${box.organic}" data-price="${box.totalPrice}" data-stock="${box.stockQuantity}">
			<div class="product-badge ${box.organic ? 'organic' : ''}">
				${box.organic ? 'Orgánica' : 'Convencional'}
			</div>
			<div class="product-image">
				<img src="${box.img}" alt="${box.name}" loading="lazy">
			</div>
			<div class="product-info">
				<h3 class="product-name">${box.name}</h3>
				<div class="product-rating">
					<div class="stars">${stars}</div>
					<span class="rating-score">${rating.toFixed(1)}</span>
				</div>
				<p class="product-desc">${box.desc}</p>
				<div class="product-meta">
					<span><i class="fas fa-weight-hanging"></i> ${box.weight.toFixed(1)}kg</span>
					<span class="price-perkg">$${box.priceKg.toFixed(2)}/kg</span>
				</div>
				${stockInfo}
				<div class="box-contents">
					<h4>Contenido</h4>
					<div class="contents-list">
						${displayedContents}${moreContents}
					</div>
				</div>
				<div class="product-price">
					<span class="price-main">$${box.totalPrice.toFixed(2)}</span>
					<span class="price-unit">caja</span>
				</div>
			</div>
			<div class="product-actions">
				<div class="quantity-selector ${disabledClass}">
					<button class="qty-btn minus" aria-label="Reducir cantidad" ${disabledAttr}>-</button>
					<input type="number" min="1" value="1" class="qty-input" readonly ${disabledAttr}>
					<button class="qty-btn plus" aria-label="Aumentar cantidad" ${disabledAttr}>+</button>
				</div>
				<div class="total-price" aria-live="polite">Total: $${box.totalPrice.toFixed(2)}</div>
				<button class="btn-primary add-to-cart ${disabledClass}" data-id="${box.id}" ${disabledAttr}>
					<i class="fas fa-shopping-cart"></i>
					Añadir al carrito
				</button>
			</div>
		</div>
	`;
}

async function loadBoxesFromDatabase() {
	// Try to get products client
	let supabase = window.productsClient;
	
	if (!supabase && typeof window.getProductsClient === 'function') {
		try {
			supabase = window.getProductsClient();
		} catch (e) {
			console.warn('Could not get products client:', e);
		}
	}
	
	if (!supabase) {
		throw new Error('Supabase client not available');
	}

	console.log('📦 Cargando cajas desde Supabase...');
	const { data: boxesData, error } = await supabase
		.from('current_boxes')
		.select('id, name, description, image_url, category, price_cop, estimated_weight_kg, available, in_stock, stock_quantity, featured, tags')
		.eq('available', true)
		.order('featured', { ascending: false })
		.order('name', { ascending: true });

	if (error) {
		throw error;
	}

	if (!Array.isArray(boxesData) || boxesData.length === 0) {
		return [];
	}

	const ids = boxesData.map(box => box.id).filter(Boolean);
	const contentsMap = new Map();

	if (ids.length) {
		const { data: contentsData, error: contentsError } = await supabase
			.from('box_contents')
			.select('box_id, product_name, display_order')
			.in('box_id', ids)
			.order('display_order', { ascending: true });

		if (contentsError) {
			console.warn('⚠️ No se pudieron cargar los contenidos de las cajas:', contentsError);
		} else if (Array.isArray(contentsData)) {
			contentsData.forEach(item => {
				if (!contentsMap.has(item.box_id)) {
					contentsMap.set(item.box_id, []);
				}
				contentsMap.get(item.box_id).push(item.product_name);
			});
		}
	}

	return boxesData.map(box => mapBoxRecord(box, contentsMap));
}

function mapBoxRecord(box, contentsMap) {
	const contents = contentsMap.get(box.id) || [];
	const weight = parseNumber(box.estimated_weight_kg, 2.5);
	const totalPrice = parseNumber(box.price_cop, 0);
	const priceKg = weight > 0 ? totalPrice / weight : totalPrice;
	const tags = Array.isArray(box.tags) ? box.tags.map(tag => String(tag)) : [];
	const organic = Boolean(box.organic) || tags.some(tag => tag.toLowerCase().includes('org'));
	const stockQuantity = Math.max(0, parseInt(box.stock_quantity, 10) || 0);

	return {
		id: box.id,
		name: box.name || 'Caja de frutas',
		category: box.category || 'Caja Premium',
		desc: box.description || 'Selección de frutas frescas listas para disfrutar.',
		img: resolveImagePath(box.image_url),
		weight: weight > 0 ? weight : 1,
		priceKg: priceKg > 0 ? priceKg : totalPrice,
		totalPrice,
		organic,
		rating: parseNumber(box.rating ?? box.average_rating, 4.7),
		contents: contents.length ? contents : ['Frutas seleccionadas'],
		featured: Boolean(box.featured),
		available: box.available !== false,
		inStock: box.in_stock !== false && stockQuantity > 0,
		stockQuantity
	};
}

function parseNumber(value, fallback = 0) {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveImagePath(path) {
	if (!path) {
		return `${IMAGE_PREFIX}/images/caja/default-box.png`;
	}
	if (/^https?:\/\//i.test(path) || path.startsWith('data:')) {
		return path;
	}
	if (IMAGE_PREFIX && path.startsWith(IMAGE_PREFIX + '/')) {
		return path;
	}
	const normalized = path.startsWith('/') ? path : `/${path}`;
	return `${IMAGE_PREFIX}${normalized}`;
}

function getFallbackBoxes() {
	return [
		{
			id: 101,
			category: 'Frutas Mixtas',
			img: resolveImagePath('/images/caja/caja-mixta.jpg'),
			name: 'Caja Mixta 5kg',
			desc: 'Selección variada de frutas frescas perfectas para compartir en familia.',
			weight: 5,
			priceKg: 8.5,
			totalPrice: 42.5,
			organic: true,
			rating: 4.9,
			contents: ['Manzanas', 'Naranjas', 'Plátanos', 'Peras'],
			featured: true,
			available: true,
			inStock: true,
			stockQuantity: 12
		},
		{
			id: 102,
			category: 'Cítricas',
			img: resolveImagePath('/images/caja/caja-citrica.jpg'),
			name: 'Caja Cítrica 8kg',
			desc: 'Todo el poder de la vitamina C en una combinación refrescante y aromática.',
			weight: 8,
			priceKg: 4.5,
			totalPrice: 36,
			organic: true,
			rating: 4.8,
			contents: ['Naranjas Valencia', 'Limones', 'Mandarinas', 'Pomelos'],
			featured: false,
			available: true,
			inStock: true,
			stockQuantity: 18
		},
		{
			id: 103,
			category: 'Tropicales',
			img: resolveImagePath('/images/caja/caja-tropical.jpg'),
			name: 'Caja Tropical 7kg',
			desc: 'Sabores tropicales intensos ideales para jugos, snacks y recetas creativas.',
			weight: 7,
			priceKg: 9.2,
			totalPrice: 64.4,
			organic: true,
			rating: 4.7,
			contents: ['Piña', 'Mango', 'Papaya', 'Maracuyá'],
			featured: true,
			available: true,
			inStock: true,
			stockQuantity: 9
		},
		{
			id: 104,
			category: 'Desayuno',
			img: resolveImagePath('/images/caja/caja-mixta.jpg'),
			name: 'Caja Desayuno 4kg',
			desc: 'Frutas dulces y balanceadas para iniciar el día con energía y frescura.',
			weight: 4,
			priceKg: 10.75,
			totalPrice: 43,
			organic: false,
			rating: 4.6,
			contents: ['Fresas', 'Uvas', 'Kiwi', 'Banano baby'],
			featured: false,
			available: true,
			inStock: true,
			stockQuantity: 15
		}
	];
}

function setupCart() {
	updateCartDisplay();

	const checkoutBtn = document.getElementById('cartCheckout');
	if (checkoutBtn && !checkoutBtn.dataset.bound) {
		checkoutBtn.dataset.bound = 'true';
		checkoutBtn.addEventListener('click', () => {
			if (cartBoxes.length === 0) {
				showNotification('Tu carrito está vacío', false);
				return;
			}

			if (window.checkoutModalBoxes) {
				window.checkoutModalBoxes.show({ items: cartBoxes });
			} else {
				showNotification('No pudimos abrir el checkout en este momento', false);
			}
		});
	}
}

function addToCart(item) {
	const quantity = Math.max(1, Number(item.quantity) || 1);
	const payload = { ...item, quantity };

	const existing = cartBoxes.find(cartItem => cartItem.id === payload.id);
	if (existing) {
		existing.quantity += quantity;
	} else {
		cartBoxes.push(payload);
	}

	localStorage.setItem('fruvi_cart_boxes', JSON.stringify(cartBoxes));
	updateCartDisplay();

	const itemLabel = quantity > 1 ? `${quantity}x ${item.name}` : item.name;
	showNotification(`${itemLabel} añadido al carrito`, true);
}

function getCartTotals() {
	return cartBoxes.reduce((acc, item) => {
		const qty = Math.max(1, Number(item.quantity) || 1);
		const price = Number(item.price) || 0;
		acc.totalItems += qty;
		acc.totalPrice += price * qty;
		return acc;
	}, { totalItems: 0, totalPrice: 0 });
}

function updateCartDisplay() {
	const countEl = document.getElementById('cartCount');
	const totalEl = document.getElementById('cartTotal');
	const { totalItems, totalPrice } = getCartTotals();

	if (countEl) {
		countEl.textContent = totalItems;
	}
	if (totalEl) {
		totalEl.textContent = `$${totalPrice.toFixed(2)}`;
	}
}

function updateCartItemQuantity(productId, newQuantity) {
	const index = cartBoxes.findIndex(item => item.id === productId);
	if (index === -1) {
		return;
	}

	const safeQuantity = Math.max(0, Number(newQuantity) || 0);
	if (safeQuantity === 0) {
		const removed = cartBoxes.splice(index, 1);
		localStorage.setItem('fruvi_cart_boxes', JSON.stringify(cartBoxes));
		updateCartDisplay();
		if (removed[0]) {
			showNotification(`${removed[0].name} eliminado del carrito`, true);
		}
		return;
	}

	cartBoxes[index].quantity = safeQuantity;
	localStorage.setItem('fruvi_cart_boxes', JSON.stringify(cartBoxes));
	updateCartDisplay();
	showNotification('Cantidad actualizada', true);
}

function removeCartItem(productId) {
	const index = cartBoxes.findIndex(item => item.id === productId);
	if (index === -1) {
		return;
	}

	const [removed] = cartBoxes.splice(index, 1);
	localStorage.setItem('fruvi_cart_boxes', JSON.stringify(cartBoxes));
	updateCartDisplay();
	if (removed) {
		showNotification(`${removed.name} eliminado del carrito`, true);
	}
}

window.updateCartBoxesItemQuantity = updateCartItemQuantity;
window.removeCartBoxesItem = removeCartItem;

function showNotification(message, success = true) {
	const notification = document.createElement('div');
	notification.className = `store-notification ${success ? 'success' : 'error'} glass`;
	notification.innerHTML = `
		<i class="fas ${success ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
		<span>${message}</span>
	`;

	Object.assign(notification.style, {
		position: 'fixed',
		top: '20px',
		right: '20px',
		zIndex: '10000',
		padding: '12px 16px',
		borderRadius: '12px',
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
		fontSize: '14px',
		fontWeight: '500',
		backdropFilter: 'blur(10px)',
		border: '1px solid rgba(255,255,255,0.1)',
		boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
		animation: 'slideInRight 0.3s ease-out'
	});

	document.body.appendChild(notification);

	setTimeout(() => {
		notification.style.animation = 'slideOutRight 0.3s ease-in';
		setTimeout(() => notification.remove(), 300);
	}, 3000);
}

if (!window.getRegistrationBenefits) {
	window.getRegistrationBenefits = () => [
		{ icon: 'fas fa-truck', title: 'Envío Gratis', description: 'Entrega gratuita en pedidos superiores a $50' },
		{ icon: 'fas fa-percentage', title: 'Descuentos Exclusivos', description: 'Hasta 20% de descuento en productos premium' },
		{ icon: 'fas fa-clock', title: 'Entrega Rápida', description: 'Recibe tus frutas frescas en menos de 24 horas' },
		{ icon: 'fas fa-shield-alt', title: 'Garantía de Calidad', description: 'Solo frutas frescas y de la mejor calidad' },
		{ icon: 'fas fa-headset', title: 'Soporte 24/7', description: 'Atención al cliente disponible todo el día' },
		{ icon: 'fas fa-gift', title: 'Regalos Especiales', description: 'Recibe frutas gratis en tu cumpleaños' }
	];
}

if (!window.getUserStatus) {
	window.getUserStatus = async () => ({ isGuest: false });
}

if (!window.getUser) {
	window.getUser = async () => null;
}
