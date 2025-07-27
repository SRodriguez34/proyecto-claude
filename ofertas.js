/**
 * Módulo de Ofertas y Combos - BebidaShop
 * Sistema profesional para gestión de promociones con integración preparada para Supabase
 */

class OfertasManager {
    constructor() {
        this.ofertas = [];
        this.combos = [];
        this.configuracion = {};
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.isLoading = false;
        
        // Configuración para futura integración con Supabase
        this.supabaseConfig = {
            enabled: false,
            url: process.env.SUPABASE_URL || '',
            key: process.env.SUPABASE_ANON_KEY || '',
            table_ofertas: 'ofertas',
            table_combos: 'combos'
        };
        
        this.init();
    }

    async init() {
        try {
            await this.cargarDatos();
            this.renderizarOfertas();
            this.configurarEventListeners();
            this.inicializarAnimaciones();
            console.log('✅ Módulo de Ofertas inicializado correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar módulo de ofertas:', error);
            this.mostrarError('Error al cargar las ofertas. Por favor, intenta nuevamente.');
        }
    }

    async cargarDatos() {
        this.mostrarLoader(true);
        
        try {
            // Por ahora carga desde JSON local, preparado para Supabase
            if (this.supabaseConfig.enabled) {
                await this.cargarDesdeSupabase();
            } else {
                await this.cargarDesdeJSON();
            }
        } catch (error) {
            throw new Error(`Error al cargar datos: ${error.message}`);
        } finally {
            this.mostrarLoader(false);
        }
    }

    async cargarDesdeJSON() {
        try {
            const response = await fetch('./ofertas.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.ofertas = data.ofertas || [];
            this.combos = data.combos || [];
            this.configuracion = data.configuracion || {};
            
            console.log(`📦 Cargadas ${this.ofertas.length} ofertas y ${this.combos.length} combos`);
        } catch (error) {
            throw new Error(`Error al cargar JSON: ${error.message}`);
        }
    }

    // Método preparado para futura integración con Supabase
    async cargarDesdeSupabase() {
        // TODO: Implementar cuando se conecte Supabase
        console.log('🔄 Preparado para cargar desde Supabase...');
        /*
        const { data: ofertas, error: errorOfertas } = await supabase
            .from(this.supabaseConfig.table_ofertas)
            .select('*')
            .eq('activo', true);
            
        const { data: combos, error: errorCombos } = await supabase
            .from(this.supabaseConfig.table_combos)
            .select('*')
            .eq('activo', true);
            
        if (errorOfertas || errorCombos) {
            throw new Error('Error al conectar con Supabase');
        }
        
        this.ofertas = ofertas || [];
        this.combos = combos || [];
        */
    }

    renderizarOfertas() {
        const container = document.getElementById('ofertas-container');
        if (!container) {
            console.error('❌ Contenedor de ofertas no encontrado');
            return;
        }

        // Renderizar sección de ofertas individuales
        const ofertasDestacadas = this.ofertas.filter(oferta => oferta.destacado);
        const ofertasHTML = this.generarHTMLOfertas(ofertasDestacadas);
        
        // Renderizar sección de combos
        const combosDestacados = this.combos.filter(combo => combo.destacado);
        const combosHTML = this.generarHTMLCombos(combosDestacados);

        container.innerHTML = `
            <div class="ofertas-header">
                <h2 class="ofertas-title">🔥 Ofertas Especiales</h2>
                <p class="ofertas-subtitle">Aprovecha estos descuentos por tiempo limitado</p>
            </div>
            
            <div class="ofertas-individuales">
                <h3 class="seccion-title">Productos en Oferta</h3>
                <div class="ofertas-grid">
                    ${ofertasHTML}
                </div>
            </div>
            
            <div class="combos-section">
                <h3 class="seccion-title">Combos y Packs Especiales</h3>
                <div class="combos-grid">
                    ${combosHTML}
                </div>
            </div>
        `;

        this.aplicarAnimacionesEntrada();
    }

    generarHTMLOfertas(ofertas) {
        return ofertas.map(oferta => {
            const ahorro = oferta.precio_original - oferta.precio_oferta;
            const estrellas = this.generarEstrellas(oferta.rating);
            
            return `
                <div class="oferta-card" data-id="${oferta.id}" data-tipo="individual">
                    <div class="oferta-badge">-${oferta.descuento}%</div>
                    ${oferta.badge ? `<div class="oferta-tag">${oferta.badge}</div>` : ''}
                    
                    <div class="oferta-imagen">
                        <span class="producto-emoji">${oferta.imagen}</span>
                    </div>
                    
                    <div class="oferta-info">
                        <div class="oferta-marca">${oferta.marca}</div>
                        <h4 class="oferta-nombre">${oferta.nombre}</h4>
                        <p class="oferta-descripcion">${oferta.descripcion}</p>
                        
                        <div class="oferta-rating">
                            ${estrellas}
                            <span class="rating-count">(${oferta.reviews})</span>
                        </div>
                        
                        <div class="oferta-precios">
                            <span class="precio-original">${this.formatearPrecio(oferta.precio_original)}</span>
                            <span class="precio-oferta">${this.formatearPrecio(oferta.precio_oferta)}</span>
                            <span class="ahorro-badge">Ahorras ${this.formatearPrecio(ahorro)}</span>
                        </div>
                        
                        <div class="oferta-stock">
                            <span class="stock-indicator ${oferta.stock < 10 ? 'stock-bajo' : ''}">
                                ${oferta.stock < 10 ? '⚠️ Últimas unidades' : `✅ ${oferta.stock} disponibles`}
                            </span>
                        </div>
                        
                        <button class="btn-agregar-carrito" onclick="ofertasManager.agregarAlCarrito('${oferta.id}', 'individual')">
                            <i class="fas fa-shopping-cart"></i>
                            Agregar al Carrito
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    generarHTMLCombos(combos) {
        return combos.map(combo => {
            const estrellas = this.generarEstrellas(combo.rating);
            
            return `
                <div class="combo-card" data-id="${combo.id}" data-tipo="combo">
                    <div class="combo-badge">-${combo.descuento}%</div>
                    ${combo.badge ? `<div class="combo-tag">${combo.badge}</div>` : ''}
                    
                    <div class="combo-imagen">
                        <span class="combo-emoji">${combo.imagen}</span>
                    </div>
                    
                    <div class="combo-info">
                        <h4 class="combo-nombre">${combo.nombre}</h4>
                        <p class="combo-descripcion">${combo.descripcion}</p>
                        
                        <div class="combo-productos">
                            <h5>Incluye:</h5>
                            <ul>
                                ${combo.productos.map(producto => `<li>${producto}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="combo-rating">
                            ${estrellas}
                            <span class="rating-count">(${combo.reviews})</span>
                        </div>
                        
                        <div class="combo-precios">
                            <span class="precio-original">${this.formatearPrecio(combo.precio_original)}</span>
                            <span class="precio-oferta">${this.formatearPrecio(combo.precio_oferta)}</span>
                            <div class="ahorro-destacado">
                                <span>💰 Ahorras ${this.formatearPrecio(combo.ahorro)}</span>
                            </div>
                        </div>
                        
                        <div class="combo-stock">
                            <span class="stock-indicator ${combo.stock < 5 ? 'stock-bajo' : ''}">
                                ${combo.stock < 5 ? '⚠️ Pocas unidades' : `✅ ${combo.stock} disponibles`}
                            </span>
                        </div>
                        
                        <button class="btn-agregar-carrito combo-btn" onclick="ofertasManager.agregarAlCarrito('${combo.id}', 'combo')">
                            <i class="fas fa-shopping-cart"></i>
                            Agregar Combo al Carrito
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    generarEstrellas(rating) {
        const estrellasLlenas = Math.floor(rating);
        const tieneMediaEstrella = rating % 1 !== 0;
        let estrellas = '';
        
        for (let i = 0; i < estrellasLlenas; i++) {
            estrellas += '<i class="fas fa-star"></i>';
        }
        
        if (tieneMediaEstrella) {
            estrellas += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const estrellasVacias = 5 - Math.ceil(rating);
        for (let i = 0; i < estrellasVacias; i++) {
            estrellas += '<i class="far fa-star"></i>';
        }
        
        return `<div class="rating-stars">${estrellas} <span class="rating-number">${rating}</span></div>`;
    }

    formatearPrecio(precio) {
        const simbolo = this.configuracion.simbolo_moneda || '$';
        return `${simbolo}${precio.toFixed(2)}`;
    }

    agregarAlCarrito(id, tipo) {
        let producto;
        
        if (tipo === 'individual') {
            producto = this.ofertas.find(oferta => oferta.id === id);
        } else if (tipo === 'combo') {
            producto = this.combos.find(combo => combo.id === id);
        }
        
        if (!producto) {
            console.error('❌ Producto no encontrado:', id);
            return;
        }

        // Verificar stock
        if (producto.stock <= 0) {
            this.mostrarNotificacion('❌ Producto sin stock', 'error');
            return;
        }

        // Verificar si ya está en el carrito
        const itemExistente = this.carrito.find(item => item.id === id);
        
        if (itemExistente) {
            if (itemExistente.cantidad < producto.stock) {
                itemExistente.cantidad++;
            } else {
                this.mostrarNotificacion('⚠️ Stock máximo alcanzado', 'warning');
                return;
            }
        } else {
            this.carrito.push({
                id: producto.id,
                tipo: tipo,
                nombre: producto.nombre,
                precio: producto.precio_oferta,
                imagen: producto.imagen,
                cantidad: 1,
                stock_disponible: producto.stock
            });
        }

        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.mostrarNotificacion(`✅ ${producto.nombre} agregado al carrito`, 'success');
        
        // Efecto visual en el botón
        this.animarBotonAgregado(id);
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }

    actualizarContadorCarrito() {
        const contador = document.querySelector('.carrito-contador');
        if (contador) {
            const totalItems = this.carrito.reduce((total, item) => total + item.cantidad, 0);
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    animarBotonAgregado(id) {
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) {
            const boton = card.querySelector('.btn-agregar-carrito');
            boton.classList.add('btn-agregado');
            setTimeout(() => {
                boton.classList.remove('btn-agregado');
            }, 1000);
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <span>${mensaje}</span>
            <button class="cerrar-notificacion">&times;</button>
        `;
        
        // Agregar al DOM
        document.body.appendChild(notificacion);
        
        // Mostrar con animación
        setTimeout(() => notificacion.classList.add('mostrar'), 100);
        
        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }, 3000);
        
        // Botón cerrar
        notificacion.querySelector('.cerrar-notificacion').addEventListener('click', () => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        });
    }

    mostrarLoader(mostrar) {
        const loader = document.getElementById('ofertas-loader');
        if (loader) {
            loader.style.display = mostrar ? 'flex' : 'none';
        }
    }

    mostrarError(mensaje) {
        const container = document.getElementById('ofertas-container');
        if (container) {
            container.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <h3>Error al cargar ofertas</h3>
                    <p>${mensaje}</p>
                    <button class="btn-reintentar" onclick="ofertasManager.init()">
                        <i class="fas fa-redo"></i>
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    configurarEventListeners() {
        // Listener para cambios de ventana (responsive)
        window.addEventListener('resize', this.debounce(() => {
            this.ajustarLayoutResponsive();
        }, 250));
        
        // Intersection Observer para animaciones lazy
        this.configurarObservadorInterseccion();
    }

    configurarObservadorInterseccion() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar cards cuando se rendericen
        setTimeout(() => {
            document.querySelectorAll('.oferta-card, .combo-card').forEach(card => {
                observer.observe(card);
            });
        }, 500);
    }

    aplicarAnimacionesEntrada() {
        const cards = document.querySelectorAll('.oferta-card, .combo-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    inicializarAnimaciones() {
        // Configurar animaciones CSS personalizadas
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulseCart {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .btn-agregado {
                animation: pulseCart 0.3s ease-in-out;
                background-color: #22c55e !important;
            }
            
            .animate-in {
                animation: slideInUp 0.6s ease-out;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    ajustarLayoutResponsive() {
        const container = document.getElementById('ofertas-container');
        if (!container) return;
        
        const width = window.innerWidth;
        
        if (width < 768) {
            container.classList.add('mobile-layout');
        } else {
            container.classList.remove('mobile-layout');
        }
    }

    // Utility function para debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Métodos públicos para integración externa
    obtenerCarrito() {
        return this.carrito;
    }

    limpiarCarrito() {
        this.carrito = [];
        this.guardarCarrito();
        this.actualizarContadorCarrito();
    }

    obtenerTotalCarrito() {
        return this.carrito.reduce((total, item) => {
            return total + (item.precio * item.cantidad);
        }, 0);
    }

    // Método para refresh manual de datos
    async refrescarOfertas() {
        await this.cargarDatos();
        this.renderizarOfertas();
    }
}

// Inicializar cuando el DOM esté listo
let ofertasManager;

document.addEventListener('DOMContentLoaded', () => {
    ofertasManager = new OfertasManager();
});

// Exportar para uso global
window.OfertasManager = OfertasManager;
window.ofertasManager = ofertasManager;