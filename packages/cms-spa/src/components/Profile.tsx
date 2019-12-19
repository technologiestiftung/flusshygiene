// src/components/Profile.js

import React, { useEffect, useState, useRef } from 'react';
import { useAuth0, Auth0Context } from '../lib/auth/react-auth0-wrapper';
import { Container } from './Container';
import { SpotEditorBasisData } from './spot/SpotEditor-Basis-Data';
import { DEFAULT_SPOT } from '../lib/common/constants';
import { useMapResizeEffect } from '../hooks/map-hooks';
// import { RootState } from '../lib/state/reducers/root-reducer';
// import { useSelector, useDispatch } from 'react-redux';
import { REACT_APP_API_HOST } from '../lib/config';
import { APIMountPoints, ApiResources } from '../lib/common/enums';
import {
  // IFetchSpotOptions,
  ApiActionTypes,
  IApiAction,
  IBathingspot,
} from '../lib/common/interfaces';
// import { fetchSpots } from '../lib/state/reducers/actions/fetch-get-spots';
import { CardTile } from './spot/elements/Spot-CardTile';
import SpotsMap from './spot/elements/Spot-Map';
import { apiRequest, useApi } from '../contexts/postgres-api';
import { actionCreator } from '../lib/utils/pgapi-actionCreator';
import { Spinner } from './util/Spinner';
const limit = 50; // magic number from the postgres-api

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
  // const spots = useSelector((state: RootState) => state.data.spots);
  // const truncated = useSelector((state: RootState) => state.data.truncated);
  // const dispatch = useDispatch();
  const [spots, setSpots] = useState<IBathingspot[] | undefined>(undefined);
  const [apiState, apiDispatch] = useApi();

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
    setSpots(apiState.spots);
  }, [apiState]);
  /**
   * This effect does the apo call to the postgres-api using the context
   *
   */
  useEffect(() => {
    if (token === undefined) return;
    if (user.pgapiData === undefined) return;
    /**
     * local async call
     */
    const getSpots = async () => {
      try {
        let url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}`;
        /**
         * We first get the count of spots
         */
        const res = await fetch(`${url}/count`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (res.ok) {
          const response = await res.json();
          const count = response.data[0];

          /**
           * now check if we are out of limit with the number of spots
           * If so create multiple calls
           */
          if (count > limit) {
            const actions: IApiAction[] = [];
            for (let skip = 0; skip < count; skip += limit) {
              const action = actionCreator({
                body: {},
                token,
                url: `${url}?skip=${skip}&limit=${limit}`,
                method: 'GET',
                type: ApiActionTypes.START_API_REQUEST,
                resource: 'bathingspots',
              });
              actions.push(action);
            }
            actions.forEach((action) => {
              apiRequest(apiDispatch, action);
            });
          } else {
            const action = actionCreator({
              body: {},
              token,
              url,
              method: 'GET',
              type: ApiActionTypes.START_API_REQUEST,
              resource: 'bathingspots',
            });

            apiRequest(apiDispatch, action);
          }
        } else {
          throw new Error('Could not get count of spots');
        }
      } catch (error) {
        throw error;
      }
    };
    getSpots();
  }, [token, apiDispatch, user.pgapiData, apiState.reload]);

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
    <>
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
          <SpotEditorBasisData
            initialSpot={DEFAULT_SPOT}
            handleEditModeClick={handleEditModeClick}
            handleInfoShowModeClick={(e) => {
              if (e) e.preventDefault();
            }}
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
      {editMode === false && (
        <>
          <Container containerClassName={'user__spots-map'}>
            <div ref={mapRef} id='map__container'>
              {spots === undefined && <Spinner />}
              {spots !== undefined && (
                <SpotsMap
                  width={mapDims.width}
                  height={mapDims.height}
                  data={spots}
                />
              )}
            </div>
          </Container>
          <Container containerClassName={'user__spots'}>
            <div className='tile is-ancestor'>
              <div style={{ flexWrap: 'wrap' }} className='tile is-parent'>
                {spots === undefined && <Spinner />}
                {spots !== undefined &&
                  spots.map((obj, i) => {
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
    </>
  );
};

export default Profile;
