import { IsNumber, IsBoolean,  IsDateString, IsString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDto {

  @IsNumber()
  totalAmount?: number;

  @IsBoolean()
  status: boolean;

  orderparent_id?: string;

  orderDate: Date; 

  table_id: string; 

  user_id: string;
}
