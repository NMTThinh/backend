import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateSetTableDto } from './dto/create-settable.dto'; // Đường dẫn đúng tới CreateSetTableDto
import { UpdateSetTableDto } from './dto/update-settable.dto'; // DTO để cập nhật bàn ăn
import { SetTable } from 'src/settable/model/settable.schema';
import { SetTableRepository } from './settable.repository'; // Repository để tương tác với DB
import { checkValisIsObject } from 'src/common/common';
import { TableRepository } from 'src/table/table.repository';
import { Types } from 'mongoose';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';

@Injectable()
export class SetTableService {
  constructor(
    private readonly repository: SetTableRepository,
    private readonly tableRepository: TableRepository,
  ) {}

  // Tạo đơn đặt bàn ăn
  async createSetTable(createSetTable: CreateSetTableDto) {
    let { table_id, ...data } = createSetTable;
  
    // Kiểm tra tính hợp lệ của table_id
    checkValisIsObject(table_id, 'table_id');
  
    // Tìm bàn có id table_id
    const table = await this.tableRepository.findOne(table_id);
  
    if (!table) {
      throw new NotFoundException('Không tìm thấy bàn với ID đã cung cấp');
    }
  
    // Tạo bản ghi SetTable
    const settable = {
      _id: new Types.ObjectId(),
      table_id: Types.ObjectId.createFromHexString(table_id),
      ...data,
    };
  
    try {
      // Tạo SetTable mới
      const newSetTable = await this.repository.createSetTable(settable as SetTable);
  
      // Cập nhật trạng thái bàn thành "đã đặt" (false)
      await this.tableRepository.updateStatusById(table_id, false);
  
      return newSetTable;
    } catch (error) {
      throw new UnprocessableEntityException('Đơn đặt bàn này đã tồn tại');
    }
  }
  
  // Lấy All đơn đặt bàn ăn theo ID
  findAll(params: ParamPaginationDto) {
    const { page, limit, sort, keyword } = params;

    const newSort = sort != 'asc' ? 'desc' : 'asc';

    return this.repository.findAll(page, limit, newSort, keyword);
  }

  // Lấy đơn đặt bàn ăn theo ID
  async findById(id: string) {
    checkValisIsObject(id, 'settable id');
    const settable = await this.repository.findOne(id);
    if (!settable) {
      throw new NotFoundException('Không tìm thấy đơn đặt bàn với ID đã cung cấp');
    }

    return settable;
  }

  // Cập nhật đơn đặt bàn ăn
  async updateById(id: string, updateSetTable: UpdateSetTableDto) { 
    checkValisIsObject(id, 'settable id');
    checkValisIsObject(updateSetTable.table_id, 'table_id');
  
    const { table_id, ...data } = updateSetTable;
  
    // Kiểm tra xem bàn có tồn tại hay không
    const table = await this.tableRepository.findOne(table_id);
    if (!table) {
      throw new NotFoundException('Không tìm thấy bàn với ID đã cung cấp');
    }
  
    // Cập nhật đơn đặt bàn
    const settable = await this.repository.updateSetTable(id, {
      _id: new Types.ObjectId(id),
      table_id: new Types.ObjectId(table_id),
      ...data,
    });
    if (!settable) {
      throw new NotFoundException('Không tìm thấy đơn đặt bàn để cập nhật');
    }
  
    return settable;
  }
  

  // Xóa đơn đặt bàn ăn
  async deleteSetTable(id: string) {
    checkValisIsObject(id, 'settable id');

    const settable = await this.repository.deleteOne(id);

    if (!settable) {
      throw new NotFoundException('Không tìm thấy đơn đặt bàn để xóa');
    }

    return settable;
  }

  // Cập nhật trạng thái đơn đặt bàn ăn
  async updateStatusSetTable(id: string, status: boolean) {
    console.log('status', status);
    checkValisIsObject(id, 'table id');
    const settable = await this.repository.updateStatus(id, status);

    if (!settable) {
      throw new NotFoundException('Không tìm thấy đơn đặt bàn để cập nhật trạng thái');
    }

    return settable;
  }
  
}
