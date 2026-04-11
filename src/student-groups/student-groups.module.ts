import { Module } from '@nestjs/common';
import { RelationalStudentGroupPersistenceModule } from './infrastructure/persistence/relational/relational-student-group-persistence.module';

@Module({
  imports: [RelationalStudentGroupPersistenceModule],
  exports: [RelationalStudentGroupPersistenceModule],
})
export class StudentGroupsModule {}
