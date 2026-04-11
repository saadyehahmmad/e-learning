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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AdminPlacementService } from './admin-placement.service';
import { CreatePlacementQuestionDto } from './dto/create-placement-question.dto';
import { PatchPlacementQuestionDto } from './dto/patch-placement-question.dto';

/**
 * Placement test workspace (`/admin/placement`).
 */
@ApiTags('Admin — Placement')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.admin)
@Controller({
  path: 'admin/placement',
  version: '1',
})
export class AdminPlacementController {
  constructor(private readonly placementService: AdminPlacementService) {}

  @Get()
  getWorkspace() {
    return this.placementService.getWorkspace();
  }

  @Post('questions')
  @HttpCode(HttpStatus.CREATED)
  createQuestion(@Body() body: CreatePlacementQuestionDto) {
    return this.placementService.createQuestion(body);
  }

  @Patch('questions/:questionId')
  patchQuestion(
    @Param('questionId') questionId: string,
    @Body() body: PatchPlacementQuestionDto,
  ) {
    return this.placementService.updateQuestion(questionId, body);
  }

  @Delete('questions/:questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param('questionId') questionId: string): Promise<void> {
    await this.placementService.deleteQuestion(questionId);
  }
}
