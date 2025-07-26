// Datos de productos
const products = [
    {
        id: 1,
        name: "Agua Mineral Premium",
        description: "Agua mineral natural de manantial, pureza garantizada para tu hidratación diaria.",
        price: "$2.50",
        image: "💧",
        whatsappMessage: "Hola! Me interesa el Agua Mineral Premium de $2.50"
    },
    {
        id: 2,
        name: "Jugo de Naranja Natural",
        description: "Jugo 100% natural exprimido de naranjas frescas, sin conservantes artificiales.",
        price: "$4.99",
        image: "🍊",
        whatsappMessage: "Hola! Me interesa el Jugo de Naranja Natural de $4.99"
    },
    {
        id: 3,
        name: "Refresco de Cola",
        description: "El clásico sabor de cola que todos aman, perfecto para cualquier momento.",
        price: "$3.25",
        image: "🥤",
        whatsappMessage: "Hola! Me interesa el Refresco de Cola de $3.25"
    },
    {
        id: 4,
        name: "Cerveza Artesanal",
        description: "Cerveza artesanal premium con sabor único y proceso de elaboración tradicional.",
        price: "$6.75",
        image: "🍺",
        whatsappMessage: "Hola! Me interesa la Cerveza Artesanal de $6.75"
    },
    {
        id: 5,
        name: "Café Frío Especialidad",
        description: "Café premium preparado en frío, ideal para los amantes del café con un toque especial.",
        price: "$5.50",
        image: "☕",
        whatsappMessage: "Hola! Me interesa el Café Frío Especialidad de $5.50"
    },
    {
        id: 6,
        name: "Smoothie de Frutas",
        description: "Deliciosa mezcla de frutas tropicales, rico en vitaminas y sabor natural.",
        price: "$7.25",
        image: "🥤",
        whatsappMessage: "Hola! Me interesa el Smoothie de Frutas de $7.25"
    },
    {
        id: 7,
        name: "Té Helado de Limón",
        description: "Refrescante té helado con un toque cítrico de limón, perfecto para el verano.",
        price: "$3.75",
        image: "🍋",
        whatsappMessage: "Hola! Me interesa el Té Helado de Limón de $3.75"
    },
    {
        id: 8,
        name: "Bebida Energética",
        description: "Potente bebida energética para darte el impulso que necesitas en tu día.",
        price: "$4.50",
        image: "⚡",
        whatsappMessage: "Hola! Me interesa la Bebida Energética de $4.50"
    }
];

// Configuración de WhatsApp
const WHATSAPP_NUMBER = "1234567890"; // Cambia por tu número real

// Función para generar URL de WhatsApp
function generateWhatsAppURL(message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

// Función para crear una tarjeta de producto
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
                <a href="${generateWhatsAppURL(product.whatsappMessage)}" 
                   class="whatsapp-btn" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    <i class="fab fa-whatsapp"></i>
                    Comprar por WhatsApp
                </a>
            </div>
        </div>
    `;
}

// Función para renderizar todos los productos
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) {
        console.error('Contenedor de productos no encontrado');
        return;
    }

    container.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Agregar animación escalonada
    const productCards = container.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Función para manejar errores de carga de imágenes
function handleImageErrors() {
    const images = document.querySelectorAll('.product-image img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            this.parentElement.innerHTML = '🥤'; // Emoji por defecto
        });
    });
}

// Función para animaciones de scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar las tarjetas de productos
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease-out';
                observer.observe(card);
            });
        }, 100);
    });
}

// Función para manejar clics en botones de WhatsApp
function handleWhatsAppClicks() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.whatsapp-btn')) {
            // Agregar efecto visual al hacer clic
            const btn = e.target.closest('.whatsapp-btn');
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1.05)';
            }, 100);
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

// Función para mejorar la experiencia móvil
function initMobileOptimizations() {
    // Prevenir zoom en inputs en iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
        }
    }

    // Mejorar el comportamiento de hover en dispositivos táctiles
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// Función principal de inicialización
function init() {
    renderProducts();
    handleImageErrors();
    initScrollAnimations();
    handleWhatsAppClicks();
    initMobileOptimizations();
    
    console.log('BebidaShop inicializado correctamente');
    console.log(`${products.length} productos cargados`);
}

// Event listeners
document.addEventListener('DOMContentLoaded', init);

// Manejar errores globales
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
});

// Exportar funciones para uso en consola (debugging)
window.BebidaShop = {
    products,
    generateWhatsAppURL,
    renderProducts,
    init
};