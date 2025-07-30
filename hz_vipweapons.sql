-- ██╗  ██╗███████╗    ██╗   ██╗██╗██████╗     ██╗    ██╗███████╗ █████╗ ██████╗  ██████╗ ███╗   ██╗███████╗
-- ██║  ██║╚══███╔╝    ██║   ██║██║██╔══██╗    ██║    ██║██╔════╝██╔══██╗██╔══██╗██╔═══██╗████╗  ██║██╔════╝
-- ███████║  ███╔╝     ██║   ██║██║██████╔╝    ██║ █╗ ██║█████╗  ███████║██████╔╝██║   ██║██╔██╗ ██║███████╗
-- ██╔══██║ ███╔╝      ╚██╗ ██╔╝██║██╔═══╝     ██║███╗██║██╔══╝  ██╔══██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║
-- ██║  ██║███████╗     ╚████╔╝ ██║██║         ╚███╔███╔╝███████╗██║  ██║██║     ╚██████╔╝██║ ╚████║███████║
-- ╚═╝  ╚═╝╚══════╝      ╚═══╝  ╚═╝╚═╝          ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝
--
-- Desarrollado por: HZ - CodigosParaJuegos - FiveMSoluciones
-- Discord: https://discord.gg/codigosparajuegos
-- Tienda: https://codigosparajuegos.com
-- GitHub: https://github.com/HazteUnSitio

-- Crear tabla para armas VIP
CREATE TABLE IF NOT EXISTS `hz_vipweapons` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `identifier` varchar(60) NOT NULL,
    `weapon_name` varchar(100) NOT NULL,
    `components` longtext DEFAULT NULL,
    `ammo` int(11) DEFAULT 100,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_player_weapon` (`identifier`, `weapon_name`),
    KEY `idx_identifier` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla para loadouts VIP
CREATE TABLE IF NOT EXISTS `hz_vipweapons_loadouts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `identifier` varchar(60) NOT NULL,
    `loadout_name` varchar(100) NOT NULL,
    `weapons_data` longtext NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_player_loadout` (`identifier`, `loadout_name`),
    KEY `idx_identifier` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla para usuarios VIP
CREATE TABLE IF NOT EXISTS `hz_vipweapons_users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `identifier` varchar(60) NOT NULL,
    `is_vip` tinyint(1) DEFAULT 0,
    `vip_level` int(11) DEFAULT 1,
    `granted_by` varchar(60) DEFAULT NULL,
    `granted_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `expires_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_identifier` (`identifier`),
    KEY `idx_is_vip` (`is_vip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar permisos ACE por defecto
-- Agregar estas líneas a tu server.cfg:
-- add_ace group.admin "Hz-VipWeapons" allow
-- add_ace group.moderator "Hz-VipWeapons" allow

-- Ejemplo de datos de prueba (opcional)
-- INSERT INTO `hz_vipweapons_users` (`identifier`, `is_vip`, `vip_level`, `granted_by`) VALUES
-- ('char1:license_id_here', 1, 1, 'system');