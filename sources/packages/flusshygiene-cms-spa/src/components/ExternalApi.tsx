import React, { useState } from 'react';
import { useAuth0 } from '../react-auth0-wrapper';
import { REACT_APP_API_HOST } from '../lib/config';
import { APIMountPoints } from '../lib/common/enums';

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(true);
  const [apiMessage, setApiMessage] = useState('');
  const { getTokenSilently } = useAuth0();

  const callApi = async (url: string, opts: any) => {
    try {
      // console.log(token);

      const response = await fetch(url, opts);

      // console.log(response);
      const responseData = await response.json();
      // console.log(responseData);

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>External APIS</h1>
      <button
        onClick={async () => {
          const token = await getTokenSilently();
          const url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}`;
          const opts = {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };
          callApi(url, opts);
        }}
      >
        Ping PG API
      </button>
      <button
        onClick={async () => {
          const url = `/ocpu/library/fhpredict/R/simple/json`;
          const opts = {
            method: 'POST',
            body: JSON.stringify({ a: 'from', b: 'spa' }),
            headers: {
              'content-type': 'application/json',
            },
          };

          // console.log('making request to', url);
          // console.log('with the following options', opts);
          callApi(url, opts);
        }}
      >
        Ping OCPU API
      </button>
      {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
    </>
  );
};

export default ExternalApi;
