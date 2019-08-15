import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory } from 'history';
function render(ui: any, store, history?, ...rest) {
  if (!history) {
    history = createMemoryHistory();
  }
  return rtlRender(
    <Provider store={store}>
      <Router history={history}>{ui}</Router>
    </Provider>,
    ...rest,
  );
}

export * from '@testing-library/react';
export { render };
