# Content Security Policy (CSP) Headers Configuration

## For Vercel (vercel.json)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' api.web3forms.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' /api/submit-form"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## For Netlify (_headers file)
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' api.web3forms.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' /.netlify/functions/submitForm
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## For Apache (.htaccess)
```apache
# Enable HTTPS
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' api.web3forms.com; frame-ancestors 'none'; base-uri 'self'"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/gif "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>
```

## For Nginx (nginx.conf)
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL/TLS Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' api.web3forms.com; frame-ancestors 'none'; base-uri 'self'" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss;

    # Cache Control
    location ~* \.(css|js|png|jpg|jpeg|gif|webp|svg)$ {
        expires 1m;
        add_header Cache-Control "public, max-age=2592000";
    }

    location / {
        root /path/to/your/site;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://api-backend:3000;
    }
}
```

## For Express.js (server.js)
```javascript
const express = require('express');
const app = express();

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' api.web3forms.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' /api/submit-form"
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

// Gzip compression
const compression = require('compression');
app.use(compression());

// Cache control
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|png|jpg|webp|svg)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=2592000');
  }
  next();
});

// Static files
app.use(express.static('.'));

// API routes
const submitForm = require('./api/submitForm');
app.post('/api/submit-form', submitForm);

app.listen(3000, () => console.log('Server running on :3000'));
```

## CSP Policy Explanation

### `default-src 'self'`
- Only load resources from your own domain by default

### `script-src 'self' 'unsafe-inline'`
- Allow scripts from your domain and inline scripts
- Note: Remove 'unsafe-inline' in production if possible

### `style-src 'self' 'unsafe-inline' fonts.googleapis.com`
- Allow CSS from your domain, inline styles, and Google Fonts

### `img-src 'self' data: https:`
- Allow images from your domain, data URIs, and HTTPS URLs

### `connect-src 'self' api.web3forms.com`
- Only allow fetch/XHR to your domain and Web3Forms

### `font-src fonts.gstatic.com`
- Only allow fonts from Google Fonts CDN

### `frame-ancestors 'none'`
- Prevent your site from being embedded in iframes (clickjacking protection)

### `form-action 'self'`
- Only allow form submissions to your domain

## Testing CSP Headers

Use online CSP validators:
- https://csp-evaluator.withgoogle.com/
- https://report-uri.com/home/csp_validator

Check headers with curl:
```bash
curl -I https://your-domain.com
```

View in browser DevTools → Network → Headers → Response Headers

## CSP Report-Only Mode (Before Enforcing)

Start with report-only to catch issues without breaking anything:

```
Content-Security-Policy-Report-Only: default-src 'self'; report-uri https://your-api.com/csp-report
```

Once working, switch to enforcing:
```
Content-Security-Policy: default-src 'self'; report-uri https://your-api.com/csp-report
```

## Warnings to Watch For

⚠️ Inline scripts may trigger CSP violations
⚠️ Third-party services need to be explicitly allowed
⚠️ 'unsafe-inline' weakens security - avoid in production
⚠️ Test thoroughly before enabling in production

## Best Practices

✅ Start with report-only mode
✅ Monitor console for violations
✅ Gradually tighten the policy
✅ Use nonces for legitimate inline scripts
✅ Keep a CSP report-uri endpoint
✅ Review reports weekly
