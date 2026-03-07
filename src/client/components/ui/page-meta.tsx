import { useEffect } from 'react';
import { useLocation } from 'react-router';

interface PageMetaProps {
  title: string;
  description: string;
}

interface HeadTagUpdate {
  selector: string;
  attributes: Record<string, string>;
}

const PREVIEW_IMAGE_URL = 'https://raw.githubusercontent.com/bishopz/2026-boilerplate/main/public/preview.png';
const DEFAULT_KEYWORDS = 'boilerplate, react, node.js, express, typescript, local-first, encryption, authentication';
const DEFAULT_AUTHOR = 'BishopZ';
const DEFAULT_LANGUAGE = 'English';
const DEFAULT_LOCALE = 'en_US';
const DEFAULT_TWITTER_SITE = '@bishopz';

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const upsertLink = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const getCanonicalUrl = (pathname: string) => {
  if (typeof window === 'undefined') {
    return `https://github.com/bishopz/2026-boilerplate${pathname}`;
  }

  return new URL(pathname, window.location.origin).toString();
};

export const PageMeta = ({ title, description }: PageMetaProps) => {
  const { pathname } = useLocation();
  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(pathname);
    const imageAlt = `${title} Preview`;
    const metaUpdates: HeadTagUpdate[] = [
      { selector: 'meta[charset]', attributes: { charset: 'UTF-8' } },
      { selector: 'meta[name="viewport"]', attributes: { name: 'viewport', content: 'width=device-width, initial-scale=1.0' } },
      { selector: 'meta[http-equiv="Content-Security-Policy"]', attributes: { 'http-equiv': 'Content-Security-Policy', content: 'upgrade-insecure-requests' } },
      { selector: 'meta[http-equiv="X-Content-Type-Options"]', attributes: { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' } },
      { selector: 'meta[http-equiv="X-Frame-Options"]', attributes: { 'http-equiv': 'X-Frame-Options', content: 'DENY' } },
      { selector: 'meta[name="title"]', attributes: { name: 'title', content: title } },
      { selector: 'meta[name="description"]', attributes: { name: 'description', content: description } },
      { selector: 'meta[name="author"]', attributes: { name: 'author', content: DEFAULT_AUTHOR } },
      { selector: 'meta[name="keywords"]', attributes: { name: 'keywords', content: DEFAULT_KEYWORDS } },
      { selector: 'meta[name="robots"]', attributes: { name: 'robots', content: 'index, follow' } },
      { selector: 'meta[name="language"]', attributes: { name: 'language', content: DEFAULT_LANGUAGE } },
      { selector: 'meta[name="revisit-after"]', attributes: { name: 'revisit-after', content: '7 days' } },
      { selector: 'meta[name="generator"]', attributes: { name: 'generator', content: 'Vite' } },
      { selector: 'meta[property="og:type"]', attributes: { property: 'og:type', content: 'website' } },
      { selector: 'meta[property="og:site_name"]', attributes: { property: 'og:site_name', content: title } },
      { selector: 'meta[property="og:title"]', attributes: { property: 'og:title', content: title } },
      { selector: 'meta[property="og:description"]', attributes: { property: 'og:description', content: description } },
      { selector: 'meta[property="og:image"]', attributes: { property: 'og:image', content: PREVIEW_IMAGE_URL } },
      { selector: 'meta[property="og:image:alt"]', attributes: { property: 'og:image:alt', content: imageAlt } },
      { selector: 'meta[property="og:url"]', attributes: { property: 'og:url', content: canonicalUrl } },
      { selector: 'meta[property="og:locale"]', attributes: { property: 'og:locale', content: DEFAULT_LOCALE } },
      { selector: 'meta[name="twitter:card"]', attributes: { name: 'twitter:card', content: 'summary_large_image' } },
      { selector: 'meta[name="twitter:title"]', attributes: { name: 'twitter:title', content: title } },
      { selector: 'meta[name="twitter:description"]', attributes: { name: 'twitter:description', content: description } },
      { selector: 'meta[name="twitter:image"]', attributes: { name: 'twitter:image', content: PREVIEW_IMAGE_URL } },
      { selector: 'meta[name="twitter:image:alt"]', attributes: { name: 'twitter:image:alt', content: imageAlt } },
      { selector: 'meta[name="twitter:site"]', attributes: { name: 'twitter:site', content: DEFAULT_TWITTER_SITE } },
      { selector: 'meta[name="theme-color"]', attributes: { name: 'theme-color', content: '#ffffff' } },
      { selector: 'meta[name="mobile-web-app-capable"]', attributes: { name: 'mobile-web-app-capable', content: 'yes' } },
      { selector: 'meta[name="apple-mobile-web-app-title"]', attributes: { name: 'apple-mobile-web-app-title', content: title } },
      { selector: 'meta[name="apple-mobile-web-app-status-bar-style"]', attributes: { name: 'apple-mobile-web-app-status-bar-style', content: 'default' } },
    ];

    document.title = title;
    metaUpdates.forEach(({ selector, attributes }) => { upsertMeta(selector, attributes); });
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
  }, [description, pathname, title]);

  return null;
};
