import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), UsersModule],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
