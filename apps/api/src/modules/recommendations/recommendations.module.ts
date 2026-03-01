import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from '../matching/schemas/match.schema';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { Suggestion, SuggestionSchema } from './schemas/suggestion.schema';
import { VenueEvent, VenueEventSchema } from './schemas/venue-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Suggestion.name, schema: SuggestionSchema },
      { name: VenueEvent.name, schema: VenueEventSchema },
      { name: Match.name, schema: MatchSchema }
    ])
  ],
  providers: [RecommendationsService],
  controllers: [RecommendationsController],
  exports: [RecommendationsService]
})
export class RecommendationsModule {}
