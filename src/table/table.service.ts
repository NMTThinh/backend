import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto'; // Đường dẫn đúng tới CreateTableDto
import { UpdateTableDto } from './dto/update-table.dto'; // DTO để cập nhật bàn ăn
import { TableRepository } from './table.repository'; // Repository để tương tác với DB
import { checkValisIsObject } from 'src/common/common';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';

@Injectable()
export class TableService {
  constructor(private readonly repository: TableRepository) {}

  // Tạo bàn ăn
  async createTable(createTableDto: CreateTableDto) {
    const { nametable, status, numberofchair,tableparent_id } = createTableDto;

    const checkParent = tableparent_id !== '' ? tableparent_id : null;

    try {
      if (tableparent_id !== '') {
        checkValisIsObject(tableparent_id, 'tableparent_id');

        const tableparent = await this.repository.findOne(tableparent_id);
        if (!tableparent) {
          throw new NotFoundException('Không tìm thấy table id');
        }
      }
      return await this.repository.create({
       nametable,
       numberofchair,
       status,
       tableparent_id: checkParent
      });
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }


  // Lấy bàn ăn theo ID
  async findById(id: string) {
    checkValisIsObject(id, 'table id');
    const table = await this.repository.findOne(id);
    if (!table) {
      throw new NotFoundException('không tìm thấy bàn');
    }

    return table;
  }

  // Cập nhật bàn ăn
  async updateById(id: string, tableUpdate: UpdateTableDto) {
    const { nametable, status,numberofchair, tableparent_id } = tableUpdate;
    const checkParent = tableparent_id !== '' ? tableparent_id : null;

    const table = await this.findById(id);

    try {
      if (tableparent_id !== '') {
        checkValisIsObject(tableparent_id, 'tableparent_id');

        if (
          table.tableparent_id &&
          tableparent_id !== table.tableparent_id.toHexString()
        ) {
          const tableparent = await this.repository.findOne(tableparent_id);
          if (!tableparent) {
            throw new NotFoundException('Không tìm thấy table id');
          }
        }
      }

      if (table.children.length > 0) {
        throw new UnprocessableEntityException(
          'Bàn đã được đặt, không thể thay đổi lại',
        );
      }

      return await this.repository.updateOne(id, table, {
        nametable,
        numberofchair,
        status,
        tableparent_id: checkParent,
      });
    } catch (error) {
      throw new UnprocessableEntityException('Tên đã tồn tại');
    }
  }

  // Xóa bàn ăn
  async deleteById(id: string) {
    const table = await this.findById(id);

    if (table.children.length > 0) {
      throw new UnprocessableEntityException(
        'Table này vẫn còn danh mục con',
      );
    }

    await this.repository.deleteTable(table._id.toHexString());

    return table;
  }

  // Cập nhật trạng thái bàn ăn
  async updateStatusById(id: string, status: boolean) {
    checkValisIsObject(id, 'table id');
    checkValisIsObject(id, 'tableparent_id');

    const table = await this.repository.updateStatusById(id, status);
    if (!table) {
      throw new NotFoundException('không tìm thấy id bàn ăn');
    }

    return table;
  }
}
