import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/decorator/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Injectable() // Cho biết RoleAuthGuard là một service có thể inject vào controller hay service khác
export class RoleAuthGuard extends JwtAuthGuard implements CanActivate { // kiểm tra vai trò user sau khi đã xác thực bằng JWT
  constructor(private readonly reflector: Reflector) { // lấy metadata từ các decorator Role
    super();
  }

  canActivate(// quyết định yêu cầu đc tiếp tục không true/false
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [//Lấy các vai trò mà route yêu cầu từ decorator @Roles()
      context.getHandler(),// là các phương thức giúp lấy metadata từ
      context.getClass(),//các decorator của route hoặc controller.
    ]);

    if (!requiredRoles) {
      return true;
    }
// Kiểm tra vai trò người dùng
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
