const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

document.querySelectorAll('[data-web3forms]').forEach((form) => {
	const message = form.querySelector('[role="status"]');
	if (!message) return;
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const accessKey = form.querySelector('[name="access_key"]').value;
		if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
			message.textContent = 'Form setup is incomplete. Add your Web3Forms access key before publishing.';
			return;
		}
		message.textContent = 'Sending...';
		try {
			const response = await fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body: new FormData(form) });
			const result = await response.json();
			if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
			message.textContent = 'Thanks. Your message was sent successfully.';
			form.reset();
		} catch (error) {
			message.textContent = 'We could not send your message. Please try again or call us directly.';
			console.error('Web3Forms submission failed:', error);
		}
	});
});
