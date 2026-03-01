import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ headers: Record<string, string> }>();
    const authHeader = req.headers.authorization ?? '';
    const token = authHeader.replace('Bearer ', '').trim();
    const expected = this.config.get<string>('WORKER_AUTH_TOKEN');

    if (!expected || token !== expected) {
      throw new ForbiddenException('Invalid internal token.');
    }

    return true;
  }
}
