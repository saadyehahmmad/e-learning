import { BadRequestException } from '@nestjs/common';

const STUDENT_PREFIX = 's_';
const GROUP_PREFIX = 'g_';
const QUESTION_PREFIX = 'q_';

/**
 * Builds the wire-format student id (`s_<numericId>`).
 */
export function toStudentPublicId(numericId: number): string {
  return `${STUDENT_PREFIX}${numericId}`;
}

/**
 * Parses `s_<id>` into the numeric user primary key.
 */
export function parseStudentPublicId(id: string): number {
  if (!id?.startsWith(STUDENT_PREFIX)) {
    throw new BadRequestException({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid student id',
        details: [{ field: 'studentId', issue: 'invalid_format' }],
      },
    });
  }
  const n = Number(id.slice(STUDENT_PREFIX.length));
  if (!Number.isFinite(n)) {
    throw new BadRequestException({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid student id',
        details: [{ field: 'studentId', issue: 'invalid_format' }],
      },
    });
  }
  return n;
}

/**
 * Builds the wire-format group id (`g_<uuid>`).
 */
export function toGroupPublicId(uuid: string): string {
  return `${GROUP_PREFIX}${uuid}`;
}

/**
 * Strips the `g_` prefix when present.
 */
export function parseGroupPublicId(id: string): string {
  return id.startsWith(GROUP_PREFIX) ? id.slice(GROUP_PREFIX.length) : id;
}

/**
 * Wire-format question id (`q_<uuid>`).
 */
export function toQuestionPublicId(uuid: string): string {
  return `${QUESTION_PREFIX}${uuid}`;
}

/**
 * Parses `q_<uuid>` into the persisted question id.
 */
export function parseQuestionPublicId(id: string): string {
  if (!id?.startsWith(QUESTION_PREFIX)) {
    throw new BadRequestException({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid question id',
        details: [{ field: 'questionId', issue: 'invalid_format' }],
      },
    });
  }
  return id.slice(QUESTION_PREFIX.length);
}
