// Nhận yêu cầu từ client, xử lý thông tin đầu vào và chuyển đến cho Service
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/decorator/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role-jwt.guard';
import { CategoryService } from 'src/category/category.service';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';
import { Category } from 'src/category/model/category.schema';
import { buildPagination } from 'src/common/common';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  // Tạo danh mục món
  @UseGuards(JwtAuthGuard, RoleAuthGuard)// Xác thực JWT token và Xác thực vai trò của người dùng.
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() category: CreateCategoryDto) {
    const result = await this.service.createCategory(category);
    if (result) {
      return { message: 'Tạo danh mục thành công!' };
    } else {
      return { message: 'Không thể tạo danh mục. Vui lòng thử lại.' };
    }
  }
  //Lấy tất cả danh mục
  // @UseGuards(JwtAuthGuard)
  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async getAll(@Query() params: ParamPaginationDto) {
    const categories = await this.service.findAll(params);

    const rootCategories = categories.filter((category) => {
      return category.parent_id === null;
    });

    return buildPagination<Category>(categories, params, rootCategories);
  }
  // Lấy tên danh mục theo id
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.findById(id);
  } 
  //Xóa danh mục
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const result = await this.service.deleteById(id);
    if (result) {
      return { message: 'Xóa danh mục thành công!' };
    } else {
      return { message: 'Không thể xóa danh mục. Vui lòng thử lại.' };
    }
  }
  //Sửa danh mục
  // @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() category: UpdateCategoryDto) {
    const result = await this.service.updateById(id, category);
    if (result) {
      return { message: 'Cập nhật danh mục thành công!' };
    } else {
      return { message: 'Không thể cập nhật danh mục. Vui lòng thử lại.' };
    }
  }
  //Sửa trạng thái danh mục
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Query('status') status: boolean) {
    const result = await this.service.updateStatusById(id, status);
    if (result) {
      return { message: `Cập nhật trạng thái thành công! Trạng thái hiện tại: ${status}` };
    } else {
      return { message: 'Không thể cập nhật trạng thái danh mục. Vui lòng thử lại.' };
    }
  }
}