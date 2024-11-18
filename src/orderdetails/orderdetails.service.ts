import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import { Types } from 'mongoose';
  import { checkValisIsObject } from 'src/common/common';
  import { ParamPaginationDto } from 'src/common/param-pagination.dto';
  import { CreateOrderDetailsDto } from './dto/create-orderdetails.dto';
  import { UpdateOrderDetailsDto } from './dto/update-orderdetails.dto';
  import { OrderDetails } from 'src/orderdetails/model/orderdetails.schema';
  import { OrderDetailsRepository } from './orderdetails.repository';
  import { OrderRepository } from 'src/orderr/orderr.repository';
import { ProductRepository } from 'src/product/product.repository';
  
  @Injectable()
  export class OrderDetailsService {
    constructor(
      private readonly orderdetailsRepository: OrderDetailsRepository,
      private readonly orderRepository: OrderRepository,
      private readonly productRepository: ProductRepository
    ) {}
  // tạo chi tiết đơn hàng
    async createOrderDetails(createOrderDetails: CreateOrderDetailsDto) {
      let { order_id,product_id, ...data } = createOrderDetails;
  
      checkValisIsObject(order_id, 'order_id');
  
      const order = await this.orderRepository.findOne(order_id);
      const product = await this.productRepository.findOne(product_id);

      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng.');
      }
      if (!product) {
        throw new NotFoundException('Không tìm thấy sản phẩm.');
      }
      const orderdetails = {
        _id: new Types.ObjectId(),
        order_id: Types.ObjectId.createFromHexString(order_id),
        product_id: Types.ObjectId.createFromHexString(product_id),
        ...data,
      };
  
      try {
        const createdOrderDetails = await this.orderdetailsRepository.create(orderdetails as OrderDetails);
        return { message: 'Chi tiết đơn hàng đã được tạo thành công.', data: createdOrderDetails };
      } catch (error) {
        throw new UnprocessableEntityException('Tên chi tiết đơn hàng đã tồn tại.');
      }
    }

  // Xóa chi tiết đơn hàng bằng id
    async deleteById(id: string) {
      checkValisIsObject(id, 'orderdetails id');
  
      const orderdetails = await this.orderdetailsRepository.deleteOne(id);
  
      if (!orderdetails) {
        throw new NotFoundException('Không tìm thấy chi tiết đơn hàng để xóa.');
      }
  
      return { message: 'Chi tiết đơn hàng đã được xóa thành công.', data: orderdetails};
    }
  //Câp nhật chi tiết đơn hàng 
    async updateById(id: string, updateOrderDetails: UpdateOrderDetailsDto) {
      checkValisIsObject(id, 'orderdetails id');
      checkValisIsObject(updateOrderDetails.order_id, 'order_id');
      checkValisIsObject(updateOrderDetails.product_id, 'product_id');
  
      const { order_id,product_id, ...data } = updateOrderDetails;
  
      const order = await this.orderRepository.findOne(order_id);
      const product = await this.productRepository.findOne(product_id);
 
      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng.');
      }
      if (!product) {
        throw new NotFoundException('Không tìm thấy sản phẩm.');
      }
  
      const orderdetails = await this.orderdetailsRepository.updateOne(id, {
        _id: new Types.ObjectId(id),
        order_id: new Types.ObjectId(order_id),
        product_id: new Types.ObjectId(product_id),
        ...data,
      });
      if (!orderdetails) {
        throw new NotFoundException('Không tìm thấy chi tiết đơn hàng để cập nhật.');
      }
  
      return { message: 'Chi tiết đơn hàng đã được cập nhật thành công.', data: orderdetails };
    }
    //Tìm chi tiết đơn hàng
    async findById(id: string) {
      checkValisIsObject(id, 'product id');
  
      const orderdetails = await this.orderdetailsRepository.findOne(id);
      if (!orderdetails) {
        throw new NotFoundException('Không tìm thấy chi tiết đơn hàng.');
      }
      return orderdetails;
    }
  }
  