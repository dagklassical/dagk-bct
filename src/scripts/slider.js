// src/scripts/slider.js
import Splide from '@splidejs/splide';

document.addEventListener('DOMContentLoaded', () => {
  new Splide('#main-hero-slider', {
    type       : 'loop',       // El slider volverá a empezar al llegar al final
    autoplay   : true,         // Reproducción automática
    interval   : 6000,         // Cambia de slide cada 5 segundos
    pauseOnHover: true,        // Pausa la reproducción al pasar el ratón
    arrows     : false,        // Oculta las flechas de navegación (puedes poner 'true' si las quieres)
    pagination : true,         // Muestra los puntos de navegación
    lazyLoad   : 'nearby',     // Carga las imágenes solo cuando son necesarias (mejora el rendimiento)
    speed      : 800,          // Velocidad de la transición en milisegundos
  }).mount();
});