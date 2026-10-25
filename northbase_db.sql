-- ========================================================
-- NORTHBASE - BASE DE DATOS COMPLETA (ESTRUCTURA Y DATOS)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `northbase_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `northbase_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `partidas_memorama`;
DROP TABLE IF EXISTS `historial_trivias`;
DROP TABLE IF EXISTS `usuario_coleccionables`;
DROP TABLE IF EXISTS `coleccionables`;
DROP TABLE IF EXISTS `usuarios`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Estructura para la tabla: `usuarios`
-- --------------------------------------------------------
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido_paterno` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido_materno` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipo_favorito` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_perfil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Estructura para la tabla: `coleccionables`
-- --------------------------------------------------------
CREATE TABLE `coleccionables` (
  `id_coleccionable` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('trivia','juego','logro') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'trivia',
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_coleccionable`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Estructura para la tabla: `usuario_coleccionables`
-- --------------------------------------------------------
CREATE TABLE `usuario_coleccionables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_coleccionable` int NOT NULL,
  `fecha_desbloqueo` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuario_logro` (`id_usuario`,`id_coleccionable`),
  KEY `fk_uc_coleccionable` (`id_coleccionable`),
  CONSTRAINT `fk_uc_coleccionable` FOREIGN KEY (`id_coleccionable`) REFERENCES `coleccionables` (`id_coleccionable`) ON DELETE CASCADE,
  CONSTRAINT `fk_uc_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Estructura para la tabla: `historial_trivias`
-- --------------------------------------------------------
CREATE TABLE `historial_trivias` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `trivia_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `puntaje` int NOT NULL,
  `total_preguntas` int NOT NULL,
  `porcentaje` decimal(5,2) NOT NULL,
  `fecha_completado` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historial`),
  KEY `fk_ht_usuario` (`id_usuario`),
  CONSTRAINT `fk_ht_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Estructura para la tabla: `partidas_memorama`
-- --------------------------------------------------------
CREATE TABLE `partidas_memorama` (
  `id_partida` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `dificultad` enum('facil','medio','dificil') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medio',
  `movimientos` int NOT NULL,
  `tiempo_segundos` int NOT NULL,
  `completado` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_partida` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_partida`),
  KEY `fk_pm_usuario` (`id_usuario`),
  CONSTRAINT `fk_pm_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Catálogo oficial de los 40 Coleccionables de la Zona Norte
-- --------------------------------------------------------
INSERT INTO `coleccionables` (`id_coleccionable`, `nombre`, `descripcion`, `tipo`, `imagen_url`) VALUES
(1, 'Bateador: Víctor Mendoza', 'Otorgada por dominar al 100% la trivia de los Sultanes de Monterrey.', 'trivia', './src/assets/Coleccionables/VictorMendozaSultanesBateador.svg'),
(2, 'Bateador: Justin Turner', 'Otorgada por dominar al 100% la trivia de los Toros de Tijuana.', 'trivia', './src/assets/Coleccionables/JustinTurnerTorosBateador.svg'),
(3, 'Bateador: Kyle Garlick', 'Otorgada por dominar al 100% la trivia de los Charros de Jalisco.', 'trivia', './src/assets/Coleccionables/KyleGarlickCharrosBateador.svg'),
(4, 'Bateador: Ramón Hernández', 'Otorgada por dominar al 100% la trivia de los Acereros de Monclova.', 'trivia', './src/assets/Coleccionables/RamonHdzAcererosBateador.svg'),
(5, 'Bateador: Ángel Reyes', 'Otorgada por dominar al 100% la trivia de los Rieleros de Aguascalientes.', 'trivia', './src/assets/Coleccionables/AngelReyesRielerosBateador.svg'),
(6, 'Bateador: Fernando Villegas', 'Otorgada por dominar al 100% la trivia de los Saraperos de Saltillo.', 'trivia', './src/assets/Coleccionables/FernandoVillegasSaraperosBateador.svg'),
(7, 'Bateador: Kennys Vargas', 'Otorgada por dominar al 100% la trivia de los Tecos de los Dos Laredos.', 'trivia', './src/assets/Coleccionables/KennysVargasTecosBateador.svg'),
(8, 'Bateador: Juan Yépez', 'Otorgada por dominar al 100% la trivia de los Dorados de Chihuahua.', 'trivia', './src/assets/Coleccionables/JuanYepezDoradosBateador.svg'),
(9, 'Bateador: Nick Torres', 'Otorgada por dominar al 100% la trivia de los Algodoneros del Unión Laguna.', 'trivia', './src/assets/Coleccionables/NickTorresAlgodonerosBateador.svg'),
(10, 'Bateador: Víctor Márquez', 'Otorgada por dominar al 100% la trivia de Caliente de Durango.', 'trivia', './src/assets/Coleccionables/VictorMarquezCalienteBateador.svg'),
(11, 'Lanzador: Juan Gámez', 'Otorgada por responder al 100% la trivia histórica de la Zona Norte.', 'trivia', './src/assets/Coleccionables/JuanGamezSultanesLanzador.svg'),
(12, 'Lanzador: David Reyes', 'Otorgada al responder y completar tu primera trivia en NorthBase.', 'trivia', './src/assets/Coleccionables/DavidReyesTorosLanzador.svg'),
(13, 'Lanzador: Luis Rodríguez', 'Otorgada al completar las 11 trivias de la plataforma.', 'trivia', './src/assets/Coleccionables/LuisRdzCharrosLanzador.svg'),
(14, 'Lanzador: Wilmer Ríos', 'Otorgada al conseguir calificación perfecta (100%) en al menos 5 trivias.', 'trivia', './src/assets/Coleccionables/WilmerRiosAcererosLanzador.svg'),
(15, 'Lanzador: Óscar Cruz', 'Otorgada por alcanzar el 100% de aciertos en las 11 trivias de la liga.', 'trivia', './src/assets/Coleccionables/OscarCruzRielerosLanzador.svg'),
(16, 'Lanzador: Zach Morth', 'Otorgada al ganar tu primera partida en modo Fácil.', 'juego', './src/assets/Coleccionables/ZachMorthSaraperosLanzador.svg'),
(17, 'Lanzador: Nate Antone', 'Otorgada al ganar una partida en modo Medio.', 'juego', './src/assets/Coleccionables/NateAntoneTecosLanzador.svg'),
(18, 'Lanzador: Darel Torres', 'Otorgada al vencer el reto en modo Difícil (Equipos y Mánagers).', 'juego', './src/assets/Coleccionables/DarelTorresDoradosLanzador.svg'),
(19, 'Lanzador: Erasmo Ramírez', 'Otorgada al completar el modo Fácil en menos de 30 segundos.', 'juego', './src/assets/Coleccionables/ErasmoRamirezAlgodonerosLanzador.svg'),
(20, 'Lanzador: Odrisamer Despaigne', 'Otorgada al completar el modo Medio en menos de 60 segundos.', 'juego', './src/assets/Coleccionables/OdrisamerDespaigneCalienteLanzador.svg'),
(21, 'Mánager: Henry Blanco', 'Otorgada al resolver el modo Difícil en menos de 90 segundos.', 'juego', './src/assets/Coleccionables/HenryBlancoSultanesManager.svg'),
(22, 'Mánager: Roberto Kelly', 'Otorgada al completar el modo Fácil con menos de 8 movimientos.', 'juego', './src/assets/Coleccionables/RobertoKellyTorosManager.svg'),
(23, 'Mánager: Benjamín Gil', 'Otorgada al resolver el modo Medio con menos de 16 movimientos.', 'juego', './src/assets/Coleccionables/BenjaminGilCharrosManager.svg'),
(24, 'Mánager: Juan Gabriel Castro', 'Otorgada al ganar al menos una partida en Fácil, Medio y Difícil.', 'juego', './src/assets/Coleccionables/JuanCastroAcererosManager.svg'),
(25, 'Mánager: Enrique Reyes', 'Otorgada al crear tu cuenta y seleccionar a tu equipo favorito.', 'logro', './src/assets/Coleccionables/EnriqueReyesRielerosManager.svg'),
(26, 'Mánager: José Molina', 'Otorgada por lograr el 100% en la trivia de tu equipo favorito.', 'logro', './src/assets/Coleccionables/JoseMolinaSaraperosManager.svg'),
(27, 'Mánager: Mendy López', 'Otorgada al ganar 3 partidas consecutivas de memorama.', 'logro', './src/assets/Coleccionables/MendyLopezTecosManager.svg'),
(28, 'Mánager: Tony DeFrancesco', 'Otorgada al explorar la galería multimedia de al menos 3 equipos.', 'logro', './src/assets/Coleccionables/TonyDefrancescoDoradosManager.svg'),
(29, 'Mánager: Ramón Santiago', 'Otorgada al capturar una fotografía interactiva usando los filtros de la cámara.', 'logro', './src/assets/Coleccionables/RamonSantiagoAlgodonerosManager.svg'),
(30, 'Mánager: Óscar Robles', 'Otorgada al escanear el logo de tu equipo con la cámara AR y tomarte una foto con su modelo 3D.', 'logro', './src/assets/Coleccionables/OscarRoblesCalienteManager.svg'),
(31, 'Estadio: Walmart Park', 'Otorgada al explorar la historia y casa de los Sultanes de Monterrey.', 'logro', './src/assets/Coleccionables/EstadioSultanes.svg'),
(32, 'Estadio: Chevron', 'Otorgada al explorar la casa de los Toros de Tijuana en la frontera.', 'logro', './src/assets/Coleccionables/EstadioToros.svg'),
(33, 'Estadio: Panamericano', 'Otorgada al explorar el hogar de los Charros de Jalisco en Zapopan.', 'logro', './src/assets/Coleccionables/EstadioCharros.svg'),
(34, 'Estadio: Monclova', 'Otorgada al visitar la historia de la Furia Azul en el Horno Más Grande de México.', 'logro', './src/assets/Coleccionables/EstadioAcereros.svg'),
(35, 'Estadio: Alberto Romo Chávez', 'Otorgada al explorar la histórica casa ferrocarrilera de los Rieleros.', 'logro', './src/assets/Coleccionables/EstadioRieleros.svg'),
(36, 'Estadio: Francisco I. Madero', 'Otorgada al conocer el nido de la Nave Verde de los Saraperos de Saltillo.', 'logro', './src/assets/Coleccionables/EstadioSaraperos.svg'),
(37, 'Estadio: Parque La Junta', 'Otorgada al explorar la histórica plaza binacional de los Tecos de los Dos Laredos.', 'logro', './src/assets/Coleccionables/EstadioTecos.svg'),
(38, 'Estadio: Monumental Chihuahua', 'Otorgada al conocer la casa de los Dorados en la División del Norte.', 'logro', './src/assets/Coleccionables/EstadioDorados.svg'),
(39, 'Estadio: De la Revolución', 'Otorgada al explorar el histórico parque lagunero de los Algodoneros.', 'logro', './src/assets/Coleccionables/EstadioAlgodoneros.svg'),
(40, 'Estadio: Francisco Villa', 'Otorgada al conocer la casa del béisbol duranguense con Caliente de Durango.', 'logro', './src/assets/Coleccionables/EstadioCaliente.svg');

