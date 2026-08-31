/**
 * Enhanced form submission handler with client-side validation
 * Adds warnings for optional but important fields
 * Provides fallback contact methods prominently
 */

const FORM_ENDPOINT = '/api/submit-form';
const FALLBACK_PHONE = '(303) 502-5008';
const FALLBACK_EMAIL = 'info@alphawaylogistics.com';

document.querySelectorAll('[data-web3forms]').forEach((form) => {
  const message = form.querySelector('[role="status"]');
  if (!message) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Validate optional but important fields
    const validationIssues = validateForm(form);
    
    if (validationIssues.length > 0) {
      // Show warnings but allow submission
      const warningMessage = `⚠️ Note: ${validationIssues.join(', ')}. Click submit again to proceed without this info.`;
      message.textContent = warningMessage;
      message.className = 'warning';
      
      // Prevent submission on first click with warnings
      form.dataset.validationWarningShown = 'true';
      setTimeout(() => {
        form.dataset.validationWarningShown = 'false';
      }, 3000);
      
      return;
    }

    // Clear any previous messages
    message.textContent = 'Sending...';
    message.className = '';

    try {
      // Collect form data
      const formData = new FormData(form);
      
      // Remove the placeholder access_key before sending
      formData.delete('access_key');

      // Convert to JSON for easier handling
      const data = Object.fromEntries(formData);

      // Submit to backend endpoint
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Submission failed');
      }

      // Success
      message.textContent = '✓ Thanks. Your message was sent successfully.';
      message.className = 'success';
      form.reset();
      form.dataset.validationWarningShown = 'false';

      // Clear success message after 5 seconds
      setTimeout(() => {
        message.textContent = '';
      }, 5000);

    } catch (error) {
      // Show error with fallback contact methods
      const errorMessage = `
        We could not send your message. Please try again or contact us directly:
        📞 Call: ${FALLBACK_PHONE}
        📧 Email: ${FALLBACK_EMAIL}
      `;
      message.textContent = errorMessage;
      message.className = 'error';
      console.error('Form submission failed:', error);
    }
  });

  // Add real-time validation feedback on blur
  const emailInputs = form.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value && !isValidEmail(input.value)) {
        input.classList.add('invalid-input');
        const feedback = input.nextElementSibling;
        if (feedback?.className.includes('feedback')) {
          feedback.textContent = '⚠️ Please enter a valid email';
        }
      } else {
        input.classList.remove('invalid-input');
        const feedback = input.nextElementSibling;
        if (feedback?.className.includes('feedback')) {
          feedback.textContent = '';
        }
      }
    });
  });

  // Add character counter to textareas
  const textareas = form.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    textarea.addEventListener('input', () => {
      const count = textarea.value.length;
      let feedback = textarea.nextElementSibling;
      if (!feedback?.className.includes('char-count')) {
        feedback = document.createElement('small');
        feedback.className = 'char-count';
        textarea.parentNode.insertBefore(feedback, textarea.nextElementSibling);
      }
      feedback.textContent = `${count} characters`;
    });
  });
});

/**
 * Validate form and return array of issues
 */
function validateForm(form) {
  const issues = [];
  
  // Check for optional email field (important for follow-up)
  const emailInputs = form.querySelectorAll('input[name*="email"]');
  emailInputs.forEach(input => {
    if (!input.value && !input.required) {
      issues.push('Email not provided (we won\'t be able to follow up)');
    } else if (input.value && !isValidEmail(input.value)) {
      issues.push('Email format is invalid');
    }
  });

  // Check for optional name field
  const nameInputs = form.querySelectorAll('input[name*="name"]');
  nameInputs.forEach(input => {
    if (!input.value && !input.required && input.id !== 'feedback-name') {
      issues.push('Name not provided');
    }
  });

  // Check for very short messages (likely accidental)
  const textareas = form.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    if (textarea.value.trim().length < 10 && textarea.required) {
      issues.push('Message is quite short, please provide more details');
    }
  });

  return issues;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Add fallback contact info to error messages
 */
function createFallbackMessage() {
  const container = document.createElement('div');
  container.className = 'fallback-contact';
  container.innerHTML = `
    <p><strong>Having trouble?</strong> Reach out directly:</p>
    <a href="tel:+13035025008" class="contact-link">📞 ${FALLBACK_PHONE}</a>
    <a href="mailto:info@alphawaylogistics.com" class="contact-link">📧 ${FALLBACK_EMAIL}</a>
  `;
  return container;
}
