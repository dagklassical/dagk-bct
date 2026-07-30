// public/scripts/slider.js
document.addEventListener('DOMContentLoaded', function() {
  const sliderEl = document.getElementById('main-hero-slider');
  
  if (!sliderEl) return; // Salir silenciosamente si el slider no existe en esta página

  // 1. Cargar estilos de Splide con SRI verificado (v4.1.4)
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css';
  link.integrity = 'sha384-RQYEYzAnHyG0swTqlleCCsKHN9pUKyYMflAk6KEjvY6KhE5MLlvjwZkai5538g2T';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);

  // 2. Cargar script de Splide con SRI verificado (v4.1.4)
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
  script.integrity = 'sha384-RbYB5yr9jD1p+2OHlV3KzOBLAY48CbFsJ87bXEFYINGgOlQJNE4cEjTUf+Q2fygb';
  script.crossOrigin = 'anonymous';
  script.async = true;
  
  // 3. Inicialización segura tras la carga exitosa
  script.onload = function() {
    try {
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
      console.log('✅ Slider inicializado correctamente (Integridad SRI verificada)');
    } catch (error) {
      console.error('❌ Error crítico al montar Splide:', error);
    }
  };

  // 4. Manejo de fallo de integridad o red (Auditoría de seguridad)
  script.onerror = function() {
    console.error('❌ Fallo de integridad (SRI) o de red al cargar Splide JS. El recurso fue bloqueado o alterado.');
  };

  document.head.appendChild(script);
});