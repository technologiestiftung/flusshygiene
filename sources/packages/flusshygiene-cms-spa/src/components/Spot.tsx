import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/state/reducers/root-reducer';
import { RouteComponentProps } from 'react-router';
import SpotsMap from './SpotsMap';
import { useMapResizeEffect } from '../hooks/map-hooks';

import { API_DOMAIN } from '../lib/common/constants';
import { APIMountPoints, ApiResources } from '../lib/common/enums';
import { IFetchSpotsOptions } from '../lib/common/interfaces';
import { fetchSingleSpot } from '../lib/state/reducers/actions/fetch-single-spot';
import { SpotHeader } from './spot/SpotHeader';

type RouteProps = RouteComponentProps<{ id?: string }>;

const Spot: React.FC<RouteProps> = ({ match }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.detailSpot.loading);
  const truncated = useSelector(
    (state: RootState) => state.detailSpot.truncated,
  );
  const spot = useSelector((state: RootState) => state.detailSpot.spot);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);
  useEffect(() => {
    console.log('executing effect');
    if (!truncated) return;
    const opts: IFetchSpotsOptions = {
      method: 'GET',
      url: `${API_DOMAIN}/${APIMountPoints.v1}/${ApiResources.getBathingspots}/${match.params.id}`,
      headers: {},
    };
    dispatch(fetchSingleSpot(opts));
  }, [spot, dispatch]);

  return (
    <section>
      <div className='columns'>
        <div className='column is-full'>
          <SpotHeader
            nameLong={spot[0] !== undefined ? spot[0].nameLong : ''}
            water={spot[0] !== undefined ? spot[0].water : ''}
            district={spot[0] !== undefined ? spot[0].district : ''}
          />
        </div>
      </div>
      <div className='columns'>
        <div className='column is-full'>
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
    </section>
  );
};

export default Spot;
