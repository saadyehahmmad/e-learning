import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';

/**
 * Hub / session context for the signed-in admin (`GET /admin/me`).
 */
@ApiTags('Admin — Hub')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.admin)
@Controller({
  path: 'admin/me',
  version: '1',
})
export class AdminHubController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  /**
   * Returns display name and role for the admin shell.
   */
  @Get()
  async getMe(@Req() req: { user: JwtPayloadType }) {
    const user = await this.usersRepository.findOne({
      where: { id: Number(req.user.id) },
      select: ['id', 'firstName', 'lastName', 'email'],
      loadEagerRelations: false,
    });
    const adminDisplayName =
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
      user?.email ||
      'Admin';
    return {
      adminDisplayName,
      role: 'admin',
    };
  }
}
