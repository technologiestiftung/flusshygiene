import React from 'react';
import { RouteNames } from '../../lib/common/enums';
// import '../../assets/styles/card.scss';
import { Link } from 'react-router-dom';

export interface ISpotCard {
  title: string;
  water: string | undefined;
  id: number;
  image: string;
  hasPrediction: boolean;
  isUserLoggedIn?: boolean;
}

export const CardTile: React.FC<ISpotCard> = ({
  title,
  water,
  id,
  image,
  hasPrediction,
  isUserLoggedIn,
}) => {
  // console.log(image);
  return (
    <div className='card'>
      <div className='card-image'>
        <figure className='image is-16by9'>
          <img
            src={image === null ? 'http://placekitten.com/270/135' : image}
            alt={''}
          />
        </figure>
      </div>

      <div className='card-content'>
        <div className='media'>
          <div className='media-content'>
            <p className='title is-6'>
              {title}{' '}
              {(() => {
                if (hasPrediction === true) {
                  return <span className='asteriks'> * </span>;
                }
                return null;
              })()}
            </p>
            {(() => {
              if (water) {
                if (water.length >= 0) {
                  return (
                    <p className='subtitle is-6'>
                      <span className='spot-water'>{water}</span>;
                    </p>
                  );
                }
              }
            })()}
          </div>
        </div>
        <div className='content'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec
          iaculis mauris.
          <br />
        </div>
      </div>
      <footer className='card-footer'>
        <Link
          className='card-footer-item'
          to={`/${RouteNames.bathingspot}/${id}`}
        >
          Detail
        </Link>
        {(() => {
          if (isUserLoggedIn !== undefined && isUserLoggedIn === true) {
            return (
              <Link
                className='card-footer-item'
                to={`/${RouteNames.bathingspot}/${id}`}
              >
                Bearbeiten
              </Link>
            );
          }
        })()}
      </footer>
    </div>
  );
};

// export const Card = (props: ISpotCard) => (
//   <li
//     data-spot-id={props.id}
//     id={props.id.toString()}
//     className='index__bathingspot-list-item'
//   >
//     <div>
//       <img src='' alt='' className='spot-image' />
//       <img src='' alt='' className='state-image' />
//       <span className='spot-title'>{props.title}</span>
//       {(() => {
//         if (props.hasPrediction === true) {
//           return <span className='asteriks'> * </span>;
//         }
//         return null;
//       })()}
//       {(() => {
//         if (props.hasOwnProperty('water') === true) {
//           if (props.water) {
//             if (props.water.length >= 0 && props.water !== props.title) {
//               return <span className='spot-water'>{props.water}</span>;
//             }
//           }
//         }
//         return null;
//       })()}
//       <Link
//         className='is-small button index__bathingspot-list-item-button is-pulled-right'
//         to={`/${RouteNames.bathingspot}/${props.id}`}
//       >
//         Detail
//       </Link>
//       {(() => {
//         if (
//           props.isUserLoggedIn !== undefined &&
//           props.isUserLoggedIn === true
//         ) {
//           return (
//             <Link
//               className='is-small button index__bathingspot-list-item-button'
//               to={`/${RouteNames.bathingspot}/${props.id}/${RouteNames.editor}`}
//             >
//               Edit
//             </Link>
//           );
//         }
//       })()}
//     </div>
//   </li>
// );
