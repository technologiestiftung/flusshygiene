import React from 'react';
import { createStore } from 'redux';
import { reducer } from '../../__test-utils/empty-reducer';
import { initialState } from '../../__test-utils/initial-state';
import { render } from '../../__test-utils/render-with-providers';
import { createMemoryHistory } from 'history';
import Profile from '../components/Profile';

it('renders Home without crashing', () => {
  const store = createStore(reducer, initialState);
  const history = createMemoryHistory({ initialEntries: ['/'] });
  render(<Profile />, store, history);
});
