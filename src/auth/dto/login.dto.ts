import { IsEmail } from 'class-validator'; // kiểm tra email

export class LoginDto { // nhận dữ liệu đăng nhập từ client
  @IsEmail()
  email: string;

  password: string;
}
