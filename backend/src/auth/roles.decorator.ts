import { SetMetadata } from '@nestjs/common';
import { UserRole } from './auth.enums';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);