import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AdminDashboardService } from './admin-dashboard.service';

/**
 * Admin dashboard aggregates (`GET /admin/dashboard`).
 */
@ApiTags('Admin — Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.admin)
@Controller({
  path: 'admin/dashboard',
  version: '1',
})
export class AdminDashboardController {
  constructor(private readonly dashboardService: AdminDashboardService) {}

  /**
   * Returns KPIs and chart series for the reporting window.
   */
  @Get()
  getDashboard(@Query('from') from?: string, @Query('to') to?: string) {
    return this.dashboardService.getDashboard(from, to);
  }
}
