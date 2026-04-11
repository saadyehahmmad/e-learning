import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { AdminStudentsService } from '../admin/admin-students.service';
import { StudentPlacementService } from './student-placement.service';

/**
 * Student routes under `/api/v1/student/*` (JWT + student role).
 */
@ApiTags('Student')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.student)
@Controller({
  path: 'student',
  version: '1',
})
export class StudentController {
  constructor(
    private readonly adminStudentsService: AdminStudentsService,
    private readonly studentPlacementService: StudentPlacementService,
  ) {}

  /**
   * Hub summary: placement, group, payments (see `docs/student hub/student-hub.json`).
   */
  @Get('hub')
  @ApiOperation({ summary: 'Student hub (placement summary, group, payments)' })
  getHub(@Req() req: { user: JwtPayloadType }) {
    return this.adminStudentsService.getStudentHubWire(Number(req.user.id));
  }

  /**
   * Full placement test for the exam UI — questions **without** correct answers.
   */
  @Get('placement')
  @ApiOperation({ summary: 'Load placement test (questions for the learner)' })
  getPlacement() {
    return this.studentPlacementService.getPlacementExam();
  }
}
