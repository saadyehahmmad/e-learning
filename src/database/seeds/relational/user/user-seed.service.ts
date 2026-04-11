import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

/**
 * Seeds baseline users (admin, tutor, student) matching UserEntity columns.
 * Must run after role and status seeds; e-learning seed expects `user@student.com`.
 */
@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  /** Upserts demo accounts by email or by fixed role slot. */
  async run() {
    const usersToSeed = [
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'user@admin.com',
        password: 'admin',
        roleId: RoleEnum.admin,
        roleName: 'Admin',
      },
      {
        firstName: 'Jane',
        lastName: 'Tutor',
        email: 'user@tutor.com',
        password: 'tutor',
        roleId: RoleEnum.tutor,
        roleName: 'Tutor',
      },
      {
        firstName: 'John',
        lastName: 'Student',
        email: 'user@student.com',
        password: 'student',
        roleId: RoleEnum.student,
        roleName: 'Student',
      },
    ];

    for (const user of usersToSeed) {
      const existingUserByEmail = await this.repository.findOne({
        where: { email: user.email },
      });
      const existingUserByRole = existingUserByEmail
        ? null
        : await this.repository.findOne({
            where: { role: { id: user.roleId } },
          });
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await this.repository.save(
        this.repository.create({
          id: existingUserByEmail?.id ?? existingUserByRole?.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: hashedPassword,
          role: {
            id: user.roleId,
            name: user.roleName,
          },
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }
  }
}
