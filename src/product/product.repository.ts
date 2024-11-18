import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Product } from 'src/product/model/product.schema';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<Product>,
  ) {}
// Tạo sản phẩm mới
  create(product: Product) {
    return new this.model({
      ...product,
    }).save();
  }
  // Cập nhật hình ảnh chính cho product bằng image_id và image_url
  async uploadMainFile(
    id: Types.ObjectId,
    { image_id, image_url }: { image_id: string; image_url: string },
  ) {
    return await this.model
      .findOneAndUpdate({ _id: id }, { image_id, image_url }, { new: true })
      .lean<Product>(true);
  }
 // Thêm một hoặc nhiều hình ảnh phụ vào danh sách hình ảnh của product
  async uploadExtraFiles(
    id: Types.ObjectId,
    files: { image_id: string; image_url: string },
  ) {
    return await this.model
      .findOneAndUpdate({ _id: id }, { $push: { images: files } })
      .lean<Product>(true);
  }
 // Tìm tất cả product với các tùy chọn phân trang, sắp xếp và tìm kiếm
  async findAll(
    page: number,
    limit: number,
    sort: 'asc' | 'desc',
    keyword: any,
  ) {
    return await this.model
      .find(keyword ? { $or: [{ name: new RegExp(keyword, 'i') }] } : {})
      .skip((page - 1) * limit)
      .sort({ name: sort })
      .limit(limit)
      .populate('category_id')
      .lean<Product[]>(true);
  }
 // Xóa một product theo ID
  async deleteOne(id: string) {
    return await this.model.findOneAndDelete({ _id: id }).lean<Product>(true);
  }
// Cập nhật thông tin của product theo ID
  async updateOne(id: string, product: Product) {
    return await this.model
      .findOneAndUpdate({ _id: id }, product, {
        new: true,
      })
      .lean<Product>(true);
  }
 // Tìm một product cụ thể theo ID
  async findOne(id: string) {
    return await this.model.findOne({ _id: id }).lean<Product>(true);
  }
// Xóa các hình ảnh phụ theo danh sách image_ids từ product
  async deleteExtraImages(id: Types.ObjectId, image_ids: string[]) {
    return await this.model
      .findOneAndUpdate(
        { _id: id },
        { $pull: { images: { image_id: { $in: image_ids } } } },
      )
      .lean<Product>(true);
  }
  // Cập nhật tồn kho (stock) của product theo ID
  async updateStock(id: Types.ObjectId, stock: number) {
    return await this.model
      .findOneAndUpdate({ _id: id }, { $inc: { stock } }, { new: true })
      .lean<Product>(true);
  }
// Tìm các product theo category
  async findByCategory(filterQuery: FilterQuery<Product>) {
    return await this.model.find(filterQuery).lean<Product[]>(true);
  }
  // Cập nhật trạng thái (status) của product theo ID
  async updateStatus(_id: string, status: boolean) {
    return await this.model
      .findOneAndUpdate({ _id }, { status }, { new: true })
      .lean<Product>(true);
  }
}
