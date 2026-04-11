import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminStudentsService } from './admin-students.service';
import { AdminGroupsService } from './admin-groups.service';
import { AdminPlacementService } from './admin-placement.service';

/**
 * Single response that mirrors the `docs/admin hub/*.json` bundle for bootstrapping the admin UI.
 */
@Injectable()
export class AdminHubBundleService {
  constructor(
    private readonly dashboardService: AdminDashboardService,
    private readonly studentsService: AdminStudentsService,
    private readonly groupsService: AdminGroupsService,
    private readonly placementService: AdminPlacementService,
  ) {}

  /**
   * Returns dashboard, students list, groups, and placement workspace in one document.
   * If no placement test exists, `placement` is `null` instead of failing the whole payload.
   */
  async getBundle(adminUserId: number) {
    const [dashboard, students, groups] = await Promise.all([
      this.dashboardService.getDashboard(),
      this.studentsService.listStudents(adminUserId),
      this.groupsService.listGroups(),
    ]);

    let placement: Awaited<
      ReturnType<AdminPlacementService['getWorkspace']>
    > | null = null;
    try {
      placement = await this.placementService.getWorkspace();
    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        throw err;
      }
    }

    return {
      dashboard,
      students,
      groups,
      placement,
    };
  }
}
