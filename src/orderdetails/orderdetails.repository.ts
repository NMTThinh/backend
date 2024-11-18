import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { OrderDetails } from 'src/orderdetails/model/orderdetails.schema';

@Injectable()
export class OrderDetailsRepository {
  constructor(
    @InjectModel(OrderDetails.name) private readonly model: Model<OrderDetails>,
  ) {}
//Tạo chi tiết đơn hàng
  create(orderdetails: OrderDetails) {
    return new this.model({
      ...orderdetails,
    }).save();
  }

//Xóa chi tiết đơn hàng
  async deleteOne(id: string) {
    const deletedOrderDetails=  await this.model.findOneAndDelete({ _id: id }).lean<OrderDetails>(true);
    if (!deletedOrderDetails) {
      throw new NotFoundException('Không tìm thấy chi tiết đơn hàng để xóa.');
    }
    
    return deletedOrderDetails;
  }
//Cập nhật chi tiết đơn hàng
  async updateOne(id: string, orderdetails:  Partial<OrderDetails>) {
    return await this.model
      .findOneAndUpdate({ _id: id }, orderdetails, {
        new: true,
      })
      .lean<OrderDetails>(true);
  }
//Tìm chi tiết đơn hàng
  async findOne(id: string) {
    return await this.model.findOne({ _id: id }).lean<OrderDetails>(true);
  }

//Cập nhật trạng thái chi tiết 
  async updateStatus(_id: string, status: boolean) {
    return await this.model
      .findOneAndUpdate({ _id }, { status }, { new: true })
      .lean<OrderDetails>(true);
  }
}
