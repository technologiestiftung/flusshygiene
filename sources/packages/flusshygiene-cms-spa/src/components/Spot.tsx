// import { DEFAULT_SPOT_ID } from '../lib/common/constants';
import { APIMountPoints, ApiResources, RouteNames } from '../lib/common/enums';
import { fetchSingleSpot } from '../lib/state/reducers/actions/fetch-get-single-spot';
import { IFetchSpotOptions } from '../lib/common/interfaces';
import { Link } from 'react-router-dom';
import { Measurement } from './spot/SpotMeasurement';
import { RootState } from '../lib/state/reducers/root-reducer';
import { RouteComponentProps } from 'react-router';
import { SpotBodyAddonTagGroup } from './spot/SpotAddonTagGroup';
import { SpotHeader } from './spot/SpotHeader';
import { SpotImage } from './spot/SpotImage';
import { SpotLocation } from './spot/SpotLocation';
import { useMapResizeEffect } from '../hooks/map-hooks';
import { useSelector, useDispatch } from 'react-redux';
import React, { useRef, useEffect, useState } from 'react';
import { SpotEditor } from './spot/SpotEditor';
import SpotsMap from './SpotsMap';

// import '../assets/styles/spot-editor.scss';
import { useAuth0 } from '../react-auth0-wrapper';
import { REACT_APP_API_HOST } from '../lib/config';
import { Container } from './Container';
type RouteProps = RouteComponentProps<{ id: string }>;

const Spot: React.FC<RouteProps> = ({ match }) => {
  const { user, isAuthenticated, getTokenSilently } = useAuth0();

  const handleEditModeClick = () => {
    setEditMode(!editMode);
  };
  const handleCalibrationClick = () => {
    // console.log('Start calibration');
    setShowNotification((prevState) => !prevState);
  };
  const dispatch = useDispatch();
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [token, setToken] = useState<string>();

  const [showNotification, setShowNotification] = useState(false);
  const spot = useSelector((state: RootState) => state.detailSpot.spot);
  const isSingleSpotLoading = useSelector(
    (state: RootState) => state.detailSpot.loading,
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);

  // const fetchOpts: IFetchSpotOptions = {
  //   method: 'GET',
  //   url: `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.bathingspots}/${match.params.id}`,
  //   headers: {
  //     'content-type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
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
    if (showNotification === false) return;
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  }, [showNotification]);

  useEffect(() => {
    // if (spot.id === parseInt(match.params.id, 10)) {
    //   return;
    // }
    if (token === undefined) return;
    if (user.pgapiData === undefined) return;
    const url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.users}/${user.pgapiData.id}/${ApiResources.bathingspots}/${match.params.id}`;
    const fetchOpts: IFetchSpotOptions = {
      method: 'GET',
      url,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    dispatch(fetchSingleSpot(fetchOpts));
    // setFormReadyToRender(true);
  }, [dispatch, match.params.id, token, user, user.pgapiData]);

  // useEffect(() => {
  //   if (
  //     spot.id === parseInt(match.params.id!, 10) ||
  //     spot.id !== DEFAULT_SPOT_ID
  //   ) {
  //     return;
  //   }
  //   dispatch(fetchSingleSpot(fetchOpts));
  // }, [spot, dispatch, match.params.id, fetchOpts]);

  useEffect(() => {
    if (spot.id === parseInt(match.params.id!, 10)) {
      setFormReadyToRender(true);
    }
  }, [setFormReadyToRender, spot.id, match.params.id]);

  if (editMode === true) {
    return (
      <div className='container'>
        <div className='columns is-centered'>
          <div className='column is-10'>
            {formReadyToRender === true && editMode === true && (
              <SpotEditor
                initialSpot={spot}
                handleEditModeClick={handleEditModeClick}
              />
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {showNotification === true && (
          <Container>
            <div className='notification spot__calib-notification--on-top'>
              Kalibrierung ihrer Badestelle wird gestartet. Bitte kommen Sie in
              einigen Minuten zurück.
            </div>
          </Container>
        )}
        {isAuthenticated === true && (
          <Container>
            <div className='buttons'>
              <button className='button is-small' onClick={handleEditModeClick}>
                Badestelle Bearbeiten
              </button>
              <button
                className='button is-small'
                onClick={handleCalibrationClick}
              >
                Regendaten Kalibrierung Starten
              </button>
              {/* <button
                className='button is-small'
                onClick={handleCalibrationClick}
              >
                Regendaten Kalibrierung Starten
              </button> */}
            </div>
          </Container>
        )}
        <Container>
          <SpotHeader
            name={spot.name}
            nameLong={spot.nameLong}
            water={spot.water}
            district={spot.district}
          />
        </Container>

        <div className='container'>
          <div className='columns is-centered'>
            <div className='column is-5'>
              {spot !== undefined && (
                <div>
                  {/* <div className='column'> */}
                  <SpotLocation
                    name={spot.name}
                    nameLong={spot.nameLong}
                    street={spot.street}
                    location={spot.location}
                    postalCode={(() => {
                      if (
                        spot.postalCode !== undefined &&
                        spot.postalCode !== null
                      ) {
                        return spot.postalCode;
                      }
                      return '';
                    })()}
                    city={spot.city}
                    website={spot.website}
                  />
                  {/* </div> */}
                  {/* <div className='column'> */}
                  <SpotImage
                    image={spot.image}
                    nameLong={spot.nameLong}
                    name={spot.name}
                    imageAuthor={undefined}
                  />
                  {/* </div> */}
                </div>
              )}
            </div>
            <div className='column is-5'>
              {spot !== undefined &&
                spot.measurements !== undefined &&
                spot.measurements.length > 0 && (
                  <Measurement
                    measurements={spot.measurements}
                    hasPrediction={spot.hasPrediction}
                  >
                    {(() => {
                      if (spot.hasPrediction === true) {
                        return (
                          <div className='bathingspot__body-prediction'>
                            <p>
                              {/*tslint:disable-next-line: max-line-length*/}
                              <span className='asteriks'>*</span> Die hier
                              angezeigte Bewertung wird unterstützt durch eine
                              neuartige tagesaktuelle Vorhersagemethode.{' '}
                              <Link to={`/${RouteNames.info}`}>
                                Erfahren Sie mehr&nbsp;&raquo;
                              </Link>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </Measurement>
                )}
            </div>
          </div>
        </div>
        <Container>
          {isSingleSpotLoading === false && (
            <div ref={mapRef} id='map__container'>
              <SpotsMap
                width={mapDims.width}
                height={mapDims.height}
                data={(() => {
                  return Array.isArray(spot) === true ? spot : [spot];
                })()}
                zoom={4}
              />
            </div>
          )}
        </Container>
        <Container>
          {spot !== undefined && (
            <div className='bathingspot__body-addon'>
              <h3>Weitere Angaben zur Badesstelle</h3>
              <SpotBodyAddonTagGroup
                cyanoPossible={spot.cyanoPossible}
                lifeguard={spot.lifeguard}
                disabilityAccess={spot.disabilityAccess}
                hasDisabilityAccesableEntrence={
                  spot.hasDisabilityAccesableEntrence
                }
                restaurant={spot.restaurant}
                snack={spot.snack}
                parkingSpots={spot.parkingSpots}
                bathrooms={spot.bathrooms}
                disabilityAccessBathrooms={spot.disabilityAccessBathrooms}
                bathroomsMobile={spot.bathroomsMobile}
                dogban={spot.dogban}
              />
            </div>
          )}
        </Container>
      </>
    );
  }
};

export default Spot;
