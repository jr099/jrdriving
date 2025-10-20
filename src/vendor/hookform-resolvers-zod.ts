import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form';
import type { ZodType } from 'zod';

export function zodResolver<TFieldValues extends FieldValues>(
  schema: ZodType<TFieldValues>
): Resolver<TFieldValues> {
  return (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} as FieldErrors<TFieldValues> };
    }

    const fieldErrors: FieldErrors<TFieldValues> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string') {
        fieldErrors[key as keyof TFieldValues] = { message: issue.message };
      }
    }

    return { values: {} as TFieldValues, errors: fieldErrors };
  };
}
