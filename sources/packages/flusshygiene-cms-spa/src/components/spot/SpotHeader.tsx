import React from 'react';
export interface ISpotHeader {
  nameLong?: string;
  district?: string;
  water?: string;
  name: string;
}

export const SpotHeader = (props: ISpotHeader) => (
  <div className=''>
    <h1 className='title is-1'>{props.name}</h1>
    {props.nameLong && (
      <h2 className='subtitle is-2'>
        {props.nameLong} <span className='district'>{props.district}</span>
      </h2>
    )}
    {props.water && <h3 className='subtitle is-3'>{props.water}</h3>}
  </div>
);
