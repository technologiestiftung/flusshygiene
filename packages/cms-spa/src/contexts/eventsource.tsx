import React, { useEffect, createContext, useReducer, useContext } from 'react';

type EventSourceProviderProps = { children: React.ReactNode };

interface IEventSourceState {
  events: any[];
}
interface IEventAction {
  type: 'INCOMING';
  event: any;
}
const EventSourceContext = createContext<IEventSourceState | undefined>(
  undefined,
);

const eventSourceReducer: (
  state: IEventSourceState,
  action: IEventAction,
) => IEventSourceState = (state, action) => {
  switch (action.type) {
    case 'INCOMING': {
      console.log('IncomingMessage', action);
      const parsed = JSON.parse(action.event.data);
      let nextState: IEventSourceState;
      if (parsed.event === 'response') {
        nextState = { events: [...state.events, parsed] };
      } else {
        nextState = state;
      }
      return nextState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const EventSourceProvider = ({ children }: EventSourceProviderProps) => {
  const [state, dispatch] = useReducer(eventSourceReducer, {
    events: [],
  });
  const url =
    process.env.REACT_APP_EVENT_SOURCE_URL === undefined
      ? 'http://localhost:8888/middlelayer/stream'
      : process.env.REACT_APP_EVENT_SOURCE_URL;
  const eventSource = new EventSource(url);

  useEffect(() => {
    // if (eventSource.readyState !== EventSource.OPEN) {
    //   return;
    // }
    eventSource.addEventListener('passthrough', (event) => {
      console.log('passthrough', event);
      const action: IEventAction = { type: 'INCOMING', event };
      dispatch(action);
    });
    eventSource.addEventListener('error', (event) => {
      console.error('eventsource error', event);
    });
    eventSource.addEventListener('close', (event) => {
      console.info('eventsource close', event);
    });
    return () => {
      eventSource.close();
    };
  }, [eventSource]);
  return (
    <EventSourceContext.Provider value={state}>
      {children}
    </EventSourceContext.Provider>
  );
};
const useEventSourceState = () => {
  const stateContext = useContext(EventSourceContext);
  if (stateContext === undefined) {
    throw new Error(
      'useEventSourceState must be used within a EventSource Provider',
    );
  }
  return stateContext;
};
const useEventSource: () => IEventSourceState = () => {
  return useEventSourceState();
};
export { EventSourceProvider, useEventSource };
