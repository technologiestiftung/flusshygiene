// src/components/Profile.js

import React, { useEffect, useState } from 'react';
import { useAuth0, Auth0Context } from '../react-auth0-wrapper';

const Profile: React.FC = () => {
  const { loading, user } = useAuth0();
  const [you, setYou] = useState(user);
  useEffect(() => {
    // console.log(user);
    if (user.pgapiData !== undefined) {
      console.log('goz api data');
      setYou({ ...user });
    }
    // return () => {};
  }, [you, user]);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <Auth0Context.Consumer>
        {(value) => (
          <div>
            <img src={value.user.picture} alt='Profile' />
            <h2>{value.user.name}</h2>
            <p>{value.user.email}</p>
            {(() => {
              // console.log('in consumer', value.user);
              // setYou({ ...value.user });
              return null;
            })()}
            <code>{JSON.stringify(you, null, 2)}</code>
          </div>
        )}
      </Auth0Context.Consumer>
    );
  }
};

export default Profile;
