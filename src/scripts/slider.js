// src/scripts/slider.js
import Splide from '@splidejs/splide';

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const sliderEl = document.getElementById('main-hero-slider');
    if (sliderEl) {
      new Splide(sliderEl, {
        type: 'loop',
        autoplay: true,
        interval: 6000,
        pauseOnHover: true,
        arrows: false,
        pagination: true,
        lazyLoad: 'nearby',
        speed: 800,
      }).mount(); // ← Todo en una sola línea
    }
  });
}