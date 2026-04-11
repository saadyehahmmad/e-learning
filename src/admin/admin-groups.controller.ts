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
import { AdminGroupsService } from './admin-groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { PatchGroupDto } from './dto/patch-group.dto';

/**
 * Student groups CRUD (`/admin/groups`).
 */
@ApiTags('Admin — Groups')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.admin)
@Controller({
  path: 'admin/groups',
  version: '1',
})
export class AdminGroupsController {
  constructor(private readonly groupsService: AdminGroupsService) {}

  @Get()
  list() {
    return this.groupsService.listGroups();
  }

  @Get(':groupId')
  getOne(@Param('groupId') groupId: string) {
    return this.groupsService.getGroup(groupId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateGroupDto) {
    return this.groupsService.createGroup(body);
  }

  @Patch(':groupId')
  patch(@Param('groupId') groupId: string, @Body() body: PatchGroupDto) {
    return this.groupsService.patchGroup(groupId, body);
  }

  @Delete(':groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('groupId') groupId: string): Promise<void> {
    await this.groupsService.deleteGroup(groupId);
  }
}
