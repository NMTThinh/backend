import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {} // sử dụng các hàm xử lý logic từ service

  @Post('users/login')
  loginUser(@Body() login: LoginDto) { //Lấy dữ liệu từ body của request và kiểm tra xem có đúng cấu trúc của LoginDto không.
    return this.authService.validateUser(login);//gọi hàm authService kiểm tra thông tin đăng nhập 
  }

  @Post('customers/login')
  loginCustomer(@Body() login: LoginDto) {
    return this.authService.validateCustomer(login);
  }
}
