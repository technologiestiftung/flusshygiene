import React from 'react';
import { createStore } from 'redux';
import { reducer } from '../../__test-utils/empty-reducer';
import { initialState } from '../../__test-utils/initial-state';
import { render } from '../../__test-utils/render-with-providers';
import { createMemoryHistory } from 'history';
import SpotEditor from '../components/spot/SpotEditor';
import { IBathingspot } from '../lib/common/interfaces';
it('renders Home without crashing', () => {
  const store = createStore(reducer, initialState);
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const spot: IBathingspot = {
    name: 'Sweetwater',
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const editor = render(
    <SpotEditor initialSpot={spot} handleEditModeClick={() => {}} />,
    store,
    history,
  );
  expect(editor.getAllByLabelText(/name/i)).toBeDefined();
  // expect(editor.queryByText(/foo/i)).toBeDefined();
  // expect(editor.queryByText(/\*/i)).toBeDefined();

  // expect(editor.queryByText(/\<a/i)).toBeDefined();
});
