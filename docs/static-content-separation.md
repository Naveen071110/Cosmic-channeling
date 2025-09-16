# Static Content Separation Documentation

## Overview

This document outlines the static content separation optimizations implemented to minimize compute unit usage by preventing static content from triggering server instances.

## Static vs Dynamic Content Classification

### Static Content (No Server Required)
These assets and pages can be served directly without spinning up compute instances:

#### 1. **Static Assets**
- **Location**: `/public/`, `/dist/public/assets/`
- **Cache Policy**: 1 year with immutable headers
- **Types**:
  - **JavaScript bundles** (`.js`, `.mjs`) - Content hashed, immutable
  - **CSS stylesheets** (`.css`) - Content hashed, immutable  
  - **Images** (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.ico`) - Long cache with revalidation
  - **Audio files** (`.mp3`, `.wav`, `.ogg`, `.m4a`) - Long cache, range request support
  - **Fonts** (`.woff`, `.woff2`, `.ttf`, `.eot`, `.otf`) - Long cache, preload hints

#### 2. **Pre-rendered Pages**
- **Location**: `/dist/public/` (as static HTML files)
- **Cache Policy**: 1 hour with revalidation
- **Pages**:
  - Home page (`/`) → `index.html`
  - Pricing page (`/pricing`) → `pricing.html`
  - Privacy Policy (`/privacy-policy`) → `privacy-policy.html`
  - Terms of Service (`/terms-of-service`) → `terms-of-service.html`
  - 404 page (`/404`) → `404.html`

### Dynamic Content (Server Required)
These require server instances and should not be cached aggressively:

#### 1. **API Endpoints**
- **Pattern**: `/api/*`
- **Cache Policy**: No cache or short cache (varies by endpoint)
- **Examples**:
  - User authentication (`/api/auth/*`)
  - Cosmic quotes (`/api/quotes/random`)
  - Dream interpretation (`/api/interpret-dream`)
  - PayPal integration (`/api/paypal/*`)
  - Space news (`/api/space-news`)

#### 2. **Dynamic Pages**
- **Authentication required**: Any page requiring login
- **Real-time data**: Pages with live content updates
- **User-specific**: Pages showing personalized content
- **Examples**:
  - Journal entries (user-specific)
  - Meditation progress (user-specific)
  - Premium content (auth required)

## Optimization Strategies

### 1. Static Asset Caching

```javascript
// Cache headers by asset type
const CACHE_STRATEGIES = {
  // Hashed assets - cache forever
  'js|css': 'public, max-age=31536000, immutable',
  
  // Images - long cache with revalidation
  'png|jpg|jpeg|gif|webp|svg|ico': 'public, max-age=31536000, must-revalidate',
  
  // Audio files - long cache with range support
  'mp3|wav|ogg|m4a': 'public, max-age=31536000, immutable',
  
  // HTML - short cache for updates
  'html': 'public, max-age=3600, must-revalidate'
};
```

### 2. Static Page Pre-rendering

Pre-rendered pages are generated at build time with:
- SEO-optimized meta tags
- Social media Open Graph tags
- Critical CSS inlined
- Preload hints for important resources
- Static page markers for client-side detection

### 3. Content Hash Cache Busting

Assets are organized with content hashes:
```
/assets/
├── js/
│   ├── main.[hash].js
│   └── vendor.[hash].js
├── css/
│   └── styles.[hash].css
├── images/
│   └── logo.[hash].png
└── audio/
    └── meditation.[hash].mp3
```

### 4. Express Middleware Optimization

Static content is served with optimized middleware that:
- Sets aggressive cache headers for hashed assets
- Adds security headers for all static content
- Enables range requests for audio/video files
- Provides compression hints for text-based assets

## Implementation Details

### Build Process Integration

1. **Pre-rendering Script** (`scripts/prerender-static-pages.js`)
   - Generates static HTML files at build time
   - Creates SEO-optimized meta tags
   - Generates static page manifest

2. **Build Optimization Script** (`scripts/build-static-optimization.js`)
   - Scans and categorizes all assets
   - Generates content hashes for cache busting
   - Creates asset manifest with optimization metadata
   - Generates cache rule configurations

3. **Server Middleware Enhancement** (`server/index.ts`)
   - Adds static content serving middleware before Vite
   - Implements optimal cache headers for each asset type
   - Provides security headers and compression hints

### File Structure

```
dist/public/
├── index.html                    # Pre-rendered home page
├── pricing.html                  # Pre-rendered pricing page
├── privacy-policy.html           # Pre-rendered privacy policy
├── terms-of-service.html         # Pre-rendered terms
├── 404.html                      # Pre-rendered 404 page
├── assets/
│   ├── js/[name].[hash].js      # Hashed JavaScript bundles
│   ├── css/[name].[hash].css    # Hashed CSS files
│   ├── images/[name].[hash].ext # Hashed image files
│   └── audio/[name].[hash].ext  # Hashed audio files
├── static-manifest.json          # Pre-rendered pages manifest
├── asset-manifest.json           # Asset optimization manifest
└── static-optimization-summary.json # Optimization summary
```

## Performance Benefits

### 1. Compute Unit Reduction
- Static assets served without server instances
- Pre-rendered pages eliminate server-side rendering
- Reduced cold start frequency

### 2. Improved Loading Performance
- Long-term caching reduces repeat downloads
- Content hashes enable aggressive caching
- Critical CSS inlined in pre-rendered pages
- Resource preloading for better perceived performance

### 3. Better SEO
- Pre-rendered pages with optimized meta tags
- Faster initial page loads improve search rankings
- Social media sharing optimized with Open Graph tags

### 4. Enhanced User Experience
- Faster page loads from cached content
- Immediate page display for static content
- Progressive enhancement for dynamic features

## Monitoring and Verification

### 1. Static Content Detection
Pages include markers to identify if they're served statically:
```javascript
window.__STATIC_PAGE__ = true;
window.__ROUTE__ = '/pricing';
window.__BUILD_TIME__ = '2024-01-01T00:00:00.000Z';
```

### 2. Asset Manifest Tracking
The asset manifest tracks:
- Total number of optimized assets
- Cache policies for each asset type
- Static routes that don't require server instances
- Build-time optimization metadata

### 3. Performance Metrics
Monitor these metrics to verify optimization success:
- Compute unit usage reduction for static routes
- Cache hit rates for static assets
- Page load times for pre-rendered content
- Server instance spin-up frequency

## Future Enhancements

### 1. Advanced Pre-rendering
- Dynamic content pre-rendering with data fetching
- Incremental static regeneration for updated content
- Build-time API data integration

### 2. CDN Integration
- Asset uploading to CDN during build
- Edge caching for global distribution
- Advanced cache invalidation strategies

### 3. Service Worker Caching
- Offline-first static content strategy
- Background asset updates
- Network fallback optimization

## Troubleshooting

### Common Issues

1. **Static content not caching**: Check cache headers in browser dev tools
2. **Pre-rendered pages not updating**: Verify build process runs pre-rendering
3. **Assets not found**: Check asset manifest for correct paths
4. **Server still spinning up**: Verify static routes are properly configured

### Debug Commands

```bash
# Run pre-rendering
node scripts/prerender-static-pages.js

# Run build optimization
node scripts/build-static-optimization.js

# Check asset manifest
cat dist/public/asset-manifest.json

# Check static page manifest
cat dist/public/static-manifest.json
```