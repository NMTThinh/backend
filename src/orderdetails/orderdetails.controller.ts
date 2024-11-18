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
  import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
  import { RoleAuthGuard } from 'src/auth/guards/role-jwt.guard';
  import { Roles } from 'src/auth/decorator/role.decorator';
  import { Role } from 'src/auth/decorator/role.enum';
  import { CreateOrderDetailsDto } from './dto/create-orderdetails.dto';
  import { UpdateOrderDetailsDto } from './dto/update-orderdetails.dto';
  import { OrderDetailsService } from './orderdetails.service';
  import { ParamPaginationDto } from 'src/common/param-pagination.dto';
  import { buildPagination } from 'src/common/common';
  
  @Controller('order-details')
  export class OrderDetailsController {
    constructor(private readonly orderDetailsService: OrderDetailsService) {}
  // Tạo chi tiết đơn hàng
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Post()
    async createOrderDetails(@Body() createOrderDetailsDto: CreateOrderDetailsDto) {
      const result = await this.orderDetailsService.createOrderDetails(createOrderDetailsDto);
      if (result) {
        return { message: 'Tạo chi tiết đơn hàng thành công!' };
      } else {
        throw new BadRequestException('Không thể tạo chi tiết đơn hàng. Vui lòng thử lại.');
      }
    }

  //Lấy chi tiết đơn hàng theo id
    @Get(':id')
    async getOne(@Param('id') id: string) {
      const orderDetail = await this.orderDetailsService.findById(id);
      if (orderDetail) {
        return orderDetail;
      } else {
        throw new BadRequestException('Chi tiết đơn hàng không tồn tại.');
      }
    }
  // Cập nhật chi tiết đơn hàng
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateOrderDetailsDto: UpdateOrderDetailsDto) {
      const result = await this.orderDetailsService.updateById(id, updateOrderDetailsDto);
      if (result) {
        return { message: 'Cập nhật chi tiết đơn hàng thành công!' };
      } else {
        throw new BadRequestException('Không thể cập nhật chi tiết đơn hàng. Vui lòng thử lại.');
      }
    }
  //Xóa chi tiết đơn hàng
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Delete(':id')  async delete(@Param('id') id: string) {
      const result = await this.orderDetailsService.deleteById(id);
      if (result) {
        return { message: 'Xóa chi tiết đơn hàng thành công!' };
      } else {
        throw new BadRequestException('Không thể xóa chi tiết đơn hàng. Vui lòng thử lại.');
      }
    }
    
  }
  