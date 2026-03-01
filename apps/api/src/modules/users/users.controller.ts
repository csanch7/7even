import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/interfaces/request.interface';
import { UpdateMeDto } from './dto/update-me.dto';
import { UsersService } from './users.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.getMe(user.sub);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateMeDto) {
    return this.usersService.updateMe(user.sub, dto);
  }

  @Delete('me')
  deleteMe(@CurrentUser() user: AuthUser) {
    return this.usersService.softDelete(user.sub);
  }
}
