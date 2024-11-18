  import {
      IsBoolean,
      IsMongoId,
      IsNumber,
      IsString,
    } from 'class-validator';
    
    export class CreateSetTableDto {
    
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
    