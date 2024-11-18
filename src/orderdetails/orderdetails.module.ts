import { forwardRef, Module } from '@nestjs/common';
import { OrderModule } from 'src/orderr/orderr.module';
import { DatabaseModule } from 'src/database/database.module';
import { OrderDetailsController } from './orderdetails.controller';
import { OrderDetailsRepository } from './orderdetails.repository';
import { OrderDetailsService } from './orderdetails.service';
import {OrderDetails, OrderDetailsSchema } from './model/orderdetails.schema';
import { ProductModule } from 'src/product/product.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    DatabaseModule.forFeature([{ name: 'OrderDetails', schema: OrderDetailsSchema }]),
    ProductModule,
    forwardRef(() => OrderModule),
  ],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService, OrderDetailsRepository],
  exports: [OrderDetailsRepository, OrderDetailsService],
})
export class OrderDetailsModule {}
