import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpots } from '../lib/state/reducers/actions/fetch-get-spots';
import { Card } from './spot/Card';
import { RootState } from '../lib/state/reducers/root-reducer';
import SpotsMap from './SpotsMap';
import '../assets/styles/map.scss';
import { useMapResizeEffect } from '../hooks/map-hooks';
import { DEFAULT_SPOT } from '../lib/common/constants';
import { APIMountPoints, ApiResources } from '../lib/common/enums';
import { IFetchSpotOptions } from '../lib/common/interfaces';
import { Container } from './Container';
import { SpotEditor } from './spot/SpotEditor';
import { REACT_APP_API_HOST } from '../lib/config';
// react hooks based on
// https://codesandbox.io/s/react-redux-hook-by-indrek-lasn-gyoq0
// see also https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
// interface IObject {
//   [key: string]: any;
// }
// const initialState: IObject[] = [];
const Home: React.FC = () => {
  const spots = useSelector((state: RootState) => state.data.spots);
  const truncated = useSelector((state: RootState) => state.data.truncated);
  const dispatch = useDispatch();
  // const [dimensions, setDimensions] = useState({});
  const mapRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState(false);
  const handleEditModeClick = () => {
    setEditMode(!editMode);
  };
  const handleNewSpot = () => {
    setEditMode(true);
  };
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
    const url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.bathingspots}`;
    // console.log(url);
    const opts: IFetchSpotOptions = {
      url,
      headers: {},
      method: 'GET',
    };
    dispatch(fetchSpots(opts));
  }, [spots, truncated, dispatch]);

  return (
    <div className='index'>
      {editMode === true && (
        <Container>
          <SpotEditor
            initialSpot={DEFAULT_SPOT}
            handleEditModeClick={handleEditModeClick}
            newSpot={true}
          />
        </Container>
      )}
      <div className='columns is-centered'>
        <div className='column is-10'>
          <h1 className='title is-1'>Badegewässer</h1>
          <button className='button' onClick={handleNewSpot}>
            Neue Badestelle
          </button>
        </div>
      </div>
      <div className='columns is-centered'>
        <div className='column is-10'>
          <div ref={mapRef} id='map__container'>
            <SpotsMap
              width={mapDims.width}
              height={mapDims.height}
              data={spots}
            />
          </div>
        </div>
      </div>
      <div className='columns is-centered'>
        <div className='column is-10'>
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
