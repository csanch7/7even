import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match, MatchDocument } from '../matching/schemas/match.schema';
import {
  ModerationReport,
  ModerationReportDocument
} from './schemas/moderation-report.schema';

@Injectable()
export class ModerationService {
  private readonly bannedKeywords = ['hate', 'threat', 'violence', 'stalk'];

  constructor(
    @InjectModel(ModerationReport.name)
    private readonly reportModel: Model<ModerationReportDocument>,
    @InjectModel(Match.name)
    private readonly matchModel: Model<MatchDocument>
  ) {}

  async reportMatch(matchId: string, reporterId: string, messageIds: string[] = []) {
    const report = await this.reportModel.create({
      matchId: new Types.ObjectId(matchId),
      reporterId: new Types.ObjectId(reporterId),
      messageIds: messageIds.map((id) => new Types.ObjectId(id)),
      status: 'under_review'
    });

    await this.matchModel.findByIdAndUpdate(matchId, { status: 'reported' });

    return {
      reportId: report.id,
      status: report.status
    };
  }

  scanMessage(content: string) {
    const lower = content.toLowerCase();
    const flagged = this.bannedKeywords.some((keyword) => lower.includes(keyword));
    return {
      flagged,
      reason: flagged ? 'keyword_flag' : null
    };
  }
}
