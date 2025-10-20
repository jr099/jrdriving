import { createClient } from '@supabase/supabase-js';

const importMetaEnv = (() => {
  try {
    return (Function('return typeof import.meta !== "undefined" ? import.meta : undefined;')() as
      | { env?: Record<string, string | undefined> }
      | undefined)?.env;
  } catch {
    return undefined;
  }
})();

const nodeEnv = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env;
const supabaseUrl = importMetaEnv?.VITE_SUPABASE_URL ?? nodeEnv?.VITE_SUPABASE_URL;
const supabaseAnonKey = importMetaEnv?.VITE_SUPABASE_ANON_KEY ?? nodeEnv?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
