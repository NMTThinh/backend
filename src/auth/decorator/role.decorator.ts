import { SetMetadata } from '@nestjs/common'; // kiểm tra logic vai trò của người dùng  
import { Role } from 'src/auth/decorator/role.enum';

export const ROLES_KEY = 'role'; // Khóa giúp truy xuất đúng metadata.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);// nhận đầu vào là danh sách role và lưu danh sách với khóa.
