import { isObject } from './../src/lib/utils/is-object';

describe('utiltites tests', ()=>{
  test('should be an objcet',()=>{
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
  });
  test('should not be an objcet',()=>{
    expect(isObject(true)).toBe(false);
    expect(isObject(2)).toBe(false);
    expect(isObject(2.3)).toBe(false);
    expect(isObject('foo')).toBe(false);
  });
});
