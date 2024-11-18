import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { CustomerModule } from 'src/customer/customer.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule, //Để lấy thông tin từ bảng user khi xử lý logic xác thực.
    JwtModule.registerAsync({ //Đăng ký module JWT với cấu hình động
      useFactory: () => ({
        secret:
          'vVarX3ETLuR35pAe8LLVSEieaIxvBrz6X2B0eiN1HY4cdf3jYwBUKISJhDDXD60gsZiL9HLTYPoVwrSGa628XGmjJkGF04J3f4On',
        signOptions: {
          expiresIn: '24h', //Token sẽ hết hạn sau 24 giờ.
          algorithm: 'HS256',//Thuật toán mã hóa token
        },
      }),
    }),
    CustomerModule,
  ],

  providers: [AuthService, JwtStrategy],//Đăng ký AuthService để thực hiện logic.Đăng ký JwtStrategy để cấu hình cách xử lý JWT khi client gửi lên.
})
export class AuthModule {}
