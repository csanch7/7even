import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match, MatchDocument } from '../matching/schemas/match.schema';
import { Suggestion, SuggestionDocument } from './schemas/suggestion.schema';
import { VenueEvent, VenueEventDocument } from './schemas/venue-event.schema';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(Suggestion.name)
    private readonly suggestionModel: Model<SuggestionDocument>,
    @InjectModel(VenueEvent.name)
    private readonly venueEventModel: Model<VenueEventDocument>,
    @InjectModel(Match.name)
    private readonly matchModel: Model<MatchDocument>
  ) {}

  async generateForMatch(matchId: string, combinedInterests: string[]) {
    const catalog = await this.venueEventModel.find();
    const ranked = catalog
      .map((item) => {
        const matchedTags = item.tags.filter((tag) => combinedInterests.includes(tag));
        const score = matchedTags.length / Math.max(1, item.tags.length);
        return {
          venueEventId: item._id,
          name: item.name,
          type: item.type,
          matchedTags,
          score: Number(score.toFixed(4))
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    await this.suggestionModel.findOneAndUpdate(
      { matchId: new Types.ObjectId(matchId) },
      {
        matchId: new Types.ObjectId(matchId),
        items: ranked
      },
      { upsert: true, new: true }
    );

    return ranked;
  }

  async getForMatch(matchId: string, userId: string) {
    const match = await this.matchModel.findById(matchId);
    if (!match) return null;

    const participants = [match.userA.toString(), match.userB.toString()];
    if (!participants.includes(userId)) return null;

    return this.suggestionModel.findOne({ matchId: new Types.ObjectId(matchId) });
  }
}
