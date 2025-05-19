/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsUUID,
  ValidateIf,
  Validate,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ScheduleTaskStatus } from '../entities/cleaning-schedule-task.entity';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'OnlyOneAssignedField', async: false })
class OnlyOneAssignedFieldConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    const hasContributor = !!obj.assignedToContributorId;
    const hasAdmin = !!obj.assignedToAdminUserId;

    return !(hasContributor && hasAdmin);
  }

  defaultMessage(_: ValidationArguments) {
    return 'Você deve informar **apenas um** entre assignedToContributorId e assignedToAdminUserId';
  }
}

export class UpdateCleaningScheduleTaskDto {
  @IsUUID()
  cleaningScheduleId: string;

  @IsUUID()
  taskId: string;

  @IsOptional()
  @IsEnum(ScheduleTaskStatus)
  newStatus?: ScheduleTaskStatus;

  @IsOptional()
  @IsUUID()
  assignedToContributorId?: string;

  @IsOptional()
  @IsUUID()
  assignedToAdminUserId?: string;

  @Validate(OnlyOneAssignedFieldConstraint)
  _onlyOneAssignedField: boolean;
}
