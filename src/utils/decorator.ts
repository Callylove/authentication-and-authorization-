import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ROLE_TYPE } from 'src/role/entities/role.entity';


export const UserAuth = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export class LoggedInUser {
  id: string; ///It is actually the uuid of the user.

  role: ROLE_TYPE;

  constructor(id: string, role: ROLE_TYPE) {
    this.id = id;
    this.role = role;
  }
}
