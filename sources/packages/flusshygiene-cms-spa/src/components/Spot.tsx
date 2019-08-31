import { DEFAULT_SPOT_ID } from '../lib/common/constants';
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

import '../assets/styles/spot-editor.scss';
import { useAuth0 } from '../react-auth0-wrapper';
import { REACT_APP_API_HOST } from '../lib/config';
type RouteProps = RouteComponentProps<{ id: string }>;

const Spot: React.FC<RouteProps> = ({ match }) => {
  const { isAuthenticated } = useAuth0();
  const handleEditModeClick = () => {
    setEditMode(!editMode);
  };
  const dispatch = useDispatch();
  const [formReadyToRender, setFormReadyToRender] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const spot = useSelector((state: RootState) => state.detailSpot.spot);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);

  const fetchOpts: IFetchSpotOptions = {
    method: 'GET',
    url: `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.bathingspots}/${match.params.id}`,
    headers: {},
  };

  useEffect(() => {
    if (spot.id === parseInt(match.params.id!, 10)) {
      return;
    }
    dispatch(fetchSingleSpot(fetchOpts));
    // setFormReadyToRender(true);
  }, [spot, dispatch, match.params.id, fetchOpts]);
  useEffect(() => {
    if (
      spot.id === parseInt(match.params.id!, 10) ||
      spot.id !== DEFAULT_SPOT_ID
    ) {
      return;
    }
    dispatch(fetchSingleSpot(fetchOpts));
  }, [spot, dispatch, match.params.id, fetchOpts]);

  useEffect(() => {
    if (spot.id === parseInt(match.params.id!, 10)) {
      setFormReadyToRender(true);
    }
  }, [setFormReadyToRender, spot.id, match.params.id]);

  return (
    <div className='container'>
      <div className='columns'>
        <div className='column'>
          {formReadyToRender === true && editMode === true && (
            <SpotEditor
              initialSpot={spot}
              handleEditModeClick={handleEditModeClick}
            />
          )}
        </div>
      </div>
      <div className='columns is-centered'>
        <div className='column is-10'>
          <SpotHeader
            nameLong={(() => {
              if (spot !== undefined) {
                return spot.nameLong !== undefined ? spot.nameLong : spot.name;
              } else {
                return null;
              }
            })()}
            water={spot !== undefined ? spot.water : ''}
            district={spot !== undefined ? spot.district : ''}
          />
        </div>
      </div>
      {isAuthenticated === true && (
        <div className='columns is-centered'>
          <div className='column is-10'>
            <button className='button' onClick={handleEditModeClick}>
              Bearbeiten
            </button>
          </div>
        </div>
      )}
      <div className='columns is-centered'>
        <div className='column is-5'>
          {spot !== undefined && (
            <div>
              {/* <div className='column'> */}
              <SpotLocation
                nameLong={spot.nameLong}
                street={spot.street}
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
                latitude={spot.latitude}
                longitude={spot.longitude}
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
      <div className='columns is-centered'>
        <div className='column is-10'>
          {(() => {
            return (
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
            );
          })()}
        </div>
      </div>
      <div className='columns is-centered'>
        <div className='column is-10'>
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
        </div>
      </div>
    </div>
  );
};

export default Spot;
