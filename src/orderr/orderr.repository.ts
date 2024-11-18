import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from '../orderr/dto/create-orderr.dto';
import { UpdateOrderDto } from '../orderr/dto/update-orderr.dto';
import { Order } from '../orderr/model/orderr.schema';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private readonly model: Model<Order>,
  ) {}
//Tạo đơn hàng
  async create(orderData: CreateOrderDto) {
    const newOrder = await new this.model({
      _id: new Types.ObjectId(),
      ...orderData,
    }).save();

    if (newOrder.orderparent_id) {
      await this.model.findOneAndUpdate(
        { _id: newOrder.orderparent_id },
        { $addToSet: { children: newOrder._id } },
        { new: true },
      );
    }

    return newOrder;
  }
//Tìm đơn hàng
  async findOne(id: string) {
    return await this.model
      .findOne({ _id: id })
      .populate({
        path: 'children',
        populate: { path: 'children', populate: { path: 'children' } },
      })
      .lean<Order>(true);
  }
//Tìm tất cả đơn hàng
  async findAll(
    page: number,
    limit: number,
    sort: 'asc' | 'desc',
    keyword: any,
  ) {
    return await this.model
      .find(keyword ? { $or: [{ totalAmount: new RegExp(keyword, 'i') }] } : {})
      .skip((page - 1) * limit)
      .sort({ totalAmount: sort === 'asc' ? 1 : -1 })
      .limit(limit)
      .populate({
        path: 'children',
        populate: { path: 'children', populate: { path: 'children' } },
      })
      .lean<Order[]>(true);
  }
//Xóa đơn hàng
  async deleteById(id: string) {
    return await this.model.findOneAndDelete({ _id: id });
  }
//Cập nhật đơn hàng
  async updateOne(id: string, orderOld: Order, orderNew: UpdateOrderDto) {
    const updatedOrder = await this.model.findOneAndUpdate(
      { _id: id },
      orderNew,
      {
        new: true,
      },
    );

    if (orderNew.orderparent_id) {
      await this.model.updateOne(
        { _id: updatedOrder.orderparent_id },
        { $addToSet: { children: updatedOrder._id } },
      );
    }

    if (
      orderNew.orderparent_id &&
      orderOld.orderparent_id.toString() !== orderNew.orderparent_id?.toString()
    ) {
      await this.model.updateOne(
        { _id: orderNew.orderparent_id },
        { $pull: { children: orderOld._id } },
      );
    }

    return updatedOrder;
  }

//Cập nhật trạng thái
  async updateStatusById(id: string, status: boolean) {
    
    return await this.model
      .findOneAndUpdate({ _id: id }, { status }, { new: true })
      .lean<Order>(true);
  }
}
