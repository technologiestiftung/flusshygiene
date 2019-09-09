import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpots } from '../lib/state/reducers/actions/fetch-get-spots';
// import { CardTile } from './spot/CardTile';
import { RootState } from '../lib/state/reducers/root-reducer';
import SpotsMap from './SpotsMap';
// import '../assets/styles/map.scss';
import { useMapResizeEffect } from '../hooks/map-hooks';
// import { DEFAULT_SPOT } from '../lib/common/constants';
import { APIMountPoints, ApiResources } from '../lib/common/enums';
import { IFetchSpotOptions } from '../lib/common/interfaces';
import { Container } from './Container';
// import { SpotEditor } from './spot/SpotEditor';
import { REACT_APP_API_HOST } from '../lib/config';
// import { useAuth0 } from '../react-auth0-wrapper';
// react hooks based on
// https://codesandbox.io/s/react-redux-hook-by-indrek-lasn-gyoq0
// see also https://github.com/typescript-cheatsheets/react-typescript-cheatsheet

const Home: React.FC = () => {
  const spots = useSelector((state: RootState) => state.data.spots);
  const truncated = useSelector((state: RootState) => state.data.truncated);
  const dispatch = useDispatch();
  // const [dimensions, setDimensions] = useState({});
  const mapRef = useRef<HTMLDivElement>(null);
  // const [editMode, setEditMode] = useState(false);
  // const { isAuthenticated } = useAuth0();
  // const handleEditModeClick = () => {
  //   setEditMode(!editMode);
  // };
  // const handleNewSpot = () => {
  //   setEditMode(true);
  // };
  const mapDims = useMapResizeEffect(mapRef);

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
      {/* {editMode === true && (
        <Container>
          <SpotEditor
            initialSpot={DEFAULT_SPOT}
            handleEditModeClick={handleEditModeClick}
            newSpot={true}
          />
        </Container>
      )} */}
      <Container>
        {/* <div className='columns is-centered'> */}
        {/* <div className='column is-10'> */}
        <h1 className='title is-1'>Flusshygiene</h1>
        <div className='content'>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        {/* {isAuthenticated !== undefined && isAuthenticated === true && (
            <button className='button' onClick={handleNewSpot}>
            Neue Badestelle
            </button>
          )} */}
        {/* </div> */}
        {/* </div> */}
      </Container>

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
      {/* <div className='columns is-centered'>
        <div className='column is-10'>
          <div className='tile is-ancestor'>
            <div style={{ flexWrap: 'wrap' }} className='tile is-parent'>
              {spots.map((obj, i) => {

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
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
export default Home;
