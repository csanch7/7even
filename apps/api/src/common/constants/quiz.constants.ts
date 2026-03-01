import { QuizQuestion } from '../interfaces/quiz.interface';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'I enjoy trying new social activities.',
    axis: 'openness'
  },
  {
    id: 'q2',
    prompt: 'I prefer quiet evenings over large gatherings.',
    axis: 'introversion'
  },
  {
    id: 'q3',
    prompt: 'I am usually very organized with my week.',
    axis: 'conscientiousness'
  },
  {
    id: 'q4',
    prompt: 'I enjoy discussing ideas and current events.',
    axis: 'intellect'
  },
  {
    id: 'q5',
    prompt: 'I prefer spontaneous plans.',
    axis: 'spontaneity'
  }
];

export const INTEREST_TAGS = [
  'coffee',
  'foodie',
  'sports',
  'art',
  'music',
  'outdoors',
  'gaming',
  'comedy',
  'nightlife',
  'books'
] as const;
