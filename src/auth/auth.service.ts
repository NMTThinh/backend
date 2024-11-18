import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { CustomerRepository } from 'src/customer/customer.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,// Tạo và xử lý JWT.
    private readonly userRepository: UserRepository,//Truy vấn dữ liệu từ bảng user.
    private readonly customerRepository: CustomerRepository,
  ) {}

  async validateUser(login: LoginDto) { // lấy thông tin từ LoginDto
    const { email, password } = login;
    const user = await this.userRepository.findByEmail(email);// tìm user theo email 

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    if (user.status === false) {
      throw new UnauthorizedException('Tài khoản đã bị khoá');
    }

    const isMatch = bcrypt.compareSync(password, user.password);//So sánh mật khẩu bằng bcrypt.compareSync
    if (!isMatch) {
      throw new UnauthorizedException('Sai mật khẩu');
    }

    const body: TokenPayloadDto = { //Tạo payload cho token
      _id: user._id.toHexString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return this.jwtService.signAsync(body); // Mã hóa payload thành token
  }
  async validateCustomer(login: LoginDto) {
    const { email, password } = login;
    const customer = await this.customerRepository.findbyEmail(email);
    if (!customer) {
      throw new UnauthorizedException('Không tìm thấy customer');
    }

   
  }
}
