import { IsStrongPassword } from 'class-validator'; // kiểm tra mk 

export class ChangePasswordDto { // nhận dữ liệu từ client khi thay đổi mk
  old_password: string;

  @IsStrongPassword()
  new_password: string;
}
