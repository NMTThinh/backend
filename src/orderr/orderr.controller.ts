import {
  BadRequestException,
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
  import { OrderService } from 'src/orderr/orderr.service';
  import { CreateOrderDto } from 'src/orderr/dto/create-orderr.dto';
  import { UpdateOrderDto } from 'src/orderr/dto/update-orderr.dto';
  import { Order } from 'src/orderr/model/orderr.schema';
  import { buildPagination } from 'src/common/common';
  import { ParamPaginationDto } from 'src/common/param-pagination.dto';
  
  @Controller('orders')
  export class OrderController {
    constructor(private readonly service: OrderService) {}
  //Tạo đơn hàng
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Post()  
    async createOrder(@Body() createOrderDto: CreateOrderDto) {
      const result = await this.service.createOrder(createOrderDto);
      if (result) {
        return { message: 'Tạo đơn hàng thành công!' };
      } else {
        throw new BadRequestException('Không thể tạo đơn hàng. Vui lòng thử lại.');
      }
    }
  //Lấy tất cả đơn hàng
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Get()
    async getAll(@Query() params: ParamPaginationDto) {
      const orders = await this.service.findAll(params);
  
      const rootOrders = orders.filter((order) => {
        return order.orderparent_id === null;
      });
  
      if (orders.length > 0) {
        return buildPagination<Order>(orders, params, rootOrders);
      } else {
        throw new BadRequestException('Không có đơn hàng nào.');
      }
    }
  //Tìm 1 đơn hàng
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Get(':id')
    async getOne(@Param('id') id: string) {
      const order = await this.service.findById(id);
      if (order) {
        return order;
      } else {
        throw new BadRequestException('Đơn hàng không tồn tại.');
      }
    }
  //Xóa đơn hàng
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Delete(':id')
    async deleteOne(@Param('id') id: string) {
      const result = await this.service.deleteById(id);
      if (result) {
        return { message: 'Xóa đơn hàng thành công!' };
      } else {
        throw new BadRequestException('Không thể xóa đơn hàng. Vui lòng thử lại.');
      }
    }
  //Cập nhật đơn hàng
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Put(':id')
    async updateOne(@Param('id') id: string, @Body() order: UpdateOrderDto) {
      const result = await this.service.updateById(id, order);
      if (result) {
        return { message: 'Cập nhật đơn hàng thành công!' };
      } else {
        throw new BadRequestException('Không thể cập nhật đơn hàng. Vui lòng thử lại.');
      }
    }
  //Cập nhật trạng thái
    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Put(':id/status')

  async updateOrderStatus(@Param('id') id: string, @Query('status') status: boolean) {
    const updatedStatus = await this.service.updateStatusById(id, status);
    return {
      message: `Cập nhật trạng thái đơn hàng thành công.`,
      updatedStatus,
    };
  }
  }
  