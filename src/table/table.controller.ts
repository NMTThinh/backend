import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/decorator/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role-jwt.guard';
import { CreateTableDto } from './dto/create-table.dto'; // Đường dẫn đúng tới CreateTableDto
import { UpdateTableDto } from './dto/update-table.dto'; // DTO để cập nhật bàn ăn
import { Table } from 'src/table/model/table.schema';
import { TableService } from './table.service'; // Service để xử lý logic bàn ăn
import { table } from 'console';

@Controller('tables') // Đường dẫn cơ sở cho các yêu cầu liên quan đến bàn ăn
export class TableController {
  constructor(private readonly tableService: TableService) {}

  // Tạo bàn ăn
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @Post("create")
  async createTable(@Body() table: CreateTableDto) {
    const newTable = await this.tableService.createTable(table);
    return {
      message: 'Tạo bàn ăn thành công.',
      table: newTable,
    };
  }
  // Lấy bàn ăn theo id
  @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    getTableById(@Param('id') id: string) {
      return this.tableService.findById(id);
    }

  // Cập nhật bàn ăn
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateTable(@Param('id') id: string, @Body() table: UpdateTableDto) {
    const updatedTable = await this.tableService.updateById(id, table);
    return {
      message: `Cập nhật thông tin bàn ăn thành công.`,
      updatedTable,
    };
  }

  // Xóa bàn ăn
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteTable(@Param('id') id: string) {
    await this.tableService.deleteById(id);
    return {
      message: `Xóa bàn ăn có ID thành công.`,
      deletedId: id,
    };
  }

  // Cập nhật trạng thái bàn ăn
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Put(':id/status')
  async updateStatusTable(@Param('id') id: string, @Query('status') status: boolean) {
    const updatedStatus = await this.tableService.updateStatusById(id, status);
    return {
      message: `Cập nhật trạng thái bàn ăn có thành công.`,
      updatedStatus,
    };
  }
}
