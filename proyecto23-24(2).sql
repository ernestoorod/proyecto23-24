-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-02-2024 a las 09:05:55
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto23-24`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carreras`
--

CREATE TABLE `carreras` (
  `ID` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `localizacion` varchar(100) NOT NULL,
  `distancia` varchar(100) NOT NULL,
  `fecha` varchar(100) NOT NULL,
  `desnivel` varchar(100) NOT NULL,
  `IDusuario` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carreras`
--

INSERT INTO `carreras` (`ID`, `nombre`, `localizacion`, `distancia`, `fecha`, `desnivel`, `IDusuario`) VALUES
(57, 'Carrera Prueba', 'Leon', '50', '15/03/2025', 'Bajo', 101);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gpx_archivos`
--

CREATE TABLE `gpx_archivos` (
  `id` int(11) NOT NULL,
  `nombre_carrera` varchar(255) DEFAULT NULL,
  `gpxFileName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gpx_archivos`
--

INSERT INTO `gpx_archivos` (`id`, `nombre_carrera`, `gpxFileName`) VALUES
(17, 'Carrera Prueba', 'new.gpx');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen_archivos`
--

CREATE TABLE `imagen_archivos` (
  `id` int(11) NOT NULL,
  `nombre_carrera` varchar(255) DEFAULT NULL,
  `imageFileName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagen_archivos`
--

INSERT INTO `imagen_archivos` (`id`, `nombre_carrera`, `imageFileName`) VALUES
(7, 'Carrera Prueba', 'imagen6.2.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `ID` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `localidad` varchar(100) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `club` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`ID`, `username`, `nombre`, `correo`, `password`, `localidad`, `telefono`, `club`) VALUES
(101, 'ernestoo', 'Ernesto Rodriguez Rodriguez', 'ernesto@gmail.com', '$2y$10$V9z37UX3Vh6xAk2AWkQ3/.Wdku9vLITxD.k47jSsdQA.fcLnl1JUG', 'Barrundia', '645699537', 'Vilortos Montañeros');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carreras`
--
ALTER TABLE `carreras`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `foreign_carreras_usuarios` (`IDusuario`);

--
-- Indices de la tabla `gpx_archivos`
--
ALTER TABLE `gpx_archivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nombre_carrera` (`nombre_carrera`);

--
-- Indices de la tabla `imagen_archivos`
--
ALTER TABLE `imagen_archivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `imagen_archivos_ibfk_1` (`nombre_carrera`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `username` (`username`,`correo`,`telefono`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carreras`
--
ALTER TABLE `carreras`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de la tabla `gpx_archivos`
--
ALTER TABLE `gpx_archivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `imagen_archivos`
--
ALTER TABLE `imagen_archivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carreras`
--
ALTER TABLE `carreras`
  ADD CONSTRAINT `carreras_ibfk_1` FOREIGN KEY (`IDusuario`) REFERENCES `usuarios` (`ID`);

--
-- Filtros para la tabla `gpx_archivos`
--
ALTER TABLE `gpx_archivos`
  ADD CONSTRAINT `gpx_archivos_ibfk_1` FOREIGN KEY (`nombre_carrera`) REFERENCES `carreras` (`nombre`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagen_archivos`
--
ALTER TABLE `imagen_archivos`
  ADD CONSTRAINT `imagen_archivos_ibfk_1` FOREIGN KEY (`nombre_carrera`) REFERENCES `carreras` (`nombre`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
