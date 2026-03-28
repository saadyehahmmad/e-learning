import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import { EnrollmentEntity } from '../../../../../enrollments/infrastructure/persistence/relational/entities/enrollment.entity';

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
  name: 'payment',
})
export class PaymentEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: Date,
  })
  paidAt?: Date | null;

  @Column({
    nullable: true,
    type: String,
  })
  providerReference?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  status: string;

  @Column({
    nullable: false,
    type: String,
  })
  currency: string;

  @Column({
    nullable: false,
    type: Number,
  })
  amount: number;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  student: UserEntity;

  @ManyToOne(() => EnrollmentEntity, { eager: true, nullable: false })
  enrollment: EnrollmentEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
