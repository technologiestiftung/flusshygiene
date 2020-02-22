import React, { createContext, useContext, useReducer } from 'react';
import {
  IOcpuAction,
  IOcpuState,
  IOcpuStartAction,
  IOcpuFinishAction,
  IOcpuFailAction,
} from '../lib/common/interfaces';

type Dispatch = (action: IOcpuAction) => void;
type OcpuProviderProps = { children: React.ReactNode };

const OcpuStateContext = createContext<IOcpuState | undefined>(undefined);

const OcpuDispatchContext = createContext<Dispatch | undefined>(undefined);

const ocpuReducer: (
  state: IOcpuState,
  action: IOcpuAction | IOcpuStartAction | IOcpuFinishAction | IOcpuFailAction,
) => IOcpuState = (state, action) => {
  switch (action.type) {
    case 'START_OCPU_REQUEST': {
      const locAction = action as IOcpuStartAction;
      // console.log('request started');

      return { ...state, processing: locAction.payload.processingType };
    }
    case 'FINISH_OCPU_REQUEST': {
      // console.log('request finished');
      const locAction = action as IOcpuFinishAction;
      // console.log(state, 'finsihed');
      return {
        ...state,
        processing: undefined,
        responses: [locAction.payload.response],
      };
    }
    case 'FAIL_OCPU_REQUEST': {
      //       console.log('request failed');
      const locAction = action as IOcpuFailAction;

      return {
        ...state,
        processing: undefined,
        errors: [locAction.payload.error],
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const OcpuProvider = ({ children }: OcpuProviderProps) => {
  const [state, dispatch] = useReducer(ocpuReducer, {
    sessionId: '',
    responses: [],
    errors: [],
    processing: undefined,
  });
  return (
    <OcpuStateContext.Provider value={state}>
      <OcpuDispatchContext.Provider value={dispatch}>
        {children}
      </OcpuDispatchContext.Provider>
    </OcpuStateContext.Provider>
  );
};

const useOcpuState = () => {
  const stateContext = useContext(OcpuStateContext);
  if (stateContext === undefined) {
    throw new Error('useOcpuState must be used within a OcpuProvider');
  }

  return stateContext;
};

const postOcpu = async (dispatch: Dispatch, action: IOcpuAction) => {
  let response: Response;
  const fetchAction = action as IOcpuStartAction;
  dispatch(fetchAction);
  try {
    //     console.log('ocpu action triggered');
    //     console.log(fetchAction.payload.config);
    response = await fetch(fetchAction.payload.url, fetchAction.payload.config);
    // console.log(response);
    if (response.ok === true) {
      let json: any;
      try {
        json = await response.json();
      } catch (err) {
        console.error('Error parsing response from fetch call to json', err);
        throw err;
      }
      // console.log('Response json from postOcpu', json);
      const finishPayload: IOcpuFinishAction = {
        type: 'FINISH_OCPU_REQUEST',
        payload: { response: json },
      };
      dispatch(finishPayload);
    } else {
      // console.warn('fetch response not ok');
      throw new Error('Network fetch response not ok');
    }
  } catch (error) {
    console.error('Error while making fetch call', error);
    const failPayload: IOcpuFailAction = {
      type: 'FAIL_OCPU_REQUEST',
      payload: { error: response! },
    };
    dispatch(failPayload);
  }
};
const useOcpuDispatch = () => {
  const dispatchContext = useContext(OcpuDispatchContext);
  if (dispatchContext === undefined) {
    throw new Error('useOcpuDispatch must be used within a OcpuProvider');
  }
  return dispatchContext;
};

const useOcpu: () => [IOcpuState, Dispatch] = () => {
  return [useOcpuState(), useOcpuDispatch()];
};

export { useOcpu, OcpuProvider, postOcpu };
