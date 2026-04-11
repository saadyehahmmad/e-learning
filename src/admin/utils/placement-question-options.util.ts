export type PlacementQuestionType = 'single' | 'multi' | 'text';

export interface ParsedPlacementQuestionOptions {
  type: PlacementQuestionType;
  options: string[];
}

/**
 * Maps persisted `question.options` (JSON wrapper or legacy) to API `options[]` and `type`.
 */
export function parsePlacementQuestionOptions(
  optionsRaw: string,
): ParsedPlacementQuestionOptions {
  const trimmed = (optionsRaw || '').trim();
  if (!trimmed) {
    return { type: 'text', options: [] };
  }
  try {
    const parsed = JSON.parse(trimmed) as {
      type?: PlacementQuestionType;
      options?: string[];
    };
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.options)) {
      return {
        type: parsed.type ?? 'single',
        options: parsed.options,
      };
    }
  } catch {
    // fall through
  }
  return { type: 'single', options: [] };
}

/**
 * Serializes admin placement question body to stored `options` column (JSON string).
 */
export function serializePlacementQuestionOptions(
  type: PlacementQuestionType,
  options: string[],
): string {
  return JSON.stringify({ type, options });
}
