// public/scripts/slider.js
document.addEventListener('DOMContentLoaded', function() {
  const sliderEl = document.getElementById('main-hero-slider');
  
  if (sliderEl) {
    // Cargar Splide desde CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
    script.async = true;
    script.onload = function() {
      new Splide('#main-hero-slider', {
        type: 'loop',
        autoplay: true,
        interval: 6000,
        pauseOnHover: true,
        arrows: false,
        pagination: true,
        lazyLoad: 'nearby',
        speed: 800,
      }).mount();
      
      console.log('✅ Slider inicializado correctamente');
    };
    document.head.appendChild(script);
    
    // Cargar estilos de Splide
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css';
    document.head.appendChild(link);
  }
});