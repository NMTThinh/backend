import { IsNumber, IsOptional, IsBoolean, IsString, IsMongoId } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsBoolean()
  status?: boolean;

  orderparent_id?: string;

  orderDate?: Date;

  table_id: string; 

  user_id: string;
}
