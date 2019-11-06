import React from 'react';
import { createStore } from 'redux';
import { reducer } from '../../__test-utils/empty-reducer';
import { initialState } from '../../__test-utils/initial-state';
import { render, act } from '../../__test-utils/render-with-providers';
import { createMemoryHistory } from 'history';
import Profile from '../components/Profile';

it.skip('renders Profile without crashing', async (done) => {
  const store = createStore(reducer, initialState);
  const history = createMemoryHistory({ initialEntries: ['/'] });

  await act(async () => {
    render(<Profile />, store, history);
    done();
  });
});
