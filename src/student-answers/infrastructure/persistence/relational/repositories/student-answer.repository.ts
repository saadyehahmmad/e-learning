import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { StudentAnswerEntity } from '../entities/student-answer.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { StudentAnswer } from '../../../../domain/student-answer';
import { StudentAnswerRepository } from '../../student-answer.repository';
import { StudentAnswerMapper } from '../mappers/student-answer.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class StudentAnswerRelationalRepository implements StudentAnswerRepository {
  constructor(
    @InjectRepository(StudentAnswerEntity)
    private readonly studentAnswerRepository: Repository<StudentAnswerEntity>,
  ) {}

  async create(data: StudentAnswer): Promise<StudentAnswer> {
    const persistenceModel = StudentAnswerMapper.toPersistence(data);
    const newEntity = await this.studentAnswerRepository.save(
      this.studentAnswerRepository.create(persistenceModel),
    );
    return StudentAnswerMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<StudentAnswer[]> {
    const entities = await this.studentAnswerRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => StudentAnswerMapper.toDomain(entity));
  }

  async findById(
    id: StudentAnswer['id'],
  ): Promise<NullableType<StudentAnswer>> {
    const entity = await this.studentAnswerRepository.findOne({
      where: { id },
    });

    return entity ? StudentAnswerMapper.toDomain(entity) : null;
  }

  async findByIds(ids: StudentAnswer['id'][]): Promise<StudentAnswer[]> {
    const entities = await this.studentAnswerRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => StudentAnswerMapper.toDomain(entity));
  }

  async update(
    id: StudentAnswer['id'],
    payload: Partial<StudentAnswer>,
  ): Promise<StudentAnswer> {
    const entity = await this.studentAnswerRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.studentAnswerRepository.save(
      this.studentAnswerRepository.create(
        StudentAnswerMapper.toPersistence({
          ...StudentAnswerMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return StudentAnswerMapper.toDomain(updatedEntity);
  }

  async remove(id: StudentAnswer['id']): Promise<void> {
    await this.studentAnswerRepository.delete(id);
  }
}
