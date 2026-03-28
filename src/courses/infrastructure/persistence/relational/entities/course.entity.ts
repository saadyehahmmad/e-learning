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
  name: 'course',
})
export class CourseEntity extends EntityRelationalHelper {
  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  tutor: UserEntity;

  @Column({
    nullable: true,
    type: Number,
  })
  price?: number | null;

  @Column({
    nullable: false,
    type: String,
  })
  level: string;

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
