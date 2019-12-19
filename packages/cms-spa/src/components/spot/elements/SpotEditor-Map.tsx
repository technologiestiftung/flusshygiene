import React, { useEffect, useState, useRef } from 'react';
import { useFormikContext } from 'formik';
import DeckGL from '@deck.gl/react';
import { MapController } from '@deck.gl/core';
import {
  IMapsEditorProps,
  IGeoJson,
  MapEditModes,
  IGeoJsonFeature,
  IBathingspotExtend,
} from '../../../lib/common/interfaces';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { useMapResizeEffect } from '../../../hooks/map-hooks';

import { StaticMap } from 'react-map-gl';
import { REACT_APP_MAPBOX_API_TOKEN } from '../../../lib/config';
import { IconAngleDown } from '../../fontawesome-icons';
const initialViewState = {
  bearing: 0,
  latitude: 52,
  longitude: 13,
  pitch: 0,
  zoom: 4,
};

const dropdownTexts = {
  view: { text: ' Anzeige' },
  modify: { text: 'Modifizieren' },
  translate: { text: 'Bewegen' },
  drawPoint: { text: 'Position Zeichnen' },
  drawPolygon: { text: 'Regeneinzugsgebiet Zeichnen' },
};

const FormikSpotEditorMap: React.FC<IMapsEditorProps> = ({
  width,
  height,
  data,
  zoom,
  lat,
  lon,
  activeEditor,
  newSpot,
  defaultFormikSetFieldValues,
  handleUpdates,
}) => {
  const { setFieldValue } = useFormikContext<IBathingspotExtend>();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapDims = useMapResizeEffect(mapRef);
  const [editMode, setEditMode] = useState<MapEditModes>('view');
  const mapToolbarEditModeHandler: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();
    // console.log(event.currentTarget.id);
    switch (event.currentTarget.id) {
      case 'view':
      case 'modify':
      case 'translate':
      case 'drawPoint':
      case 'drawPolygon':
        if (['modify', 'translate'].includes(event.currentTarget.id)) {
          setSelectedIndex([0]);
        }
        setEditMode(event.currentTarget.id);
        break;
    }
  };
  // console.log(formik);
  // const { values /*, setValues*/ } = useFormikContext<IBathingspot>();
  // const [location, setLocation] = useState<IGeoJson>();
  // const [area, setArea] = useState<IGeoJson>();
  const [geoData, setGeoData] = useState<IGeoJson>();
  // useEffect(() => {
  //   console.log(values);
  //   return () => {};
  // }, [values]);
  const [selectedIndex, setSelectedIndex] = useState<number[]>([]);
  // const [locationMode, setLocationMode] = useState<MapEditModes>('view');
  // const [areaMode, setAreaMode] = useState<MapEditModes>('view');

  useEffect(() => {
    // if (data === undefined) return;
    // if (data[0] === undefined) return;
    if (geoData === undefined) return;
    if (geoData.features === undefined) return;
    const points = geoData.features.filter((ele) => {
      if (ele.geometry.type === 'Point') {
        return ele;
      }
      return null;
    });
    const polies = geoData.features.filter((ele) => {
      // console.log('got a polygon', ele);
      if (ele.geometry.type === 'Polygon') {
        return ele;
      }
      return null;
    });
    if (polies.length > 0) {
      // data[0].area = polies[0].geometry;
      setFieldValue('area', polies[0].geometry);
      // defaultFormikSetFieldValues('area', polies[0].geometry);
    }
    if (points.length > 0) {
      // data[0].location = points[0].geometry; // geoData.features[0].geometry;
      setFieldValue('location', points[0].geometry);
      // defaultFormikSetFieldValues('location', points[0].geometry);
    }
  }, [geoData, setFieldValue]);

  useEffect(() => {
    if (data === undefined) return;
    if (data[0] === undefined) return;

    const features: IGeoJsonFeature[] = [];

    if (data[0].location !== undefined) {
      // console.log('location in second hook', data[0].location);
      const loc: IGeoJsonFeature = {
        type: 'Feature',
        geometry: data[0].location,
        properties: {
          fhType: 'primary',
        },
      };
      features.push(loc);
    }
    if (data[0].area !== undefined) {
      const area: IGeoJsonFeature = {
        type: 'Feature',
        geometry: data[0].area,
        properties: {
          fhType: 'primary',
          // guideType: 'tentative',
          // editHandleType: 'existing',
        },
      };
      features.push(area);
    }

    // console.log('the features we have found', features);
    const geo: IGeoJson = {
      type: 'FeatureCollection',
      features: features,
    };

    // setSelectedIndex([]);
    setGeoData(geo);
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setGeoData]);

  if (zoom !== undefined) {
    initialViewState.zoom = zoom;
    if (
      data !== undefined &&
      data[0] !== undefined &&
      lat !== undefined &&
      lon !== undefined
    ) {
      initialViewState.latitude = data[0].latitude;
      initialViewState.longitude = data[0].longitude;
    }
  }

  // const locationMode = activeEditor === 'location' ? editMode : 'view';
  // const areaMode = activeEditor === 'area' ? editMode : 'view';
  const commonProps = {
    lineWidthMinPixels: 2,
    editHandlePointRadiusMinPixels: 4,
    editHandlePointRadiusScale: 200,
    lineDashJustified: true,
    // modeConfig: {
    //   // enableSnapping: true,
    //   cursor: 'crosshair',
    // },
    pickingRadius: 20,
    pickingDepth: 1,
  };

  const geoLayer = new EditableGeoJsonLayer({
    ...commonProps,
    selectedFeatureIndexes: selectedIndex,
    id: 'location',
    data: geoData,
    mode: editMode,
    onStopDragging: () => {},
    onEdit: ({ updatedData, editContext }) => {
      // console.log('updated data from nebula');
      // console.log(editContext);

      // console.log(updatedData);
      const pointFeatures = updatedData.features.filter(
        (ele: IGeoJsonFeature) => ele.geometry.type === 'Point',
      );
      const polyFeatures = updatedData.features.filter(
        (ele: IGeoJsonFeature) => ele.geometry.type === 'Polygon',
      );
      // console.log('point', pointFeatures);
      // console.log('poly', polyFeatures);

      const geo: IGeoJson = {
        type: 'FeatureCollection',
        features: [
          pointFeatures[pointFeatures.length - 1],
          polyFeatures[polyFeatures.length - 1],
        ],
      };

      setGeoData(geo);
    },
    ...commonProps,
  });
  const [isActive, setIsActive] = useState(false);
  const handleClick = (event) => {
    mapToolbarEditModeHandler(event);
    setIsActive(false);
  };
  const setActiveMode = (mode: string) =>
    editMode === mode ? 'is-active' : '';
  return (
    <>
      <div className='buttons'>
        <div className={`dropdown ${isActive ? 'is-active' : ''} is-small`}>
          <div
            className='dropdown-trigger'
            aria-haspopup='true'
            aria-controls='dropdown-menu'
          >
            <button
              className='button is-small'
              aria-haspopup='true'
              aria-controls='dropdown-menu'
              // disabled={isDisabled}
              onClick={(event) => {
                event.preventDefault();
                setIsActive(!isActive);
              }}
            >
              <span style={{ paddingRight: '0.5em' }}>{`Bearbeitungs Modus: ${
                dropdownTexts[editMode] !== undefined
                  ? dropdownTexts[editMode].text
                  : ''
              }`}</span>
              <span>
                <IconAngleDown />
              </span>
            </button>
          </div>
          <div className='dropdown-menu' id='dropdown-menu' role='menu'>
            <div className='dropdown-content'>
              <a
                href='#/'
                className={`dropdown-item ${setActiveMode('view')}`}
                onClick={handleClick}
                id={'view'}
              >
                anzeigen
              </a>

              <a
                href='#/'
                className={`dropdown-item ${setActiveMode('modify')} ${
                  newSpot === true ? 'is-hidden' : ''
                }`}
                onClick={handleClick}
                id={'modify'}
              >
                modifizieren
              </a>
              <a
                // dirty hack to keep bulma working
                href='#/'
                className={`dropdown-item ${setActiveMode('translate')} ${
                  newSpot === true ? 'is-hidden' : ''
                }`}
                onClick={handleClick}
                id={'translate'}
              >
                bewegen
              </a>
              <a
                // dirty hack to keep bulma working
                href='#/'
                className={`dropdown-item ${setActiveMode('drawPoint')}`}
                onClick={handleClick}
                id={'drawPoint'}
              >
                Punkt zeichnen
              </a>
              <a
                // dirty hack to keep bulma working
                href='#/'
                className={`dropdown-item ${setActiveMode('drawPolygon')}`}
                onClick={handleClick}
                id={'drawPolygon'}
              >
                Polygon zeichnen
              </a>
            </div>
          </div>
        </div>
      </div>
      <div ref={mapRef} id='map__container'>
        {
          <DeckGL
            width={mapDims.width}
            height={mapDims.height}
            initialViewState={initialViewState}
            // controller={true}
            layers={[geoLayer]}
            getCursor={(() => {
              if (activeEditor === 'location') {
                return geoLayer.getCursor.bind(geoLayer);
              } else {
                return;
              }
            })()}
            onClick={(info: any) => {
              // console.log('onLayerClick', info);
              if (editMode === 'view' || editMode === 'drawPolygon') {
                return;
              }
              if (info) {
                // console.log(`select editing feature ${info.index}`);
                if (info.index >= 0) {
                  setSelectedIndex([info.index]);
                }
              } else {
                setSelectedIndex([]);
              }
            }}
            controller={{ type: MapController, doubleClickZoom: false }}
          >
            <StaticMap
              width={width}
              height={height}
              mapboxApiAccessToken={REACT_APP_MAPBOX_API_TOKEN}
              mapStyle='mapbox://styles/fmoronzirfas/ck21m3k446h8g1cp9zj67nw4m'
            />
          </DeckGL>
        }
      </div>
    </>
  );
};

export default FormikSpotEditorMap;
