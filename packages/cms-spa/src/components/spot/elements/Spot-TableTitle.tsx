import React from 'react';
import {
  IconRain,
  IconCalc,
  IconComment,
  IconCSV,
  IconIndustry,
} from '../../fontawesome-icons';
export type TableTitleIconType =
  | 'IconCalc'
  | 'IconRain'
  | 'IconCSV'
  | 'IconComment'
  | 'IconIndustry';
export interface ISpotTableTitle {
  title: string;
  iconType: TableTitleIconType;
}
export function SpotTableTitle({
  title,
  iconType,
}: ISpotTableTitle): React.ReactNode {
  return (
    <h3 className='is-title is-3'>
      <span>
        {(() => {
          switch (iconType) {
            case 'IconComment': {
              return <IconComment></IconComment>;
            }
            case 'IconCSV': {
              return <IconCSV></IconCSV>;
            }
            case 'IconRain': {
              return <IconRain></IconRain>;
            }
            case 'IconCalc': {
              return <IconCalc></IconCalc>;
            }
            case 'IconIndustry': {
              return <IconIndustry></IconIndustry>;
            }
            default: {
              throw new Error('No default icon defiend');
            }
          }
        })()}
      </span>{' '}
      <span>{title}</span>
    </h3>
  );
}
