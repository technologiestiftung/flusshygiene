import { IFormBuildData, IBathingspot } from '../common/interfaces';

export const patchValues: (
  values: IBathingspot,
  data: IFormBuildData[],
  defaultSelect?: string,
) => IFormBuildData[] = (values, data, defaultSelect) => {
  data.forEach((ele, i, arr) => {
    if (ele.type === 'checkbox') {
      if (values.hasOwnProperty(ele.name) === true) {
        arr[i].value =
          values[ele.name] === undefined ? false : values[ele.name];
      }
    }
    if (ele.type === 'select') {
      if (values.hasOwnProperty(ele.name) === true) {
        if (defaultSelect === undefined) {
          throw new Error(
            'You need to define a defaultSelect value for the patch function ',
          );
        }
        arr[i].value =
          values[ele.name] === undefined ? defaultSelect : values[ele.name];
      }
    }
  });
  return data;
};
