import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { CardTile } from '../components/spot/CardTile';
import { MemoryRouter } from 'react-router';

storiesOf('CardTile', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('default', () => (
    <CardTile
      title={'Sweetwater'}
      water={'Sweet'}
      id={1}
      image={'http://placekitten.com/1080/540'}
      hasPrediction={true}
    />
  ));
