import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt'; //Lấy token từ request của người dùng. 
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto'; //Định nghĩa cấu trúc thông tin bên trong JWT.
//Kiểm tra tính xác thực của JWT và lấy thông tin user từ JWT
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { // kiểm tra và xử lý JWT 
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),// Lấy token từ Authorization header
      secretOrKey:
        'vVarX3ETLuR35pAe8LLVSEieaIxvBrz6X2B0eiN1HY4cdf3jYwBUKISJhDDXD60gsZiL9HLTYPoVwrSGa628XGmjJkGF04J3f4On',//mk để giải mã JWT
    });
  }

  async validate(payload: TokenPayloadDto) {
    return payload;//trả về thông tin user
  }
}
