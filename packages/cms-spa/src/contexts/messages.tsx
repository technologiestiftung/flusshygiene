import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { Timer } from '../lib/utils/timeout';
export type BannerType = 'normal' | 'warning' | 'error';

interface IMessage {
  message: string;
  type: BannerType;
}
interface IMessagesState {
  messages: IMessage[];
}

interface IMessageAction {
  type: 'ADD_MESSAGE' | 'REMOVE_MESSAGE';
  payload: IMessage | number;
}

type MessageDispatch = (action: IMessageAction) => void;
type MessageProviderProps = { children: React.ReactNode };

// let messages: IMessage[] = [];
// let type: BannerType = 'normal';
const MessageStateContext = createContext<IMessagesState | undefined>(
  undefined,
);

const MessageDispatchContext = createContext<MessageDispatch | undefined>(
  undefined,
);

const messageReducer = (state: IMessagesState, action: IMessageAction) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      if (typeof action.payload === 'number') {
        throw new Error('ADD_MESSAGE action needs message and type on payload');
      }
      return {
        messages: [...state.messages, action.payload as IMessage],
      };

    case 'REMOVE_MESSAGE':
      if (typeof action.payload !== 'number') {
        throw new Error('REMOVE_MESSAGE action needs number as payload');
      }
      return {
        messages: state.messages.filter(
          (_item, i) => i !== (action.payload as number),
        ),
      };
    default:
      throw new Error('No default action defined');
  }
};

const MessageProvider = ({ children }: MessageProviderProps) => {
  const [state, dispatch] = useReducer(messageReducer, {
    messages: [],
  });
  return (
    <MessageStateContext.Provider value={state}>
      <MessageDispatchContext.Provider value={dispatch}>
        {state.messages.map((item, i) => {
          // let typeClassname: string;

          // switch (item.type) {
          //   case 'normal': {
          //     typeClassname = 'is-primary';
          //     break;
          //   }
          //   case 'warning': {
          //     typeClassname = 'is-warning';
          //     break;
          //   }
          //   case 'error': {
          //     typeClassname = 'is-danger';
          //     break;
          //   }
          //   default: {
          //     typeClassname = '';
          //     break;
          //   }
          // }
          if (item.message !== undefined && item.message.length > 0) {
            return (
              <Banner data={item} dispatch={dispatch} id={i} key={i} />

              // <div
              //   key={i}
              //   className={`notification notification--margin-bottom ${typeClassname}`}
              // >
              //   <button
              //     className='delete'
              //     onClick={() => {
              //       console.log('clicked ', i);
              //       dispatch({
              //         type: 'REMOVE_MESSAGE',
              //         payload: i,
              //       });
              //     }}
              //   ></button>
              //   {item.message}
              // </div>
            );
          } else {
            return null;
          }
        })}
        {/* {state.messages !== undefined && state.messages.length > 0 && (
        )} */}
        {children}
      </MessageDispatchContext.Provider>
    </MessageStateContext.Provider>
  );
};

const Banner: React.FC<{
  data: IMessage;
  dispatch: React.Dispatch<IMessageAction>;
  id: number;
  time?: number;
}> = ({ data, dispatch, id, time = 60000 }) => {
  let className: string;
  const [bannerId, setBannerId] = useState(id);
  switch (data.type) {
    case 'normal': {
      className = 'is-primary';
      break;
    }
    case 'warning': {
      className = 'is-warning';
      break;
    }
    case 'error': {
      className = 'is-danger';
      break;
    }
    default: {
      className = '';
      break;
    }
  }

  const remove = useCallback(() => {
    dispatch({
      type: 'REMOVE_MESSAGE',
      payload: bannerId,
    });
  }, [dispatch, bannerId]);

  const timer = new Timer(function() {
    dispatch({
      type: 'REMOVE_MESSAGE',
      payload: id,
    });
  }, time);

  useEffect(() => {
    setBannerId(id);
    timer.start();
  }, [setBannerId]); // eslint-disable-line

  return (
    <div
      // onMouseEnter={() => {
      //   timer.pause();
      // }}
      // onMouseLeave={() => {
      //   timer.resume();
      // }}
      className={`notification notification--margin-bottom ${className}`}
    >
      <button
        className='delete'
        onClick={() => {
          remove();
        }}
      ></button>
      {data.message}
    </div>
  );
};
const useMessageState = () => {
  const stateContext = useContext(MessageStateContext);
  if (stateContext === undefined) {
    throw new Error('useMessageState must be used within a MessageProvider');
  }
  return stateContext;
};

const useMessageDispatch = () => {
  const dispatchContext = useContext(MessageDispatchContext);
  if (dispatchContext === undefined) {
    throw new Error('useMessageDispatch must be used within a MessageProvider');
  }
  return dispatchContext;
};

const useMessages: () => [IMessagesState, MessageDispatch] = () => {
  return [useMessageState(), useMessageDispatch()];
};

export { useMessages, MessageProvider };
