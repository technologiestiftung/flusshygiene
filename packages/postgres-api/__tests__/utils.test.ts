import { formatDateToString, pad } from './../src/lib/utils/format-dates';
import fs from 'fs';
import path from 'path';
import { IObject } from '../src/lib/common';
import { getGEOJsonGeometry } from '../src/lib/utils/get-geojson-geometry';
import { getPropsValueGeneric } from '../src/lib/utils/get-properties-values-generic';
import { isObject } from './../src/lib/utils/is-object';

describe('utiltites  isObject tests', () => {
  test('should be an objcet', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
  });
  test('should not be an objcet', () => {
    expect(isObject(true)).toBe(false);
    expect(isObject(2)).toBe(false);
    expect(isObject(2.3)).toBe(false);
    expect(isObject('foo')).toBe(false);
  });
});

describe('utilities getGEOJsonGeometry test', () => {
  test('shuold return a geojson geometry', () => {
    const geojson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, './data/polygon.json'), 'utf8'),
    );
    const geom: IObject = getGEOJsonGeometry({ geo: geojson }, 'geo');
    // console.log(geom);
    expect(geom).toMatchObject(geojson.geometry);
  });
});
describe('generic property getter', () => {
  test('should get the right types or undefined', () => {
    const o = {
      arr: [1, 2, 3],
      bool: true,
      fun: () => 'foo',
      num: 12,
      obj: { foo: 'bah' },
      str: 'foo',
    };
    expect(typeof getPropsValueGeneric<string>(o, 'str')).toBe('string');
    expect(typeof getPropsValueGeneric<number[]>(o, 'arr')).toBe('object');
    expect(typeof getPropsValueGeneric<boolean>(o, 'bool')).toBe('boolean');
    expect(typeof getPropsValueGeneric<number>(o, 'num')).toBe('number');
    expect(typeof getPropsValueGeneric<object>(o, 'obj')).toBe('object');
    expect(getPropsValueGeneric<string>(o, 'str')).toEqual('foo');
    expect(getPropsValueGeneric<number[]>(o, 'arr')).toEqual(o.arr);
    expect(getPropsValueGeneric<boolean>(o, 'bool')).toBe(true);
    expect(getPropsValueGeneric<number>(o, 'num')).toBe(12);
    expect(getPropsValueGeneric<object>(o, 'obj')).toEqual(o.obj);
    expect(getPropsValueGeneric(o, 'bool')).toBe(true);
    expect(getPropsValueGeneric<boolean>(o, 'foo')).toBe(undefined);
    expect(getPropsValueGeneric(o, 'foo')).toBe(undefined);
    expect(getPropsValueGeneric<string>(o, 'bool')).toBe(true);
    expect(getPropsValueGeneric<string>(o, 'foo')).toBe(undefined);
  });
});

describe('string formatting tools', () => {
  test('should match string', () => {
    const date = new Date();
    const res = formatDateToString(date);

    expect(res).toEqual(
      expect.stringMatching(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/),
    );
  });
  test('should pad number', () => {
    expect(pad(2)).toEqual('02');
    expect(pad(10)).toEqual('10');
    expect(pad(100)).toEqual('100');
  });
});
