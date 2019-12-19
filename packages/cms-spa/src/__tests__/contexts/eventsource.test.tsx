import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import 'eventsource/lib/eventsource-polyfill';

import {
  EventSourceProvider,
  useEventSource,
} from '../../contexts/eventsource';

describe('Testing api context', () => {
  test('EventSourceProvider should render', () => {
    const component = (
      <EventSourceProvider url={'http://localhost:8888/middlelayer/stream'}>
        {<></>}
      </EventSourceProvider>
    );
    const dom = render(component);
    expect(dom).toBeDefined();
  });
  test('Should throw an error if not in provider (imp detail)', () => {
    expect(() => {
      useEventSource();
    }).toThrow(Error);
  });
});
