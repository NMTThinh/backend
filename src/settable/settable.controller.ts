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
  import { CreateSetTableDto } from './dto/create-settable.dto'; // Đường dẫn đúng tới CreateSetTableDto
  import { UpdateSetTableDto } from './dto/update-settable.dto'; // DTO để cập nhật bàn ăn
  import { SetTableService } from './settable.service'; // Service để xử lý logic bàn ăn
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { buildPagination } from 'src/common/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
  
  @Controller('settables') 
export class SetTableController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly settableService: SetTableService) {}

  // Tạo đơn đặt bàn 
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post('create')
  createSetTable(@Body() settable: CreateSetTableDto) {
    const newSetTable = this.settableService.createSetTable(settable);
    return {
      message: 'Tạo đơn đặt bàn thành công.',
      setTable: newSetTable,
    };
  }
    // Lấy đơn đặt bàn theo id
    @UseGuards(JwtAuthGuard)
      @Roles(Role.ADMIN, Role.USER)
      @Get(':id')
      getSetTableById(@Param('id') id: string) {
        return this.settableService.findById(id);
      }

      @UseGuards(JwtAuthGuard, RoleAuthGuard)
      @Roles(Role.ADMIN, Role.USER)
      @Get()
      async getAll(@Query() params: ParamPaginationDto) {
        const settables = await this.settableService.findAll(params);
        return buildPagination(settables, params);
      }
  
    // Cập nhật đơn đặt bàn
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Put(':id')
    updateSetTable(@Param('id') id: string, @Body() settable: UpdateSetTableDto) {
      const updatedSetTable = this.settableService.updateById(id, settable);
      return {
        message: `Cập nhật đơn đặt bàn thành công.`,
        updatedSetTable,
      };
    }
// tìm đơn đặt bàn
  // @Get(':id')
  // getOne(@Param('id') id: string) {
  //   return this.settableService.findById(id);
  // }

    // Xóa đơn đặt bàn
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  async deleteSetTable(@Param('id') id: string) {
    const settable = await this.settableService.deleteSetTable(id);
    await this.cloudinaryService.deleteById(`settables/${settable._id}`);
    return {
      message: `Xóa đơn đặt bàn có thành công.`,
      deletedId: id,
    };
  }
    
  
    // Cập nhật trạng thái đơn đặt bàn
    @UseGuards(JwtAuthGuard, RoleAuthGuard)
    @Roles(Role.ADMIN, Role.USER)
    @Put(':id/status')
    updateStatus(@Param('id') id: string, @Query('status') status: boolean) {
      const updatedStatus = this.settableService.updateStatusSetTable(id, status);
      return {
        message: `Cập nhật trạng thái đơn đặt bàn thành công.`,
        updatedStatus,
      };
    }
  }
  