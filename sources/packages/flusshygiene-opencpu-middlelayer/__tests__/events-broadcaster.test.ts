import { BroadCaster } from '../src/events-broadcaster';

describe('testing events broadcaster', () => {
  test('should return same instance', () => {
    const b1 = BroadCaster.getInstance();
    const b2 = BroadCaster.getInstance();
    expect(b1).toBe(b2);
  });
});
