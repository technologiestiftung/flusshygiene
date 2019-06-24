import tap from 'tap';
import{flattenArray} from '../.build/lib/util';
const nonFlattArr = [[1,2,3],[1,2,3]];
const flattArr = flattenArray(nonFlattArr);
if(flattArr[0] === 1){
  tap.pass('Array is flatt');
}

tap.equal(flattArr.length, 6, 'Array should have six elements');
tap.equal([[[1,2,3]],[[1,2,3]]].length, 2, 'Array should have 2 elements');