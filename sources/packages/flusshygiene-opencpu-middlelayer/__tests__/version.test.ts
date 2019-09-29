import { version } from '../src/version';
describe('testing version', () => {
  test('should be the same as version from package.json', () => {
    const v = require('../package.json').version;
    expect(version()).toBe(v);
  });
});
