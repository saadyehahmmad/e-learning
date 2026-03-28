import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { StudentAnswer } from '../../domain/student-answer';

export abstract class StudentAnswerRepository {
  abstract create(
    data: Omit<StudentAnswer, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<StudentAnswer>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<StudentAnswer[]>;

  abstract findByQuizId(quizId: string): Promise<StudentAnswer[]>;

  abstract findByQuizIdAndStudentId(
    quizId: string,
    studentId: number,
  ): Promise<StudentAnswer[]>;

  abstract getAttemptSummaryByQuizIdAndStudentId(
    quizId: string,
    studentId: number,
  ): Promise<{ attemptCount: number; lastSubmittedAt: Date | null }>;

  abstract findById(
    id: StudentAnswer['id'],
  ): Promise<NullableType<StudentAnswer>>;

  abstract findByIds(ids: StudentAnswer['id'][]): Promise<StudentAnswer[]>;

  abstract update(
    id: StudentAnswer['id'],
    payload: DeepPartial<StudentAnswer>,
  ): Promise<StudentAnswer | null>;

  abstract remove(id: StudentAnswer['id']): Promise<void>;
}
