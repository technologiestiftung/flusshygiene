import React from 'react';
export interface ISpotHeader {
  nameLong?: string;
  district?: string;
  water?: string;
  name: string;
}

export const SpotHeader = (props: ISpotHeader) => (
  <div className=''>
    <h1 className='is-title is-1'>{props.name}</h1>
    {props.nameLong && (
      <div className='content'>
        <p className='subtitle'>
          {props.nameLong} <span className='district'>{props.district}</span>
        </p>
      </div>
    )}
    {props.water && (
      <h3 className='is-subtitle is-3'>
        {'Gewässer: '}
        {props.water}
      </h3>
    )}
  </div>
);
