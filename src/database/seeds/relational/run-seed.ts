import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { ELearningSeedService } from './e-learning/e-learning-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // Order matters: roles/status → users → placement/payments demo data.
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(ELearningSeedService).run();

  await app.close();
};

void runSeed();
