import React from 'react';
import { createStore } from 'redux';
import { reducer } from '../../__test-utils/empty-reducer';
import { initialState } from '../../__test-utils/initial-state';
import { render } from '../../__test-utils/render-with-providers';
import { createMemoryHistory } from 'history';
import { CardTile } from '../components/spot/Spot-CardTile';

it('renders The Card without crashing', () => {
  const store = createStore(reducer, initialState);
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const card = render(
    <CardTile
      title={'Foo'}
      id={1}
      water={undefined}
      image={'http://placekitten.com/200/300'}
      hasPrediction={true}
    />,
    store,
    history,
  );
  expect(card.queryByText(/foo/i)).toBeDefined();
  expect(card.queryByText(/\*/i)).toBeDefined();

  expect(card.queryByText(/\<a/i)).toBeDefined();
});
