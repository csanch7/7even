import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from '../matching/schemas/match.schema';
import { ModerationService } from './moderation.service';
import {
  ModerationReport,
  ModerationReportSchema
} from './schemas/moderation-report.schema';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [
    forwardRef(() => MatchingModule),
    MongooseModule.forFeature([
      { name: ModerationReport.name, schema: ModerationReportSchema },
      { name: Match.name, schema: MatchSchema }
    ])
  ],
  providers: [ModerationService],
  exports: [ModerationService]
})
export class ModerationModule {}
