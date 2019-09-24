import { ColorNames } from '../common/interfaces';

const classBaseName = 'questionnaire__color';
export const colorNamesToClassNames: (cname: ColorNames) => string = (
  cname,
) => {
  const colName = cname.toLowerCase();

  switch (colName) {
    case 'grün':
      return `${classBaseName}--green`;
    case 'türkis':
      return `${classBaseName}--turquoise`;
    case 'gelb':
      return `${classBaseName}--yellow`;
    case 'orange':
      return `${classBaseName}--orange`;
    case 'rot':
      return `${classBaseName}--red`;
    default:
      return '';
  }
};

export const colorNamesToRotation: (cname: ColorNames) => number = (cname) => {
  const colName = cname.toLowerCase();

  switch (colName) {
    case 'grün':
      return 0;
    case 'türkis':
      return 135;
    case 'gelb':
      return 45;
    case 'orange':
      return 90;
    case 'rot':
      return 180;
    default:
      return 0;
  }
};
