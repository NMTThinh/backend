import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module';
import { ProductModule } from 'src/product/product.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TableModule } from './table/table.module'; 
import { SetTableModule } from './settable/settable.module';
import { OrderModule } from './orderr/orderr.module';
import { OrderDetailsModule } from './orderdetails/orderdetails.module';


@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    OrderDetailsModule,
    CloudinaryModule,
    TableModule,
    SetTableModule,

  ],
})
export class AppModule {}
