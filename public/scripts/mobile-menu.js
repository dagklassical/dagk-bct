(function() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const icon = toggle.querySelector('svg');
  if (!icon) return;

  const openIcon = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
  const closeIcon = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';

  /**
   * @param {boolean} isOpen
   */
  const updateIcon = (isOpen) => {
    icon.innerHTML = isOpen ? closeIcon : openIcon;
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !isOpen);
    updateIcon(isOpen);
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      updateIcon(false);
    });
  });
})();