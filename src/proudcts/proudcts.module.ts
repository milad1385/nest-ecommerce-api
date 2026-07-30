import { Module } from '@nestjs/common';
import { ProudctsService } from './proudcts.service';
import { ProudctsController } from './proudcts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proudct } from './entities/proudct.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proudct, Category])],
  controllers: [ProudctsController],
  providers: [ProudctsService],
})
export class ProudctsModule {}
