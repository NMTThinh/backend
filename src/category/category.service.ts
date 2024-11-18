//Chứa logic xử lý chính,Controller gọi service để thực hiện các thao tác như truy xuất dữ liệu từ database hoặc xử lý nghiệp vụ
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryRepository } from 'src/category/category.repository';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';
import { checkValisIsObject } from 'src/common/common';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  // Tạo danh mục
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name, status, parent_id } = createCategoryDto;

    const checkParent = parent_id !== '' ? parent_id : null;

    try {
      if (parent_id !== '') {
        checkValisIsObject(parent_id, 'parent_id');

        const parent = await this.repository.findOne(parent_id);
        if (!parent) {
          throw new NotFoundException('Không tìm thấy category id');
        }
      }
      const newCategory = await this.repository.create({
        name,
        status,
        parent_id: checkParent,
      });
      return { message: 'Tạo danh mục thành công!', data: newCategory };
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  // Lấy danh sách danh mục
  findAll(params: ParamPaginationDto) {
    const { page, limit, sort, keyword } = params;
    const newSort = sort !== 'asc' ? 'desc' : 'asc';
    return this.repository.findAll(page, limit, newSort, keyword);
  }

  // Lấy danh mục theo ID
  async findById(id: string) {
    checkValisIsObject(id, 'category id');
    const category = await this.repository.findOne(id);
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }
    return { message: 'Tìm thấy danh mục', data: category };
  }

  // Xóa danh mục
  async deleteById(id: string) {
    const category = await this.findById(id);
    if (category.data.children && category.data.children.length > 0) {
      throw new UnprocessableEntityException(
        'Danh mục này vẫn còn danh mục con',
      );
    }

    await this.repository.deleteOne(category.data._id.toHexString());
    return { message: 'Xóa danh mục thành công!' };
  }

  // Cập nhật danh mục
  async updateById(id: string, categoryUpdate: UpdateCategoryDto) {
    const { name, status, parent_id } = categoryUpdate;
    const checkParent = parent_id !== '' ? parent_id : null;

    const category = await this.findById(id);

    try {
      if (parent_id !== '') {
        checkValisIsObject(parent_id, 'parent_id');
        if (
          category.data.parent_id &&
          parent_id !== category.data.parent_id.toHexString()
        ) {
          const parent = await this.repository.findOne(parent_id);
          if (!parent) {
            throw new NotFoundException('Không tìm thấy category id');
          }
        }
      }

      if (category.data.children && category.data.children.length > 0) {
        throw new UnprocessableEntityException(
          'Danh mục có danh mục con, không thể thay đổi lại',
        );
      }

      const updatedCategory = await this.repository.updateOne(id, category.data, {
        name,
        status,
        parent_id: checkParent,
      });
      return { message: 'Cập nhật danh mục thành công!', data: updatedCategory };
    } catch (error) {
      console.log(error.message);
      throw new UnprocessableEntityException('Tên đã tồn tại');
    }
  }

  // Cập nhật trạng thái danh mục
  async updateStatusById(id: string, status: boolean) {
    checkValisIsObject(id, 'category id');
    checkValisIsObject(id, 'parent_id');

    const category = await this.repository.updateStatusById(id, status);
    if (!category) {
      throw new NotFoundException('không tìm thấy id danh mục');
    }

    return category;
  }
}
