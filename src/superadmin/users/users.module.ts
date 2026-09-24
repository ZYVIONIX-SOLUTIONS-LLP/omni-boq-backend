import { Module } from '@nestjs/common';
import { SuperadminUsersController } from './users.controller';
import { SuperadminUsersService } from './users.service';

@Module({
  controllers: [SuperadminUsersController],
  providers: [SuperadminUsersService],
  exports: [SuperadminUsersService],
})
export class SuperadminUsersModule {}
