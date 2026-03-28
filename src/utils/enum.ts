import { ROLE_TYPE } from 'src/role/entities/role.entity';

export interface AUTH_CREDENTIAL {
  id: string;
  role: ROLE_TYPE;
}
export interface IResponse {
  message?: string;
  code?: number;
  data?: any;
}
