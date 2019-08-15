import React from 'react';
import App from '../App';
import { createStore } from 'redux';
import { reducer } from '../../__test-utils/empty-reducer';
import { initialState } from '../../__test-utils/initial-state';
import { render } from '../../__test-utils/render-with-providers';
import { createMemoryHistory } from 'history';

it('renders App without crashing', () => {
  const history = createMemoryHistory();
  const store = createStore(reducer, initialState);
  // const div = document.createElement('div');
  render(<App />, store, history);
  // ReactDOM.render(
  //   <Provider store={store}>
  //     <App />
  //   </Provider>,
  //   div,
  // );
  // ReactDOM.unmountComponentAtNode(div);
});
