import { InternalServerErrorException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

export async function hashPassword(password: string) {
  try {

    const s = await bcrypt.genSalt(parseInt(process.env.SALT ?? '10'));

   
    const result = await bcrypt.hash(password.trim(), s);

    return result;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new InternalServerErrorException(error.message);
  }
}
