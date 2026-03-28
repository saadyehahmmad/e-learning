import { CourseEntity } from '../../../../../courses/infrastructure/persistence/relational/entities/course.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'quiz',
})
export class QuizEntity extends EntityRelationalHelper {
  @ManyToOne(() => CourseEntity, { eager: true, nullable: false })
  course: CourseEntity;

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

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
