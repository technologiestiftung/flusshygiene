// broadcaster - instance.test.ts;
import { broadcaster } from '../broadcaster-instance';
jest.mock('winston');
afterAll(() => {
  jest.resetAllMocks();
});
describe('instance passthrough calls', () => {
  test('passthrough', () => {
    const spyOnDataEmit = jest.spyOn(broadcaster, 'emit');
    broadcaster.emit('passthrough', { event: 'start' });
    broadcaster.emit('passthrough', { event: 'end' });
    broadcaster.emit('passthrough', { event: 'foo' });
    expect(spyOnDataEmit).toHaveBeenCalled();
    expect(spyOnDataEmit).toHaveBeenCalledTimes(6);
  });
});
