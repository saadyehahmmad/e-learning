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
  name: 'review',
})
export class ReviewEntity extends EntityRelationalHelper {
  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  reviewer: UserEntity;

  @Column({
    nullable: false,
    type: String,
  })
  targetType: string;

  @Column({
    nullable: true,
    type: String,
  })
  comment?: string | null;

  @Column({
    nullable: false,
    type: Number,
  })
  rating: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
