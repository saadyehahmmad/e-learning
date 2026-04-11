import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentGroupEntity } from './entities/student-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentGroupEntity])],
  exports: [TypeOrmModule],
})
export class RelationalStudentGroupPersistenceModule {}
