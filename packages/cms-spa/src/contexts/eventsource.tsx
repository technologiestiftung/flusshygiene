import React, {
  useEffect,
  createContext,
  useReducer,
  useContext,
  useRef,
} from "react";

type EventSourceProviderProps = { children: React.ReactNode; url?: string };

interface IEventSourceState {
  events: any[];
  url?: string;
  pings?: number;
}
interface IEventAction {
  type: "INCOMING" | "SET_URL" | "INTERNAL_ERROR" | "PING_RECEIVED";
  event: any;
  url?: string;
}
const EventSourceContext = createContext<IEventSourceState | undefined>(
  undefined,
);

const eventSourceReducer: (
  state: IEventSourceState,
  action: IEventAction,
) => IEventSourceState = (state, action) => {
  switch (action.type) {
    case "INCOMING": {
      const parsed = JSON.parse(action.event.data);
      // console.log(parsed, 'incoming event');
      let nextState: IEventSourceState;
      if (parsed.event === "response") {
        nextState = { events: [parsed] };
      } else {
        nextState = state;
      }
      return nextState;
    }
    case "SET_URL": {
      const url = action.url;
      if (url === undefined) {
        return state;
      } else {
        return { ...state, url };
      }
    }
    case "PING_RECEIVED": {
      let pings = 0;
      if (state.pings !== undefined) {
        pings = state.pings;
      }
      pings += 1;
      return { ...state, pings };
    }
    case "INTERNAL_ERROR": {
      // console.error(action.type);
      console.error(action.event);
      return { ...state, events: ["INTERNAL_ERROR"] };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const EventSourceProvider = ({ children, url }: EventSourceProviderProps) => {
  url =
    url === undefined
      ? process.env.REACT_APP_EVENT_SOURCE_URL === undefined
        ? "http://localhost:8888/middlelayer/stream"
        : process.env.REACT_APP_EVENT_SOURCE_URL
      : url;
  const [state, dispatch] = useReducer(eventSourceReducer, {
    events: [],
    url: url,
  });
  // let eventSource =
  const eventSource = useRef(
    new EventSource(state.url === undefined ? url : state.url),
  );

  useEffect(() => {
    if (state.url === undefined) return;
    eventSource.current.close();

    eventSource.current = new EventSource(state.url);
    // close and delete source delete
  }, [state.url]);
  useEffect(() => {
    // if (eventSource.readyState !== EventSource.OPEN) {
    //   return;
    // }
    eventSource.current.addEventListener("passthrough", (event) => {
      // console.log('passthrough', event);
      const action: IEventAction = { type: "INCOMING", event };
      dispatch(action);
    });
    eventSource.current.addEventListener("ping", (event) => {
      // eslint-disable-next-line no-console
      console.log("ping", event);
      const action: IEventAction = { type: "PING_RECEIVED", event };
      dispatch(action);
    });
    eventSource.current.addEventListener("error", (event) => {
      console.error("eventsource error", event);
      const action: IEventAction = { type: "INTERNAL_ERROR", event };
      dispatch(action);
    });
    eventSource.current.addEventListener("close", (event) => {
      // console.info('eventsource close', event);
    });
    return () => {
      eventSource.current.close();
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
      "useEventSourceState must be used within a EventSource Provider",
    );
  }
  return stateContext;
};
const useEventSource: () => IEventSourceState = () => {
  return useEventSourceState();
};
export { EventSourceProvider, useEventSource };
