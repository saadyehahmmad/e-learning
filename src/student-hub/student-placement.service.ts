import { Injectable, NotFoundException } from '@nestjs/common';
import { PlacementService } from '../placement/placement.service';
import { SubmitPlacementAnswersDto } from '../placement/dto/submit-placement-answers.dto';
import { parsePlacementQuestionOptions } from '../admin/utils/placement-question-options.util';
import { toQuestionPublicId } from '../admin/utils/admin-public-ids.util';

/**
 * Student-safe placement payload: metadata and questions **without** correct answers.
 */
@Injectable()
export class StudentPlacementService {
  constructor(private readonly placementService: PlacementService) {}

  /**
   * Returns the active placement test for the learner UI (exam screen).
   * Omits `correctAnswer` on each question so answers cannot be scraped from the client.
   */
  async getPlacementExam() {
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
      questions: placement.questions.map((q) => {
        const parsed = parsePlacementQuestionOptions(q.options);
        return {
          id: toQuestionPublicId(q.id),
          prompt: q.prompt,
          type: parsed.type,
          options: parsed.options,
          createdAt: q.createdAt.toISOString(),
          updatedAt: q.updatedAt.toISOString(),
        };
      }),
    };
  }

  /**
   * Submits answers for a specific placement, e.g. id from `GET /student/placement` → `placementId` `placement-<uuid>`.
   *
   * @param placementSegment - `placement-<uuid>` or raw placement primary key (uuid string)
   */
  async submitAnswersForPlacement(
    placementSegment: string,
    userId: number,
    dto: SubmitPlacementAnswersDto,
  ) {
    const placementId = this.parsePlacementPublicId(placementSegment);
    const placement = await this.placementService.findById(placementId);
    if (!placement) {
      throw new NotFoundException({
        error: {
          code: 'NOT_FOUND',
          message: 'Placement not found',
          details: [],
        },
      });
    }

    const normalized: SubmitPlacementAnswersDto = {
      answers: dto.answers.map((a) => ({
        answer: a.answer,
        questionId: a.questionId.startsWith('q_')
          ? a.questionId.slice(2)
          : a.questionId,
      })),
    };

    return this.placementService.submit(placement.id, userId, normalized);
  }

  /**
   * Strips optional `placement-` prefix from route param (matches wire `placementId`).
   */
  private parsePlacementPublicId(segment: string): string {
    const prefix = 'placement-';
    const s = segment.trim();
    return s.startsWith(prefix) ? s.slice(prefix.length) : s;
  }
}
