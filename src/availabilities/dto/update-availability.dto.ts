// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateAvailabilityDto } from './create-availability.dto';

export class UpdateAvailabilityDto extends PartialType(CreateAvailabilityDto) {}
