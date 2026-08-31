# Security Implementation Guide

## Problem
The original implementation exposed the Web3Forms API key in the HTML, which is a security risk:
- API keys should never be in client-side code
- Exposed keys can be used by unauthorized parties to send forms
- Keys committed to git are permanently exposed in history

## Solution
This guide shows how to securely handle form submissions using a **server-side proxy**.

---

## Architecture

```
User Form (Client)
       ↓
  script-secure.js
       ↓
/api/submit-form (Your Backend)
       ↓
Web3Forms API (with secured API key)
```

The API key stays on your server and is never exposed to the client.

---

## Setup Instructions

### 1. Get Your Web3Forms API Key
1. Visit https://web3forms.com/
2. Create an account
3. Copy your Access Key from the dashboard
4. Do NOT commit this to Git

### 2. Set Environment Variable

#### For Local Development
Create a `.env` file in your project root:
```
WEB3FORMS_ACCESS_KEY=your_actual_api_key_here
```

**Important**: Add `.env` to `.gitignore` to prevent accidental commits:
```bash
echo ".env" >> .gitignore
```

#### For Production Deployment

**Vercel:**
- Go to Project Settings → Environment Variables
- Add `WEB3FORMS_ACCESS_KEY` with your API key

**Netlify:**
- Go to Site Settings → Build & Deploy → Environment
- Add `WEB3FORMS_ACCESS_KEY` with your API key

**AWS Lambda:**
- Use AWS Systems Manager Parameter Store or Secrets Manager
- Reference in Lambda function configuration

**Heroku:**
```bash
heroku config:set WEB3FORMS_ACCESS_KEY=your_api_key
```

**Docker:**
```dockerfile
FROM node:18
ENV WEB3FORMS_ACCESS_KEY=$WEB3FORMS_ACCESS_KEY
# ... rest of Dockerfile
```

### 3. Update Your HTML

Replace the form configuration in `index.html`:

**OLD (Insecure):**
```html
<form id="quote-form" data-web3forms>
  <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
  <input type="hidden" name="subject" value="Dispatch consultation request">
  <!-- ... form fields ... -->
</form>
<script src="script.js" defer></script>
```

**NEW (Secure):**
```html
<form id="quote-form" data-web3forms>
  <input type="hidden" name="subject" value="Dispatch consultation request">
  <!-- Do NOT include access_key in HTML anymore -->
  <!-- ... form fields ... -->
</form>
<script src="script-secure.js" defer></script>
```

### 4. Deploy Backend Handler

Choose your deployment platform:

#### Option A: Vercel (Recommended for static sites)
1. Copy `api/submitForm.js` to your project
2. Deploy with `vercel` CLI
3. Forms will automatically POST to `/api/submit-form`

#### Option B: Netlify Functions
1. Create `netlify/functions/submitForm.js` with the same code
2. Update form endpoint to `/.netlify/functions/submitForm`
3. Deploy normally

#### Option C: Self-hosted Node.js (Express)
1. Create a simple Express server:
```javascript
const express = require('express');
const submitForm = require('./api/submitForm');

const app = express();
app.use(express.json());
app.post('/api/submit-form', submitForm);
app.listen(3000);
```

2. Run with: `node server.js`
3. Update form endpoint in `script-secure.js` to match your server URL

#### Option D: Traditional PHP Server
Create `api/submit-form.php`:
```php
<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

$accessKey = getenv('WEB3FORMS_ACCESS_KEY');
if (!$accessKey) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Server error']);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$data['access_key'] = $accessKey;

$response = http_post_fields('https://api.web3forms.com/submit', $data);
echo $response;
?>
```

### 5. Update Form Endpoint in script-secure.js

If your backend is not at `/api/submit-form`, update this line:
```javascript
const FORM_ENDPOINT = 'https://your-domain.com/api/submit-form';
```

### 6. Test Locally

For local testing with Node.js:
```bash
npm install express dotenv
# Create a simple test server
node -e "require('dotenv').config(); const express = require('express'); const app = express(); app.use(express.json()); const handler = require('./api/submitForm'); app.post('/api/submit-form', handler); app.listen(3000, () => console.log('Server running on :3000'));"
```

---

## Testing

### Manual Testing
1. Open your site locally
2. Fill out a form
3. Submit and verify you get a success message
4. Check your Web3Forms dashboard for the submission

### Automated Testing
```bash
curl -X POST http://localhost:3000/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{"subject": "Test", "message": "Test message"}'
```

---

## Security Checklist

- ✅ API key is in environment variable, not in code
- ✅ `.env` file is in `.gitignore`
- ✅ Backend endpoint validates requests
- ✅ API key is added server-side, never sent to client
- ✅ Form no longer exposes access_key in HTML
- ✅ HTTPS is used for all communications
- ✅ Consider rate limiting on backend to prevent spam

---

## Migration from Old Implementation

1. Keep `script.js` as-is for now (backward compatibility)
2. Add `.env.example` to Git (without real keys)
3. Update HTML to remove hardcoded access_key
4. Add backend handler files
5. Test thoroughly before going live
6. Remove `script.js` once `script-secure.js` is verified

---

## Troubleshooting

**Forms not submitting:**
- Check that `WEB3FORMS_ACCESS_KEY` environment variable is set
- Verify backend is running and accessible
- Check browser console for errors
- Verify form action matches your endpoint

**400/401 errors:**
- Ensure `WEB3FORMS_ACCESS_KEY` is correct and active
- Verify `subject` field is being sent
- Check Web3Forms documentation for required fields

**CORS errors:**
- If backend and frontend are on different domains, enable CORS:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

---

## References
- [Web3Forms Documentation](https://web3forms.com/documentation)
- [Environment Variables Best Practices](https://12factor.net/config)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
