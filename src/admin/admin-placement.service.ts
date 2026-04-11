import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlacementService } from '../placement/placement.service';
import {
  parsePlacementQuestionOptions,
  PlacementQuestionType,
  serializePlacementQuestionOptions,
} from './utils/placement-question-options.util';
import {
  parseQuestionPublicId,
  toQuestionPublicId,
} from './utils/admin-public-ids.util';
import { PlacementQuestion } from '../placement/domain/placement-question';

/**
 * Placement test workspace: single aggregate via {@link PlacementService}.
 */
@Injectable()
export class AdminPlacementService {
  constructor(private readonly placementService: PlacementService) {}

  /**
   * Returns placement metadata and all questions.
   */
  async getWorkspace() {
    const placement = await this.placementService.findPlacementTest();
    if (!placement) {
      throw new NotFoundException({
        error: {
          code: 'NOT_FOUND',
          message: 'Placement test is not configured',
          details: [],
        },
      });
    }

    const maxQuestions = placement.maxQuestions ?? 50;

    return {
      placementId: `placement-${placement.id}`,
      title: placement.title,
      examDurationMinutes: placement.examDurationMinutes ?? 50,
      maxQuestions,
      description:
        placement.description ??
        placement.quizDescription ??
        'Placement test description for learners',
      courseTitle: placement.courseTitle ?? 'Placement Course',
      courseLevel: placement.courseLevel ?? 'all',
      questions: placement.questions.map((q) => this.questionToWire(q)),
    };
  }

  /**
   * Adds a placement question when under capacity.
   */
  async createQuestion(body: {
    type: PlacementQuestionType;
    prompt: string;
    options: string[];
    correctAnswer: string;
  }) {
    const placement = await this._requirePlacement();
    const maxQuestions = placement.maxQuestions ?? 50;
    if (placement.questions.length >= maxQuestions) {
      throw new ConflictException({
        error: {
          code: 'CONFLICT',
          message: 'Maximum number of placement questions reached',
          details: [{ field: 'maxQuestions', issue: 'at_capacity' }],
        },
      });
    }

    const optionsPayload = serializePlacementQuestionOptions(
      body.type,
      body.options,
    );

    const created = await this.placementService.addQuestion(placement.id, {
      prompt: body.prompt.trim(),
      options: optionsPayload,
      correctAnswer: body.correctAnswer.trim(),
    });

    return this.questionToWire(created);
  }

  /**
   * Updates a placement question (partial).
   */
  async updateQuestion(
    questionPublicId: string,
    body: Partial<{
      type: PlacementQuestionType;
      prompt: string;
      options: string[];
      correctAnswer: string;
    }>,
  ) {
    const id = parseQuestionPublicId(questionPublicId);
    const placement = await this._requirePlacement();
    const existing = placement.questions.find((q) => q.id === id);
    if (!existing) {
      throw new NotFoundException({
        error: {
          code: 'NOT_FOUND',
          message: 'Question not found',
          details: [],
        },
      });
    }

    const parsed = parsePlacementQuestionOptions(existing.options);
    const nextType = body.type ?? parsed.type;
    const nextOptions =
      body.options !== undefined ? body.options : parsed.options;

    const patch: {
      prompt?: string;
      options?: string;
      correctAnswer?: string;
    } = {};
    if (body.prompt !== undefined) {
      patch.prompt = body.prompt.trim();
    }
    if (body.correctAnswer !== undefined) {
      patch.correctAnswer = body.correctAnswer.trim();
    }
    if (body.type !== undefined || body.options !== undefined) {
      patch.options = serializePlacementQuestionOptions(nextType, nextOptions);
    }

    const updated = await this.placementService.updateQuestion(
      placement.id,
      id,
      patch,
    );

    return this.questionToWire(updated);
  }

  /**
   * Deletes a placement question.
   */
  async deleteQuestion(questionPublicId: string): Promise<void> {
    const id = parseQuestionPublicId(questionPublicId);
    const placement = await this._requirePlacement();
    const existing = placement.questions.find((q) => q.id === id);
    if (!existing) {
      throw new NotFoundException({
        error: {
          code: 'NOT_FOUND',
          message: 'Question not found',
          details: [],
        },
      });
    }
    await this.placementService.deleteQuestion(placement.id, id);
  }

  private async _requirePlacement() {
    const placement = await this.placementService.findPlacementTest();
    if (!placement) {
      throw new NotFoundException({
        error: {
          code: 'NOT_FOUND',
          message: 'Placement test is not configured',
          details: [],
        },
      });
    }
    return placement;
  }

  private questionToWire(q: PlacementQuestion) {
    const parsed = parsePlacementQuestionOptions(q.options);
    return {
      id: toQuestionPublicId(q.id),
      prompt: q.prompt,
      type: parsed.type,
      options: parsed.options,
      correctAnswer: q.correctAnswer,
      createdAt: q.createdAt.toISOString(),
      updatedAt: q.updatedAt.toISOString(),
    };
  }
}
