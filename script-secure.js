/**
 * Secure form submission handler
 * Submits forms to a backend endpoint instead of exposing the API key
 */

const FORM_ENDPOINT = '/api/submit-form'; // Change to your deployment URL if needed

document.querySelectorAll('[data-web3forms]').forEach((form) => {
  const message = form.querySelector('[role="status"]');
  if (!message) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Clear any previous messages
    message.textContent = 'Sending...';
    message.className = ''; // Reset classes

    try {
      // Collect form data
      const formData = new FormData(form);
      
      // Remove the placeholder access_key before sending to our endpoint
      // (our backend will add the real one)
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
      message.textContent = 'Thanks. Your message was sent successfully.';
      message.className = 'success';
      form.reset();

      // Clear success message after 5 seconds
      setTimeout(() => {
        message.textContent = '';
      }, 5000);

    } catch (error) {
      message.textContent = 'We could not send your message. Please try again or call us directly at (303) 502-5008.';
      message.className = 'error';
      console.error('Form submission failed:', error);
    }
  });
});
