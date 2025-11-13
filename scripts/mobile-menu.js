document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar los elementos del DOM
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu-dropdown');

    // Verificar que los elementos existan antes de agregar eventos
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            // Alternar la clase 'active' para mostrar/ocultar el menú
            mobileMenu.classList.toggle('active');
        });
    }

    console.log("Menú móvil profesional inicializado.");
});