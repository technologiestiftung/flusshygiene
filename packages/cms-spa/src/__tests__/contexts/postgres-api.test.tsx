import React, { useEffect } from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ApiProvider, useApi, apiRequest } from '../../contexts/postgres-api';
import { IApiAction, ApiActionTypes } from '../../lib/common/interfaces';
beforeEach(() => {
  //@ts-ignore
  fetch.resetMocks();
});
afterAll(cleanup);
describe('Testing api context', () => {
  test('APiProvider should render', () => {
    const component = <ApiProvider>{<></>}</ApiProvider>;
    const dom = render(component);
    expect(dom).toBeDefined();
  });

  test('Should throw an error if not in provider (imp detail)', () => {
    expect(() => {
      useApi();
    }).toThrow(Error);
  });

  test('Make request', () => {
    //@ts-ignore
    fetch.mockResponseOnce(JSON.stringify({ spots: ['12345'] }));
    const Button: React.FC = () => {
      const [apiState, apiDispatch] = useApi();
      return (
        <>
          <div>{JSON.stringify(apiState)}</div>
          <button
            onClick={(e) => {
              e.preventDefault();
              const action: IApiAction = {
                type: ApiActionTypes.START_API_REQUEST,
                payload: {
                  requestType: { type: 'GET', resource: 'ping' },
                  url: `/api/v1`,
                  config: {
                    method: 'GET',

                    headers: {
                      'content-type': 'application/json',
                      Authorization: `Bearer ${'xyz'}`,
                    },
                    credentials: 'include',
                  },
                },
              };
              apiRequest(apiDispatch, action);
            }}
          >
            click
          </button>
        </>
      );
    };
    const dom = (
      <ApiProvider>
        <Button></Button>
      </ApiProvider>
    );

    const { getByText, debug } = render(dom);
    const button = getByText(/click/);
    const click = fireEvent(button, new MouseEvent('click'));
    expect(click).toBe(true);
    // debug();
  });
});
