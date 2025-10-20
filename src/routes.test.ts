import { strict as assert } from 'node:assert';
import test from 'node:test';

const processEnv = (((globalThis as any).process ?? ((globalThis as any).process = {})).env ??=
  {} as Record<string, string>);

processEnv.VITE_API_BASE_URL = 'https://api.test.local';

import { PROTECTED_DASHBOARD_PATHS } from './routes.constants.js';

test('router includes driver and admin dashboards', () => {
  assert.ok(
    PROTECTED_DASHBOARD_PATHS.includes('chauffeur'),
    'expected a chauffeur dashboard route'
  );
  assert.ok(
    PROTECTED_DASHBOARD_PATHS.includes('admin'),
    'expected an admin dashboard route'
  );
});
