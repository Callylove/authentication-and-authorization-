
import { BaseTable } from 'src/base-table';
import { Role } from 'src/role/entities/role.entity';

import {
  Column,
  Entity,
  ManyToOne,

} from 'typeorm';

export enum USER_STATUS {
  PENDING = 'pending',
  VERIFIED_MAIL = 'verified_mail',
  DISABLED = 'disabled',
  ENABLED = 'enabled',
}

@Entity('users')
export class User extends BaseTable {
  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: true,
  })
  first_name: string;

  @Column({
    nullable: true,
  })
  last_name: string;


  @Column({
    type: 'enum',
    enum: USER_STATUS,
    default: USER_STATUS.PENDING,
  })
  status: USER_STATUS;



  @Column({
    nullable: true,
    select: false,
  })
  password: string;

  @Column({
    nullable: true,
    select: false,
  })
  otp: string 

  @Column({
    type: 'datetime',
    nullable: true,
    select: false,
  })
  otp_created_at: Date 



  @ManyToOne(() => Role, (role) => role.id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  role: Role;

}
