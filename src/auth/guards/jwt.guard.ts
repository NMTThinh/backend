    import { AuthGuard } from '@nestjs/passport'; 

    export class JwtAuthGuard extends AuthGuard('jwt') {} // kiểm tra mã JWT hợp lệ không
