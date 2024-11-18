import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './orderr.controller';
import { OrderRepository } from './orderr.repository';
import { OrderService } from './orderr.service';
import { Order, OrderSchema } from './model/orderr.schema';
import { DatabaseModule } from 'src/database/database.module';
import { OrderDetailsModule } from 'src/orderdetails/orderdetails.module';
import { TableModule } from 'src/table/table.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    forwardRef(() => OrderDetailsModule),
    forwardRef(() => TableModule),
    forwardRef(() => UserModule),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderRepository, OrderService],
})  
export class OrderModule {}
