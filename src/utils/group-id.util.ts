/**
 * Normalizes wire-format group ids (`g_<uuid>`) to the raw FK value.
 */
export function normalizeStoredGroupId(
  wireOrRaw: string | null | undefined,
): string | null | undefined {
  if (wireOrRaw === undefined) {
    return undefined;
  }
  if (wireOrRaw === null || wireOrRaw === '') {
    return null;
  }
  return wireOrRaw.startsWith('g_') ? wireOrRaw.slice(2) : wireOrRaw;
}
