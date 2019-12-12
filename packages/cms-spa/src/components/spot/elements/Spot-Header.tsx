import React from 'react';
import { Spinner } from '../../util/Spinner';
export interface ISpotHeader {
  nameLong?: string;
  district?: string;
  water?: string;
  name?: string;
  isLoading: boolean;
}

export const SpotHeader = (props: ISpotHeader) => {
  if (props.isLoading === true && props.name === undefined) {
    return <Spinner />;
  } else {
    return (
      <>
        <h1 className='is-title is-1'>
          {props.name} {props.isLoading === true && <Spinner />}
        </h1>
        {(() => {
          if (props.nameLong) {
            return (
              <div className='content'>
                <p className='subtitle'>
                  {props.nameLong}{' '}
                  <span className='district'>{props.district}</span>
                </p>
              </div>
            );
          }
          return;
        })()}
        {(() => {
          if (props.water) {
            return (
              <h3 className='is-subtitle is-3'>
                {'Gewässer: '}
                {props.water}
              </h3>
            );
          }
        })()}
      </>
    );
  }
};
