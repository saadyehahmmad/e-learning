import { Placement } from '../../../../domain/placement';
import { PlacementQuestion } from '../../../../domain/placement-question';
import {
  PlacementEntity,
  PlacementQuestionJson,
} from '../entities/placement.entity';

export class PlacementMapper {
  static toDomain(raw: PlacementEntity): Placement {
    const p = new Placement();
    p.id = raw.id;
    p.title = raw.title;
    p.passingScore = raw.passingScore;
    p.description = raw.description;
    p.examDurationMinutes = raw.examDurationMinutes;
    p.quizDescription = raw.quizDescription;
    p.courseTitle = raw.courseTitle;
    p.courseLevel = raw.courseLevel;
    p.createdAt = raw.createdAt;
    p.updatedAt = raw.updatedAt;
    p.questions = (raw.questions ?? []).map((q) =>
      PlacementMapper.questionJsonToDomain(q),
    );
    return p;
  }

  static toPersistence(domain: Placement): PlacementEntity {
    const e = new PlacementEntity();
    e.id = domain.id;
    e.title = domain.title;
    e.passingScore = domain.passingScore;
    e.description = domain.description;
    e.examDurationMinutes = domain.examDurationMinutes;
    e.quizDescription = domain.quizDescription;
    e.courseTitle = domain.courseTitle;
    e.courseLevel = domain.courseLevel;
    e.createdAt = domain.createdAt;
    e.updatedAt = domain.updatedAt;
    e.questions = (domain.questions ?? []).map((q) =>
      PlacementMapper.questionDomainToJson(q),
    );
    return e;
  }

  static questionJsonToDomain(q: PlacementQuestionJson): PlacementQuestion {
    const pq = new PlacementQuestion();
    pq.id = q.id;
    pq.prompt = q.prompt;
    pq.options = q.options;
    pq.correctAnswer = q.correctAnswer;
    pq.createdAt = new Date(q.createdAt);
    pq.updatedAt = new Date(q.updatedAt);
    return pq;
  }

  static questionDomainToJson(q: PlacementQuestion): PlacementQuestionJson {
    return {
      id: q.id,
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      createdAt: q.createdAt.toISOString(),
      updatedAt: q.updatedAt.toISOString(),
    };
  }
}
