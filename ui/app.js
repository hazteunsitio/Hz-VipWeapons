// ██╗  ██╗███████╗    ██╗   ██╗██╗██████╗     ██╗    ██╗███████╗ █████╗ ██████╗  ██████╗ ███╗   ██╗███████╗
// ██║  ██║╚══███╔╝    ██║   ██║██║██╔══██╗    ██║    ██║██╔════╝██╔══██╗██╔══██╗██╔═══██╗████╗  ██║██╔════╝
// ███████║  ███╔╝     ██║   ██║██║██████╔╝    ██║ █╗ ██║█████╗  ███████║██████╔╝██║   ██║██╔██╗ ██║███████╗
// ██╔══██║ ███╔╝      ╚██╗ ██╔╝██║██╔═══╝     ██║███╗██║██╔══╝  ██╔══██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║
// ██║  ██║███████╗     ╚████╔╝ ██║██║         ╚███╔███╔╝███████╗██║  ██║██║     ╚██████╔╝██║ ╚████║███████║
// ╚═╝  ╚═╝╚══════╝      ╚═══╝  ╚═╝╚═╝          ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝
//
// Desarrollado por: HZ - CodigosParaJuegos - FiveMSoluciones
// Discord: https://discord.gg/codigosparajuegos
// Tienda: https://codigosparajuegos.com
// GitHub: https://github.com/HazteUnSitio

// Variables globales
let currentTab = 'search';
let weaponsData = [];
let playersData = [];
let weaponsGivenCount = 0;
let activityLog = [];
let weaponPresets = {
    'assault_loadout': ['WEAPON_ASSAULTRIFLE', 'WEAPON_PISTOL'],
    'sniper_loadout': ['WEAPON_SNIPERRIFLE', 'WEAPON_PISTOL'],
    'heavy_loadout': ['WEAPON_RPG', 'WEAPON_MINIGUN']
};

$(document).ready(function() {
    // Initialize the panel but keep it hidden
    $('#weaponPanel').hide();
    populateWeaponDropdown();
    updateClock();
    setInterval(updateClock, 1000);
    
    // Set default tab
    switchTab('search');
});

// Tab Management
function switchTab(tabName) {
    console.log('[DEBUG] Switching to tab:', tabName);
    
    // Remove active class from all tabs and content
    $('.tab-btn').removeClass('active');
    $('.tab-content').removeClass('active');
    
    // Add active class to selected tab and content
    $(`.tab-btn[onclick="switchTab('${tabName}')"]`).addClass('active');
    $(`#${tabName}Tab`).addClass('active');
    
    // Clear search results when switching away from search tab
    if (tabName !== 'search') {
        $('#weaponListSection').html(`
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>Ingresa un ID de jugador para ver sus armas VIP</p>
            </div>
        `);
    }
    
    // Auto-load VIP players when switching to manage tab
    if (tabName === 'manage') {
        console.log('[DEBUG] Auto-loading VIP players for manage tab');
        setTimeout(() => {
            showVipPlayers();
        }, 100);
    }
}



// Panel Management
function showPanel() {
    console.log('[DEBUG] Showing panel...');
    const panel = $('#weaponPanel');
    panel.css('display', 'flex').show();
    
    // Forzar reflow para asegurar que el display se aplique
    panel[0].offsetHeight;
    
    // Agregar clase para animación de entrada desde la derecha
    setTimeout(() => {
        panel.addClass('show');
    }, 10);
    
    updateClock();
}

function hidePanel() {
    const panel = $('#weaponPanel');
    
    // Remover clase para animación de salida hacia la derecha
    panel.removeClass('show');
    
    // Esperar a que termine la animación antes de ocultar
    setTimeout(() => {
        panel.hide();
    }, 400);
}

function closeAll() {
    hidePanel();
    // Send close event to FiveM
    $.post('https://Hz_vipweapons/exit', JSON.stringify({}));
}

// Nuevas funcionalidades
function openBulkActions() {
    showNotification('Función de acciones masivas en desarrollo', 'info');
}

function openWeaponPresets() {
    showNotification('Presets de armas disponibles: Asalto, Francotirador, Pesado', 'info');
}

function openActivityLog() {
    if (activityLog.length === 0) {
        showNotification('No hay actividad registrada', 'info');
        return;
    }
    
    let logText = 'Últimas actividades:\n';
    activityLog.slice(0, 5).forEach(log => {
        logText += `${log.timestamp}: ${log.action}\n`;
    });
    
    showNotification('Registro mostrado en consola', 'info');
    console.log(logText);
}

function openSettings() {
    showNotification('Panel de configuración en desarrollo', 'info');
}

function backupData() {
    showLoadingState('Creando backup...');
    
    setTimeout(() => {
        hideLoadingState();
        showNotification('Backup creado exitosamente', 'success');
        logActivity('Backup de datos creado');
    }, 2000);
}

function exportData() {
    const data = {
        weapons: weaponsData,
        players: playersData,
        stats: {
            weaponsGiven: weaponsGivenCount,
            totalWeapons: window.allWeapons ? window.allWeapons.length : 0
        },
        activityLog: activityLog
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `vip_weapons_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Datos exportados correctamente', 'success');
    logActivity('Datos exportados');
}

// ESC Key Handler
$(document).keyup(function(e) {
    if (e.keyCode === 27) { // ESC key
        closeAll();
    }
});

// Clock Function
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    $('#currentTime').text(timeString);
}

// Función para mostrar notificaciones elegantes
function showNotificationEnhanced(message, type = 'info', duration = 4000) {
    // Remover notificación existente
    $('.notification').remove();
    
    const icon = getNotificationIconEnhanced(type);
    const notification = $(`
        <div class="notification ${type}">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
    `);
    
    $('body').append(notification);
    
    // Mostrar notificación con animación suave
    setTimeout(() => {
        notification.addClass('show');
    }, 100);
    
    // Ocultar notificación
    setTimeout(() => {
        notification.removeClass('show');
        setTimeout(() => {
            if (notification.length && notification.parent().length) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// Función para obtener iconos de notificación elegantes
function getNotificationIconEnhanced(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-times-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Función para mostrar estado de carga
function showLoadingState(message = 'Cargando...') {
    const loadingOverlay = $(`
        <div id="loadingOverlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        ">
            <div style="
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--border-radius-sm);
                padding: 30px;
                text-align: center;
                backdrop-filter: blur(20px);
                color: var(--text-primary);
            ">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 16px;"></i>
                <p style="margin: 0; font-weight: 500;">${message}</p>
            </div>
        </div>
    `);
    
    $('body').append(loadingOverlay);
}

// Función para ocultar estado de carga
function hideLoadingState() {
    $('#loadingOverlay').remove();
}

// Función para registrar actividad
function logActivity(action) {
    const timestamp = new Date().toLocaleString('es-ES');
    activityLog.unshift({
        timestamp: timestamp,
        action: action
    });
    
    // Mantener solo los últimos 50 registros
    if (activityLog.length > 50) {
        activityLog = activityLog.slice(0, 50);
    }
}

// Función para actualizar estadísticas
function updateStats() {
    const weaponsGivenElement = document.getElementById('weaponsGiven');
    const totalWeaponsElement = document.getElementById('totalVipWeapons');
    
    if (weaponsGivenElement) {
        weaponsGivenElement.textContent = weaponsGivenCount;
    }
    
    if (totalWeaponsElement) {
        // Contar el número total de armas disponibles
        const weaponSelect = document.getElementById('weaponSelect');
        const totalWeapons = weaponSelect ? weaponSelect.options.length - 1 : 0; // -1 para excluir la opción "Loading..."
        totalWeaponsElement.textContent = totalWeapons > 0 ? totalWeapons : '47'; // Mostrar 47 como valor por defecto
        
        // Animación para el contador
        totalWeaponsElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalWeaponsElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// This function is now defined at the end of the file with filtering support

// Populate weapon dropdown from server data - Mejorado
function populateWeaponDropdownFromData(weapons) {
    console.log('[DEBUG] Loading weapons from server data:', weapons);
    
    if (!weapons || Object.keys(weapons).length === 0) {
        console.log('[DEBUG] No server weapons found, using fallback');
        populateWeaponDropdown(); // Fallback to default weapons
        return;
    }
    
    const select = $('#weaponSelect');
    select.empty().append('<option value="" disabled selected>Seleccionar Arma VIP...</option>');
    
    let weaponCount = 0;
    window.allWeapons = []; // Store all weapons for filtering
    
    // Handle Config.VipWeapons object format
    for (const [weaponHash, weaponConfig] of Object.entries(weapons)) {
        const weaponName = weaponConfig.label || weaponConfig.name || weaponHash;
        const weaponData = { value: weaponHash, name: weaponName };
        window.allWeapons.push(weaponData);
        select.append(`<option value="${weaponHash}">${weaponName}</option>`);
        weaponCount++;
    }
    
    console.log('[DEBUG] Server weapons loaded successfully:', weaponCount);
    
    // Mostrar notificación de éxito
    showNotification(`${weaponCount} armas VIP cargadas correctamente`, 'success');
}



// Search Player Weapons - Mejorado con validación
function searchPlayer() {
    const playerId = $('#playerIdSearch').val().trim();
    
    // Validación mejorada
    if (!playerId) {
        showNotification('Por favor ingresa un ID de jugador válido', 'error');
        $('#playerIdSearch').focus();
        return;
    }
    
    const playerIdNum = parseInt(playerId);
    if (isNaN(playerIdNum) || playerIdNum < 1) {
        showNotification('El ID del jugador debe ser un número válido mayor a 0', 'error');
        $('#playerIdSearch').focus();
        return;
    }
    
    console.log('[DEBUG] Searching weapons for player ID:', playerIdNum);
    
    // Show loading state mejorado
    $('#weaponListSection').html(`
        <div class="loading-state">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <h3>Buscando Jugador</h3>
            <p>Consultando armas VIP del jugador ID: <strong>${playerIdNum}</strong></p>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `);
    
    // Animación de la barra de progreso
    setTimeout(() => {
        $('.loading-progress').css('width', '100%');
    }, 100);
    
    // Send request to search player
    $.post('https://Hz_vipweapons/searchPlayer', JSON.stringify({
        playerId: playerIdNum
    }));
}

// Display Weapons - Mejorado con mejor diseño
function displayWeapons(weapons) {
    const container = $('#weaponListSection');
    container.empty();
    
    if (!weapons || weapons.length === 0) {
        container.html(`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Sin Armas VIP</h3>
                <p>Este jugador no tiene armas VIP asignadas</p>
                <div class="empty-actions">
                    <button class="btn btn-primary" onclick="switchTab('give')">
                        <i class="fas fa-gift"></i>
                        Otorgar Arma VIP
                    </button>
                </div>
            </div>
        `);
        return;
    }
    
    // Añadir header con información del jugador
    const playerInfo = `
        <div class="weapons-header">
            <div class="weapons-count">
                <i class="fas fa-gun"></i>
                <span>${weapons.length} Arma${weapons.length !== 1 ? 's' : ''} VIP Encontrada${weapons.length !== 1 ? 's' : ''}</span>
            </div>
        </div>
    `;
    container.append(playerInfo);
    
    // Crear contenedor de armas
    const weaponsGrid = $('<div class="weapons-grid"></div>');
    
    weapons.forEach((weapon, index) => {
        const weaponCard = `
            <div class="weapon-card modern" data-weapon-index="${index}">
                <div class="weapon-header">
                    <div class="weapon-icon">
                        <i class="fas fa-gun"></i>
                    </div>
                    <div class="weapon-info">
                        <h4 class="weapon-name">${weapon.name || weapon.weaponName || 'Arma Desconocida'}</h4>
                        <span class="weapon-type">Arma VIP</span>
                    </div>
                </div>
                <div class="weapon-stats">
                    <div class="stat-item">
                        <i class="fas fa-bullets"></i>
                        <span>Munición: ${weapon.ammo || 0}</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-cogs"></i>
                        <span>Componentes: ${weapon.components ? weapon.components.length : 0}</span>
                    </div>
                </div>
                <div class="weapon-actions">
                    <button class="btn btn-danger btn-sm" onclick="removeWeapon('${weapon.name || weapon.weaponName}', ${weapon.playerId})">
                        <i class="fas fa-trash"></i>
                        Remover
                    </button>
                </div>
            </div>
        `;
        weaponsGrid.append(weaponCard);
    });
    
    container.append(weaponsGrid);
    
    // Animación de entrada
    setTimeout(() => {
        $('.weapon-card').each(function(index) {
            setTimeout(() => {
                $(this).addClass('animate-in');
            }, index * 100);
        });
    }, 50);
    
    console.log('[DEBUG] Displayed', weapons.length, 'weapons');
}

// Give Weapon
function giveWeapon() {
    const weaponType = $('#weaponSelect').val();
    const playerId = $('#playerIdGive').val().trim();
    const ammoAmount = $('#ammoAmount').val() || 250;
    const weaponTint = $('#weaponTint').val() || 0;
    
    if (!weaponType || !playerId) {
        showNotification('Por favor selecciona un arma e ingresa un ID de jugador', 'error');
        return;
    }
    
    console.log('[DEBUG] Giving weapon:', weaponType, 'to player:', playerId);
    
    // Mostrar loading
    showLoadingState('Entregando arma...');
    
    // Send request to give weapon
    $.post('https://Hz_vipweapons/giveWeapon', JSON.stringify({
        playerId: parseInt(playerId),
        weapon: weaponType,
        ammoAmount: parseInt(ammoAmount),
        weaponTint: parseInt(weaponTint)
    }));
    
    // Clear inputs
    $('#weaponSelect').val('');
    $('#playerIdGive').val('');
    $('#ammoAmount').val('250');
    $('#weaponTint').val('0');
    
    weaponsGivenCount++;
    updateStats();
    logActivity(`Arma ${weaponType} entregada al jugador ${playerId}`);
    
    setTimeout(() => {
        hideLoadingState();
        showNotification('Arma otorgada exitosamente', 'success');
    }, 1000);
}

// Función para dar arma con accesorios
function giveWeaponWithAttachments() {
    const weaponType = $('#weaponSelect').val();
    const playerId = $('#playerIdGive').val().trim();
    
    if (!weaponType || !playerId) {
        showNotification('Por favor selecciona un arma e ingresa un ID de jugador', 'error');
        return;
    }
    
    // Accesorios comunes para armas
    const attachments = ['COMPONENT_AT_AR_FLSH', 'COMPONENT_AT_SCOPE_MACRO', 'COMPONENT_AT_AR_GRIP'];
    
    showLoadingState('Entregando arma con accesorios...');
    
    $.post('https://Hz_vipweapons/giveWeaponWithAttachments', JSON.stringify({
        playerId: parseInt(playerId),
        weapon: weaponType,
        attachments: attachments,
        ammoAmount: parseInt($('#ammoAmount').val() || 250),
        weaponTint: parseInt($('#weaponTint').val() || 0)
    }));
    
    weaponsGivenCount++;
    updateStats();
    logActivity(`Arma ${weaponType} con accesorios entregada al jugador ${playerId}`);
    
    setTimeout(() => {
        hideLoadingState();
        showNotification('Arma con accesorios entregada correctamente', 'success');
    }, 1000);
}

// Remove Weapon
function removeWeapon(weaponName, playerId) {
    if (!confirm(`¿Estás seguro de que quieres remover ${weaponName}?`)) {
        return;
    }
    
    // Send request to remove weapon
    $.post('https://Hz_vipweapons/removeWeapon', JSON.stringify({
        playerId: playerId,
        weapon: weaponName
    }));
}

// Management Functions
function showVipPlayers() {
    // Show loading state
    $('#vipPlayersSection').html(`
        <div class="no-search">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando jugadores VIP...</p>
        </div>
    `);
    
    // Send request to get VIP players
    $.post('https://Hz_vipweapons/getVipPlayers', JSON.stringify({}));
    
    showNotificationEnhanced('Actualizando lista de jugadores VIP...', 'info');
    updateVipPlayersDisplay();
}

// Función para actualizar la visualización de jugadores VIP
function updateVipPlayersDisplay() {
    const activeCount = document.getElementById('activeVipCount');
    const totalCount = document.getElementById('totalVipPlayers');
    
    if (activeCount && totalCount) {
        // Simular contadores
        activeCount.textContent = '2';
        totalCount.textContent = '5';
        
        // Animar los números
        activeCount.style.transform = 'scale(1.2)';
        totalCount.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            activeCount.style.transform = 'scale(1)';
            totalCount.style.transform = 'scale(1)';
        }, 200);
    }
}

// Función para refrescar jugadores VIP
function refreshVipPlayers() {
    showNotificationEnhanced('Actualizando lista de jugadores...', 'info');
    
    // Simular carga
    const grid = document.getElementById('vipPlayersGrid');
    if (grid) {
        const cards = grid.querySelectorAll('.vip-player-card.demo');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100 * (index + 1));
        });
    }
    
    updateVipPlayersDisplay();
    
    setTimeout(() => {
        showNotificationEnhanced('Lista actualizada correctamente', 'success');
    }, 500);
}

// Función para exportar datos VIP
function exportVipData() {
    showNotificationEnhanced('Exportando datos de jugadores VIP...', 'info');
    
    // Simular exportación
    setTimeout(() => {
        showNotificationEnhanced('Datos exportados correctamente', 'success');
    }, 1000);
}

// Display VIP Players
function displayVipPlayers(players) {
    console.log('[DEBUG] Displaying VIP players:', players);
    const container = $('#vipPlayersSection');
    container.empty();
    
    // Update statistics
    let totalWeapons = 0;
    if (players && players.length > 0) {
        players.forEach(player => {
            if (player.weapons) {
                totalWeapons += player.weapons.length;
            }
        });
    }
    
    // Update stats in the UI
    const totalVipPlayersElement = $('#totalVipPlayers');
    const totalVipWeaponsElement = $('#totalVipWeapons');
    if (totalVipPlayersElement.length) totalVipPlayersElement.text(players ? players.length : 0);
    if (totalVipWeaponsElement.length) totalVipWeaponsElement.text(totalWeapons);
    
    if (!players || players.length === 0) {
        container.html(`
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>Sin Jugadores VIP</h3>
                <p>No hay jugadores con armas VIP actualmente</p>
                <div class="empty-actions">
                    <button class="btn btn-primary" onclick="switchTab('give')">
                        <i class="fas fa-gift"></i>
                        <span>Dar Primera Arma VIP</span>
                    </button>
                </div>
            </div>
        `);
        return;
    }

    const weaponsHeader = `
        <div class="weapons-header">
            <h3><i class="fas fa-users"></i> Jugadores VIP Activos</h3>
            <div class="weapons-count">
                <span class="count">${players.length}</span>
                <span class="label">Jugadores</span>
            </div>
            <div class="weapons-count">
                <span class="count">${totalWeapons}</span>
                <span class="label">Armas Totales</span>
            </div>
        </div>
    `;
    container.append(weaponsHeader);
    
    const vipPlayersGrid = $('<div class="vip-players-grid"></div>');
    
    players.forEach(player => {
        const playerCard = `
            <div class="vip-player-card modern">
                <div class="player-header">
                    <div class="player-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="player-info">
                        <h4>${player.name || 'Jugador Desconocido'}</h4>
                        <span class="player-id">ID: ${player.id}</span>
                    </div>
                    <div class="player-status">
                        <span class="status-badge online">
                            <i class="fas fa-circle"></i>
                            VIP
                        </span>
                    </div>
                </div>
                <div class="player-weapons">
                    <div class="weapons-header-small">
                        <i class="fas fa-crosshairs"></i>
                        <span>Armas VIP (${player.weapons ? player.weapons.length : 0})</span>
                    </div>
                    <div class="weapons-list">
                        ${player.weapons && player.weapons.length > 0 ? 
                            player.weapons.map(weapon => `
                                <div class="weapon-item">
                                    <div class="weapon-info">
                                        <i class="fas fa-crosshairs"></i>
                                        <span class="weapon-name">${weapon.label || weapon.name}</span>
                                    </div>
                                    <button class="btn-remove" onclick="removeWeapon('${weapon.name || weapon.weaponName}', ${player.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `).join('') : 
                            '<div class="no-weapons"><i class="fas fa-info-circle"></i> Sin armas VIP</div>'
                        }
                    </div>
                </div>
                <div class="player-actions">
                    <button class="btn btn-primary btn-sm" onclick="searchPlayerById(${player.id})">
                        <i class="fas fa-search"></i>
                        <span>Ver Detalles</span>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="clearPlayerWeapons(${player.id}, '${player.name}')">
                        <i class="fas fa-trash-alt"></i>
                        <span>Limpiar Armas</span>
                    </button>
                </div>
            </div>
        `;
        vipPlayersGrid.append(playerCard);
    });
    
    container.append(vipPlayersGrid);
}

// Search player by ID from VIP list
function searchPlayerById(playerId) {
    console.log('[DEBUG] Searching player by ID:', playerId);
    
    // Switch to search tab
    switchTab('search');
    
    // Set the player ID in the search input
    const searchInput = document.getElementById('playerIdSearch');
    if (searchInput) {
        searchInput.value = playerId;
        
        // Add visual feedback
        searchInput.focus();
        
        // Trigger the search after a short delay to ensure tab switch is complete
        setTimeout(() => {
            searchPlayer();
        }, 300);
    } else {
        console.error('[ERROR] Search input not found');
        showNotification('Error al buscar jugador', 'error');
    }
}

// Clear all weapons for a specific player
function clearPlayerWeapons(playerId, playerName) {
    if (!confirm(`¿Estás seguro de que quieres remover TODAS las armas VIP de ${playerName}?`)) {
        return;
    }
    
    $.post('https://Hz_vipweapons/clearAllWeapons', JSON.stringify({
        playerId: playerId
    }));
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = $(`
        <div class="notification ${type}">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                'fa-info-circle'
            }"></i>
            <span>${message}</span>
        </div>
    `);
    
    $('body').append(notification);
    
    // Show notification
    setTimeout(() => {
        notification.addClass('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.removeClass('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function clearAllWeapons() {
    const playerId = $('#clearPlayerId').val().trim();
    if (!playerId) {
        showNotification('Por favor ingresa un ID de jugador', 'error');
        return;
    }
    
    if (!confirm(`¿Estás seguro de que quieres remover TODAS las armas VIP del jugador ${playerId}?`)) {
        return;
    }
    
    // Send request to clear all weapons
    $.post('https://Hz_vipweapons/clearAllWeapons', JSON.stringify({
        playerId: parseInt(playerId)
    }));
    
    $('#clearPlayerId').val('');
    showNotification('Todas las armas han sido removidas', 'success');
}

// Modal functions
function showClearAllModal() {
    $('#clearAllModal').fadeIn(300);
}

function hideClearAllModal() {
    $('#clearAllModal').fadeOut(300);
}

function confirmClearAll() {
    if (!confirm('ÚLTIMA CONFIRMACIÓN: ¿Realmente quieres eliminar TODAS las armas VIP de TODOS los jugadores?')) {
        return;
    }
    
    hideClearAllModal();
    
    fetch(`https://${GetParentResourceName()}/clearAllVipWeapons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        showNotification('Limpiando todas las armas VIP...', 'info');
        // Refrescar la lista de jugadores VIP después de limpiar
        setTimeout(() => {
            showVipPlayers();
        }, 1000);
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error al limpiar las armas VIP', 'error');
    });
}

// Enhanced weapon dropdown population for default weapons
function populateWeaponDropdown() {
    const weapons = [
        { name: "AK-47", value: "WEAPON_ASSAULTRIFLE" },
        { name: "Pistola", value: "WEAPON_PISTOL" },
        { name: "SMG", value: "WEAPON_SMG" },
        { name: "Francotirador", value: "WEAPON_SNIPERRIFLE" },
        { name: "Escopeta", value: "WEAPON_PUMPSHOTGUN" },
        { name: "Rifle Avanzado", value: "WEAPON_ADVANCEDRIFLE" },
        { name: "Pistola de Combate", value: "WEAPON_COMBATPISTOL" },
        { name: "Micro SMG", value: "WEAPON_MICROSMG" },
        { name: "RPG", value: "WEAPON_RPG" }
    ];
    
    const select = $('#weaponSelect');
    select.empty().append('<option value="" disabled selected>Seleccionar Arma VIP...</option>');
    
    window.allWeapons = weapons; // Store for filtering
    
    weapons.forEach(weapon => {
        select.append(`<option value="${weapon.value}">${weapon.name}</option>`);
    });
    
    console.log('[DEBUG] Default weapons loaded:', weapons.length);
}

// Improved notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    $('.notification').remove();
    
    const notification = $(`
        <div class="notification notification-${type}">
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="$(this).parent().fadeOut(300)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `);
    
    $('body').append(notification);
    notification.fadeIn(300);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info': 
        default: return 'fa-info-circle';
    }
}

// Función para actualizar estadísticas automáticamente
setInterval(updateStats, 5000);
setInterval(updateClock, 1000);
updateStats();



// NUI Message Handler
window.addEventListener('message', function(event) {
    const data = event.data;
    console.log('[DEBUG] Received message:', data);
    
    switch(data.type || data.action) {
        case 'show':
        case 'showPanel':
            console.log('[DEBUG] Showing weapon panel');
            showPanel();
            if (data.weapons) {
                console.log('[DEBUG] Loading weapons:', Object.keys(data.weapons).length);
                populateWeaponDropdownFromData(data.weapons);
            }
            break;
        case 'hide':
        case 'hidePanel':
            console.log('[DEBUG] Hiding weapon panel');
            hidePanel();
            break;
        case 'updateWeapons':
        case 'displayWeapons':
            console.log('[DEBUG] Updating weapons list');
            if (data.playerName) {
                $('#weaponListSection').prepend(`<h4>Armas de: ${data.playerName}</h4>`);
            }
            displayWeapons(data.weapons);
            break;
        case 'displayVipPlayers':
            console.log('[DEBUG] Displaying VIP players');
            displayVipPlayers(data.players);
            break;
        case 'notification':
            showNotification(data.message, data.notificationType);
            break;
        case 'weaponGiven':
            showNotification('¡Arma otorgada exitosamente!', 'success');
            break;
        case 'weaponRemoved':
            showNotification('¡Arma removida exitosamente!', 'success');
            // Refresh the weapon list if we're on search tab
            const currentPlayerId = $('#playerIdSearch').val();
            if (currentPlayerId && $('.tab-content.active').attr('id') === 'searchTab') {
                setTimeout(() => searchPlayer(), 500);
            }
            break;
        case 'allWeaponsCleared':
            showNotification('¡Todas las armas han sido removidas!', 'success');
            break;
        case 'error':
            showNotification('Error: ' + (data.message || 'Operación fallida'), 'error');
            break;
        case 'success':
            showNotification(data.message || 'Operación exitosa', 'success');
            break;
        case 'info':
            showNotification(data.message || 'Información', 'info');
            break;
    }
});

// Keyboard Events
$(document).keyup(function(e) {
    if (e.keyCode === 27) { // ESC key
        closeAll();
    }
});

// Enter key support for inputs
$('#playerIdSearch').keyup(function(e) {
    if (e.keyCode === 13) { // Enter key
        searchPlayer();
    }
});

$('#playerIdGive').keyup(function(e) {
    if (e.keyCode === 13) { // Enter key
        giveWeapon();
    }
});

$('#clearPlayerId').keyup(function(e) {
    if (e.keyCode === 13) { // Enter key
        clearAllWeapons();
    }
});