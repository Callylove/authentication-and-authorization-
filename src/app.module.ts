import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { datasourceOptions } from 'src/db';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';

@Module({
   imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
   
    TypeOrmModule.forRoot(datasourceOptions),
   
    UsersModule,
   
    RoleModule,
   
    AuthModule,
   
    
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
