import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchSpots } from '../lib/state/reducers/actions/fetch-get-spots';
// import { CardTile } from './spot/CardTile';
// import { RootState } from '../lib/state/reducers/root-reducer';
// import SpotsMap from './SpotsMap';
// import '../assets/styles/map.scss';
// import { useMapResizeEffect } from '../hooks/map-hooks';
// import { DEFAULT_SPOT } from '../lib/common/constants';
// import { APIMountPoints, ApiResources } from '../lib/common/enums';
// import { IFetchSpotOptions } from '../lib/common/interfaces';
import { Container } from './Container';
import { Link } from 'react-router-dom';
import { RouteNames } from '../lib/common/enums';
// import { SpotEditor } from './spot/SpotEditor';
// import { REACT_APP_API_HOST } from '../lib/config';
// import { useAuth0 } from '../react-auth0-wrapper';
// react hooks based on
// https://codesandbox.io/s/react-redux-hook-by-indrek-lasn-gyoq0
// see also https://github.com/typescript-cheatsheets/react-typescript-cheatsheet

const Home: React.FC = () => {
  // const spots = useSelector((state: RootState) => state.data.spots);
  // const truncated = useSelector((state: RootState) => state.data.truncated);
  // const dispatch = useDispatch();
  // const [dimensions, setDimensions] = useState({});
  // const mapRef = useRef<HTMLDivElement>(null);
  // const [editMode, setEditMode] = useState(false);
  // const { isAuthenticated } = useAuth0();
  // const handleEditModeClick = () => {
  //   setEditMode(!editMode);
  // };
  // const handleNewSpot = () => {
  //   setEditMode(true);
  // };
  // const mapDims = useMapResizeEffect(mapRef);

  // useEffect(() => {
  //   // some infinit scroll would also be nice
  //   // https://upmostly.com/tutorials/build-an-infinite-scroll-component-in-react-using-react-hooks
  //   //
  //   // initial loading of map data
  //   if (!truncated) {
  //     return;
  //   }
  //   const url = `${REACT_APP_API_HOST}/${APIMountPoints.v1}/${ApiResources.bathingspots}`;
  //   // console.log(url);
  //   const opts: IFetchSpotOptions = {
  //     url,
  //     headers: {},
  //     method: 'GET',
  //   };
  //   dispatch(fetchSpots(opts));
  // }, [spots, truncated, dispatch]);

  return (
    <div>
      {/* {editMode === true && (
        <Container>
          <SpotEditor
            initialSpot={DEFAULT_SPOT}
            handleEditModeClick={handleEditModeClick}
            newSpot={true}
          />
        </Container>
      )} */}
      <div className='hero is-primary'>
        <div className='hero-body'>
          <Container>
            {/* <div className='columns is-centered'> */}
            {/* <div className='column is-10'> */}
            {/* <h1 className='is-title is-1'>Flusshygiene</h1> */}
            <h1 className='is-title is-1'>Herzlich Willkommen,</h1>
            <div className='content'>
              <p>
                auf dieser Webplattform stehen dem Nutzer zwei wesentliche
                Erzeugnisse des Forschungsprojekts FLUSSHYGIENE zu Verfügung.
                Das Projekt FLUSSHYGIENE befasste sich drei Jahre mit der
                Thematik des Flussbadens in Deutschland. Das Flussbaden wird im
                Allgemeinen immer beliebter und vielerorts werden Flüsse bereits
                heute zum Baden genutzt. Dennoch gibt es an Flüssen spezielle
                Gefahren, wie starke Strömungen, die Schifffahrt sowie eine oft
                schwankende Wasserqualität, die beim Flussbaden berücksichtigt
                werden müssen, damit die Gesundheit von Badenden nicht übermäßig
                gefährdet wird.
              </p>
            </div>
          </Container>
        </div>
      </div>
      <Container>
        <h3 className='is-title is-3'>
          Tool zur Erstbewertung neuer Badegewässer
        </h3>
        <div className='content'>
          <p>
            Um eine Einschätzung über die Eignung eines neuen
            Badegewässerstandortes durchführen zu können, wurde im Projekt
            FLUSSHYGIENE ein checklistenbasiertes Bewertungsinstrument neuer,
            potenzieller Badegewässerstandorte entwickelt. Dieser soll dem
            Nutzer eine erste Einschätzung ermöglichen, ob die Eröffnung eines
            Badegewässer an einem bestimmten Standort wahrscheinlich ist. <br />
            <Link to={`/${RouteNames.questionnaire}`}>
              zur Standortbewertung
            </Link>
          </p>
        </div>
        <h3 className='is-title is-3'>Tool zum Aufbau von Frühwarnsystem</h3>
        <div className='content'>
          <p>
            Im Projekt FLUSSHYGIENE wurde ein neuer Ansatz zum Aufbau von
            Frühwarnsystemen entwickelt, der den Ansatz der Langzeitbewertung
            der EG-Badegewässerrichtlinie auf tägliche Vorhersagen überträgt.
            Ein solcher Ansatz fehlte bisher und eine Bewertung der
            Badegewässerqualität fand bisher ausschließlich rückblickend statt.
            Der Ansatz kann an allen Typen von Badegewässer angewendet werden.
          </p>
          <p>
            Die im Projekt entwickelte Methodik, basiert auf statistischen
            Modellierungsansätzen und im Projekt entwickelten Vorhersage- und
            Modelvalidierungskriterien. Die wesentlichen Schritte des
            Modellaufbaus und der Validierung wurden auf dieser Webplattform
            automatisiert, sodass die Methodik nun zuständigen Behörden sowie
            Betreibern von Badegewässern zur Verfügung steht. <br />
            <Link to={`/${'profile'}`}>
              zum Badestellen Bearbeiten/Erstellen
            </Link>
          </p>
        </div>
      </Container>
      <Container>
        <h3 className='is-title is-3'>Zugang zur Plattform</h3>
        <div className='content'>
          <p>
            Um Zugang zu unserer Plattform zu erhalten schreiben Sie eine E-Mail
            an "flusshygiene [at] technologiestiftung-berlin [Punkt] de"
          </p>
        </div>
      </Container>
    </div>
  );
};
export default Home;
