import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class VerifiedEmailGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ user: { sub: string } }>();
    const user = await this.usersService.findById(req.user.sub);
    if (!user?.emailVerifiedAt) {
      throw new ForbiddenException('Complete .edu email verification first.');
    }
    return true;
  }
}
