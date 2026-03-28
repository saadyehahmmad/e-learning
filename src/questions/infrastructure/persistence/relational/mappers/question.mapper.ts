import { Question } from '../../../../domain/question';

import { QuizMapper } from '../../../../../quizzes/infrastructure/persistence/relational/mappers/quiz.mapper';

import { QuestionEntity } from '../entities/question.entity';

export class QuestionMapper {
  static toDomain(raw: QuestionEntity): Question {
    const domainEntity = new Question();
    domainEntity.correctAnswer = raw.correctAnswer;

    domainEntity.options = raw.options;

    domainEntity.prompt = raw.prompt;

    if (raw.quiz) {
      domainEntity.quiz = QuizMapper.toDomain(raw.quiz);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Question): QuestionEntity {
    const persistenceEntity = new QuestionEntity();
    persistenceEntity.correctAnswer = domainEntity.correctAnswer;

    persistenceEntity.options = domainEntity.options;

    persistenceEntity.prompt = domainEntity.prompt;

    if (domainEntity.quiz) {
      persistenceEntity.quiz = QuizMapper.toPersistence(domainEntity.quiz);
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
