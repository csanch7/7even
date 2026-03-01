import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthUser } from '../../common/interfaces/request.interface';
import { RecommendationsService } from './recommendations.service';

@Controller('matches/:matchId/suggestions')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  getSuggestions(@Param('matchId') matchId: string, @CurrentUser() user: AuthUser) {
    return this.recommendationsService.getForMatch(matchId, user.sub);
  }
}
