import React from 'react';
import { RouteNames } from '../../lib/enums';

import '../../assets/styles/card.scss';

export interface ISpotCard {
  title: string;
  water: string;
  id: number;
  image: string;
  hasPrediction: boolean;
  isUserLoggedIn?: boolean;
}

export const Card = (props: ISpotCard) => (
  <li
    data-spot-id={props.id}
    id={props.id.toString()}
    className='index__bathingspot-list-item'
  >
    <div>
      <img src='' alt='' className='spot-image' />
      <img src='' alt='' className='state-image' />
      <span className='spot-title'>{props.title}</span>
      {(() => {
        if (props.hasPrediction === true) {
          return <span className='asteriks'> * </span>;
        }
        return null;
      })()}
      {(() => {
        if (props.hasOwnProperty('water') === true) {
          if (props.water !== null) {
            if (props.water.length >= 0 && props.water !== props.title) {
              return <span className='spot-water'>{props.water}</span>;
            }
          }
        }
        return null;
      })()}
      <a
        className='is-small button index__bathingspot-list-item-button is-pulled-right'
        href={`/${RouteNames.bathingspot}/${props.id}`}
      >
        Detail
      </a>
      {(() => {
        if (
          props.isUserLoggedIn !== undefined &&
          props.isUserLoggedIn === true
        ) {
          return (
            <a
              className='is-small button index__bathingspot-list-item-button'
              href={`/${RouteNames.bathingspot}/${props.id}/${RouteNames.editor}`}
            >
              Edit
            </a>
          );
        }
      })()}
    </div>
  </li>
);
