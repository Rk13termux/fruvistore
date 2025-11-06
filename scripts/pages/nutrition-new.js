// Nutrition Page with AI Credits System - Personalized Health Dashboard
import { getFruitNutritionJSON, chatCompletionWithHistory } from '../services/groqService.js';
import { calculateBMI, calculateDailyCalories } from '../services/nutritionService.js';
import { getUsersClient } from '../services/supabaseService.js';

export async function renderNutritionPage(root) {
  // Get current user
  let currentUser = null;
  let userCredits = 0;
  let nutritionPlan = null;

  try {
    currentUser = await window.getUser();
    if (currentUser) {
      userCredits = await window.getCreditBalance(currentUser.id);
      nutritionPlan = await loadUserNutritionPlan(currentUser.id);
    }
  } catch (e) {
    console.log('Error loading user data:', e.message);
  }

  root.innerHTML = `
  <!-- Nutrition Dashboard with Credits -->
  <section class="nutrition-dashboard-v2">
    <div class="container">
      
      <!-- Header with Credits Display -->
      <div class="nutrition-header glass-card">
        <div class="header-content">
          <div class="header-title">
            <h1><i class="fas fa-heartbeat"></i> Centro de Nutrición & Salud</h1>
            <p>Tu plan personalizado de alimentación inteligente</p>
          </div>
          <div class="credits-display-nutrition">
            <div class="credits-badge">
              <i class="fas fa-coins"></i>
              <span class="credits-count" id="nutritionCredits">${userCredits}</span>
              <span class="credits-label">créditos</span>
            </div>
            <button class="btn-recharge" id="rechargeBtn" style="display: ${userCredits === 0 ? 'flex' : 'none'}">
              <i class="fab fa-whatsapp"></i>
              Recargar Créditos
            </button>
          </div>
        </div>
        ${userCredits === 0 ? `
        <div class="warning-banner">
          <i class="fas fa-exclamation-triangle"></i>
          <span>Sin créditos disponibles. Recarga para continuar usando el asistente nutricional.</span>
        </div>
        ` : ''}
      </div>

      <!-- Quick Health Stats -->
      <div class="health-stats-grid">
        <div class="stat-card glass-card">
          <div class="stat-icon">
            <i class="fas fa-weight"></i>
          </div>
          <div class="stat-content">
            <h3>BMI</h3>
            <p class="stat-value" id="bmiValue">--</p>
            <p class="stat-label">Índice de Masa Corporal</p>
          </div>
        </div>
        
        <div class="stat-card glass-card">
          <div class="stat-icon">
            <i class="fas fa-fire"></i>
          </div>
          <div class="stat-content">
            <h3>Calorías</h3>
            <p class="stat-value" id="caloriesValue">--</p>
            <p class="stat-label">Requerimiento diario</p>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon">
            <i class="fas fa-clipboard-check"></i>
          </div>
          <div class="stat-content">
            <h3>Plan Activo</h3>
            <p class="stat-value" id="planStatus">${nutritionPlan ? 'Sí' : 'No'}</p>
            <p class="stat-label">Estado del plan</p>
          </div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <h3>Progreso</h3>
            <p class="stat-value" id="progressValue">0%</p>
            <p class="stat-label">Meta de salud</p>
          </div>
        </div>
      </div>

      <!-- Personal Health Calculator -->
      <div class="health-calculator glass-card">
        <h2><i class="fas fa-calculator"></i> Calculadora de Salud</h2>
        <div class="calculator-form">
          <div class="form-row">
            <div class="form-group">
              <label>Peso (kg)</label>
              <input type="number" id="weight" placeholder="70" step="0.1">
            </div>
            <div class="form-group">
              <label>Altura (cm)</label>
              <input type="number" id="height" placeholder="170">
            </div>
            <div class="form-group">
              <label>Edad</label>
              <input type="number" id="age" placeholder="30">
            </div>
            <div class="form-group">
              <label>Género</label>
              <select id="gender">
                <option value="">Seleccionar</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group full-width">
              <label>Nivel de Actividad</label>
              <select id="activity">
                <option value="sedentary">Sedentario (poco o ningún ejercicio)</option>
                <option value="lightly_active">Ligeramente activo (ejercicio 1-3 días/semana)</option>
                <option value="moderately_active">Moderadamente activo (ejercicio 3-5 días/semana)</option>
                <option value="very_active">Muy activo (ejercicio 6-7 días/semana)</option>
                <option value="extremely_active">Extremadamente activo (ejercicio intenso diario)</option>
              </select>
            </div>
          </div>
          <button class="btn-calculate" id="calculateBtn">
            <i class="fas fa-calculator"></i>
            Calcular Mi Perfil
          </button>
        </div>
        <div id="calculatorResults" class="calculator-results" style="display: none;"></div>
      </div>

      <!-- AI Nutrition Assistant -->
      <div class="ai-nutrition-assistant glass-card">
        <h2><i class="fas fa-brain"></i> Asistente Nutricional Inteligente</h2>
        <p class="assistant-intro">Pregunta cualquier cosa sobre nutrición, dietas, batidos personalizados y más. Cada consulta consume 1 crédito.</p>
        
        <div class="chat-interface">
          <div class="messages-container" id="nutritionMessages">
            <div class="welcome-message">
              <div class="ai-avatar">
                <i class="fas fa-apple-alt"></i>
              </div>
              <div class="message-content">
                <p><strong>¡Hola! Soy tu asistente nutricional.</strong></p>
                <p>Puedo ayudarte con:</p>
                <ul>
                  <li>🥤 Recetas de batidos personalizados</li>
                  <li>📋 Planes de dieta adaptados a tus necesidades</li>
                  <li>📊 Análisis nutricional de alimentos</li>
                  <li>💪 Recomendaciones para mejorar tu salud</li>
                  <li>🎯 Metas de peso y composición corporal</li>
                </ul>
                <p>¿En qué puedo ayudarte hoy?</p>
              </div>
            </div>
          </div>

          <div class="input-container">
            <textarea 
              id="nutritionInput" 
              placeholder="Escribe tu pregunta sobre nutrición..." 
              rows="3"
              ${userCredits === 0 ? 'disabled' : ''}
            ></textarea>
            <button 
              class="btn-send" 
              id="sendNutritionBtn"
              ${userCredits === 0 ? 'disabled' : ''}
            >
              <i class="fas fa-paper-plane"></i>
              Enviar (1 crédito)
            </button>
          </div>
        </div>
      </div>

      <!-- Personalized Nutrition Plan Table -->
      <div class="nutrition-plan-table glass-card">
        <div class="table-header">
          <h2><i class="fas fa-clipboard-list"></i> Mi Plan de Nutrición Personalizado</h2>
          <button class="btn-refresh" id="refreshPlanBtn">
            <i class="fas fa-sync-alt"></i>
            Actualizar Plan
          </button>
        </div>

        <div id="nutritionPlanContent">
          ${nutritionPlan ? renderNutritionPlanTable(nutritionPlan) : `
          <div class="empty-plan">
            <i class="fas fa-clipboard"></i>
            <p>Aún no tienes un plan personalizado</p>
            <p class="hint">Usa el asistente nutricional para generar tu plan</p>
          </div>
          `}
        </div>
      </div>

      <!-- Fruit Database Reference -->
      <div class="fruit-database glass-card">
        <h2><i class="fas fa-apple-alt"></i> Base de Datos de Frutas</h2>
        <div class="fruits-grid" id="fruitsGrid">
          <!-- Will be populated dynamically -->
        </div>
      </div>

    </div>
  </section>
  `;

  // Initialize functionality
  initializeNutritionPage(currentUser, userCredits);
}

function renderNutritionPlanTable(plan) {
  return `
    <div class="plan-overview">
      <div class="plan-stat">
        <i class="fas fa-calendar-alt"></i>
        <span>Creado: ${new Date(plan.created_at).toLocaleDateString()}</span>
      </div>
      <div class="plan-stat">
        <i class="fas fa-bullseye"></i>
        <span>Objetivo: ${plan.goal || 'Mejora general'}</span>
      </div>
      <div class="plan-stat">
        <i class="fas fa-clock"></i>
        <span>Duración: ${plan.duration || '30 días'}</span>
      </div>
    </div>

    <div class="plan-sections">
      <!-- Daily Meal Plan -->
      <div class="plan-section">
        <h3><i class="fas fa-utensils"></i> Plan de Comidas Diario</h3>
        <div class="meals-schedule">
          ${plan.meals ? plan.meals.map(meal => `
            <div class="meal-card">
              <div class="meal-time">${meal.time}</div>
              <div class="meal-name">${meal.name}</div>
              <div class="meal-description">${meal.description}</div>
              <div class="meal-calories">${meal.calories} cal</div>
            </div>
          `).join('') : '<p>No hay comidas definidas</p>'}
        </div>
      </div>

      <!-- Personalized Smoothies -->
      <div class="plan-section">
        <h3><i class="fas fa-blender"></i> Batidos Personalizados</h3>
        <div class="smoothies-grid">
          ${plan.smoothies ? plan.smoothies.map(smoothie => `
            <div class="smoothie-card">
              <h4>${smoothie.name}</h4>
              <ul class="ingredients">
                ${smoothie.ingredients.map(ing => `<li>${ing}</li>`).join('')}
              </ul>
              <div class="smoothie-benefits">${smoothie.benefits}</div>
            </div>
          `).join('') : '<p>No hay batidos recomendados</p>'}
        </div>
      </div>

      <!-- Health Improvements -->
      <div class="plan-section">
        <h3><i class="fas fa-chart-line"></i> Mejoras Esperadas</h3>
        <div class="improvements-list">
          ${plan.improvements ? plan.improvements.map(improvement => `
            <div class="improvement-item">
              <div class="improvement-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="improvement-content">
                <h4>${improvement.title}</h4>
                <p>${improvement.description}</p>
                <div class="improvement-timeline">${improvement.timeline}</div>
              </div>
            </div>
          `).join('') : '<p>Usa el asistente para obtener recomendaciones personalizadas</p>'}
        </div>
      </div>

      <!-- Nutrition Tips -->
      <div class="plan-section">
        <h3><i class="fas fa-lightbulb"></i> Consejos Nutricionales</h3>
        <div class="tips-grid">
          ${plan.tips ? plan.tips.map(tip => `
            <div class="tip-card">
              <i class="fas fa-star"></i>
              <p>${tip}</p>
            </div>
          `).join('') : '<p>Solicita consejos al asistente</p>'}
        </div>
      </div>
    </div>
  `;
}

async function loadUserNutritionPlan(userId) {
  try {
    const supabase = await getUsersClient();
    const { data, error } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.log('No nutrition plan found:', error.message);
    return null;
  }
}

async function saveNutritionPlan(userId, planData) {
  try {
    const supabase = await getUsersClient();
    const { data, error } = await supabase
      .from('nutrition_plans')
      .upsert({
        user_id: userId,
        ...planData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving nutrition plan:', error);
    throw error;
  }
}

function initializeNutritionPage(currentUser, userCredits) {
  // Calculator functionality
  const calculateBtn = document.getElementById('calculateBtn');
  calculateBtn?.addEventListener('click', handleCalculate);

  // AI Assistant functionality
  const sendBtn = document.getElementById('sendNutritionBtn');
  const inputField = document.getElementById('nutritionInput');
  
  sendBtn?.addEventListener('click', () => handleNutritionQuery(currentUser, userCredits));
  inputField?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNutritionQuery(currentUser, userCredits);
    }
  });

  // Recharge button
  const rechargeBtn = document.getElementById('rechargeBtn');
  rechargeBtn?.addEventListener('click', showRechargeModal);

  // Refresh plan button
  const refreshPlanBtn = document.getElementById('refreshPlanBtn');
  refreshPlanBtn?.addEventListener('click', () => refreshNutritionPlan(currentUser));

  // Load fruits database
  loadFruitsDatabase();
}

function handleCalculate() {
  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseFloat(document.getElementById('height').value);
  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const activity = document.getElementById('activity').value;

  if (!weight || !height || !age || !gender || !activity) {
    showNotification('Por favor completa todos los campos', 'warning');
    return;
  }

  // Calculate BMI
  const bmiData = calculateBMI(weight, height);
  
  // Calculate Calories
  const caloriesData = calculateDailyCalories(age, gender, weight, height, activity);

  // Update stats
  document.getElementById('bmiValue').textContent = bmiData.bmi;
  document.getElementById('caloriesValue').textContent = `${caloriesData.dailyCalories} kcal`;

  // Show results
  const resultsDiv = document.getElementById('calculatorResults');
  resultsDiv.style.display = 'block';
  resultsDiv.innerHTML = `
    <div class="results-grid">
      <div class="result-card">
        <h4>Tu BMI</h4>
        <p class="result-value">${bmiData.bmi}</p>
        <p class="result-category">${bmiData.category}</p>
        <p class="result-risk">${bmiData.risk}</p>
      </div>
      <div class="result-card">
        <h4>Calorías Diarias</h4>
        <p class="result-value">${caloriesData.dailyCalories} kcal</p>
        <p class="result-detail">TMB: ${caloriesData.bmr} kcal</p>
      </div>
      <div class="result-card">
        <h4>Macronutrientes</h4>
        <p>Proteínas: ${caloriesData.macronutrients.protein_g}g</p>
        <p>Carbohidratos: ${caloriesData.macronutrients.carbs_g}g</p>
        <p>Grasas: ${caloriesData.macronutrients.fat_g}g</p>
      </div>
      <div class="result-card">
        <h4>Peso Ideal</h4>
        <p>${bmiData.idealWeightRange.min}-${bmiData.idealWeightRange.max} kg</p>
      </div>
    </div>
  `;

  showNotification('✓ Cálculos completados', 'success');
}

async function handleNutritionQuery(currentUser, currentCredits) {
  if (!currentUser) {
    showNotification('Debes iniciar sesión para usar el asistente', 'warning');
    return;
  }

  if (currentCredits === 0) {
    showRechargeModal();
    return;
  }

  const inputField = document.getElementById('nutritionInput');
  const query = inputField.value.trim();

  if (!query) return;

  // Add user message to chat
  addMessageToChat('user', query);
  inputField.value = '';

  // Show loading
  const loadingId = addMessageToChat('assistant', 'Analizando tu consulta...', true);

  try {
    // Consume 1 credit
    const newBalance = await window.consumeCredit(currentUser.id, 1, 'Consulta nutricional');
    
    // Update credits display
    document.getElementById('nutritionCredits').textContent = newBalance;
    updateCreditsUI(newBalance);

    // Get AI response
    const context = `Eres un nutricionista experto especializado en frutas y alimentación saludable. 
    Proporciona consejos personalizados, recetas de batidos, planes de dieta y recomendaciones nutricionales.
    Sé específico, práctico y motiv ador. Usa las frutas colombianas cuando sea posible.`;
    
    const response = await chatCompletionWithHistory([
      { role: 'system', content: context },
      { role: 'user', content: query }
    ]);

    // Remove loading and add real response
    removeMessage(loadingId);
    addMessageToChat('assistant', response);

    // Save interaction to history
    await saveNutritionInteraction(currentUser.id, query, response);

    // Check if response contains a plan and extract it
    if (response.toLowerCase().includes('plan') || response.toLowerCase().includes('batido')) {
      // Auto-generate structured plan from AI response
      await generatePlanFromResponse(currentUser.id, query, response);
    }

  } catch (error) {
    removeMessage(loadingId);
    addMessageToChat('assistant', `Error: ${error.message}`, false, true);
    console.error('Error in nutrition query:', error);
  }
}

function addMessageToChat(role, content, isLoading = false, isError = false) {
  const messagesContainer = document.getElementById('nutritionMessages');
  const messageId = `msg-${Date.now()}`;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}-message ${isLoading ? 'loading' : ''} ${isError ? 'error' : ''}`;
  messageDiv.id = messageId;
  
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <i class="fas fa-${role === 'user' ? 'user' : 'apple-alt'}"></i>
    </div>
    <div class="message-content">
      ${isLoading ? '<div class="typing-indicator"><span></span><span></span><span></span></div>' : content}
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  return messageId;
}

function removeMessage(messageId) {
  const message = document.getElementById(messageId);
  if (message) message.remove();
}

async function generatePlanFromResponse(userId, query, response) {
  // This is a simplified extraction - in production you'd use more sophisticated parsing
  const plan = {
    query: query,
    response: response,
    created_at: new Date().toISOString(),
    // Extract structured data from AI response if possible
    meals: extractMeals(response),
    smoothies: extractSmoothies(response),
    improvements: extractImprovements(response),
    tips: extractTips(response)
  };

  await saveNutritionPlan(userId, plan);
  
  // Refresh the plan display
  const planContent = document.getElementById('nutritionPlanContent');
  if (planContent) {
    planContent.innerHTML = renderNutritionPlanTable(plan);
  }
}

function extractMeals(response) {
  // Simple extraction - could be improved with NLP
  const meals = [];
  const lines = response.split('\n');
  // Look for meal patterns
  return meals;
}

function extractSmoothies(response) {
  const smoothies = [];
  // Extract smoothie recipes from response
  return smoothies;
}

function extractImprovements(response) {
  const improvements = [];
  // Extract expected improvements
  return improvements;
}

function extractTips(response) {
  const tips = [];
  // Extract nutrition tips
  return tips;
}

async function saveNutritionInteraction(userId, query, response) {
  try {
    const supabase = await getUsersClient();
    await supabase
      .from('nutrition_interactions')
      .insert({
        user_id: userId,
        query: query,
        response: response,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error saving interaction:', error);
  }
}

function updateCreditsUI(newBalance) {
  const rechargeBtn = document.getElementById('rechargeBtn');
  const inputField = document.getElementById('nutritionInput');
  const sendBtn = document.getElementById('sendNutritionBtn');

  if (newBalance === 0) {
    rechargeBtn.style.display = 'flex';
    inputField.disabled = true;
    sendBtn.disabled = true;
    showRechargeModal();
  }
}

function showRechargeModal() {
  // Create Windows-style modal
  const modal = document.createElement('div');
  modal.className = 'winget-modal';
  modal.innerHTML = `
    <div class="winget-modal-content">
      <div class="winget-header">
        <div class="winget-icon">
          <i class="fas fa-coins"></i>
        </div>
        <div class="winget-title">
          <h3>Créditos Agotados</h3>
          <p>Centro de Nutrición & Salud</p>
        </div>
        <button class="winget-close" onclick="this.closest('.winget-modal').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="winget-body">
        <div class="winget-message">
          <i class="fas fa-info-circle"></i>
          <p>Has utilizado todos tus créditos disponibles.</p>
          <p>Recarga para continuar usando el asistente nutricional inteligente.</p>
        </div>
        
        <div class="winget-packages">
          <div class="package-card">
            <div class="package-name">Paquete Básico</div>
            <div class="package-credits">25 créditos</div>
            <div class="package-price">$10,000 COP</div>
          </div>
          <div class="package-card featured">
            <div class="package-badge">Más Popular</div>
            <div class="package-name">Paquete Pro</div>
            <div class="package-credits">100 créditos</div>
            <div class="package-price">$35,000 COP</div>
          </div>
          <div class="package-card">
            <div class="package-name">Paquete Premium</div>
            <div class="package-credits">250 créditos</div>
            <div class="package-price">$75,000 COP</div>
          </div>
        </div>
      </div>
      
      <div class="winget-footer">
        <button class="winget-btn secondary" onclick="this.closest('.winget-modal').remove()">
          Cancelar
        </button>
        <button class="winget-btn primary" onclick="window.open('https://wa.me/573212345678?text=Hola,%20quiero%20recargar%20créditos%20para%20el%20asistente%20nutricional', '_blank')">
          <i class="fab fa-whatsapp"></i>
          Recargar por WhatsApp
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

async function refreshNutritionPlan(currentUser) {
  if (!currentUser) return;
  
  const plan = await loadUserNutritionPlan(currentUser.id);
  const planContent = document.getElementById('nutritionPlanContent');
  
  if (planContent) {
    if (plan) {
      planContent.innerHTML = renderNutritionPlanTable(plan);
      showNotification('Plan actualizado', 'success');
    } else {
      planContent.innerHTML = `
        <div class="empty-plan">
          <i class="fas fa-clipboard"></i>
          <p>Aún no tienes un plan personalizado</p>
          <p class="hint">Usa el asistente nutricional para generar tu plan</p>
        </div>
      `;
    }
  }
}

function loadFruitsDatabase() {
  const fruitsGrid = document.getElementById('fruitsGrid');
  if (!fruitsGrid) return;

  const fruitData = [
    { name: 'Fresa', emoji: '🍓', calories: 32 },
    { name: 'Kiwi', emoji: '🥝', calories: 61 },
    { name: 'Naranja', emoji: '🍊', calories: 47 },
    { name: 'Mango', emoji: '🥭', calories: 60 },
    { name: 'Arándano', emoji: '🫐', calories: 57 },
    { name: 'Manzana', emoji: '🍎', calories: 52 },
    { name: 'Plátano', emoji: '🍌', calories: 89 },
    { name: 'Uva', emoji: '🍇', calories: 69 },
    { name: 'Piña', emoji: '🍍', calories: 50 },
    { name: 'Cereza', emoji: '🍒', calories: 50 },
    { name: 'Sandía', emoji: '🍉', calories: 30 },
    { name: 'Pera', emoji: '🍐', calories: 57 }
  ];

  fruitsGrid.innerHTML = fruitData.map(fruit => `
    <div class="fruit-card">
      <div class="fruit-emoji">${fruit.emoji}</div>
      <div class="fruit-name">${fruit.name}</div>
      <div class="fruit-calories">${fruit.calories} cal</div>
    </div>
  `).join('');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
