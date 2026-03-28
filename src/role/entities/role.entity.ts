import { BaseTable } from "src/base-table";
import { Column, Entity } from "typeorm";

export enum ROLE_TYPE {
  ADMIN = 'admin',
  USER = 'user',
}
@Entity('roles')
export class Role extends BaseTable {
  @Column({
    type: 'enum',
    enum: ROLE_TYPE,
    default: ROLE_TYPE.USER,
  })
  type: ROLE_TYPE;
}
