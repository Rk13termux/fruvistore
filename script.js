// Import required services
import './scripts/services/supabaseService.js';
import './scripts/services/groqService.js';

// Global Variables
let currentStep = 1;
const totalSteps = 3;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupRegistrationForm();
    setupAIAssistant();
    setupMobileMenu();
}

// Mobile Menu Setup
function setupMobileMenu() {
    // Create mobile navigation HTML if it doesn't exist
    if (!document.querySelector('.mobile-nav')) {
        createMobileNavigation();
    }
    
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    
    // Open mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.add('active');
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Create mobile navigation HTML
function createMobileNavigation() {
    const body = document.body;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    
    // Create mobile nav
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    
    // Get navigation links from desktop menu
    const desktopNavLinks = document.querySelectorAll('.nav-links a');
    let navLinksHTML = '';
    
    desktopNavLinks.forEach(link => {
        const href = link.getAttribute('href') || '#';
        const text = link.textContent;
        const isActive = link.classList.contains('active') ? 'active' : '';
        navLinksHTML += `<a href="${href}" class="${isActive}">${text}</a>`;
    });
    
    mobileNav.innerHTML = `
        <div class="mobile-nav-header">
            <div class="logo">
                <img src="/images/logo.png" alt="Fruvi" class="logo-mark" style="width: 32px; height: 32px;">
                <span>Fruvi</span>
            </div>
            <button class="mobile-nav-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <nav class="mobile-nav-links">
            ${navLinksHTML}
        </nav>
    `;
    
    body.appendChild(overlay);
    body.appendChild(mobileNav);
}

// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // SPA route
            if (href.startsWith('#/')) {
                e.preventDefault();
                window.location.hash = href;
                return;
            }
            // Anchor scroll
            e.preventDefault();
            const targetId = href.substring(1);
            scrollToSection(targetId);
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            addToCart(productName);
        });
    });
}

// Add to Cart Function
function addToCart(productName) {
    showNotification(`${productName} añadido al carrito`, 'success');
    
    // Here you can implement actual cart functionality
    console.log(`Producto añadido: ${productName}`);
}

// Registration Form Setup
function setupRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', handleRegistrationSubmit);
    }
}

// Step Navigation
function nextStep(stepNumber) {
    if (validateCurrentStep()) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.getElementById(`step${stepNumber}`).classList.add('active');
        currentStep = stepNumber;
    }
}

function prevStep(stepNumber) {
    const current = document.getElementById(`step${currentStep}`);
    const target = document.getElementById(`step${stepNumber}`);
    if (current && target) {
        current.classList.remove('active');
        target.classList.add('active');
        currentStep = stepNumber;
    }
}

// Form Validation
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            showNotification(`Por favor, completa el campo ${field.previousElementSibling.textContent}`, 'error');
            field.focus();
            return false;
        }
        
        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                field.focus();
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel') {
            const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(field.value)) {
                showNotification('Por favor, ingresa un teléfono válido', 'error');
                field.focus();
                return false;
            }
        }
    }
    
    return true;
}

// Handle Registration Submit
async function handleRegistrationSubmit(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    const formData = new FormData(e.target);
    const userData = {
        full_name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        zip_code: formData.get('zipCode'),
        frequency: formData.get('frequency'),
        favorite_fruits: formData.getAll('fruits'),
        created_at: new Date().toISOString()
    };
    
    try {
        if (supabase) {
            // Save to Supabase
            const { data, error } = await supabase
                .from('customers')
                .insert([userData]);
            
            if (error) {
                throw error;
            }
            
            showNotification('¡Registro exitoso! Bienvenido a FreshFruits', 'success');
            e.target.reset();
            currentStep = 1;
            document.getElementById('step3').classList.remove('active');
            document.getElementById('step1').classList.add('active');
            
        } else {
            // Fallback: Save to localStorage
            const customers = JSON.parse(localStorage.getItem('freshfruits_customers') || '[]');
            customers.push(userData);
            localStorage.setItem('freshfruits_customers', JSON.stringify(customers));
            
            showNotification('¡Registro exitoso! (Datos guardados localmente)', 'success');
            e.target.reset();
            currentStep = 1;
            document.getElementById('step3').classList.remove('active');
            document.getElementById('step1').classList.add('active');
        }
        
    } catch (error) {
        console.error('Error en el registro:', error);
        showNotification('Error en el registro. Por favor, intenta nuevamente.', 'error');
    }
}

// AI Assistant Setup
function setupAIAssistant() {
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.focus();
    }
}

// Send Message to AI Assistant
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        let response;
        // Always try Groq first using the service
        response = await window.chatCompletion(message);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add AI response to chat
        addMessageToChat(response, 'bot');
        
    } catch (error) {
        console.error('Groq error:', error);
        try {
            // Fallback to local rule-based assistant
            const fallback = await generateAIResponse(message);
            removeTypingIndicator();
            addMessageToChat(fallback, 'bot');
        } catch (e) {
            removeTypingIndicator();
            addMessageToChat('Lo siento, tuve un problema al procesar tu pregunta. Por favor, intenta nuevamente.', 'bot');
        }
    }
}

// Groq service is now handled by groqService.js - function removed to avoid duplication

// Generate AI Response using local rule-based assistant
async function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simple rule-based responses
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuanto')) {
        return 'Nuestros precios varían según la fruta y la temporada. Las manzanas cuestan $2.50/kg, plátanos $1.80/kg, naranjas $2.00/kg, y fresas $4.50/kg. ¿Te interesa alguna fruta en particular?';
    }
    
    if (lowerMessage.includes('comprar') || lowerMessage.includes('pedido') || lowerMessage.includes('compra')) {
        return 'Para comprar nuestras frutas, primero necesitas registrarte en nuestro sistema. Una vez registrado, podrás realizar pedidos y recibir entregas a domicilio. ¿Deseas registrarte ahora?';
    }
    
    if (lowerMessage.includes('entrega') || lowerMessage.includes('envio') || lowerMessage.includes('domicilio')) {
        return 'Ofrecemos entregas a domicilio en toda la ciudad. El tiempo de entrega es de 24-48 horas después de realizar tu pedido. Los costos de envío varían según tu ubicación.';
    }
    
    if (lowerMessage.includes('nutricion') || lowerMessage.includes('nutriente') || lowerMessage.includes('salud')) {
        return 'Nuestras frutas son excelentes para la salud. Por ejemplo, las naranjas son ricas en vitamina C, los plátanos en potasio, y las manzanas en fibra. Puedes ver nuestra tabla nutricional completa en la sección de nutrición.';
    }
    
    if (lowerMessage.includes('fresca') || lowerMessage.includes('calidad') || lowerMessage.includes('origen')) {
        return 'Todas nuestras frutas son 100% frescas, cosechadas diariamente en nuestros propios cultivos. Trabajamos directamente con agricultores locales para garantizar la máxima calidad y frescura.';
    }
    
    if (lowerMessage.includes('registro') || lowerMessage.includes('cuenta') || lowerMessage.includes('registrarme')) {
        return 'Para registrarte, ve a la sección de registro y completa el formulario en 3 sencillos pasos. Necesitamos tu información personal, dirección de entrega, y preferencias de frutas. ¡Es rápido y fácil!';
    }
    
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos dias') || lowerMessage.includes('buenas tardes')) {
        return '¡Hola! Bienvenido a FreshFruits. Estoy aquí para ayudarte con cualquier pregunta sobre nuestras frutas, precios, o cómo realizar tus compras. ¿En qué puedo ayudarte hoy?';
    }
    
    if (lowerMessage.includes('gracias') || lowerMessage.includes('agradecido')) {
        return '¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas, no dudes en consultarme. ¡Que tengas un excelente día!';
    }
    
    // Default response
    return 'Gracias por tu pregunta. Soy un asistente especializado en frutas FreshFruits. Puedo ayudarte con información sobre precios, nutrición, cómo comprar, registro, y más. ¿Podrías reformular tu pregunta o ser más específico?';
}

// Add Message to Chat
function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const icon = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    messageDiv.innerHTML = `
        ${icon}
        <p>${message}</p>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show Typing Indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <i class="fas fa-robot"></i>
        <p>Escribiendo<span class="loading"></span></p>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove Typing Indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Handle Enter Key in Chat
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Show Notification
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}-message`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Position notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.maxWidth = '400px';
    
    // Animate in
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Utility Functions
function getCurrentDate() {
    return new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Initialize Supabase Schema (for reference)
/*
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    frequency TEXT DEFAULT 'ocasional',
    favorite_fruits TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/
