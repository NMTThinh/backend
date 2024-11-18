import {
  IsBoolean,
  IsString,
  IsNumber
} from 'class-validator';

export class CreateTableDto {

  @IsString()
  nametable: string;

  @IsNumber()
  numberofchair:number;

  @IsBoolean()
  status?: boolean;

  tableparent_id?: string;
}
