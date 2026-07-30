// public/scripts/mobile-menu.js
document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconContainer = document.getElementById('menu-icon-container'); // Asegúrate que este ID exista en tu HTML

  if (menuButton && mobileMenu) {
    // Función para crear SVG de forma segura sin innerHTML
    function createSVGIcon(type) {
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      
      // Atributos comunes
      svg.setAttribute('xmlns', NS);
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('class', 'w-6 h-6');
      svg.setAttribute('aria-hidden', 'true');

      let path;
      if (type === 'menu') {
        path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      } else if (type === 'close') {
        path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
      }

      if (path) svg.appendChild(path);
      return svg;
    }

    // Inicializar icono (Menú hamburguesa)
    if (menuIconContainer) {
      menuIconContainer.innerHTML = ''; // Limpiar cualquier contenido previo estático
      menuIconContainer.appendChild(createSVGIcon('menu'));
    }

    // Toggle del menú
    menuButton.addEventListener('click', () => {
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      
      // Actualizar estado ARIA
      menuButton.setAttribute('aria-expanded', !isExpanded);
      
      // Alternar visibilidad del menú
      mobileMenu.classList.toggle('hidden');
      
      // Cambiar icono dinámicamente
      if (menuIconContainer) {
        menuIconContainer.innerHTML = '';
        menuIconContainer.appendChild(createSVGIcon(isExpanded ? 'menu' : 'close'));
      }
    });
  }
});