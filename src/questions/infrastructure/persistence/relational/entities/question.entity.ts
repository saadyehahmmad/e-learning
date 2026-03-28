import { QuizEntity } from '../../../../../quizzes/infrastructure/persistence/relational/entities/quiz.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'question',
})
export class QuestionEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: String,
  })
  correctAnswer: string;

  @Column({
    nullable: false,
    type: String,
  })
  options: string;

  @Column({
    nullable: false,
    type: String,
  })
  prompt: string;

  @ManyToOne(() => QuizEntity, { eager: true, nullable: false })
  quiz: QuizEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
