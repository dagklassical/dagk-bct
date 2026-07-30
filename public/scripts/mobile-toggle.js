// public/scripts/mobile-toggle.js
document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconContainer = document.getElementById('menu-icon-container');

  if (!menuButton || !mobileMenu || !iconContainer) {
    console.error('❌ Faltan elementos del menú móvil en el DOM');
    return;
  }

  // Función segura para crear SVGs
  function createSVGIcon(type) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('xmlns', NS);
    svg.setAttribute('class', 'h-6 w-6');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    const path = document.createElementNS(NS, 'path');
    if (type === 'menu') {
      path.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    } else if (type === 'close') {
      path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    }
    
    svg.appendChild(path);
    return svg;
  }

  // Inicializar icono
  iconContainer.innerHTML = ''; // Limpiar contenido estático inicial
  iconContainer.appendChild(createSVGIcon('menu'));

  // Evento Click
  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;

    // Actualizar estado ARIA
    menuButton.setAttribute('aria-expanded', newState);
    
    // Alternar visibilidad del menú
    if (newState) {
      mobileMenu.classList.remove('hidden');
      // Cambiar a icono de cerrar
      iconContainer.innerHTML = '';
      iconContainer.appendChild(createSVGIcon('close'));
    } else {
      mobileMenu.classList.add('hidden');
      // Cambiar a icono de menú
      iconContainer.innerHTML = '';
      iconContainer.appendChild(createSVGIcon('menu'));
    }
  });
});