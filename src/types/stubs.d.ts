declare module 'react' {
  export type ReactNode = any;
  export type ReactElement = any;
  export type InputHTMLAttributes<T> = any;
  export function useState<T>(initial: T): [T, (value: T | ((previous: T) => T)) => void];
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useCallback<T extends (...args: any[]) => unknown>(callback: T, deps: unknown[]): T;
  export function createContext<T>(value: T): any;
  export function useContext<T>(context: any): T;
  const React: any;
  export default React;
}

declare module 'react-dom/client' {
  export function createRoot(container: HTMLElement | null): { render: (element: any) => void };
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react-router-dom' {
  export const RouterProvider: any;
  export const createBrowserRouter: any;
  export function useNavigate(): (path: string) => void;
}

declare module 'lucide-react' {
  export const Truck: any;
  export const CheckCircle: any;
  export const Loader2: any;
}

declare module 'node:test' {
  export type TestFn = (...args: any[]) => unknown;
  export default function test(name: string, fn: TestFn): Promise<void>;
  export function describe(name: string, fn: TestFn): Promise<void>;
  export function it(name: string, fn: TestFn): Promise<void>;
}

declare module 'node:assert' {
  export const strict: any;
}

declare module 'node:assert/strict' {
  const assert: any;
  export default assert;
}
