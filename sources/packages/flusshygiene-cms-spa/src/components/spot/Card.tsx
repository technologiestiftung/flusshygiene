import React from 'react';
import { RouteNames } from '../../lib/common/enums';

import '../../assets/styles/card.scss';
import { Link } from 'react-router-dom';

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
          if (props.water) {
            if (props.water.length >= 0 && props.water !== props.title) {
              return <span className='spot-water'>{props.water}</span>;
            }
          }
        }
        return null;
      })()}
      <Link
        className='is-small button index__bathingspot-list-item-button is-pulled-right'
        to={`/${RouteNames.bathingspot}/${props.id}`}
      >
        Detail
      </Link>
      {(() => {
        if (
          props.isUserLoggedIn !== undefined &&
          props.isUserLoggedIn === true
        ) {
          return (
            <Link
              className='is-small button index__bathingspot-list-item-button'
              to={`/${RouteNames.bathingspot}/${props.id}/${RouteNames.editor}`}
            >
              Edit
            </Link>
          );
        }
      })()}
    </div>
  </li>
);
