# HTML Changes Required for Secure Implementation

## Summary
Remove hardcoded API key from HTML and switch to `script-secure.js`.

## Changes to Make in `index.html`

### 1. Remove access_key from Feedback Form (Line 37)

**BEFORE:**
```html
<form id="feedback-form" data-web3forms>
  <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
  <input type="hidden" name="subject" value="Website comments and suggestions">
  <!-- ... -->
</form>
```

**AFTER:**
```html
<form id="feedback-form" data-web3forms>
  <!-- Remove the access_key line - backend will add it securely -->
  <input type="hidden" name="subject" value="Website comments and suggestions">
  <!-- ... -->
</form>
```

### 2. Remove access_key from Contact Form (Line 38)

**BEFORE:**
```html
<form id="quote-form" data-web3forms>
  <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
  <input type="hidden" name="subject" value="Dispatch consultation request">
  <!-- ... -->
</form>
```

**AFTER:**
```html
<form id="quote-form" data-web3forms>
  <!-- Remove the access_key line - backend will add it securely -->
  <input type="hidden" name="subject" value="Dispatch consultation request">
  <!-- ... -->
</form>
```

### 3. Switch Script (Line 24)

**BEFORE:**
```html
<script src="script.js" defer></script>
```

**AFTER:**
```html
<script src="script-secure.js" defer></script>
```

## Summary of Changes
- ❌ Remove: `<input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">`
- ✅ Keep: `<input type="hidden" name="subject" value="...">`
- 📝 Update script reference from `script.js` to `script-secure.js`

## Files Provided
1. **script-secure.js** - New secure form handler (replaces script.js)
2. **api/submitForm.js** - Backend handler (deploy to your server)
3. **SECURITY_SETUP.md** - Complete setup and deployment guide
4. **.env.example** - Template for environment variables
5. **.gitignore** - Prevent committing sensitive files
6. **package.json** - Dependencies and dev server script

## Next Steps
1. Read `SECURITY_SETUP.md` for detailed deployment instructions
2. Update `index.html` with changes above
3. Deploy `api/submitForm.js` to your backend
4. Set `WEB3FORMS_ACCESS_KEY` environment variable
5. Test forms locally and on production
6. Commit changes to Git (without .env file!)

## Quick Local Test
```bash
# Install dependencies
npm install

# Start dev server with secure form handling
npm run dev

# Visit http://localhost:3000 and test forms
```
