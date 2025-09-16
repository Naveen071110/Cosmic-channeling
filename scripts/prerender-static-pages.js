#!/usr/bin/env node

/**
 * Static Page Pre-rendering Script
 * 
 * This script pre-renders static pages at build time to minimize compute unit usage.
 * Pages that don't require authentication or real-time data can be pre-rendered
 * and served directly without spinning up server instances.
 */

import { createRequire } from 'module';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for pages to pre-render
const STATIC_PAGES = [
  {
    route: '/',
    component: 'Home',
    filename: 'index.html',
    priority: 'high'
  },
  {
    route: '/pricing',
    component: 'Pricing',
    filename: 'pricing.html',
    priority: 'high'
  },
  {
    route: '/privacy-policy',
    component: 'PrivacyPolicy',
    filename: 'privacy-policy.html',
    priority: 'medium'
  },
  {
    route: '/terms-of-service',
    component: 'TermsOfService',
    filename: 'terms-of-service.html',
    priority: 'medium'
  },
  {
    route: '/not-found',
    component: 'NotFound',
    filename: '404.html',
    priority: 'low'
  }
];

/**
 * Extract asset references from the built index.html
 */
async function extractAssetReferences(buildDir) {
  try {
    const indexHtmlPath = path.join(buildDir, 'index.html');
    const indexContent = await fs.readFile(indexHtmlPath, 'utf8');
    
    // Extract script and CSS links using regex
    const scriptMatch = indexContent.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/);
    // Look specifically for local CSS files (starting with /assets/)
    const cssMatch = indexContent.match(/<link[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
    const themeStyleMatch = indexContent.match(/<style[^>]*data-vite-theme[^>]*>([\s\S]*?)<\/style>/);
    
    return {
      scriptSrc: scriptMatch ? scriptMatch[1] : '/assets/index.js',
      cssSrc: cssMatch ? cssMatch[1] : '/assets/index.css',
      themeStyles: themeStyleMatch ? themeStyleMatch[0] : ''
    };
  } catch (error) {
    console.warn('⚠️  Could not extract asset references:', error.message);
    return {
      scriptSrc: '/assets/index.js',
      cssSrc: '/assets/index.css',
      themeStyles: ''
    };
  }
}

/**
 * Generate base HTML template with extracted assets
 */
function createBaseHtmlTemplate(assets) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${assets.themeStyles}
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#7C3AED">
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="{{META_DESCRIPTION}}">
    <meta name="keywords" content="cosmic channeling, meditation, spiritual growth, astrology, consciousness">
    <meta name="author" content="Cosmic Channeling">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://cosmic-channeling.replit.app{{ROUTE}}">
    <meta property="og:title" content="{{PAGE_TITLE}}">
    <meta property="og:description" content="{{META_DESCRIPTION}}">
    <meta property="og:image" content="https://cosmic-channeling.replit.app/images/cosmic-og.jpg">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://cosmic-channeling.replit.app{{ROUTE}}">
    <meta property="twitter:title" content="{{PAGE_TITLE}}">
    <meta property="twitter:description" content="{{META_DESCRIPTION}}">
    <meta property="twitter:image" content="https://cosmic-channeling.replit.app/images/cosmic-og.jpg">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    
    <!-- External Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    
    <title>{{PAGE_TITLE}}</title>
    
    <!-- Built assets -->
    <script type="module" crossorigin src="${assets.scriptSrc}"></script>
    <link rel="stylesheet" crossorigin href="${assets.cssSrc}">
    
    <!-- Cache control for static pages -->
    <meta http-equiv="Cache-Control" content="public, max-age=3600, must-revalidate">
  </head>
  <body>
    <div id="root"></div>
    
    <!-- Static page marker -->
    <script>
      window.__STATIC_PAGE__ = true;
      window.__ROUTE__ = '{{ROUTE}}';
      window.__BUILD_TIME__ = '{{BUILD_TIME}}';
    </script>
  </body>
</html>`;
}

// Page-specific metadata
const PAGE_METADATA = {
  '/': {
    title: 'Cosmic Channeling - Bridge Science & Soul',
    description: 'Explore the intersection of science and spirituality through guided meditations, cosmic insights, and transformative experiences. Discover your cosmic potential.'
  },
  '/pricing': {
    title: 'Cosmic Channeling Plans & Pricing',
    description: 'Choose your cosmic journey with our flexible pricing plans. Free exploration or premium cosmic channeling experience with advanced features.'
  },
  '/privacy-policy': {
    title: 'Privacy Policy - Cosmic Channeling',
    description: 'Learn how Cosmic Channeling protects your privacy and handles your personal data with cosmic integrity and security.'
  },
  '/terms-of-service': {
    title: 'Terms of Service - Cosmic Channeling',
    description: 'Terms and conditions for using Cosmic Channeling platform and services. Your cosmic journey with clear guidelines.'
  },
  '/not-found': {
    title: 'Page Not Found - Cosmic Channeling',
    description: 'This cosmic destination doesn\'t exist. Return to explore our universe of spiritual and scientific content.'
  }
};

/**
 * Generate static HTML for a specific page
 */
async function generateStaticPage(pageConfig, baseTemplate) {
  const { route, filename } = pageConfig;
  const metadata = PAGE_METADATA[route];
  
  if (!metadata) {
    console.warn(`⚠️  No metadata found for route: ${route}`);
    return;
  }
  
  const html = baseTemplate
    .replace(/{{PAGE_TITLE}}/g, metadata.title)
    .replace(/{{META_DESCRIPTION}}/g, metadata.description)
    .replace(/{{ROUTE}}/g, route)
    .replace(/{{BUILD_TIME}}/g, new Date().toISOString());
  
  return { filename, html, route, metadata };
}

/**
 * Write static files to build directory
 */
async function writeStaticFiles(staticPages) {
  const buildDir = path.resolve(__dirname, '../dist/public');
  
  // Ensure build directory exists
  try {
    await fs.access(buildDir);
  } catch {
    console.log('📁 Creating build directory...');
    await fs.mkdir(buildDir, { recursive: true });
  }
  
  // Write each static page
  for (const page of staticPages) {
    const filePath = path.join(buildDir, page.filename);
    await fs.writeFile(filePath, page.html, 'utf8');
    console.log(`✅ Generated: ${page.filename} for route ${page.route}`);
  }
  
  // Create a manifest file for tracking static pages
  const manifest = {
    generated: new Date().toISOString(),
    pages: staticPages.map(p => ({
      route: p.route,
      filename: p.filename,
      title: p.metadata.title,
      static: true
    }))
  };
  
  await fs.writeFile(
    path.join(buildDir, 'static-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('📋 Generated static-manifest.json');
}

/**
 * Main pre-rendering function
 */
async function preRenderStaticPages() {
  console.log('🚀 Starting static page pre-rendering...');
  console.log(`📄 Pre-rendering ${STATIC_PAGES.length} pages:`);
  
  const buildDir = path.resolve(__dirname, '../dist/public');
  
  // Extract asset references from built index.html
  console.log('🔍 Extracting asset references from built index.html...');
  const assets = await extractAssetReferences(buildDir);
  console.log(`📦 Found assets: script=${assets.scriptSrc}, css=${assets.cssSrc}`);
  
  // Create base template with extracted assets
  const baseTemplate = createBaseHtmlTemplate(assets);
  
  const staticPages = [];
  
  for (const pageConfig of STATIC_PAGES) {
    console.log(`⚡ Generating ${pageConfig.route}...`);
    
    try {
      const page = await generateStaticPage(pageConfig, baseTemplate);
      if (page) {
        staticPages.push(page);
      }
    } catch (error) {
      console.error(`❌ Failed to generate ${pageConfig.route}:`, error.message);
    }
  }
  
  if (staticPages.length > 0) {
    await writeStaticFiles(staticPages);
    console.log(`\n✨ Successfully pre-rendered ${staticPages.length} static pages!`);
    console.log(`🎯 Asset references: ${assets.scriptSrc}, ${assets.cssSrc}`);
    console.log('\n📊 Static Separation Benefits:');
    console.log('   • Pages served without server instances');
    console.log('   • Reduced compute unit usage');
    console.log('   • Faster loading times');
    console.log('   • Better SEO optimization');
  } else {
    console.warn('⚠️  No pages were generated.');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  preRenderStaticPages().catch(error => {
    console.error('💥 Pre-rendering failed:', error);
    process.exit(1);
  });
}

export { preRenderStaticPages, STATIC_PAGES, PAGE_METADATA };