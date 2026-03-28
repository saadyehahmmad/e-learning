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
  name: 'availability',
})
export class AvailabilityEntity extends EntityRelationalHelper {
  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  tutor: UserEntity;

  @Column({
    nullable: false,
    type: String,
  })
  endTime: string;

  @Column({
    nullable: false,
    type: String,
  })
  startTime: string;

  @Column({
    nullable: false,
    type: Number,
  })
  dayOfWeek: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
