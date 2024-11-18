import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SetTableController } from './settable.controller'; // Đường dẫn đến TableRepository
import { SetTableService } from './settable.service'; // Đường dẫn đến TableService
import { SetTable, SetTableSchema } from 'src/settable/model/settable.schema';
import { SetTableRepository } from './settable.repository';
import { TableModule } from 'src/table/table.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { OrderModule } from 'src/orderr/orderr.module';
@Module({
   imports: [
    CloudinaryModule,
    
    DatabaseModule.forFeature([{ name: 'SetTable', schema: SetTableSchema }]),
    forwardRef(() => TableModule), 
    forwardRef(() => OrderModule),
  ],
  controllers: [SetTableController],
  providers: [SetTableService, SetTableRepository],
  exports: [SetTableRepository, SetTableService],
})
export class SetTableModule {}
