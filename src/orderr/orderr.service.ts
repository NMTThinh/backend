import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { OrderRepository } from './orderr.repository';
import { CreateOrderDto } from './dto/create-orderr.dto';
import { UpdateOrderDto } from './dto/update-orderr.dto';
import { checkValisIsObject } from '../common/common';
import { ParamPaginationDto } from '../common/param-pagination.dto';
import { TableRepository } from 'src/table/table.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly repository: OrderRepository,
    private readonly tableRepository: TableRepository,
    private readonly userRepository: UserRepository,
  ) {}
//Tạo đơn hàng
  async createOrder(createOrderDto: CreateOrderDto) {
    const { totalAmount, status, orderDate, orderparent_id, table_id, user_id } =
      createOrderDto;
    const checkParent = orderparent_id !== '' ? orderparent_id : null;

    try {
      if (orderparent_id) {
        checkValisIsObject(orderparent_id, 'orderparent_id');
        const orderparent = await this.repository.findOne(orderparent_id);
        if (!orderparent) {
          throw new NotFoundException('Không tìm thấy đơn hàng cha với mã được cung cấp');
        }
      }
      if (table_id) {
        checkValisIsObject(table_id, 'table_id');
        const table = await this.tableRepository.findOne(table_id);
        if (!table) {
          throw new NotFoundException('Không tìm thấy bàn có mã đã cho');
        }
      }
       if (user_id) {
       checkValisIsObject(user_id, 'user_id');
      const user = await this.userRepository.findOne(user_id, 'name');
      if (!user) {
        throw new NotFoundException('Không tìm thấy nhân viên với mã đã cung cấp');
      }
      }
      return await this.repository.create({
        totalAmount,
        status,
        orderDate: orderDate || new Date(),
        orderparent_id: checkParent,
        table_id,
        user_id,
      });
    } catch (error) {
      throw new UnprocessableEntityException('Đã xảy ra lỗi khi tạo đơn hàng: ' + error.message);
    }
  }
//Tìm tất cả đơn hàng
  findAll(params: ParamPaginationDto) {
    const { page, limit, sort, keyword } = params;
    const newSort = sort !== 'asc' ? 'desc' : 'asc';

    return this.repository.findAll(page, limit, newSort, keyword);
  }
//Tìm đơn hàng
  async findById(id: string) {
    checkValisIsObject(id, 'order id');
    const order = await this.repository.findOne(id);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng với mã được cung cấp');
    }

    return order;
  }
//Xóa đơn hàng
  async deleteById(id: string) {
    const order = await this.findById(id);

    await this.repository.deleteById(order._id.toHexString());

    return {
      message: 'Đơn hàng đã được xóa thành công',
      deletedOrder: order,
    };
  }
//Cập nhật đơn hàng
  async updateById(id: string, orderUpdate: UpdateOrderDto) {
    const { totalAmount, status, orderparent_id, table_id, user_id, orderDate } = orderUpdate;
    const checkParent = orderparent_id !== '' ? orderparent_id : null;

    const order = await this.findById(id);

    try {
      if (orderparent_id) {
        checkValisIsObject(orderparent_id, 'orderparent_id');

        if (
          order.orderparent_id &&
          orderparent_id !== order.orderparent_id.toHexString()
        ) {
          const orderparent = await this.repository.findOne(orderparent_id);
          if (!orderparent) {
            throw new NotFoundException('Không tìm thấy đơn hàng cha với mã được cung cấp');
          }
        }
      }
      if (table_id) {
        checkValisIsObject(table_id, 'table_id');
        const table = await this.tableRepository.findOne(table_id);
        if (!table) {
          throw new NotFoundException('Không tìm thấy bàn với mã được cung cấp');
        }
      }
      if (user_id) {
        checkValisIsObject(user_id, 'user_id');
        const user = await this.userRepository.findOne(user_id,"");
        if (!user) {
          throw new NotFoundException('Không tìm thấy nhân viên với mã được cung cấp');
        }
      }

      const updatedOrder = await this.repository.updateOne(id, order, {
        totalAmount,
        status,
        orderDate: orderDate || new Date(),
        orderparent_id: checkParent,
        table_id,
        user_id,
      });
      if (!updatedOrder) {
        throw new NotFoundException('Không thể cập nhật đơn hàng do không tìm thấy');
      }

      return {
        message: 'Cập nhật đơn hàng thành công',
        updatedOrder,
      };
    } catch (error) {
      throw new UnprocessableEntityException('Lỗi cập nhật đơn hàng: ' + error.message);
    }
  }
//Cập nhật trạng thái 
  async updateStatusById(id: string, status: boolean) {
    checkValisIsObject(id, 'order id');

    const order = await this.repository.updateStatusById(id, status);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng với mã được cung cấp để cập nhật trạng thái');
    }

    return {
      message: 'Trạng thái của đơn hàng đã được cập nhật thành công',
      updatedStatus: status,
      order,
    };
  }
}
