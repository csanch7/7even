import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';
import { BlockedPair, BlockedPairSchema } from './schemas/blocked-pair.schema';
import {
  MatchingCycle,
  MatchingCycleSchema
} from './schemas/matching-cycle.schema';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { UsersModule } from '../users/users.module';
import { QuizModule } from '../quiz/quiz.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ModerationModule } from '../moderation/moderation.module';

@Module({
  imports: [
    UsersModule,
    QuizModule,
    RecommendationsModule,
    NotificationsModule,
    forwardRef(() => ModerationModule),
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: MatchingCycle.name, schema: MatchingCycleSchema },
      { name: BlockedPair.name, schema: BlockedPairSchema }
    ])
  ],
  providers: [MatchingService],
  controllers: [MatchingController],
  exports: [MatchingService, MongooseModule]
})
export class MatchingModule {}
