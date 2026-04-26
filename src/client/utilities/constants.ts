// The identifier used in local storage
export const LOCAL_STORAGE_ID = 'MomentumBoard';

export const META = {
  PREVIEW_IMAGE: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80',
  FALLBACK: 'https://github.com/skeiromar/Momentum-Board',
  AUTHOR: 'Omar',
  KEYWORDS: 'momentum board, habit tracker, daily board, local-first, react, vite',
  LANGUAGE: 'English',
  REVISIT_AFTER: '7 days',
  GENERATOR: 'Vite',
  OG_TYPE: 'website',
  LOCALE: 'en_US',
  TWITTER_CARD: 'summary_large_image',
  TWITTER_SITE: '@skeiromar',
  THEME_COLOR: '#07111f',
  MOBILE_WEB_APP_CAPABLE: 'yes',
  APPLE_STATUS_BAR_STYLE: 'default',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PRODUCT: '/product',
  ABOUT: '/about',
  POLICIES: '/policies',
  LOGOUT: '/logout',
} as const;

export const API_PATHS = {
  LOGIN: '/login/password',
  LOGOUT: '/logout',
  SESSION: '/api/session',
  KEY: '/api/key',
} as const;
