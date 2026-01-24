// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      // Toggle active class on nav menu
      navMenu.classList.toggle('active');
      
      // Update ARIA attributes for accessibility
      const isExpanded = navMenu.classList.contains('active');
      this.setAttribute('aria-expanded', isExpanded);
      
      // Update hamburger animation
      this.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
});