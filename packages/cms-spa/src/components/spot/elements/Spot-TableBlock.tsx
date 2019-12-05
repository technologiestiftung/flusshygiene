import React from 'react';
import { SpotTableTitle, ISpotTableTitle } from './Spot-TableTitle';
export function SpotTableBlock({
  title,
  Table,
}: {
  title: ISpotTableTitle;
  Table: () => React.ReactNode;
  // spot: IBathingspot,
}): React.ReactNode {
  return (
    <div className='column is-5'>
      {SpotTableTitle(title)}
      {/* {Title()} */}
      {Table()}
    </div>
  );
}
