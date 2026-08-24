import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  schema?: Record<string, unknown>;
}

const DEFAULT_DOMAIN = 'https://cosmic-channeling.vercel.app';
const DEFAULT_OG_IMAGE = 'https://cosmic-channeling.vercel.app/og-image.jpg';

export default function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to set or create meta tag
    const setMetaTag = (selector: string, attribute: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Update Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // 3. Update Canonical Link
    const currentCanonical = canonical || `${DEFAULT_DOMAIN}${window.location.pathname}`;
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentCanonical);

    // 4. Update OpenGraph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentCanonical);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);

    // 5. Update Twitter Card Tags
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', currentCanonical);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 6. Optional Per-Page JSON-LD Script
    let scriptTag: HTMLScriptElement | null = null;
    if (schema) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'page-specific-jsonld';
      scriptTag.text = JSON.stringify(schema);
      document.head.appendChild(scriptTag);
    }

    return () => {
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [title, description, canonical, ogType, ogImage, schema]);

  return null;
}
