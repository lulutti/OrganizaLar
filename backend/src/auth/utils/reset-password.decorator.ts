import { SetMetadata } from '@nestjs/common';

export const ResetPasswordAccess = () =>
  SetMetadata('RESET_PASSWORD_ACCESS', true);
