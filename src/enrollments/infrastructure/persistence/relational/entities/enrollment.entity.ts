import { CourseEntity } from '../../../../../courses/infrastructure/persistence/relational/entities/course.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

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
  name: 'enrollment',
})
export class EnrollmentEntity extends EntityRelationalHelper {
  @ManyToOne(() => CourseEntity, { eager: true, nullable: false })
  course: CourseEntity;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  student: UserEntity;

  @Column({
    nullable: true,
    type: Number,
  })
  progress?: number | null;

  @Column({
    nullable: false,
    type: String,
  })
  status: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
