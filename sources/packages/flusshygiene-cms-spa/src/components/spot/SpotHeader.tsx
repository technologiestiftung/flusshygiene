import React from 'react';
export interface ISpotHeader {
  nameLong: string;
  district: string;
  water?: string;
}

export const SpotHeader = (props: ISpotHeader) => (
  <div className=''>
    <h1 className='title is-3'>
      {props.nameLong} <span>{props.district}</span>
    </h1>
    {(() => {
      if (props.nameLong !== props.water && props.water !== undefined) {
        return <h2 className='subtitle'>{props.water}</h2>;
      }
      return null;
    })()}
  </div>
);
