// Versión simplificada para debugging
console.log('🔄 Iniciando módulo de ofertas...');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 DOM cargado, iniciando ofertas...');
    
    const container = document.getElementById('ofertas-container');
    if (!container) {
        console.error('❌ No se encontró el contenedor ofertas-container');
        return;
    }
    
    try {
        // Cargar datos del JSON
        console.log('📦 Cargando ofertas.json...');
        const response = await fetch('./ofertas.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Datos cargados:', data);
        
        const ofertas = data.ofertas || [];
        const combos = data.combos || [];
        
        console.log(`📊 ${ofertas.length} ofertas y ${combos.length} combos encontrados`);
        
        // Generar HTML simple
        let html = `
            <div class="ofertas-header">
                <h2 class="ofertas-title">🔥 Ofertas Especiales</h2>
                <p class="ofertas-subtitle">Aprovecha estos descuentos por tiempo limitado</p>
            </div>
            
            <div class="ofertas-individuales">
                <h3 class="seccion-title">Productos en Oferta</h3>
                <div class="ofertas-grid">
        `;
        
        // Agregar ofertas destacadas
        const ofertasDestacadas = ofertas.filter(oferta => oferta.destacado);
        console.log(`⭐ ${ofertasDestacadas.length} ofertas destacadas`);
        
        ofertasDestacadas.forEach(oferta => {
            const ahorro = oferta.precio_original - oferta.precio_oferta;
            html += `
                <div class="oferta-card" data-id="${oferta.id}">
                    <div class="oferta-badge">-${oferta.descuento}%</div>
                    <div class="oferta-tag">${oferta.badge}</div>
                    
                    <div class="oferta-imagen">
                        <span class="producto-emoji">${oferta.imagen}</span>
                    </div>
                    
                    <div class="oferta-info">
                        <div class="oferta-marca">${oferta.marca}</div>
                        <h4 class="oferta-nombre">${oferta.nombre}</h4>
                        <p class="oferta-descripcion">${oferta.descripcion}</p>
                        
                        <div class="oferta-rating">
                            <div class="rating-stars">
                                ${'★'.repeat(Math.floor(oferta.rating))} 
                                <span class="rating-number">${oferta.rating}</span>
                            </div>
                            <span class="rating-count">(${oferta.reviews})</span>
                        </div>
                        
                        <div class="oferta-precios">
                            <span class="precio-original">$${oferta.precio_original.toFixed(2)}</span>
                            <span class="precio-oferta">$${oferta.precio_oferta.toFixed(2)}</span>
                            <span class="ahorro-badge">Ahorras $${ahorro.toFixed(2)}</span>
                        </div>
                        
                        <div class="oferta-stock">
                            <span class="stock-indicator">
                                ${oferta.stock < 10 ? '⚠️ Últimas unidades' : `✅ ${oferta.stock} disponibles`}
                            </span>
                        </div>
                        
                        <button class="btn-agregar-carrito" onclick="agregarSimple('${oferta.id}')">
                            🛒 Agregar al Carrito
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
            
            <div class="combos-section">
                <h3 class="seccion-title">Combos y Packs Especiales</h3>
                <div class="combos-grid">
        `;
        
        // Agregar combos destacados
        const combosDestacados = combos.filter(combo => combo.destacado);
        console.log(`📦 ${combosDestacados.length} combos destacados`);
        
        combosDestacados.forEach(combo => {
            html += `
                <div class="combo-card" data-id="${combo.id}">
                    <div class="combo-badge">-${combo.descuento}%</div>
                    <div class="combo-tag">${combo.badge}</div>
                    
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
                            <div class="rating-stars">
                                ${'★'.repeat(Math.floor(combo.rating))} 
                                <span class="rating-number">${combo.rating}</span>
                            </div>
                            <span class="rating-count">(${combo.reviews})</span>
                        </div>
                        
                        <div class="combo-precios">
                            <span class="precio-original">$${combo.precio_original.toFixed(2)}</span>
                            <span class="precio-oferta">$${combo.precio_oferta.toFixed(2)}</span>
                            <div class="ahorro-destacado">
                                <span>💰 Ahorras $${combo.ahorro.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div class="combo-stock">
                            <span class="stock-indicator">
                                ${combo.stock < 5 ? '⚠️ Pocas unidades' : `✅ ${combo.stock} disponibles`}
                            </span>
                        </div>
                        
                        <button class="btn-agregar-carrito combo-btn" onclick="agregarSimple('${combo.id}')">
                            🛒 Agregar Combo al Carrito
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        // Insertar HTML
        container.innerHTML = html;
        console.log('✅ HTML insertado correctamente');
        
        // Agregar animaciones
        setTimeout(() => {
            const cards = container.querySelectorAll('.oferta-card, .combo-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
        
    } catch (error) {
        console.error('❌ Error al cargar ofertas:', error);
        container.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h3>Error al cargar ofertas</h3>
                <p>Error: ${error.message}</p>
                <button class="btn-reintentar" onclick="location.reload()">
                    🔄 Reintentar
                </button>
            </div>
        `;
    }
});

// Función simple para agregar al carrito
function agregarSimple(id) {
    console.log('🛒 Agregando al carrito:', id);
    
    // Mostrar notificación simple
    const notificacion = document.createElement('div');
    notificacion.innerHTML = '✅ Producto agregado al carrito';
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #22c55e;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}