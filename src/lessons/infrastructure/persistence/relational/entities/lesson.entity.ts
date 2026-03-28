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
  name: 'lesson',
})
export class LessonEntity extends EntityRelationalHelper {
  @ManyToOne(() => CourseEntity, { eager: true, nullable: false })
  course: CourseEntity;

  @Column({
    nullable: false,
    type: Number,
  })
  lessonOrder: number;

  @Column({
    nullable: true,
    type: String,
  })
  videoUrl?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  content?: string | null;

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
