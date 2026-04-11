import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { AdminHubBundleService } from './admin-hub-bundle.service';

/**
 * Aggregated admin workspace document (`GET /admin/hub`) — aligns with `docs/admin hub/`.
 */
@ApiTags('Admin — Hub bundle')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.admin)
@Controller({
  path: 'admin/hub',
  version: '1',
})
export class AdminHubBundleController {
  constructor(private readonly bundleService: AdminHubBundleService) {}

  /**
   * Returns `dashboard`, `students`, `groups`, and `placement` in one JSON payload.
   */
  @Get()
  @ApiOperation({
    summary: 'Admin hub bundle (dashboard + students + groups + placement)',
  })
  getHub(@Req() req: { user: JwtPayloadType }) {
    return this.bundleService.getBundle(Number(req.user.id));
  }
}
