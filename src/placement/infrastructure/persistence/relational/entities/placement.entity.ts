import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

/**
 * Wire representation of one question inside `placement.questions` JSONB.
 */
export type PlacementQuestionJson = {
  id: string;
  prompt: string;
  options: string;
  correctAnswer: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Single table for placement test metadata and all questions (JSONB).
 */
@Entity({
  name: 'placement',
})
export class PlacementEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: 'jsonb',
    default: [],
  })
  questions: PlacementQuestionJson[];

  @Column({
    nullable: true,
    type: Number,
  })
  passingScore?: number | null;

  @Column({
    nullable: true,
    type: String,
  })
  description?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  title: string;

  @Column({
    nullable: true,
    type: 'int',
  })
  examDurationMinutes?: number | null;

  @Column({
    nullable: true,
    type: 'int',
  })
  maxQuestions?: number | null;

  @Column({
    nullable: true,
    type: 'text',
  })
  quizDescription?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  courseTitle?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  courseLevel?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
