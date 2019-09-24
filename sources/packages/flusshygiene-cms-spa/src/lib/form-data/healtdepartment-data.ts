import { IFormBuildData } from '../common/interfaces';

export const healthDepartmentData: IFormBuildData[] = [
  {
    name: 'healthDepartment',
    type: 'text',
    label: 'Name',
  },
  {
    name: 'healthDepartmentAddition',
    type: 'text',
    label: 'Zusatz',
  },
  {
    name: 'healthDepartmentStreet',
    type: 'text',
    label: 'Straße',
  },
  {
    name: 'healthDepartmentPostalCode',
    type: 'number',
    label: 'Postleitzahl',
  },
  {
    name: 'healthDepartmentCity',
    type: 'text',
    label: 'Stadt',
  },
  {
    name: 'healthDepartmentMail',
    type: 'email',
    label: 'E-Mail',
  },
  {
    name: 'healthDepartmentPhone',
    type: 'text',
    label: 'Telefonnummer',
  },
];
