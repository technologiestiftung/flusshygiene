import React, { useEffect, useState } from 'react';
interface IObject {
  [key: string]: any;
}
const initialState: IObject[] = [];
const Home = () => {
  const [spots, setSpots] = useState(initialState);

  useEffect(() => {
    const getPublicSpots = async () => {
      try {
        const response = await fetch(
          'http://flsshygn-dev.eu-central-1.elasticbeanstalk.com/api/v1/bathingspots',
          { method: 'GET' },
        );
        return response.json();
      } catch (error) {
        return error;
      }
    };
    console.log('Effect');
    getPublicSpots()
      .then((res) => {
        console.log(res);
        setSpots(res.data);
      })
      .catch((err) => {});
  }, []);
  return (
    <div className='index section'>
      <h1>Badegewässer</h1>
      <ul className='index__bathingspot-list'></ul>
      {spots.map((obj, i) => {
        return <li key={i}>{obj.name}</li>;
      })}
    </div>
  );
};
export default Home;
