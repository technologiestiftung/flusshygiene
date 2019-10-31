// src/components/Profile.js

import React, { useEffect, useState, useRef } from 'react';
import { useAuth0, Auth0Context } from '../lib/auth/react-auth0-wrapper';
import { Container } from './Container';
import { SpotEditor } from './spot/SpotEditor';
import { DEFAULT_SPOT } from '../lib/common/constants';
import { useMapResizeEffect } from '../hooks/map-hooks';
import { RootState } from '../lib/state/reducers/root-reducer';
import { useSelector, useDispatch } from 'react-redux';
import { REACT_APP_API_HOST } from '../lib/config';
import { APIMountPoints, ApiResources } from '../lib/common/enums';
import { IFetchSpotOptions } from '../lib/common/interfaces';
import { fetchSpots } from '../lib/state/reducers/actions/fetch-get-spots';
import { CardTile } from './spot/Spot-CardTile';
import SpotsMap from './spot/Spot-Map';
// import { useBanner, BannerContext } from '../contexts/banner';

const Profile: React.FC = () => {
  // ╦  ╦╔═╗╦═╗╔═╗
  // ╚╗╔╝╠═╣╠╦╝╚═╗
  //  ╚╝ ╩ ╩╩╚═╚═╝
  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);

  // ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  // ╚═╗ ║ ╠═╣ ║ ║╣
  // ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  const { loading, user, isAuthenticated, getTokenSilently } = useAuth0();
  // const [you, setYou] = useState(user);
  const [token, setToken] = useState<string>();
  const [editMode, setEditMode] = useState(false);
  const spots = useSelector((state: RootState) => state.data.spots);
  const truncated = useSelector((state: RootState) => state.data.truncated);
  const dispatch = useDispatch();

  // ╔═╗╔═╗╔═╗╔═╗╔═╗╔╦╗╔═╗
  // ║╣ ╠╣ ╠╣ ║╣ ║   ║ ╚═╗
  // ╚═╝╚  ╚  ╚═╝╚═╝ ╩ ╚═╝
  useEffect(() => {
    async function getToken() {
      try {
        const t = await getTokenSilently();
        setToken(t);
        // console.log('got token', t);
      } catch (error) {
        console.error(error);
      }
    }
    getToken();
  }, [getTokenSilently, setToken]);

  useEffect(() => {
    // some infinit scroll would also be nice
    // https://upmostly.com/tutorials/build-an-infinite-scroll-component-in-react-using-react-hooks
    //
    // initial loading of map data
    if (token === undefined) return;
    if (user.pgapiData === undefined) return;

    if (!truncated) {
      return;
    }
    // console.log(user);
    // const token = await getTokenSilently();
    const url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}`;
    // console.log(url);
    // console.log(url);
    const opts: IFetchSpotOptions = {
      url,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    };
    dispatch(fetchSpots(opts));
  }, [spots, truncated, dispatch, token, user, user.pgapiData]);

  // ╔═╗╦ ╦╔╗╔╔═╗╔╦╗╦╔═╗╔╗╔  ╦ ╦╔═╗╔╗╔╔╦╗╦  ╔═╗╦═╗╔═╗
  // ╠╣ ║ ║║║║║   ║ ║║ ║║║║  ╠═╣╠═╣║║║ ║║║  ║╣ ╠╦╝╚═╗
  // ╚  ╚═╝╝╚╝╚═╝ ╩ ╩╚═╝╝╚╝  ╩ ╩╩ ╩╝╚╝═╩╝╩═╝╚═╝╩╚═╚═╝
  const handleEditModeClick = () => {
    setEditMode(!editMode);
  };
  const handleNewSpot = () => {
    setEditMode(true);
  };

  return (
    <React.Fragment>
      {/* <BannerContext.Consumer>
        {(value) => {
          return <div>Hello Banner</div>;
        }}
      </BannerContext.Consumer> */}

      <Container>
        {(() => {
          if (loading) {
            return <div>Loading...</div>;
          } else {
            return (
              <Auth0Context.Consumer>
                {(value) => (
                  <div className='card'>
                    <div className='card-content'>
                      <div className='media'>
                        <div className='media-left'>
                          <figure className='image is-48x48'>
                            <img src={value.user.picture} alt='Profile' />
                          </figure>
                        </div>
                        <div className='media-content'>
                          <p className='title is-4'>
                            <span>{'Benutzer: '}</span>
                            {value.user.nickname}
                          </p>
                          <p className='subtitle is-6'>
                            <span>{'E-Mail: '}</span>
                            {value.user.email} <br />
                            <span>{'API ID: '}</span>
                            {value.user.pgapiData.id}
                          </p>
                          {/* <pre>
                            <code>{JSON.stringify(user, null, 2)}</code>
                          </pre> */}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Auth0Context.Consumer>
            );
          }
        })()}
      </Container>

      {editMode === true && (
        <Container>
          <SpotEditor
            initialSpot={DEFAULT_SPOT}
            handleEditModeClick={handleEditModeClick}
            newSpot={true}
          />
        </Container>
      )}
      {editMode === false && (
        <Container>
          {isAuthenticated !== undefined && isAuthenticated === true && (
            <div className='buttons'>
              <button className='button is-small' onClick={handleNewSpot}>
                Neue Badestelle
              </button>
            </div>
          )}
        </Container>
      )}
      {editMode === false && spots !== undefined && (
        <>
          <Container containerClassName={'user__spots-map'}>
            <div ref={mapRef} id='map__container'>
              <SpotsMap
                width={mapDims.width}
                height={mapDims.height}
                data={spots}
              />
            </div>
          </Container>
          <Container containerClassName={'user__spots'}>
            <div className='tile is-ancestor'>
              <div style={{ flexWrap: 'wrap' }} className='tile is-parent'>
                {spots.map((obj, i) => {
                  // return <li key={i}s>{obj.name}</li>;

                  return (
                    <div key={i} className='tile is-child is-3'>
                      <CardTile
                        title={obj.name}
                        water={obj.water}
                        id={obj.id}
                        image={obj.image}
                        hasPrediction={obj.hasPrediction}
                        isUserLoggedIn={false}
                        key={i}
                        spot={obj}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </>
      )}
    </React.Fragment>
  );
  // if (loading) {
  //   return
  // } else {
  //   return (
  //     <React.Fragment>

  //     </React.Fragment>
  //   );
  // }
};

export default Profile;
