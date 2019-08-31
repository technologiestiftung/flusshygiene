import React, { useState } from 'react';
import { useAuth0 } from '../react-auth0-wrapper';
import { REACT_APP_API_HOST } from '../lib/config';
import { APIMountPoints } from '../lib/common/enums';

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(true);
  const [apiMessage, setApiMessage] = useState('');
  const { getTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
      // console.log(token);
      const response = await fetch(
        `${REACT_APP_API_HOST}/${APIMountPoints.v1}`,
        {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response);
      const responseData = await response.json();
      console.log(responseData);

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>External API</h1>
      <button onClick={callApi}>Ping API</button>
      {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
    </>
  );
};

export default ExternalApi;
