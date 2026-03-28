import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

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
        bio: 'Certified English tutor focused on speaking confidence.',
        hourlyRate: 25,
        spokenLanguages: 'English,Arabic',
        certifications: 'TESOL,IELTS',
      },
      {
        firstName: 'John',
        lastName: 'Student',
        email: 'user@student.com',
        password: 'student',
        roleId: RoleEnum.student,
        roleName: 'Student',
        learningGoals: 'Improve speaking and business writing',
        englishLevel: 'A2',
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
          bio: user.bio,
          hourlyRate: user.hourlyRate,
          spokenLanguages: user.spokenLanguages,
          certifications: user.certifications,
          learningGoals: user.learningGoals,
          englishLevel: user.englishLevel,
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
