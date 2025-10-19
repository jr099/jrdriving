export const CLIENT_DASHBOARD_PATH = 'client';
export const DRIVER_DASHBOARD_PATH = 'chauffeur';
export const ADMIN_DASHBOARD_PATH = 'admin';
export const DASHBOARD_SELECTOR_PATH = 'tableaux-de-bord';

export const PROTECTED_DASHBOARD_PATHS = [
  CLIENT_DASHBOARD_PATH,
  DRIVER_DASHBOARD_PATH,
  ADMIN_DASHBOARD_PATH,
] as const;
