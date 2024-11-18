import { IsOptional, IsMongoId, IsNumber } from 'class-validator';

export class UpdateOrderDetailsDto {

  @IsOptional()
  @IsMongoId()
  order_id?: string; // ID của đơn hàng, có thể được cập nhật nếu cần (kiểu string trong DTO)


  @IsOptional()
  @IsMongoId()
  product_id?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number; // Số lượng sản phẩm,  có thể được cập nhật

  @IsOptional()
  note?: string; // Ghi chú cho sản phẩm, có thể được cập nhật

  @IsOptional()
  @IsNumber()
  price?: number; // Giá của sản phẩm, có thể được cập nhật
}
