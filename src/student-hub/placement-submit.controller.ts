import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { StudentPlacementService } from './student-placement.service';
import { SubmitPlacementAnswersDto } from '../placement/dto/submit-placement-answers.dto';
import { SubmitPlacementResponseDto } from '../placement/dto/submit-placement-response.dto';

/**
 * Student placement submit under `/api/v1/placement/:placementId/submit`.
 */
@ApiTags('Placement')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.student)
@Controller({
  path: 'placement',
  version: '1',
})
export class PlacementSubmitController {
  constructor(
    private readonly studentPlacementService: StudentPlacementService,
  ) {}

  /**
   * `placementId` is the wire id, e.g. `placement-054c9db7-36ac-4c98-ae69-66a47aab6929` (same as load endpoint `placementId`).
   */
  @Post(':placementId/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit placement test (all answers)' })
  @ApiParam({
    name: 'placementId',
    example: 'placement-054c9db7-36ac-4c98-ae69-66a47aab6929',
  })
  @ApiBody({ type: SubmitPlacementAnswersDto })
  @ApiOkResponse({ type: SubmitPlacementResponseDto })
  submit(
    @Param('placementId') placementId: string,
    @Req() req: { user: JwtPayloadType },
    @Body() body: SubmitPlacementAnswersDto,
  ) {
    return this.studentPlacementService.submitAnswersForPlacement(
      placementId,
      Number(req.user.id),
      body,
    );
  }
}
