fx_version 'cerulean'
game 'gta5'
lua54 'yes'
fx_version '0.0.3'

author 'HZ - CodigosParaJuegos - FiveMSoluciones'
description 'Sistema VIP de Armas desarrollado por HZ - CodigosParaJuegos - FiveMSoluciones'

dependencies {
    'menuv',
    'es_extended'
}


client_scripts { 
    '@menuv/menuv.lua', 
    'shared/config.lua',
    'shared/custom.lua',
    'client/classes/player.lua',
    'client/main.lua', 
    'client/exports.lua',  
    'client/menus/menu.lua'
}

server_scripts {
    'shared/config.lua',
    'shared/custom.lua',
    'server/main.lua', 
    'server/logs.lua', 
    'server/callbacks.lua'
}

shared_scripts {
  '@es_extended/imports.lua',
  '@ox_lib/init.lua'
}

ui_page 'ui/index.html'

files {
  'ui/index.html',
  'ui/app.js',
  'ui/style.css'
}
dependency '/assetpacks'