import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, ROLE_TYPE } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    // this.seedRoles();
  }
  async seedRoles() {
    try {
      const existingRoles = await this.roleRepository.find();
      const existingTypes = existingRoles.map((r) => r.type);

      const allRoleTypes = Object.values(ROLE_TYPE);

      // Find which roles are missing
      const rolesToSeed = allRoleTypes.filter(
        (type) => !existingTypes.includes(type),
      );

      if (rolesToSeed.length > 0) {
        const newRoles = rolesToSeed.map((type) => {
          const role = new Role();
          role.type = type as ROLE_TYPE;
          return role;
        });

        await this.roleRepository.save(newRoles);
        console.log(`✅ Seeded roles: ${rolesToSeed.join(', ')}`);
      } else {
        console.log('✅ All roles already exist.');
      }
    } catch (e) {
      console.log('SEED ROLES ERROR:::', e);
    }
  }

  async findOneWithType(type: ROLE_TYPE) {
    const role = await this.roleRepository.findOne({
      where: {
        type,
      },
    });
    if (!role) throw new BadRequestException('Role not found');
    return role;
  }
  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
