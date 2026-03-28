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
        email: 'admin@example.com',
        roleId: RoleEnum.admin,
        roleName: 'Admin',
      },
      {
        firstName: 'Jane',
        lastName: 'Tutor',
        email: 'jane.tutor@example.com',
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
        email: 'john.student@example.com',
        roleId: RoleEnum.student,
        roleName: 'Student',
        learningGoals: 'Improve speaking and business writing',
        englishLevel: 'A2',
      },
    ];

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('secret', salt);

    for (const user of usersToSeed) {
      const count = await this.repository.count({
        where: { role: { id: user.roleId } },
      });

      if (!count) {
        await this.repository.save(
          this.repository.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password,
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
}
