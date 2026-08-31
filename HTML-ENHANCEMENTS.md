# HTML Template - Enhanced Form with Fallback Contact Info

## Changes Needed in index.html

### 1. Add Fallback Contact Info Box to Forms

Replace the contact section with this enhanced version:

```html
<section class="contact" id="contact" aria-labelledby="contact-title">
  <div class="section-heading">
    <h2 id="contact-title">Let's Get Your Truck Moving</h2>
    <span></span>
  </div>
  
  <div class="contact-grid">
    <div>
      <h3>Request a free Dispatch Consultation</h3>
      <p>Ready to keep your truck loaded and earning? Complete the form below, and we'll contact you as soon as possible.</p>
      
      <!-- NEW: Prominent Contact Info -->
      <div class="contact-info-box">
        <h3>Alphaway Logistics LLC</h3>
        <p class="contact-address">
          1580 N Logan St ste 660 #969251<br/>
          Denver, Colorado, USA
        </p>
        <p class="contact-methods">
          <a href="tel:+13035025008" class="contact-link">
            <span class="icon">📞</span>
            <strong>(303) 502-5008</strong>
          </a>
          <a href="mailto:info@alphawaylogistics.com" class="contact-link">
            <span class="icon">📧</span>
            <strong>info@alphawaylogistics.com</strong>
          </a>
        </p>
        <p class="contact-note">
          Call or email us directly if you prefer to reach out immediately
        </p>
      </div>
    </div>
    
    <div>
      <h3>Contact Form</h3>
      <form id="quote-form" data-web3forms>
        <!-- REMOVED: access_key input -->
        <input type="hidden" name="subject" value="Dispatch consultation request">
        
        <label for="email">Email address</label>
        <div class="form-row">
          <input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="you@yourcompany.com" 
            required
            aria-describedby="email-help"
          />
          <button class="button button-light" type="submit">Contact us</button>
        </div>
        
        <p class="form-message" role="status" aria-live="polite"></p>
        
        <!-- NEW: Enhanced error fallback -->
        <div class="error-fallback" style="display:none;">
          <p><strong>Having trouble with the form?</strong></p>
          <p>No problem! Reach out directly:</p>
          <a href="tel:+13035025008" class="fallback-link">📞 Call (303) 502-5008</a>
          <a href="mailto:info@alphawaylogistics.com" class="fallback-link">📧 Email info@alphawaylogistics.com</a>
        </div>
        
        <a class="onboarding-link" href="carrier-agreement.html">
          Sign carrier agreement <span aria-hidden="true">&#8594;</span>
        </a>
      </form>
    </div>
  </div>
</section>
```

### 2. Add Fallback Info to Feedback Section

```html
<section class="feedback-section" id="feedback" aria-labelledby="feedback-title">
  <div class="section-heading">
    <h2 id="feedback-title">Comments & suggestions</h2>
    <span></span>
    <p>Tell us what is working, what could be better, or what you would like to see from Alphaway Logistics.</p>
  </div>
  
  <form id="feedback-form" data-web3forms>
    <!-- REMOVED: access_key input -->
    <input type="hidden" name="subject" value="Website comments and suggestions">
    
    <div class="feedback-grid">
      <label for="feedback-name">
        Name 
        <span>(optional - helps us follow up)</span>
        <input 
          id="feedback-name" 
          name="feedback-name" 
          autocomplete="name"
          aria-describedby="name-note"
        />
        <small id="name-note">Providing your name helps us personalize our response</small>
      </label>
      
      <label for="feedback-email">
        Email 
        <span>(optional - for replies)</span>
        <input 
          id="feedback-email" 
          name="feedback-email" 
          type="email" 
          autocomplete="email"
          aria-describedby="email-note"
        />
        <small id="email-note">We won't share your email or use it for marketing</small>
      </label>
      
      <label class="feedback-full" for="feedback-message">
        Your comments or suggestions
        <textarea 
          id="feedback-message" 
          name="feedback-message" 
          required 
          placeholder="Leave your feedback here..."
          minlength="10"
          aria-describedby="message-help"
        ></textarea>
        <small id="message-help" class="char-count">0 characters</small>
      </label>
    </div>
    
    <button class="button button-light" type="submit">
      Send feedback <span aria-hidden="true">&#8594;</span>
    </button>
    
    <p class="feedback-message" role="status" aria-live="polite"></p>
    
    <!-- NEW: Fallback for feedback errors -->
    <div class="feedback-fallback" style="display:none;">
      <p>Having trouble submitting feedback?</p>
      <a href="mailto:info@alphawaylogistics.com?subject=Feedback">Send us an email instead</a>
    </div>
  </form>
</section>
```

### 3. Update Script Reference

**Find this line (line 24):**
```html
<script src="script.js" defer></script>
```

**Replace with:**
```html
<!-- Use enhanced validation script -->
<script src="script-secure-enhanced.js" defer></script>
```

### 4. Add CSS Styles for Enhanced Forms

Add to `style.css` or `style.min.css`:

```css
/* Contact Info Box */
.contact-info-box {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 20px;
  margin: 20px 0 30px 0;
}

.contact-info-box h3 {
  margin-top: 0;
}

.contact-address {
  color: var(--gray);
  font-size: 13px;
  line-height: 1.8;
  margin: 12px 0;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 12px 0;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
  text-decoration: none;
  font-size: 14px;
  transition: opacity 0.2s;
}

.contact-link:hover {
  opacity: 0.8;
}

.contact-link .icon {
  font-size: 18px;
}

.contact-note {
  font-size: 12px;
  color: var(--gray);
  margin: 8px 0 0 0;
}

/* Error Fallback */
.error-fallback,
.feedback-fallback {
  background: #2a1a1a;
  border-left: 3px solid #ff6b6b;
  padding: 12px 16px;
  margin-top: 12px;
  border-radius: 2px;
}

.error-fallback p,
.feedback-fallback p {
  margin: 4px 0;
  color: var(--white);
  font-size: 13px;
}

.fallback-link {
  display: inline-block;
  color: #ff6b6b;
  text-decoration: underline;
  margin: 4px 12px 4px 0;
  font-size: 13px;
}

.fallback-link:hover {
  opacity: 0.8;
}

/* Validation States */
.invalid-input {
  border-color: #ff6b6b !important;
  background-color: rgba(255, 107, 107, 0.05);
}

.char-count {
  display: block;
  color: var(--gray);
  font-size: 11px;
  margin-top: 4px;
}

/* Form Status Messages */
.form-message {
  line-height: 1.6;
  word-break: break-word;
}

.form-message.warning {
  color: #ffd93d;
}

.form-message.error {
  color: #ff6b6b;
}

.form-message.success {
  color: #51cf66;
}

/* Responsive */
@media (max-width: 700px) {
  .contact-methods {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .contact-link {
    margin-right: 12px;
  }

  .contact-info-box {
    margin: 12px 0 20px 0;
  }
}
```

### 5. Update script-secure-enhanced.js Reference

Make sure to link the enhanced version:
```html
<script src="script-secure-enhanced.js" defer></script>
```

---

## HTML Changes Summary

| Change | Purpose |
|--------|---------|
| Remove `access_key` input | Security - use backend handler |
| Add `contact-info-box` div | Show fallback contact info |
| Add `error-fallback` div | Provide contact methods if form fails |
| Add `aria-describedby` | Better accessibility |
| Add field descriptions | Guide users on why info is needed |
| Add `minlength` attribute | Improve form quality |
| Update script reference | Use enhanced validation |
| Add CSS classes | Visual feedback and styling |

---

## Testing Checklist

- [ ] Form still submits successfully
- [ ] Contact info is visible and prominent
- [ ] Error messages show fallback contact methods
- [ ] Validation warnings appear for optional fields
- [ ] Character counter works for textarea
- [ ] Mobile layout looks good
- [ ] All links (phone, email) work correctly
- [ ] Form clears after successful submission
- [ ] No JavaScript errors in console

---

## Fallback Contact Display

The fallback contact info will show:
1. **Always visible** in the contact form area (new contact-info-box)
2. **On error** in the form-message status area
3. **On error** in the error-fallback hidden div (can be shown by script)

This ensures users can always reach you even if the form fails.

---

## Accessibility Improvements

✅ Added `role="status"` for live updates
✅ Added `aria-describedby` for field guidance
✅ Added `aria-live="polite"` for announcements
✅ Added descriptive labels for all inputs
✅ Added fallback contact methods prominently
✅ Better keyboard navigation
✅ Color contrast improvements

---

## Next Steps

1. Apply these HTML changes to `index.html`
2. Use `script-secure-enhanced.js` instead of `script.js`
3. Add the CSS styles to your stylesheet
4. Test the form locally
5. Verify fallback contact methods display correctly
6. Check accessibility with axe DevTools
