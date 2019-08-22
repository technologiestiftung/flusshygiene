import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { Card } from '../components/spot/Card';
import { MemoryRouter } from 'react-router';

storiesOf('Card', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('default', () => (
    <Card
      title={'Sweetwater'}
      water={'Sweet'}
      id={1}
      image={'http://placekitten.com/1080/540'}
      hasPrediction={true}
    />
  ));
