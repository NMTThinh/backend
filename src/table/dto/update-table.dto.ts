import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateTableDto {
  @IsString()
  nametable: string;

  @IsNumber()
  numberofchair: number;
  @IsBoolean()
  status?: boolean;

  tableparent_id: string;
}
