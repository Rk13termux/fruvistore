// 🍃 FRUVI STORE - User Utilities
// Funciones utilitarias para formatear información de usuarios

/**
 * Extrae el primer nombre y primer apellido de un nombre completo
 * @param {string} fullName - Nombre completo del usuario
 * @returns {object} Objeto con firstName, lastName y formatted
 */
export function parseUserName(fullName) {
  if (!fullName || typeof fullName !== 'string') {
    return {
      firstName: '',
      lastName: '',
      formatted: 'Usuario'
    };
  }

  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts[1] || '';
  
  return {
    firstName,
    lastName,
    formatted: firstName + (lastName ? ` ${lastName}` : ''),
    short: firstName || 'Usuario'
  };
}

/**
 * Formatea la información del usuario con emojis fijos
 * @param {object} user - Objeto usuario de Supabase
 * @param {object} options - Opciones de formato
 * @returns {object} Información formateada del usuario
 */
export function formatUserInfo(user, options = {}) {
  if (!user) {
    return {
      displayName: '👤 Usuario Invitado',
      welcomeMessage: '👋 ¡Hola!',
      fullInfo: '👤 Usuario Invitado (ID: guest)'
    };
  }

  const fullName = user.user_metadata?.full_name || user.email || 'Usuario';
  const { firstName, lastName, formatted, short } = parseUserName(fullName);
  const userId = user.id || 'unknown';
  
  // Emojis fijos según el contexto
  const emojis = {
    welcome: '👋',
    user: '👤',
    id: '🆔',
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  const result = {
    // Información básica
    firstName,
    lastName,
    fullName: formatted,
    shortName: short,
    userId,
    email: user.email,
    
    // Formatos de display
    displayName: `${emojis.user} ${formatted}`,
    welcomeMessage: `${emojis.welcome} ¡Hola, ${short}!`,
    fullInfo: `${emojis.user} ${formatted} ${emojis.id} ID: ${userId.substring(0, 8)}...`,
    
    // Para mensajes específicos
    successMessage: (action) => `${emojis.success} ${action} - ${short}`,
    errorMessage: (error) => `${emojis.error} Error: ${error} - ${short}`,
    infoMessage: (info) => `${emojis.info} ${info} - ${short}`,
    warningMessage: (warning) => `${emojis.warning} ${warning} - ${short}`,
    
    // Emojis disponibles
    emojis
  };

  // Opciones personalizadas
  if (options.includeEmail) {
    result.fullInfo += ` 📧 ${user.email}`;
  }
  
  if (options.includeFullId) {
    result.fullInfo = `${emojis.user} ${formatted} ${emojis.id} ${userId}`;
  }

  return result;
}

/**
 * Crea un mensaje de notificación estructurado
 * @param {string} message - Mensaje principal
 * @param {string} type - Tipo de mensaje (success, error, info, warning)
 * @param {object} user - Usuario (opcional)
 * @returns {string} Mensaje formateado con emojis
 */
export function createNotificationMessage(message, type = 'info', user = null) {
  const emojiMap = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
    loading: '⏳',
    cart: '🛒',
    product: '🍎',
    order: '📦',
    user: '👤',
    admin: '🔐'
  };

  const emoji = emojiMap[type] || emojiMap.info;
  let formattedMessage = `${emoji} ${message}`;

  if (user) {
    const userInfo = formatUserInfo(user);
    formattedMessage += ` - ${userInfo.shortName}`;
  }

  return formattedMessage;
}

/**
 * Funciones específicas para diferentes tipos de mensajes
 */
export const MessageTemplates = {
  // Mensajes de carrito
  addToCart: (productName, user) => 
    createNotificationMessage(`${productName} añadido al carrito`, 'cart', user),
  
  removeFromCart: (productName, user) =>
    createNotificationMessage(`${productName} eliminado del carrito`, 'cart', user),
  
  // Mensajes de usuario
  welcomeUser: (user) => {
    const userInfo = formatUserInfo(user);
    return `${userInfo.welcomeMessage} ${userInfo.emojis.id} ID: ${user.id?.substring(0, 8)}...`;
  },
  
  // Mensajes de admin
  adminAction: (action, user) =>
    createNotificationMessage(`${action} realizada`, 'admin', user),
  
  // Mensajes de orden
  orderCreated: (orderId, user) =>
    createNotificationMessage(`Orden #${orderId} creada exitosamente`, 'order', user),
  
  // Mensajes de producto
  productUpdated: (productName, user) =>
    createNotificationMessage(`Producto ${productName} actualizado`, 'product', user)
};

// Hacer disponible globalmente
window.formatUserInfo = formatUserInfo;
window.parseUserName = parseUserName;
window.createNotificationMessage = createNotificationMessage;
window.MessageTemplates = MessageTemplates;