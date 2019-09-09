import { patchValues } from './../../../../components/spot/form-data/patch-values';
import {
  IBathingspot,
  IFormOptions,
  IFormBuildData,
} from '../../../../lib/common/interfaces';

const spot: IBathingspot = {
  name: 'Sweetwater',
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  influenceRainwater: undefined,
  hasPrediction: undefined,
  isPublic: true,
};
const data: IFormBuildData[] = [
  {
    type: 'select',
    name: 'influenceRainwater',
    label: 'influenceRainwarer',
    value: undefined,
    options: [],
  },
  {
    type: 'checkbox',
    name: 'hasPrediction',
    label: 'hasPrediction',
    value: undefined,
    options: [],
  },
];
describe('Tests for value patching', () => {
  test('patching select values', () => {
    spot.influenceRainwater = undefined;
    const patchedUndef = patchValues(spot, data, 'unknown');
    expect(patchedUndef.length).toBe(2);
    expect(patchedUndef[0].value).toEqual('unknown');
    // --------------
    spot.influenceRainwater = 'yes';
    const patchedYes = patchValues(spot, data, 'unknown');
    expect(patchedYes.length).toBe(2);
    expect(patchedYes[0].value).toEqual('yes');
    // --------------
    spot.influenceRainwater = 'no';
    const patchedNo = patchValues(spot, data, 'unknown');
    expect(patchedNo.length).toBe(2);
    expect(patchedNo[0].value).toEqual('no');
  });

  test('patching of checkbox values who are undefined/true/false', () => {
    spot.hasPrediction = undefined;
    const patchedUndef = patchValues(spot, data, 'unused');
    expect(patchedUndef.length).toBe(2);
    expect(patchedUndef[1].value).toBe(false);
    // --------------
    spot.hasPrediction = true;
    const patchedTrue = patchValues(spot, data, 'unused');
    expect(patchedTrue.length).toBe(2);
    expect(patchedTrue[1].value).toBe(true);
    // --------------
    spot.hasPrediction = false;
    const patchedFalse = patchValues(spot, data, 'unused');
    expect(patchedFalse.length).toBe(2);
    expect(patchedFalse[1].value).toBe(false);
  });

  test('patching error throw for select without default Value', () => {
    // const patched = patchValues(spot, [data[0]]);
    expect(() => {
      patchValues(spot, [data[0]]);
    }).toThrow(Error);
  });
});
