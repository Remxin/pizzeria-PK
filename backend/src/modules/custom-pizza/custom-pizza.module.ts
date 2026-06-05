import { Module } from '@nestjs/common';
import { CustomPizzaController } from './custom-pizza.controller';
import { CustomPizzaService } from './custom-pizza.service';

@Module({
  controllers: [CustomPizzaController],
  providers: [CustomPizzaService],
  exports: [CustomPizzaService],
})
export class CustomPizzaModule {}
