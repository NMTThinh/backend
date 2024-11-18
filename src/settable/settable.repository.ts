import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CreateSetTableDto } from './dto/create-settable.dto'; 
import { UpdateSetTableDto } from './dto/update-settable.dto'; 
import { SetTable } from 'src/settable/model/settable.schema';

@Injectable()
export class SetTableRepository {
    constructor(@InjectModel(SetTable.name) private readonly model: Model<SetTable>) {}

  // Tạo đơn đặt bàn
  createSetTable(settable: SetTable) {
    return new this.model({
      ...settable,
    }).save();
  }
  //Tìm tất cả đơn đặt bàn
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
      .populate('table_id')
      .lean<SetTable[]>(true);
  }
  //xóa đơn đặt bàn
  async deleteOne(id: string) {
    return await this.model.findOneAndDelete({ _id: id }).lean<SetTable>(true);
  }
  // Lấy đơn đặt bàn theo ID
  async findOne(id: string) {
    return await this.model.findOne({ _id: id }).lean<SetTable>(true);
  }

  // Cập nhật đơn đặt bàn
  async updateSetTable(id: string, settable: SetTable) {
    return await this.model
      .findOneAndUpdate({ _id: id }, settable, {
        new: true,
      })
      .lean<SetTable>(true);
  }
  // Xóa đơn đặt bàn
  async deleteSetTable(id: string) {
    return await this.model.findOneAndDelete({ _id: id });
  }
  async findByTable(filterQuery: FilterQuery<SetTable>) {
    return await this.model.find(filterQuery).lean<SetTable[]>(true);
  }
  // Cập nhật trạng thái đơn đặt bàn
  async updateStatus(_id: string, status: boolean) {
    return await this.model
      .findOneAndUpdate({ _id }, { status }, { new: true })
      .lean<SetTable>(true);
  }
}
