// Nutrition Service - Advanced nutritional analysis and personalized recommendations
// Handles user profiles, nutritional calculations, and personalized plans

import { getUsersClient } from './supabaseService.js';

// Calculate BMI and nutritional status
export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category, risk;
  if (bmi < 18.5) {
    category = 'Bajo peso';
    risk = 'Riesgo nutricional bajo';
  } else if (bmi < 25) {
    category = 'Peso normal';
    risk = 'Riesgo mínimo';
  } else if (bmi < 30) {
    category = 'Sobrepeso';
    risk = 'Riesgo moderado';
  } else {
    category = 'Obesidad';
    risk = 'Riesgo alto';
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    risk,
    idealWeightRange: {
      min: Math.round(18.5 * heightM * heightM),
      max: Math.round(24.9 * heightM * heightM)
    }
  };
}

// Calculate daily caloric needs using Mifflin-St Jeor equation
export function calculateDailyCalories(age, gender, weightKg, heightCm, activityLevel) {
  if (!age || !gender || !weightKg || !heightCm) return null;

  // Basal Metabolic Rate (BMR)
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  };

  const multiplier = activityMultipliers[activityLevel] || 1.2;
  const dailyCalories = Math.round(bmr * multiplier);

  return {
    bmr: Math.round(bmr),
    dailyCalories,
    activityMultiplier: multiplier,
    macronutrients: {
      protein_g: Math.round(dailyCalories * 0.15 / 4), // 15% of calories from protein
      carbs_g: Math.round(dailyCalories * 0.55 / 4),   // 55% of calories from carbs
      fat_g: Math.round(dailyCalories * 0.30 / 9)      // 30% of calories from fat
    }
  };
}

// Analyze nutritional deficiencies based on reported symptoms and habits
export function analyzeNutritionalDeficiencies(symptoms, diet, medicalConditions) {
  const deficiencies = [];
  const recommendations = [];

  // Vitamin C deficiency indicators
  if (symptoms.includes('fatiga') || symptoms.includes('debilidad') ||
      symptoms.includes('encías_sangrantes') || !diet.includes('cítricos')) {
    deficiencies.push({
      nutrient: 'Vitamina C',
      symptoms: ['Fatiga', 'Debilidad', 'Encías sangrantes', 'Sistema inmune débil'],
      sources: ['Naranja', 'Limón', 'Kiwi', 'Papaya', 'Brócoli', 'Pimiento rojo'],
      dailyDose: '75-90 mg'
    });
    recommendations.push('Aumentar consumo de frutas cítricas y verduras frescas');
  }

  // Iron deficiency indicators
  if (symptoms.includes('fatiga') || symptoms.includes('debilidad') ||
      symptoms.includes('palidez') || symptoms.includes('uñas_frágiles')) {
    deficiencies.push({
      nutrient: 'Hierro',
      symptoms: ['Fatiga', 'Palidez', 'Uñas frágiles', 'Dificultad para concentrarse'],
      sources: ['Espinacas', 'Lentejas', 'Carne roja magra', 'Quinoa', 'Frutas secas'],
      dailyDose: '18 mg (mujeres), 8 mg (hombres)'
    });
    recommendations.push('Consumir alimentos ricos en hierro junto con vitamina C');
  }

  // Fiber deficiency indicators
  if (symptoms.includes('estreñimiento') || symptoms.includes('digestión_lenta') ||
      !diet.includes('fibra')) {
    deficiencies.push({
      nutrient: 'Fibra',
      symptoms: ['Estreñimiento', 'Digestión lenta', 'Hinchazón'],
      sources: ['Manzana con cáscara', 'Pera', 'Frambuesas', 'Brócoli', 'Avena'],
      dailyDose: '25-30 g'
    });
    recommendations.push('Aumentar consumo de frutas con cáscara y verduras');
  }

  // Omega-3 deficiency indicators
  if (symptoms.includes('sequedad_piel') || symptoms.includes('inflamación') ||
      symptoms.includes('problemas_concentración')) {
    deficiencies.push({
      nutrient: 'Omega-3',
      symptoms: ['Piel seca', 'Inflamación', 'Problemas de concentración'],
      sources: ['Salmón', 'Nueces', 'Semillas de chía', 'Aceite de linaza'],
      dailyDose: '1-3 g EPA+DHA'
    });
    recommendations.push('Incluir pescados grasos o suplementos de omega-3');
  }

  return { deficiencies, recommendations };
}

// Create personalized nutrition plan based on user profile
export async function createPersonalizedNutritionPlan(userProfile, goals, preferences) {
  const plan = {
    dailyCalories: 0,
    macronutrients: {},
    fruitRecommendations: [],
    mealSuggestions: [],
    exerciseRecommendations: [],
    supplements: [],
    monitoring: []
  };

  // Calculate caloric needs
  if (userProfile.age && userProfile.weight_kg && userProfile.height_cm) {
    const calories = calculateDailyCalories(
      userProfile.age,
      userProfile.gender,
      userProfile.weight_kg,
      userProfile.height_cm,
      userProfile.activity_level || 'moderately_active'
    );

    if (calories) {
      plan.dailyCalories = calories.dailyCalories;
      plan.macronutrients = calories.macronutrients;
    }
  }

  // Fruit recommendations based on goals
  if (goals.includes('weight_loss')) {
    plan.fruitRecommendations = [
      'Manzana (baja en calorías, alta en fibra)',
      'Frambuesa (muy baja en azúcar)',
      'Arándano (antioxidantes, saciedad)',
      'Pomelo (quema grasa, bajo índice glucémico)',
      'Kiwi (alto en vitamina C, bajo en calorías)'
    ];
  } else if (goals.includes('energy_boost')) {
    plan.fruitRecommendations = [
      'Plátano (energía rápida, potasio)',
      'Mango (carbohidratos naturales)',
      'Papaya (digestión, energía)',
      'Uva (glucosa natural)',
      'Naranja (vitamina C, energía)'
    ];
  } else if (goals.includes('immune_system')) {
    plan.fruitRecommendations = [
      'Kiwi (vitamina C, vitamina K)',
      'Papaya (vitamina C, enzimas digestivas)',
      'Frambuesa (antioxidantes, vitamina C)',
      'Arándano (antocianinas, vitamina C)',
      'Naranja (vitamina C, flavonoides)'
    ];
  }

  // Meal suggestions
  plan.mealSuggestions = [
    {
      meal: 'Desayuno',
      suggestion: 'Batido verde con espinacas, plátano, arándanos y yogurt griego',
      fruits: ['Plátano', 'Arándanos'],
      benefits: 'Energía sostenible, antioxidantes, probióticos'
    },
    {
      meal: 'Merienda mañana',
      suggestion: 'Manzana con almendras y una taza de té verde',
      fruits: ['Manzana'],
      benefits: 'Fibra, grasas saludables, antioxidantes'
    },
    {
      meal: 'Almuerzo',
      suggestion: 'Ensalada de quinoa con fresas, nueces y aderezo de limón',
      fruits: ['Fresas'],
      benefits: 'Proteína completa, vitamina C, ácidos grasos omega-3'
    },
    {
      meal: 'Merienda tarde',
      suggestion: 'Yogurt con kiwi y semillas de chía',
      fruits: ['Kiwi'],
      benefits: 'Vitamina C, calcio, fibra'
    },
    {
      meal: 'Cena',
      suggestion: 'Salmón al horno con brócoli y papaya fresca',
      fruits: ['Papaya'],
      benefits: 'Proteína de calidad, enzimas digestivas, vitamina C'
    }
  ];

  // Exercise recommendations
  if (userProfile.activity_level === 'sedentary') {
    plan.exerciseRecommendations = [
      'Caminar 30 minutos diarios a ritmo moderado',
      'Ejercicios de fuerza 2 veces por semana',
      'Yoga o pilates 2-3 veces por semana',
      'Estiramientos diarios de 10 minutos'
    ];
  } else if (userProfile.activity_level === 'moderately_active') {
    plan.exerciseRecommendations = [
      'Ejercicio cardiovascular 45 minutos, 4 veces por semana',
      'Entrenamiento de fuerza 3 veces por semana',
      'Actividades recreativas como bailar o nadar',
      'Ejercicios de flexibilidad y equilibrio'
    ];
  }

  return plan;
}

// Save nutrition assessment
export async function saveNutritionAssessment(userId, assessmentData) {
  try {
    const supabaseClient = getUsersClient();

    const { data, error } = await supabaseClient
      .from('nutrition_assessments')
      .insert({
        user_id: userId,
        assessment_type: assessmentData.type || 'general',
        assessment_data: assessmentData,
        recommendations: assessmentData.recommendations || [],
        follow_up_date: assessmentData.followUpDate
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error saving nutrition assessment:', error);
    throw error;
  }
}

// Get user's nutrition history
export async function getNutritionHistory(userId) {
  try {
    const supabaseClient = getUsersClient();

    const { data, error } = await supabaseClient
      .from('nutrition_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting nutrition history:', error);
    return [];
  }
}

// Update user nutrition profile
export async function updateNutritionProfile(userId, profileData) {
  try {
    const supabaseClient = getUsersClient();

    const { data, error } = await supabaseClient
      .from('user_nutrition_profiles')
      .upsert({
        user_id: userId,
        ...profileData
      }, { onConflict: 'user_id' })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating nutrition profile:', error);
    throw error;
  }
}

// Get user nutrition profile
export async function getNutritionProfile(userId) {
  try {
    const supabaseClient = getUsersClient();

    const { data, error } = await supabaseClient
      .from('user_nutrition_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error('Error getting nutrition profile:', error);
    return null;
  }
}