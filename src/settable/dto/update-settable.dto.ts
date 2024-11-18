import { IsBoolean, IsString, IsNumber, IsMongoId,} from 'class-validator';

export class UpdateSetTableDto {

  @IsString()
    nameSetTable: string;
  
    @IsString()
    customerName: string;
  
    @IsString()
    numberPhone: string;

    @IsNumber()
    guestCount: number;

    @IsString()
    reservationDate: string;

    @IsBoolean()
    status: boolean;

    @IsString()
    notes?: string;

    @IsMongoId()
    table_id?: string;
}
