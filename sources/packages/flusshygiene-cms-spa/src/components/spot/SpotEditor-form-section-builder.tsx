import React from 'react';
import { SpotEditorInput } from './SpotEditor-Input';
import { SpotEditorCheckbox } from './SpotEditor-Checkbox';
import { SpotEditorSelect } from './SpotEditor-Select';
import { IFormBuildData } from '../../lib/common/interfaces';

export const formSectionBuilder: (
  data: IFormBuildData[],
) => (JSX.Element | undefined)[] = (data) => {
  const res = data.map((datum, i) => {
    switch (datum.type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <SpotEditorInput
            key={i}
            name={datum.name}
            type={datum.type}
            label={datum.label}
          />
        );
      case 'checkbox':
        return (
          <SpotEditorCheckbox
            key={i}
            name={datum.name}
            type={datum.type}
            label={datum.label}
            value={datum.value! as boolean}
          />
        );
      case 'select':
        return (
          <SpotEditorSelect
            key={i}
            name={datum.name}
            label={datum.label}
            value={datum.value! as string}
            options={datum.options!}
          />
        );
      default:
        return undefined;
    }
  });
  return res;
};
