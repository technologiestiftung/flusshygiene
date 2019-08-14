import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/state/reducers/root-reducer';
import { RouteComponentProps } from 'react-router';
import SpotsMap from './SpotsMap';
import { useMapResizeEffect } from '../hooks/map-hooks';

import { API_DOMAIN, DEFAULT_SPOT_ID } from '../lib/common/constants';
import { APIMountPoints, ApiResources, RouteNames } from '../lib/common/enums';
import { IFetchSpotsOptions, IBathingspot } from '../lib/common/interfaces';
import { fetchSingleSpot } from '../lib/state/reducers/actions/fetch-single-spot';
import { SpotHeader } from './spot/SpotHeader';
import { SpotLocation } from './spot/SpotLocation';
import { Measurement } from './spot/SpotMeasurement';
import { SpotImage } from './spot/SpotImage';
import { Link } from 'react-router-dom';
import { SpotBodyAddonList } from './spot/SpotAddonList';

type RouteProps = RouteComponentProps<{ id?: string }>;

const Spot: React.FC<RouteProps> = ({ match }) => {
  // const [dataLoaded, setDataLoaded] = useState(false);
  // const [spot, setCurrentSpot] = useState<IBathingspot | undefined>(undefined);
  const dispatch = useDispatch();
  // const isLoading = useSelector((state: RootState) => state.detailstoredSpot[0].loading);
  // const truncated = useSelector(
  //   (state: RootState) => state.detailstoredSpot[0].truncated,
  // );
  const spot = useSelector((state: RootState) => state.detailSpot.spot);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);

  // useEffect(() => {
  //   console.log('setting local spot');
  //   if (storedSpot !== undefined && storedSpot[0].spot !== undefined) {
  //     // setCurrentSpot(storedSpot[0].spot);
  //   }
  // }, [storedSpot]);
  // useEffect(() => {
  //   console.log('executing effect ');
  //   // console.log(storedSpot[0].id);
  //   // console.log(match.params.id);
  //   if (!truncated) {
  //     return;
  //   }
  //   const opts: IFetchSpotsOptions = {
  //     method: 'GET',
  //     url: `${API_DOMAIN}/${APIMountPoints.v1}/${ApiResources.getBathingspots}/${match.params.id}`,
  //     headers: {},
  //   };
  //   dispatch(fetchSingleSpot(opts));
  // }, [spot, dispatch, match.params.id, truncated]);
  useEffect(() => {
    console.log('executing effect for initial loading');
    console.log(spot);
    if (spot.id !== DEFAULT_SPOT_ID) {
      // setCurrentSpot(storedSpot[0] as IBathingspot);
      // setDataLoaded(true);
      return;
    }

    const opts: IFetchSpotsOptions = {
      method: 'GET',
      url: `${API_DOMAIN}/${APIMountPoints.v1}/${ApiResources.getBathingspots}/${match.params.id}`,
      headers: {},
    };
    console.log('dispatching loading action');
    dispatch(fetchSingleSpot(opts));
  }, [spot, dispatch, match.params.id]);

  return (
    <div className='container'>
      <div className='columns is-centered'>
        <div className='column is-10'>
          <SpotHeader
            nameLong={spot !== undefined ? spot.nameLong : ''}
            water={spot !== undefined ? spot.water : ''}
            district={spot !== undefined ? spot.district : ''}
          />
        </div>
      </div>
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
          {spot !== undefined && spot.measurements !== undefined && (
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
                        <span className='asteriks'>*</span> Die hier angezeigte
                        Bewertung wird unterstützt durch eine neuartige
                        tagesaktuelle Vorhersagemethode.{' '}
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
              <SpotBodyAddonList
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
