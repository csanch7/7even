import { ModerationService } from '../src/modules/moderation/moderation.service';

describe('ModerationService', () => {
  it('flags banned keywords', () => {
    const service = new ModerationService({} as never, {} as never);
    const result = service.scanMessage('This contains a threat');
    expect(result.flagged).toBe(true);
    expect(result.reason).toBe('keyword_flag');
  });

  it('does not flag safe messages', () => {
    const service = new ModerationService({} as never, {} as never);
    const result = service.scanMessage('Let us grab coffee this week');
    expect(result.flagged).toBe(false);
    expect(result.reason).toBeNull();
  });
});
