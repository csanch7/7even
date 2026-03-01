import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { VerifiedEmailGuard } from '../../common/guards/verified-email.guard';
import { AuthUser } from '../../common/interfaces/request.interface';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuizService } from './quiz.service';

@Controller('quiz')
@UseGuards(JwtAuthGuard, VerifiedEmailGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('questions')
  getQuestions() {
    return this.quizService.getQuestions();
  }

  @Post('responses')
  submitResponses(@CurrentUser() user: AuthUser, @Body() dto: SubmitQuizDto) {
    return this.quizService.submitResponses(user.sub, dto);
  }

  @Get('result')
  getResult(@CurrentUser() user: AuthUser) {
    return this.quizService.getResult(user.sub);
  }
}
