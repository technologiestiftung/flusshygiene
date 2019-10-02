import { version } from '../src/version';
import fs from 'fs';

afterAll(() => {
  // fsMock.mockRestore();
  jest.restoreAllMocks();
});
describe('testing version', () => {
  test('should be the same as version from package.json', () => {
    jest
      .spyOn(fs, 'readFileSync')
      .mockImplementation(() => JSON.stringify({ version: '0.1.0' }));
    expect(version()).toBe('0.1.0');
  });
  test('should throw an error', () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      return '';
    });
    expect(() => {
      version();
    }).toThrow();
  });
});
