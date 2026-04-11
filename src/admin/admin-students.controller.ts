import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AdminStudentsService } from './admin-students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { PatchStudentDto } from './dto/patch-student.dto';
import { PatchStudentStatusDto } from './dto/patch-student-status.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';

/**
 * Admin student roster (`/admin/students`).
 */
@ApiTags('Admin — Students')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.admin)
@Controller({
  path: 'admin/students',
  version: '1',
})
export class AdminStudentsController {
  constructor(private readonly studentsService: AdminStudentsService) {}

  @Get()
  list(@Req() req: { user: JwtPayloadType }) {
    return this.studentsService.listStudents(Number(req.user.id));
  }

  @Get(':studentId')
  getOne(@Param('studentId') studentId: string) {
    return this.studentsService.getStudent(studentId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateStudentDto) {
    return this.studentsService.createStudent(body);
  }

  @Patch(':studentId/status')
  patchStatus(
    @Param('studentId') studentId: string,
    @Body() body: PatchStudentStatusDto,
  ) {
    return this.studentsService.patchStudentStatus(studentId, body);
  }

  @Patch(':studentId')
  patch(@Param('studentId') studentId: string, @Body() body: PatchStudentDto) {
    return this.studentsService.patchStudent(studentId, body);
  }

  @Delete(':studentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('studentId') studentId: string): Promise<void> {
    await this.studentsService.removeStudent(studentId);
  }
}
