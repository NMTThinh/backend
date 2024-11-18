import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/auth/decorator/role.enum';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  status?: boolean; // Thêm tùy chọn cho status

  @IsOptional()
  role?: Role[]; // Thêm tùy chọn cho role
}
