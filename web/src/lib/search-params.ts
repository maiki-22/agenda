export function toSearchParamRecord(
  searchParams: URLSearchParams,
): Record<string, string | undefined> {
  const entries = Array.from(searchParams.entries()).map(([key, value]) => {
    const normalizedValue = value.trim();
    return [key, normalizedValue.length > 0 ? normalizedValue : undefined] as const;
  });

  return Object.fromEntries(entries);
}

export function normalizeSearchParamObject(
  searchParams: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => {
      const raw = Array.isArray(value) ? value[0] : value;
      const normalizedValue = raw?.trim();
      return [key, normalizedValue && normalizedValue.length > 0 ? normalizedValue : undefined] as const;
    }),
  );
}

export function getTypedSearchParams(
  request: Request,
): Record<string, string | undefined> {
  const { searchParams } = new URL(request.url);
  return toSearchParamRecord(searchParams);
}