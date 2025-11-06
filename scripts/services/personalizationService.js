// Personalization Service - Manages user-specific recommendations and insights
// Handles individual user profiles, medical insights, and personalized fruit suggestions

import { getUsersClient } from './supabaseService.js';

// Generate personalized fruit recommendations based on user profile
export async function generatePersonalizedRecommendations(userId, userProfile) {
  try {
    const supabaseClient = getUsersClient();
    if (!supabaseClient) throw new Error('Supabase no inicializado');

    const recommendations = [];

    // Base recommendations on health goals
    if (userProfile.health_goals?.includes('weight_loss')) {
      recommendations.push(
        {
          fruit_name: 'Manzana',
          health_reason: 'Baja en calorías, alta en fibra, saciante',
          priority_level: 5,
          recommended_frequency: 'diaria',
          serving_size: '1 manzana mediana',
          expected_benefits: ['Control de apetito', 'Digestión saludable', 'Bajo índice glucémico']
        },
        {
          fruit_name: 'Arándano',
          health_reason: 'Alto contenido de antioxidantes, bajo en azúcar',
          priority_level: 4,
          recommended_frequency: '3x_semana',
          serving_size: '1 taza',
          expected_benefits: ['Antioxidantes', 'Control inflamatorio', 'Apoyo metabólico']
        }
      );
    }

    if (userProfile.health_goals?.includes('immune_system')) {
      recommendations.push(
        {
          fruit_name: 'Kiwi',
          health_reason: 'Rico en vitamina C y enzimas digestivas',
          priority_level: 5,
          recommended_frequency: 'diaria',
          serving_size: '2-3 kiwis',
          expected_benefits: ['Fortalecimiento inmunológico', 'Mejora digestiva', 'Antioxidante']
        },
        {
          fruit_name: 'Papaya',
          health_reason: 'Contiene papaína y vitamina C',
          priority_level: 4,
          recommended_frequency: '3x_semana',
          serving_size: '1/2 papaya',
          expected_benefits: ['Sistema inmune', 'Digestión', 'Antiinflamatorio']
        }
      );
    }

    if (userProfile.health_goals?.includes('digestion')) {
      recommendations.push(
        {
          fruit_name: 'Pera',
          health_reason: 'Alta en fibra soluble e insoluble',
          priority_level: 5,
          recommended_frequency: 'diaria',
          serving_size: '1 pera',
          expected_benefits: ['Regularidad intestinal', 'Fibra dietética', 'Saciedad']
        },
        {
          fruit_name: 'Ciruela',
          health_reason: 'Contiene sorbitol natural, laxante natural',
          priority_level: 4,
          recommended_frequency: '2x_semana',
          serving_size: '2-3 ciruelas',
          expected_benefits: ['Función intestinal', 'Fibra', 'Hidratación']
        }
      );
    }

    // Medical conditions specific recommendations
    if (userProfile.medical_conditions?.includes('diabetes')) {
      recommendations.push(
        {
          fruit_name: 'Frambuesa',
          health_reason: 'Bajo índice glucémico, alta en fibra',
          priority_level: 5,
          recommended_frequency: 'diaria',
          serving_size: '1 taza',
          expected_benefits: ['Control glucémico', 'Fibra', 'Antioxidantes']
        }
      );
    }

    if (userProfile.medical_conditions?.includes('hypertension')) {
      recommendations.push(
        {
          fruit_name: 'Plátano',
          health_reason: 'Rico en potasio, ayuda a regular presión arterial',
          priority_level: 5,
          recommended_frequency: 'diaria',
          serving_size: '1 plátano',
          expected_benefits: ['Control presión arterial', 'Electrolitos', 'Energía']
        }
      );
    }

    if (userProfile.medical_conditions?.includes('anemia')) {
      recommendations.push(
        {
          fruit_name: 'Granada',
          health_reason: 'Contiene hierro y vitamina C para mejor absorción',
          priority_level: 4,
          recommended_frequency: '3x_semana',
          serving_size: '1/2 granada',
          expected_benefits: ['Hierro biodisponible', 'Vitamina C', 'Antioxidantes']
        }
      );
    }

    // Save recommendations to database
    for (const rec of recommendations) {
      await supabaseClient
        .from('personalized_fruit_recommendations')
        .upsert({
          user_id: userId,
          ...rec,
          is_active: true
        }, { onConflict: 'user_id,fruit_name' });
    }

    return recommendations;
  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    throw error;
  }
}

// Analyze user conversation patterns and generate medical insights
export async function analyzeUserPatterns(userId) {
  try {
    const supabaseClient = getUsersClient();
    if (!supabaseClient) return;

    // Get recent conversations
    const { data: conversations } = await supabaseClient
      .from('ai_doctor_conversations')
      .select('message_content, message_metadata, timestamp')
      .eq('user_id', userId)
      .eq('message_type', 'user')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (!conversations || conversations.length === 0) return;

    const insights = [];

    // Analyze symptom patterns
    const symptomKeywords = ['dolor', 'cansado', 'fatiga', 'mareo', 'náusea', 'vómito', 'diarrea', 'estreñimiento', 'dolor cabeza', 'insomnio', 'ansiedad', 'depresión'];
    const mentionedSymptoms = [];

    conversations.forEach(conv => {
      const content = conv.message_content.toLowerCase();
      symptomKeywords.forEach(symptom => {
        if (content.includes(symptom) && !mentionedSymptoms.includes(symptom)) {
          mentionedSymptoms.push(symptom);
        }
      });
    });

    if (mentionedSymptoms.length > 3) {
      insights.push({
        insight_type: 'symptom_pattern',
        insight_title: 'Patrón de síntomas recurrentes',
        insight_description: `Se han mencionado múltiples síntomas: ${mentionedSymptoms.join(', ')}. Recomiendo evaluación médica completa.`,
        confidence_score: 0.8,
        related_fruits: ['Manzana', 'Pera', 'Kiwi'],
        recommended_actions: ['Consultar médico', 'Mantener diario de síntomas', 'Considerar análisis clínicos']
      });
    }

    // Analyze fruit consumption patterns
    const fruitConsumption = {};
    conversations.forEach(conv => {
      if (conv.message_metadata?.fruits_mentioned) {
        conv.message_metadata.fruits_mentioned.forEach(fruit => {
          fruitConsumption[fruit] = (fruitConsumption[fruit] || 0) + 1;
        });
      }
    });

    const favoriteFruits = Object.entries(fruitConsumption)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    if (favoriteFruits.length > 0) {
      insights.push({
        insight_type: 'food_sensitivity',
        insight_title: 'Preferencias alimentarias identificadas',
        insight_description: `Frutas más consumidas: ${favoriteFruits.map(([fruit, count]) => `${fruit} (${count} menciones)`).join(', ')}`,
        confidence_score: 0.9,
        related_fruits: favoriteFruits.map(([fruit]) => fruit),
        recommended_actions: ['Mantener variedad en consumo', 'Rotar frutas para nutrición completa']
      });
    }

    // Save insights to database
    for (const insight of insights) {
      await supabaseClient
        .from('user_medical_insights')
        .insert({
          user_id: userId,
          ...insight
        });
    }

    return insights;
  } catch (error) {
    console.error('Error analyzing user patterns:', error);
  }
}

// Update user nutrition profile from conversation insights
export async function updateProfileFromInsights(userId) {
  try {
    const supabaseClient = getUsersClient();
    if (!supabaseClient) return;

    // Get recent insights
    const { data: insights } = await supabaseClient
      .from('user_medical_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!insights || insights.length === 0) return;

    // Get current profile
    const { data: currentProfile } = await supabaseClient
      .from('user_nutrition_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!currentProfile) return;

    // Update profile based on insights
    const updatedProfile = { ...currentProfile };

    insights.forEach(insight => {
      if (insight.insight_type === 'symptom_pattern') {
        // Add symptoms to medical conditions if not present
        if (!updatedProfile.medical_conditions) {
          updatedProfile.medical_conditions = [];
        }
        // This would require more sophisticated NLP, for now just flag for review
        updatedProfile.needs_medical_review = true;
      }
    });

    // Save updated profile
    await supabaseClient
      .from('user_nutrition_profiles')
      .update(updatedProfile)
      .eq('user_id', userId);

    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile from insights:', error);
  }
}

// Get user's personalized dashboard data
export async function getPersonalizedDashboard(userId) {
  try {
    const supabaseClient = getUsersClient();
    if (!supabaseClient) return null;

    const [
      { data: recommendations },
      { data: insights },
      { data: assessments },
      { data: plans }
    ] = await Promise.all([
      supabaseClient
        .from('personalized_fruit_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('priority_level', { ascending: false }),
      supabaseClient
        .from('user_medical_insights')
        .select('*')
        .eq('user_id', userId)
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(5),
      supabaseClient
        .from('nutrition_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3),
      supabaseClient
        .from('nutrition_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
    ]);

    return {
      recommendations: recommendations || [],
      insights: insights || [],
      recentAssessments: assessments || [],
      activePlan: plans?.[0] || null
    };
  } catch (error) {
    console.error('Error getting personalized dashboard:', error);
    return null;
  }
}

// Create nutrition assessment from user input
export async function createAssessmentFromSymptoms(userId, symptoms, context = '') {
  try {
    const supabaseClient = getUsersClient();
    if (!supabaseClient) throw new Error('Supabase no inicializado');

    const assessmentData = {
      symptoms_reported: symptoms,
      context: context,
      risk_factors: [],
      recommendations: [],
      follow_up_needed: false
    };

    // Analyze symptoms for risk factors
    if (symptoms.includes('fatiga') || symptoms.includes('debilidad')) {
      assessmentData.risk_factors.push('Posible deficiencia nutricional');
      assessmentData.recommendations.push('Evaluar niveles de hierro, vitamina B12, vitamina D');
    }

    if (symptoms.includes('estreñimiento') || symptoms.includes('digestión_lenta')) {
      assessmentData.risk_factors.push('Fibra dietética insuficiente');
      assessmentData.recommendations.push('Aumentar consumo de frutas con fibra: manzana, pera, ciruela');
    }

    if (symptoms.includes('infecciones_frecuentes')) {
      assessmentData.risk_factors.push('Sistema inmune comprometido');
      assessmentData.recommendations.push('Frutas ricas en vitamina C: kiwi, papaya, naranja, brócoli');
    }

    // Save assessment
    const { data, error } = await supabaseClient
      .from('nutrition_assessments')
      .insert({
        user_id: userId,
        assessment_type: 'symptom_analysis',
        assessment_data: assessmentData,
        recommendations: assessmentData.recommendations,
        follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 week follow-up
      })
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error('Error creating assessment from symptoms:', error);
    throw error;
  }
}