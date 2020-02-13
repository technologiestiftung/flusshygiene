import React from 'react';
import { SpotTableTitle, ISpotTableTitle } from './Spot-TableTitle';
// import { IconCode } from '../../fontawesome-icons';
import { ClickFunction } from '../../../lib/common/interfaces';
import { ButtonIcon } from '../../Buttons';
import { IconEdit } from '../../fontawesome-icons';

export const SpotTableBlock: React.FC<{
  title: ISpotTableTitle;
  Table: () => React.ReactNode;
  handleEditClick?: ClickFunction;
  hasData?: boolean;
}> = ({ title, Table, handleEditClick, hasData }) => {
  return (
    <div className='column is-5'>
      {/* {data && (
        <IconCode
          handleClick={() => {
            // if(data === undefined) return
            let csvContent =
              'data:text/csv;charset=utf-8,' +
              data?.map((e: any) => e.join(',')).join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `${title}.csv`);
            document.body.appendChild(link); // Required for FF
            link.click(); // This will download the data file named "my_data.csv".
          }}
        ></IconCode>
       )} */}
      {SpotTableTitle(title)}
      {Table()}
      {/* {hasData ? ( */}
      <ButtonIcon handleClick={handleEditClick} text={'Daten Editieren'}>
        <IconEdit />
      </ButtonIcon>
      {/* ) : (
        <ButtonIcon
          isDisabled={true}
          handleClick={handleEditClick}
          text={'Daten Editieren'}
        >
          <IconEdit />
        </ButtonIcon>
      )} */}
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
