
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../models/user.model.js';

export const role_metadata_key = 'roles';

export const Roles = (...roles: UserRole[]) => SetMetadata(role_metadata_key, roles);
