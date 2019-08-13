import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpots } from '../lib/state/reducers/actions/fetch-spots';
import { Card } from './spot/Card';
import { RootState } from '../lib/state/reducers/root-reducer';
import SpotsMap from './SpotsMap';
import '../assets/styles/map.scss';
import { useMapResizeEffect } from '../hooks/map-hooks';
import { API_DOMAIN } from '../lib/common/constants';
import { APIMountPoints, ApiResources } from '../lib/common/enums';
import { IFetchSpotsOptions } from '../lib/common/interfaces';
// react hooks based on
// https://codesandbox.io/s/react-redux-hook-by-indrek-lasn-gyoq0
// see also https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
// interface IObject {
//   [key: string]: any;
// }
// const initialState: IObject[] = [];
const Home: React.FC<{
  /*isLoggedin: boolean*/
}> = (
  {
    /*isLoggedin*/
  },
) => {
  const spots = useSelector((state: RootState) => state.data.spots);
  const truncated = useSelector((state: RootState) => state.data.truncated);
  const dispatch = useDispatch();
  // const [dimensions, setDimensions] = useState({});
  const mapRef = useRef<HTMLDivElement>(null);

  const mapDims = useMapResizeEffect(mapRef);
  // setMapDims(dims);
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (mapRef && mapRef.current) {
  //       const dim = {
  //         width: mapRef.current.offsetWidth,
  //         height: mapRef.current.offsetHeight,
  //       };
  //       setMapDimensions(dim);
  //     }
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // });

  useEffect(() => {
    // some infinit scroll would also be nice
    // https://upmostly.com/tutorials/build-an-infinite-scroll-component-in-react-using-react-hooks
    //
    // initial loading of map data
    if (!truncated) {
      return;
    }
    const url = `${API_DOMAIN}/${APIMountPoints.v1}/${ApiResources.getBathingspots}`;
    // console.log(url);
    const opts: IFetchSpotsOptions = {
      url,
      headers: {},
      method: 'GET',
    };
    dispatch(fetchSpots(opts));
  }, [spots, truncated, dispatch]);

  return (
    <div className='index section'>
      <div className='columns'>
        <div className='column is-full'>
          <h1 className='title is-1'>Badegewässer</h1>
        </div>
      </div>
      <div className='columns'>
        <div className='column is-full'>
          <div ref={mapRef} id='map__container'>
            <SpotsMap
              width={mapDims.width}
              height={mapDims.height}
              data={spots}
            />
          </div>
        </div>
      </div>
      <div className='columns'>
        <div className='column is-full'>
          <ul className='index__bathingspot-list'>
            {spots.map((obj, i) => {
              // return <li key={i}s>{obj.name}</li>;
              return (
                <Card
                  title={obj.name}
                  water={obj.water}
                  id={obj.id}
                  image={obj.image}
                  hasPrediction={obj.hasPrediction}
                  isUserLoggedIn={false}
                  key={i}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Home;
