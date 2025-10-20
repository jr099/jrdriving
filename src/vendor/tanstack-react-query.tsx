import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type MutationKey = readonly unknown[] | undefined;

export type MutationFunction<TData, TVariables> = (variables: TVariables) => Promise<TData> | TData;

export type UseMutationOptions<TData, TError, TVariables, TContext> = {
  mutationKey?: MutationKey;
  mutationFn: MutationFunction<TData, TVariables>;
  onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void;
  onError?: (error: TError, variables: TVariables, context: TContext | undefined) => void;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: TContext | undefined
  ) => void;
};

export type UseMutationResult<TData, TError, TVariables> = {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  data: TData | undefined;
  error: TError | null;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
};

type MutationDefaults = {
  onSuccess?: UseMutationOptions<any, any, any, any>['onSuccess'];
  onError?: UseMutationOptions<any, any, any, any>['onError'];
  onSettled?: UseMutationOptions<any, any, any, any>['onSettled'];
};

export class QueryClient {
  private mutationDefaults = new Map<string, MutationDefaults>();

  setMutationDefaults(key: string, defaults: MutationDefaults) {
    this.mutationDefaults.set(key, defaults);
  }

  getMutationDefaults(key: MutationKey): MutationDefaults | undefined {
    if (!key || key.length === 0) {
      return undefined;
    }
    return this.mutationDefaults.get(JSON.stringify(key));
  }
}

const QueryClientContext = createContext<QueryClient | null>(null);

export function QueryClientProvider({ client, children }: { client: QueryClient; children: ReactNode }) {
  return <QueryClientContext.Provider value={client}>{children}</QueryClientContext.Provider>;
}

export function useQueryClient(): QueryClient {
  const client = useContext(QueryClientContext) as QueryClient | null;
  if (!client) {
    throw new Error('No QueryClient available. Wrap your app in QueryClientProvider.');
  }
  return client;
}

export function useMutation<TData, TError = unknown, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables> {
  const { mutationFn, mutationKey, onError, onSuccess, onSettled } = options;
  const queryClient = useQueryClient();
  const defaults = useMemo(() => queryClient.getMutationDefaults(mutationKey), [mutationKey, queryClient]);

  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<TError | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const reset = useCallback(() => {
    setStatus('idle');
    setData(undefined);
    setError(null);
  }, []);

  const mutateAsync = useCallback(
    async (variables: TVariables) => {
      setStatus('pending');
      setError(null);
      try {
        const result = await mutationFn(variables);
        setData(result);
        setStatus('success');
        const mergedOnSuccess = onSuccess ?? defaults?.onSuccess;
        const mergedOnSettled = onSettled ?? defaults?.onSettled;
        mergedOnSuccess?.(result, variables, undefined as unknown as TContext);
        mergedOnSettled?.(result, null, variables, undefined as unknown as TContext);
        return result;
      } catch (caughtError) {
        const castError = caughtError as TError;
        setError(castError);
        setStatus('error');
        const mergedOnError = onError ?? defaults?.onError;
        const mergedOnSettled = onSettled ?? defaults?.onSettled;
        mergedOnError?.(castError, variables, undefined as unknown as TContext);
        mergedOnSettled?.(undefined, castError, variables, undefined as unknown as TContext);
        throw castError;
      }
    },
    [defaults?.onError, defaults?.onSettled, defaults?.onSuccess, mutationFn, onError, onSettled, onSuccess]
  );

  const mutate = useCallback(
    (variables: TVariables) => {
      void mutateAsync(variables);
    },
    [mutateAsync]
  );

  return {
    mutate,
    mutateAsync,
    data,
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    reset,
  };
}
