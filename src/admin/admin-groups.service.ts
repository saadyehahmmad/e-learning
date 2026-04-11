import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentGroupEntity } from '../student-groups/infrastructure/persistence/relational/entities/student-group.entity';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import {
  parseGroupPublicId,
  toGroupPublicId,
} from './utils/admin-public-ids.util';

/**
 * CRUD for admin student groups (`/admin/groups`).
 */
@Injectable()
export class AdminGroupsService {
  constructor(
    @InjectRepository(StudentGroupEntity)
    private readonly groupsRepository: Repository<StudentGroupEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  /**
   * Lists all groups in wire format.
   */
  async listGroups() {
    const rows = await this.groupsRepository.find({ order: { name: 'ASC' } });
    return {
      groups: rows.map((g) => this.toWire(g)),
    };
  }

  /**
   * Returns one group or throws `NotFoundException`.
   */
  async getGroup(groupPublicId: string) {
    const id = parseGroupPublicId(groupPublicId);
    const g = await this.groupsRepository.findOne({ where: { id } });
    if (!g) {
      throw new NotFoundException({
        error: {
          code: 'NOT_FOUND',
          message: 'Group not found',
          details: [],
        },
      });
    }
    return this.toWire(g);
  }

  /**
   * Creates a new group.
   */
  async createGroup(body: {
    name: string;
    description?: string | null;
    link: string;
  }) {
    const name = body.name.trim();
    const saved = await this.groupsRepository.save(
      this.groupsRepository.create({
        name,
        description: body.description?.trim() ?? null,
        link: body.link.trim(),
      }),
    );
    return this.toWire(saved);
  }

  /**
   * Partially updates a group.
   */
  async patchGroup(
    groupPublicId: string,
    body: Partial<{
      name: string;
      description: string | null;
      link: string;
    }>,
  ) {
    const id = parseGroupPublicId(groupPublicId);
    const existing = await this.groupsRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException({
        error: {
          code: 'NOT_FOUND',
          message: 'Group not found',
          details: [],
        },
      });
    }
    if (body.name !== undefined) {
      existing.name = body.name.trim();
    }
    if (body.description !== undefined) {
      existing.description = body.description?.trim() ?? null;
    }
    if (body.link !== undefined) {
      existing.link = body.link.trim();
    }
    const saved = await this.groupsRepository.save(existing);
    return this.toWire(saved);
  }

  /**
   * Deletes a group and clears `groupId` for assigned students.
   */
  async deleteGroup(groupPublicId: string): Promise<void> {
    const id = parseGroupPublicId(groupPublicId);
    const existing = await this.groupsRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException({
        error: {
          code: 'NOT_FOUND',
          message: 'Group not found',
          details: [],
        },
      });
    }
    await this.usersRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ group: null })
      .where('groupId = :id', { id })
      .execute();
    await this.groupsRepository.remove(existing);
  }

  private toWire(g: StudentGroupEntity) {
    return {
      id: toGroupPublicId(g.id),
      name: g.name,
      description: g.description ?? '',
      link: g.link,
    };
  }
}
