import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QUIZ_QUESTIONS } from '../../common/constants/quiz.constants';
import { UsersService } from '../users/users.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import {
  QuizSubmission,
  QuizSubmissionDocument
} from './schemas/quiz-submission.schema';
import {
  CompatibilityVector,
  CompatibilityVectorDocument
} from './schemas/compatibility-vector.schema';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(QuizSubmission.name)
    private readonly submissionModel: Model<QuizSubmissionDocument>,
    @InjectModel(CompatibilityVector.name)
    private readonly vectorModel: Model<CompatibilityVectorDocument>,
    private readonly usersService: UsersService
  ) {}

  getQuestions() {
    return QUIZ_QUESTIONS;
  }

  async submitResponses(userId: string, dto: SubmitQuizDto) {
    const submission = await this.submissionModel.create({
      userId: new Types.ObjectId(userId),
      answers: dto.answers,
      interests: dto.interests
    });

    const traits = this.computeTraits(dto.answers);

    await this.vectorModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      {
        userId: new Types.ObjectId(userId),
        traits,
        interests: dto.interests,
        version: 1
      },
      { upsert: true, new: true }
    );

    await this.usersService.updateMe(userId, { interests: dto.interests });

    return {
      submissionId: submission.id,
      traits,
      interests: dto.interests
    };
  }

  async getResult(userId: string) {
    const vector = await this.vectorModel.findOne({ userId: new Types.ObjectId(userId) });
    return {
      traits: vector?.traits ?? {},
      interests: vector?.interests ?? []
    };
  }

  async getAllVectors() {
    return this.vectorModel.find();
  }

  async getVectorByUserId(userId: string) {
    return this.vectorModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  private computeTraits(answers: Array<{ questionId: string; value: number }>) {
    const lookup = new Map(QUIZ_QUESTIONS.map((q) => [q.id, q.axis]));
    const traits: Record<string, number[]> = {};

    for (const answer of answers) {
      const axis = lookup.get(answer.questionId);
      if (!axis) continue;
      if (!traits[axis]) traits[axis] = [];
      traits[axis].push(answer.value);
    }

    return Object.fromEntries(
      Object.entries(traits).map(([axis, values]) => [
        axis,
        Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(3))
      ])
    );
  }
}
