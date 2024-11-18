import { Role } from 'src/auth/decorator/role.enum'; // xác định vai trò

export class TokenPayloadDto { // chứa thông tin người dùng khi đăng nhập thành công 
  _id: string;
  email: string;
  name: string;
  role?: Role[];
}
