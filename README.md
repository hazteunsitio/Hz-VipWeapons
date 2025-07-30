# Hz VIP Weapons - Sistema de Armas VIP para FiveM

![HZ Logo](https://img.shields.io/badge/Desarrollado%20por-HZ%20CodigosParaJuegos-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Framework](https://img.shields.io/badge/Framework-ESX-red?style=for-the-badge)

www.hazteunsitio.net
## 📋 Descripción

Hz VIP Weapons es un sistema completo de gestión de armas VIP para servidores FiveM que utiliza el framework ESX. Este script permite a los administradores gestionar armas especiales para jugadores VIP, incluyendo funcionalidades de guardado de loadouts, personalización de armas y un panel administrativo completo.

**Desarrollado por:** HZ - CodigosParaJuegos - FiveMSoluciones

## 🌟 Características Principales

### ✨ Sistema VIP
- **Gestión de permisos VIP** mediante metadatos de jugador
- **Verificación automática** de estado VIP
- **Sistema de permisos ACE** para administradores
- **Integración completa con ESX**

### 🔫 Gestión de Armas
- **Menú interactivo** para spawneo de armas VIP
- **Sistema de attachments** y personalización
- **Recarga automática** de munición
- **Eliminación selectiva** de armas
- **Limpieza completa** de inventario de armas

### 💾 Sistema de Loadouts
- **Guardado automático** de configuraciones de armas
- **Múltiples loadouts** por jugador
- **Carga rápida** de loadouts guardados
- **Eliminación selectiva** de loadouts
- **Persistencia en base de datos**

### 🎛️ Panel Administrativo
- **Interfaz web moderna** y responsive
- **Búsqueda de jugadores** en tiempo real
- **Asignación de armas** a jugadores específicos
- **Visualización de armas** de jugadores
- **Eliminación remota** de armas

### 📊 Sistema de Logs
- **Integración con Discord** mediante webhooks
- **Registro completo** de acciones administrativas
- **Identificación de usuarios** con Discord ID
- **Logs detallados** de asignación/eliminación de armas

## 🛠️ Instalación

### Requisitos Previos
- **ESX Framework** (versión compatible)
- **ox_lib** para callbacks y utilidades
- **Permisos ACE** configurados en el servidor
- **Base de datos MySQL** para persistencia

### Pasos de Instalación

1. **Descarga el script**
   ```bash
   git clone https://github.com/HazteUnSitio/Hz_vipweapons.git
   ```

2. **Coloca la carpeta** en tu directorio de recursos
   ```
   resources/[scripts]/Hz_vipweapons/
   ```

3. **Configura los permisos ACE** en tu `server.cfg`
   ```cfg
   # Permisos para administradores
   add_ace group.admin "Hz-VipWeapons" allow
   
   # Asignar grupo admin a usuarios específicos
   add_principal identifier.steam:110000xxxxxxxx group.admin
   ```

4. **Configura el webhook de Discord** (opcional)
   - Edita `server/logs.lua`
   - Añade tu webhook URL en la variable `webhook`

5. **Inicia el recurso** en tu `server.cfg`
   ```cfg
   ensure Hz_vipweapons
   ```

## ⚙️ Configuración

### Archivo de Configuración (`shared/config.lua`)

```lua
Config = {}

-- Configuración de armas VIP disponibles
Config.VipWeapons = {
    'WEAPON_ASSAULTRIFLE',
    'WEAPON_CARBINERIFLE',
    'WEAPON_ADVANCEDRIFLE',
    'WEAPON_SPECIALCARBINE',
    'WEAPON_BULLPUPRIFLE',
    'WEAPON_COMPACTRIFLE',
    'WEAPON_MG',
    'WEAPON_COMBATMG',
    'WEAPON_GUSENBERG',
    'WEAPON_SNIPERRIFLE',
    'WEAPON_HEAVYSNIPER',
    'WEAPON_MARKSMANRIFLE',
    'WEAPON_RPG',
    'WEAPON_GRENADELAUNCHER',
    'WEAPON_MINIGUN'
}

-- Mensajes del sistema
Config.Messages = {
    no_permission = 'No tienes permisos para usar este comando',
    not_vip = 'No eres un jugador VIP',
    weapon_given = 'Arma otorgada exitosamente',
    weapon_removed = 'Arma eliminada exitosamente',
    loadout_saved = 'Loadout guardado exitosamente',
    loadout_loaded = 'Loadout cargado exitosamente',
    loadout_deleted = 'Loadout eliminado exitosamente',
    player_not_found = 'Jugador no encontrado',
    invalid_weapon = 'Arma no válida'
}

-- Configuración de attachments
Config.WeaponAttachments = {
    ['WEAPON_ASSAULTRIFLE'] = {
        'COMPONENT_ASSAULTRIFLE_CLIP_02',
        'COMPONENT_AT_AR_FLSH',
        'COMPONENT_AT_SCOPE_MACRO',
        'COMPONENT_AT_AR_GRIP'
    },
    -- Más configuraciones de attachments...
}
```

### Configuración de Permisos

El script utiliza el sistema ACE de FiveM para gestionar permisos:

```cfg
# Crear grupo VIP
add_ace group.vip "Hz-VipWeapons.vip" allow

# Crear grupo Admin
add_ace group.admin "Hz-VipWeapons" allow
add_ace group.admin "Hz-VipWeapons.vip" allow

# Asignar jugadores a grupos
add_principal identifier.steam:110000xxxxxxxx group.vip
add_principal identifier.license:xxxxxxxxxxxxxxxx group.admin
```

## 🎮 Uso del Script

### Comandos Disponibles

#### Para Jugadores VIP
- **`/vipweapons`** - Abre el menú principal de armas VIP
- **Tecla por defecto:** `F6` - Acceso rápido al menú

#### Para Administradores
- **`/weaponpanel`** - Abre el panel administrativo web
- **`/givevipweapon [id] [arma]`** - Otorga un arma VIP a un jugador
- **`/removevipweapon [id] [arma]`** - Elimina un arma VIP de un jugador
- **`/clearvipweapons [id]`** - Elimina todas las armas VIP de un jugador

### Funcionalidades del Menú VIP

1. **Menú de Armas VIP**
   - Visualización de todas las armas disponibles
   - Spawn/Despawn de armas
   - Recarga de munición
   - Personalización con attachments

2. **Gestión de Loadouts**
   - Guardar configuración actual de armas
   - Cargar loadouts previamente guardados
   - Eliminar loadouts específicos
   - Visualizar loadouts disponibles

3. **Herramientas Adicionales**
   - Eliminar todas las armas
   - Verificación de estado VIP
   - Acceso rápido a funciones

### Panel Administrativo Web

El panel administrativo proporciona:

- **Búsqueda de jugadores** por ID
- **Visualización de armas** de jugadores específicos
- **Asignación remota** de armas VIP
- **Eliminación selectiva** de armas
- **Interfaz moderna** y fácil de usar

## 🔧 Exports Disponibles

### Client-Side Exports

```lua
-- Verificar si un jugador es VIP
local isVip = exports['Hz_vipweapons']:isVip()

-- Obtener armas VIP del jugador
local weapons = exports['Hz_vipweapons']:getWeapons()

-- Obtener loadouts del jugador
local loadouts = exports['Hz_vipweapons']:getLoadouts()
```

### Ejemplos de Uso

```lua
-- Verificar estado VIP antes de permitir acceso
if exports['Hz_vipweapons']:isVip() then
    -- Permitir acceso a contenido VIP
    print('Jugador VIP detectado')
else
    -- Denegar acceso
    print('Jugador no VIP')
end

-- Obtener y mostrar armas VIP
local vipWeapons = exports['Hz_vipweapons']:getWeapons()
for i, weapon in ipairs(vipWeapons) do
    print('Arma VIP:', weapon)
end
```

## 📁 Estructura de Archivos

```
Hz_vipweapons/
├── fxmanifest.lua              # Manifiesto del recurso
├── README.md                   # Documentación completa
├── shared/
│   ├── config.lua             # Configuración principal
│   └── custom.lua             # Funciones personalizadas
├── client/
│   ├── main.lua               # Lógica principal del cliente
│   ├── exports.lua            # Exports del cliente
│   ├── classes/
│   │   └── player.lua         # Clase Player
│   └── menus/
│       └── menu.lua           # Sistema de menús
├── server/
│   ├── main.lua               # Lógica principal del servidor
│   ├── callbacks.lua          # Callbacks del servidor
│   └── logs.lua               # Sistema de logs
└── ui/
    ├── index.html             # Interfaz web
    ├── app.js                 # Lógica JavaScript
    └── style.css              # Estilos CSS
```

## 🔒 Seguridad

### Medidas de Seguridad Implementadas

- **Verificación de permisos** en cada acción
- **Validación server-side** de todas las operaciones
- **Sanitización de inputs** en el panel web
- **Logs completos** de actividades administrativas
- **Protección contra exploits** comunes

### Recomendaciones de Seguridad

1. **Configura correctamente los permisos ACE**
2. **Revisa regularmente los logs de Discord**
3. **Mantén actualizado el script**
4. **Limita el acceso al panel administrativo**
5. **Usa HTTPS para webhooks de Discord**

## 🐛 Solución de Problemas

### Problemas Comunes

**El menú no se abre:**
- Verifica que el jugador tenga permisos VIP
- Comprueba la configuración ACE
- Revisa los logs del servidor

**Las armas no se guardan:**
- Verifica la conexión a la base de datos
- Comprueba los permisos de escritura
- Revisa la configuración de ESX

**El panel administrativo no funciona:**
- Verifica los permisos de administrador
- Comprueba la configuración NUI
- Revisa la consola del navegador

### Logs y Debugging

Para activar logs detallados, añade en tu `server.cfg`:
```cfg
set convar_logLevel "debug"
```

## 🤝 Soporte y Contribuciones

### Obtener Soporte

- **Discord:** [https://discord.gg/codigosparajuegos](https://discord.gg/codigosparajuegos)
- **Tienda:** [https://codigosparajuegos.online](https://codigosparajuegos.com)
- **GitHub:** [https://github.com/HazteUnSitio](https://github.com/HazteUnSitio)

### Contribuir al Proyecto

1. Fork el repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Envía un pull request

### Reportar Bugs

Para reportar bugs, incluye:
- Descripción detallada del problema
- Pasos para reproducir el error
- Logs del servidor/cliente
- Versión del script y framework

## 📄 Licencia

Este proyecto está desarrollado por **HZ - CodigosParaJuegos - FiveMSoluciones**.

### Términos de Uso

- ✅ Uso en servidores privados
- ✅ Modificaciones para uso personal
- ✅ Distribución con créditos
- ❌ Venta sin autorización
- ❌ Reclamación de autoría

## 🔄 Changelog

### Versión 1.0.0
- ✨ Lanzamiento inicial
- 🔫 Sistema completo de armas VIP
- 💾 Gestión de loadouts
- 🎛️ Panel administrativo web
- 📊 Sistema de logs con Discord
- 🔒 Sistema de permisos ACE
- 📱 Interfaz responsive
- 🛡️ Medidas de seguridad implementadas

---

**Desarrollado con ❤️ por HZ - CodigosParaJuegos - FiveMSoluciones**

*Para más scripts y recursos, visita nuestra tienda: [codigosparajuegos.online](https://codigosparajuegos.com)*