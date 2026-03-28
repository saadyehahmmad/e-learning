import { StudentAnswer } from '../../../../domain/student-answer';

import { QuizMapper } from '../../../../../quizzes/infrastructure/persistence/relational/mappers/quiz.mapper';

import { QuestionMapper } from '../../../../../questions/infrastructure/persistence/relational/mappers/question.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { StudentAnswerEntity } from '../entities/student-answer.entity';

export class StudentAnswerMapper {
  static toDomain(raw: StudentAnswerEntity): StudentAnswer {
    const domainEntity = new StudentAnswer();
    domainEntity.submittedAt = raw.submittedAt;

    domainEntity.isCorrect = raw.isCorrect;

    domainEntity.answer = raw.answer;

    if (raw.quiz) {
      domainEntity.quiz = QuizMapper.toDomain(raw.quiz);
    }

    if (raw.question) {
      domainEntity.question = QuestionMapper.toDomain(raw.question);
    }

    if (raw.student) {
      domainEntity.student = UserMapper.toDomain(raw.student);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: StudentAnswer): StudentAnswerEntity {
    const persistenceEntity = new StudentAnswerEntity();
    persistenceEntity.submittedAt = domainEntity.submittedAt;

    persistenceEntity.isCorrect = domainEntity.isCorrect;

    persistenceEntity.answer = domainEntity.answer;

    if (domainEntity.quiz) {
      persistenceEntity.quiz = QuizMapper.toPersistence(domainEntity.quiz);
    }

    if (domainEntity.question) {
      persistenceEntity.question = QuestionMapper.toPersistence(
        domainEntity.question,
      );
    }

    if (domainEntity.student) {
      persistenceEntity.student = UserMapper.toPersistence(
        domainEntity.student,
      );
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
