import { IsOptional, IsNumber, IsMongoId } from 'class-validator';

export class CreateOrderDetailsDto {

    @IsMongoId()
    order_id: string; // ID của đơn hàng (kiểu string trong DTO)

    @IsMongoId()
    product_id: string;

    @IsNumber()
    quantity: number; // Số lượng sản phẩm

    @IsOptional()
    note?: string; // Ghi chú cho sản phẩm

    @IsNumber()
    price: number; // Giá của sản phẩm
}
