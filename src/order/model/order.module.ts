import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { OrderController } from './order.controller';
import { DatabaseModule } from 'src/database/database.module';
import { Order, OrderSchema } from './order.schema';
import { OrderDetails, OrderDetailsSchema } from './order-detail.scheme';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderDetails.name, schema: OrderDetailsSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
