import { PlacementEntity } from '../../../../../placement/infrastructure/persistence/relational/entities/placement.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

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
  name: 'student_answer',
})
export class StudentAnswerEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: Date,
  })
  submittedAt?: Date;

  @Column({
    nullable: false,
    type: Boolean,
  })
  isCorrect?: boolean;

  @Column({
    nullable: false,
    type: String,
  })
  answer: string;

  @ManyToOne(() => PlacementEntity, { eager: true, nullable: false })
  placement: PlacementEntity;

  @Column({
    nullable: false,
    type: 'uuid',
  })
  questionId: string;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  student: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
