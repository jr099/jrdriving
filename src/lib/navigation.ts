import type { Profile } from './api-types';

export type AppPage =
  | 'home'
  | 'services'
  | 'quote'
  | 'contact'
  | 'login'
  | 'client'
  | 'driver'
  | 'admin'
  | 'legal'
  | 'terms'
  | 'privacy';

export const PAGE_TO_PATH: Record<AppPage, string> = {
  home: '/',
  services: '/services',
  quote: '/devis',
  contact: '/contact',
  login: '/login',
  client: '/client',
  driver: '/chauffeur',
  admin: '/admin',
  legal: '/mentions-legales',
  terms: '/conditions-generales',
  privacy: '/politique-confidentialite',
};

const ALIAS_TO_PAGE: Record<string, AppPage> = {
  devis: 'quote',
  chauffeur: 'driver',
  client: 'client',
  admin: 'admin',
  contact: 'contact',
  login: 'login',
  services: 'services',
  'mentions-legales': 'legal',
  'conditions-generales': 'terms',
  'politique-confidentialite': 'privacy',
};

const PATH_PAGE_ENTRIES = Object.entries(PAGE_TO_PATH).sort(([, pathA], [, pathB]) => pathB.length - pathA.length);

export function resolvePagePath(page: string): string {
  const normalized = (page.toLowerCase() as AppPage) ?? 'home';
  return PAGE_TO_PATH[normalized] ?? PAGE_TO_PATH.home;
}

export function getPageFromPath(pathname: string): AppPage {
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  for (const [page, path] of PATH_PAGE_ENTRIES) {
    if (path === '/') {
      if (cleanPath === '/') {
        return page as AppPage;
      }
      continue;
    }

    if (cleanPath === path || cleanPath.startsWith(`${path}/`)) {
      return page as AppPage;
    }
  }

  const segments = cleanPath.split('/').filter(Boolean);
  const aliasKey = segments[0];
  if (aliasKey && ALIAS_TO_PAGE[aliasKey]) {
    return ALIAS_TO_PAGE[aliasKey];
  }

  return 'home';
}

export function getRoleDefaultPage(role: Profile['role']): AppPage {
  switch (role) {
    case 'admin':
      return 'admin';
    case 'driver':
      return 'driver';
    case 'client':
    default:
      return 'client';
  }
}

export function getRoleRedirectPath(role: Profile['role']): string {
  return PAGE_TO_PATH[getRoleDefaultPage(role)];
}

export type PageToPathMap = typeof PAGE_TO_PATH;
