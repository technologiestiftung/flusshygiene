import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpots } from '../lib/state/reducers/actions/fetch-spots';
import { Card } from './spot/Card';
interface IObject {
  [key: string]: any;
}
// const initialState: IObject[] = [];
const Home = (props) => {
  const spots = useSelector((state) => state.data.spots);
  const truncated = useSelector((state) => state.data.truncated);
  const dispatch = useDispatch();

  useEffect(() => {
    // initial loading of map data
    if (!truncated) return;
    dispatch(fetchSpots());
  }, [spots, truncated, dispatch]);

  return (
    <div className='index section'>
      <h1>Badegewässer</h1>
      <ul className='index__bathingspot-list'>
        {spots.map((obj, i) => {
          // return <li key={i}>{obj.name}</li>;
          return (
            <Card
              title={obj.name}
              water={obj.water}
              id={obj.id}
              image={obj.image}
              hasPrediction={obj.hasPrediction}
              isUserLoggedIn={props.isLoggedin}
              key={i}
            />
          );
        })}
      </ul>
    </div>
  );
};
export default Home;
