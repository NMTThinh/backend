import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TableController } from './table.controller'; // Đường dẫn đến TableController
import { TableRepository } from './table.repository'; // Đường dẫn đến TableRepository
import { TableService } from './table.service'; // Đường dẫn đến TableService
import { Table, TableSchema } from 'src/table/model/table.schema';
import { SetTableModule } from 'src/settable/settable.module';
import { OrderModule } from 'src/orderr/orderr.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: 'Table', schema: TableSchema }]),
    SetTableModule,
    forwardRef(() => OrderModule),
  ],
  controllers: [TableController],
  providers: [TableService, TableRepository],
  exports: [TableRepository, TableService],
})
export class TableModule {}
