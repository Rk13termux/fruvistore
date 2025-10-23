// Telegram Web App Utilities

/**
 * Detecta si la app está corriendo dentro de Telegram
 */
export function isTelegramWebApp() {
  return !!(window.Telegram && window.Telegram.WebApp);
}

/**
 * Obtiene los datos de inicio de Telegram
 */
export function getTelegramInitData() {
  const tgData = sessionStorage.getItem('tg_data');
  if (tgData) {
    try {
      // Decodificar los datos de Telegram
      const params = new URLSearchParams(tgData);
      return {
        queryId: params.get('query_id'),
        user: params.get('user') ? JSON.parse(params.get('user')) : null,
        authDate: params.get('auth_date'),
        hash: params.get('hash'),
        raw: tgData
      };
    } catch (error) {
      console.error('Error al parsear datos de Telegram:', error);
      return null;
    }
  }
  return null;
}

/**
 * Obtiene la versión de Telegram Web App
 */
export function getTelegramVersion() {
  return sessionStorage.getItem('tg_version') || 
         (window.Telegram?.WebApp?.version) || 
         null;
}

/**
 * Configura el botón principal de Telegram
 */
export function setupTelegramMainButton(text, onClick) {
  if (isTelegramWebApp()) {
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.text = text;
    mainButton.show();
    mainButton.onClick(onClick);
  }
}

/**
 * Oculta el botón principal de Telegram
 */
export function hideTelegramMainButton() {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.MainButton.hide();
  }
}

/**
 * Expande la app a pantalla completa en Telegram
 */
export function expandTelegramApp() {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.expand();
  }
}

/**
 * Cierra la app de Telegram
 */
export function closeTelegramApp() {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.close();
  }
}

/**
 * Establece el color de fondo del header en Telegram
 */
export function setTelegramHeaderColor(color) {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.setHeaderColor(color);
  }
}

/**
 * Establece el color de fondo en Telegram
 */
export function setTelegramBackgroundColor(color) {
  if (isTelegramWebApp()) {
    window.Telegram.WebApp.setBackgroundColor(color);
  }
}

/**
 * Inicializa la integración con Telegram
 */
export function initTelegramWebApp() {
  if (isTelegramWebApp()) {
    console.log('🤖 Inicializando Telegram Web App');
    
    // Expandir a pantalla completa
    expandTelegramApp();
    
    // Establecer colores del tema
    setTelegramBackgroundColor('#000000');
    setTelegramHeaderColor('#000000');
    
    // Indicar que la app está lista
    window.Telegram.WebApp.ready();
    
    console.log('✅ Telegram Web App inicializado');
    console.log('Usuario de Telegram:', getTelegramInitData()?.user);
    console.log('Versión:', getTelegramVersion());
    
    return true;
  }
  
  console.log('ℹ️ No se detectó Telegram Web App');
  return false;
}

// Auto-inicializar cuando se carga el módulo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTelegramWebApp);
} else {
  initTelegramWebApp();
}
