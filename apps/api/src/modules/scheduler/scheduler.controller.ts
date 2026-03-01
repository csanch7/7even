import { Controller, Post, UseGuards } from '@nestjs/common';
import { InternalTokenGuard } from '../../common/guards/internal-token.guard';
import { SchedulerService } from './scheduler.service';

@Controller('scheduler')
@UseGuards(InternalTokenGuard)
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('run-weekly')
  runWeekly() {
    return this.schedulerService.runWeeklyNow();
  }

  @Post('expire-matches')
  expireMatches() {
    return this.schedulerService.expireNow();
  }
}
