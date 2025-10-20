export type ZodIssue = {
  path: (string | number)[];
  message: string;
};

export class ZodError extends Error {
  issues: ZodIssue[];

  constructor(issues: ZodIssue[]) {
    super(issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n'));
    this.issues = issues;
    this.name = 'ZodError';
  }
}

export type SafeParseSuccess<T> = { success: true; data: T };
export type SafeParseFailure = { success: false; error: ZodError };
export type SafeParseReturnType<T> = SafeParseSuccess<T> | SafeParseFailure;

type InternalParseSuccess<T> = { success: true; data: T };
type InternalParseFailure = { success: false; issues: ZodIssue[] };
type InternalParseResult<T> = InternalParseSuccess<T> | InternalParseFailure;

export abstract class ZodType<T> {
  abstract _parse(data: unknown, path: (string | number)[]): InternalParseResult<T>;

  safeParse(data: unknown): SafeParseReturnType<T> {
    const result = this._parse(data, []);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: new ZodError(result.issues) };
  }

  parse(data: unknown): T {
    const parsed = this.safeParse(data);
    if (!parsed.success) {
      throw parsed.error;
    }
    return parsed.data;
  }

  optional(): ZodOptional<T> {
    return new ZodOptional(this);
  }

  nullable(): ZodNullable<T> {
    return new ZodNullable(this);
  }
}

export type ZodTypeAny = ZodType<unknown>;

type Validator<T> = (value: T, path: (string | number)[]) => string | null;

class ZodString extends ZodType<string> {
  private validators: Validator<string>[] = [];

  _parse(data: unknown, path: (string | number)[]): InternalParseResult<string> {
    if (typeof data !== 'string') {
      return { success: false, issues: [{ path, message: 'Expected string' }] };
    }

    for (const validator of this.validators) {
      const errorMessage = validator(data, path);
      if (errorMessage) {
        return { success: false, issues: [{ path, message: errorMessage }] };
      }
    }

    return { success: true, data };
  }

  min(length: number, message?: string): this {
    this.validators.push((value) =>
      value.length >= length ? null : message ?? `Must contain at least ${length} characters`
    );
    return this;
  }

  max(length: number, message?: string): this {
    this.validators.push((value) =>
      value.length <= length ? null : message ?? `Must contain at most ${length} characters`
    );
    return this;
  }

  email(message = 'Invalid email'): this {
    const emailRegex = /^(?:[^\s@]+@[^\s@]+\.[^\s@]+)$/;
    this.validators.push((value) => (emailRegex.test(value) ? null : message));
    return this;
  }

  regex(pattern: RegExp, message = 'Invalid format'): this {
    this.validators.push((value) => (pattern.test(value) ? null : message));
    return this;
  }
}

class ZodNullable<T> extends ZodType<T | null> {
  constructor(private inner: ZodType<T>) {
    super();
  }

  _parse(data: unknown, path: (string | number)[]): InternalParseResult<T | null> {
    if (data === null) {
      return { success: true, data: null };
    }
    return this.inner._parse(data, path);
  }
}

class ZodOptional<T> extends ZodType<T | undefined> {
  constructor(private inner: ZodType<T>) {
    super();
  }

  _parse(data: unknown, path: (string | number)[]): InternalParseResult<T | undefined> {
    if (typeof data === 'undefined') {
      return { success: true, data: undefined };
    }
    return this.inner._parse(data, path);
  }
}

type Shape = Record<string, ZodTypeAny>;

type InferShape<T extends Shape> = {
  [K in keyof T]: T[K] extends ZodType<infer U> ? U : never;
};

class ZodObject<T extends Shape> extends ZodType<InferShape<T>> {
  constructor(private shape: T) {
    super();
  }

  _parse(data: unknown, path: (string | number)[]): InternalParseResult<InferShape<T>> {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      return { success: false, issues: [{ path, message: 'Expected object' }] };
    }

    const typedData = data as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    const issues: ZodIssue[] = [];

    for (const key of Object.keys(this.shape)) {
      const schema = this.shape[key];
      const childPath = [...path, key];
      const value = typedData[key];
      const parsed = schema._parse(value, childPath);
      if (parsed.success) {
        result[key] = parsed.data;
      } else {
        issues.push(...parsed.issues);
      }
    }

    if (issues.length > 0) {
      return { success: false, issues };
    }

    return { success: true, data: result as InferShape<T> };
  }
}

export const z = {
  string(): ZodString {
    return new ZodString();
  },
  object<T extends Shape>(shape: T): ZodObject<T> {
    return new ZodObject(shape);
  },
};

export type infer<T extends ZodTypeAny> = T extends ZodType<infer Output>
  ? Output
  : never;
