document.addEventListener('DOMContentLoaded', function() {
  const passwordInput = document.getElementById('account_password');
  const strengthMeter = document.querySelector('.password-strength-meter');
  const strengthContainer = document.querySelector('.password-strength');
  
  if (passwordInput && strengthMeter && strengthContainer) {
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      let strength = 0;
      
      // Length check
      if (password.length >= 12) strength++;
      if (password.length >= 16) strength++;
      
      // Character variety checks
      if (/[a-z]/.test(password)) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^a-zA-Z0-9]/.test(password)) strength++;
      
      // Update strength meter
      strengthContainer.classList.remove('weak', 'medium', 'strong');
      
      if (strength <= 2) {
        strengthContainer.classList.add('weak');
      } else if (strength <= 4) {
        strengthContainer.classList.add('medium');
      } else {
        strengthContainer.classList.add('strong');
      }
    });
  }
});