import React from 'react';
import { SpotTableTitle, ISpotTableTitle } from './Spot-TableTitle';

export const SpotTableBlock: React.FC<{
  title: ISpotTableTitle;
  Table: () => React.ReactNode;
}> = ({ title, Table }) => {
  return (
    <div className='column is-5'>
      {SpotTableTitle(title)}
      {Table()}
    </div>
  );
};

// export function SpotTableBlock({
//   title,
//   Table,
// }: {
//   title: ISpotTableTitle;
//   Table: () => React.ReactNode;
//   // spot: IBathingspot,
// }): React.ReactNode {
//   return (
//     <div className='column is-5'>
//       {SpotTableTitle(title)}
//       {Table()}
//     </div>
//   );
// }
