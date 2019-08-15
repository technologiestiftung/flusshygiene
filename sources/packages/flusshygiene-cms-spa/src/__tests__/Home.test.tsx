import React from 'react';
import Home from '../components/Home';
import { createStore } from 'redux';
import { reducer } from '../../__test-utils/empty-reducer';
import { initialState } from '../../__test-utils/initial-state';
import { render } from '../../__test-utils/render-with-providers';
import { createMemoryHistory } from 'history';

it('renders Home without crashing', () => {
  const store = createStore(reducer, initialState);
  const history = createMemoryHistory({ initialEntries: ['/'] });
  render(<Home />, store, history);
});
