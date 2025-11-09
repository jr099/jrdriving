export function resolveInsertId(result: unknown): number | undefined {
  if (!result) {
    return undefined;
  }

  if (Array.isArray(result)) {
    for (const item of result) {
      const value = resolveInsertId(item);
      if (typeof value === 'number') {
        return value;
      }
    }
    return undefined;
  }

  if (typeof result === 'object') {
    const insertId = (result as { insertId?: unknown }).insertId;
    if (typeof insertId === 'number') {
      return insertId;
    }
    if (typeof insertId === 'bigint') {
      return Number(insertId);
    }
  }

  return undefined;
}
