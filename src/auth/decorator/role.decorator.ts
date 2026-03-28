import { SetMetadata } from '@nestjs/common';
import { ROLE_TYPE } from 'src/role/entities/role.entity';


export const ROLES_KEY = 'roles';

export const UseRoles = (...hasRoles: ROLE_TYPE[]) =>
  SetMetadata(ROLES_KEY, hasRoles);
