import React from 'react';
export interface ISpotImage {
  image?: string | null;
  nameLong?: string;
  name: string;
  imageAuthor?: string;
}

export const SpotImage: React.FC<ISpotImage> = (props) => (
  <figure className='image is-16by9'>
    <img
      src={(() => {
        if (props.image === null) {
          return '/placeholder16-9.svg';
        } else if (props.image === undefined || props.image.length === 0) {
          return '/placeholder16-9.svg';
        } else {
          return props.image;
        }
      })()}
      alt={`${props.nameLong}`}
      title={`${props.name}`}
    />
    <figcaption>
      Bildquelle:{' '}
      {(() => {
        return props.imageAuthor !== undefined
          ? `${props.imageAuthor}`
          : 'Unbekannt';
      })()}
    </figcaption>
  </figure>
);
