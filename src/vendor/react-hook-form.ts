import { useCallback, useMemo, useState } from 'react';

type Primitive = string | number | boolean | undefined | null | Date;
type FieldValue = Primitive | Primitive[] | Record<string, Primitive>;
export type FieldValues = Record<string, FieldValue>;

export type FieldError = {
  type?: string;
  message?: string;
};

export type FieldErrors<TFieldValues extends FieldValues> = {
  [K in keyof TFieldValues]?: FieldError;
};

export type SubmitHandler<TFieldValues extends FieldValues> = (
  values: TFieldValues,
  event?: unknown
) => void | Promise<void>;

export type SubmitErrorHandler<TFieldValues extends FieldValues> = (
  errors: FieldErrors<TFieldValues>,
  event?: unknown
) => void;

type ResolverResult<TFieldValues extends FieldValues> = {
  values: TFieldValues | Record<string, never>;
  errors: FieldErrors<TFieldValues>;
};

export type Resolver<TFieldValues extends FieldValues> = (
  values: TFieldValues
) => Promise<ResolverResult<TFieldValues>> | ResolverResult<TFieldValues>;

type UseFormProps<TFieldValues extends FieldValues> = {
  resolver?: Resolver<TFieldValues>;
  defaultValues?: Partial<TFieldValues>;
};

type RegisteredField = {
  name: string;
  value: FieldValue;
  onChange: (event: { target: { value: FieldValue } } | FieldValue) => void;
};

type FormState<TFieldValues extends FieldValues> = {
  errors: FieldErrors<TFieldValues>;
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
};

export type UseFormReturn<TFieldValues extends FieldValues> = {
  register: (name: keyof TFieldValues & string) => RegisteredField;
  handleSubmit: (
    onValid: SubmitHandler<TFieldValues>,
    onInvalid?: SubmitErrorHandler<TFieldValues>
  ) => (event?: { preventDefault?: () => void }) => Promise<void>;
  reset: (values?: Partial<TFieldValues>) => void;
  setError: (name: keyof TFieldValues & string, error: FieldError) => void;
  clearErrors: (name?: keyof TFieldValues & string) => void;
  formState: FormState<TFieldValues>;
};

export function useForm<TFieldValues extends FieldValues>(
  props: UseFormProps<TFieldValues> = {}
): UseFormReturn<TFieldValues> {
  const { resolver, defaultValues } = props;
  const [values, setValues] = useState<FieldValues>({ ...(defaultValues ?? {}) });
  const [errors, setErrors] = useState<FieldErrors<TFieldValues>>({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmitSuccessful, setSubmitSuccessful] = useState(false);

  const register = useCallback(
    (name: keyof TFieldValues & string): RegisteredField => ({
      name,
      value: (values[name] as FieldValue) ?? '',
      onChange: (event) => {
        const value =
          typeof event === 'object' && event !== null && 'target' in event
            ? (event as { target: { value: FieldValue } }).target.value
            : (event as FieldValue);
        setValues((previous: FieldValues) => ({ ...previous, [name]: value }));
        setErrors((previous: FieldErrors<TFieldValues>) => ({ ...previous, [name]: undefined }));
      },
    }),
    [values]
  );

  const runResolver = useCallback(
    async (currentValues: TFieldValues): Promise<ResolverResult<TFieldValues>> => {
      if (!resolver) {
        return { values: currentValues, errors: {} as FieldErrors<TFieldValues> };
      }
      return resolver(currentValues);
    },
    [resolver]
  );

  const handleSubmit = useCallback(
    (
      onValid: SubmitHandler<TFieldValues>,
      onInvalid?: SubmitErrorHandler<TFieldValues>
    ) => {
      return async (event?: { preventDefault?: () => void }) => {
        event?.preventDefault?.();
        const currentValues = values as TFieldValues;
        setSubmitting(true);
        setSubmitSuccessful(false);
        try {
          const resolution = await runResolver(currentValues);
          const hasErrors = Object.values(resolution.errors).some(Boolean);
          if (hasErrors) {
            setErrors(resolution.errors);
            onInvalid?.(resolution.errors, event);
            setSubmitSuccessful(false);
            return;
          }
          setErrors({});
          await onValid(resolution.values as TFieldValues, event);
          setSubmitSuccessful(true);
        } finally {
          setSubmitting(false);
        }
      };
    },
    [runResolver, values]
  );

  const reset = useCallback(
    (nextValues?: Partial<TFieldValues>) => {
      const merged = nextValues ? { ...nextValues } : { ...(defaultValues ?? {}) };
      setValues(merged);
      setErrors({});
      setSubmitSuccessful(false);
    },
    [defaultValues]
  );

  const setError = useCallback((name: keyof TFieldValues & string, error: FieldError) => {
    setErrors((previous: FieldErrors<TFieldValues>) => ({ ...previous, [name]: error }));
    setSubmitSuccessful(false);
  }, []);

  const clearErrors = useCallback((name?: keyof TFieldValues & string) => {
    if (name) {
      setErrors((previous: FieldErrors<TFieldValues>) => ({ ...previous, [name]: undefined }));
      return;
    }
    setErrors({});
  }, []);

  const formState = useMemo(
    () => ({ errors, isSubmitting, isSubmitSuccessful }),
    [errors, isSubmitting, isSubmitSuccessful]
  );

  return {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState,
  };
}
