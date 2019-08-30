import React, { useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import {
  IMapsEditorProps,
  IGeoJson,
  IBathingspot,
} from '../../lib/common/interfaces';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { useFormikContext } from 'formik';
const initialViewState = {
  bearing: 0,
  latitude: 52,
  longitude: 13,
  pitch: 0,
  zoom: 4,
};

const FormikSpotEditorMap: React.FC<IMapsEditorProps> = ({
  width,
  height,
  data,
  zoom,
  lat,
  lon,
  editMode,
  activeEditor,
  handleUpdates,
}) => {
  // console.log(formik);
  const { values /*, setValues*/ } = useFormikContext<IBathingspot>();
  const [location, setLocation] = useState<IGeoJson>();
  const [area, setArea] = useState<IGeoJson>();
  useEffect(() => {
    console.log(values);
    return () => {};
  }, [values]);

  useEffect(() => {
    if (data === undefined) return;
    if (data[0] === undefined) return;
    if (location === undefined) return;
    if (area === undefined) return;
    data[0].location = location.features[0].geometry;
    data[0].area = area.features[0].geometry;
  }, [area, location, data]);
  useEffect(() => {
    if (data === undefined) return;
    if (data[0] === undefined) return;

    const geojsonLocation: IGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: data[0].location,
        },
      ],
    };
    const geojsonArea: IGeoJson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: data[0].area,
          properties: {
            guideType: 'tentative',
            editHandleType: 'existing',
          },
        },
      ],
    };
    setArea(geojsonArea);
    setLocation(geojsonLocation);

    return () => {
      // cleanup
    };
  }, [data]);

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

  const locationMode = activeEditor === 'location' ? editMode : 'view';
  const areaMode = activeEditor === 'area' ? editMode : 'view';
  const commonProps = {
    lineWidthMinPixels: 2,
    editHandlePointRadiusMinPixels: 4,
    editHandlePointRadiusScale: 200,
    lineDashJustified: true,
    modeConfig: {
      enableSnapping: true,
      cursor: 'crosshair',
    },
    pickingRadius: 20,
    pickingDepth: 1,
    onLayerClick: (event) => {
      console.log(event);
    },
    selectedFeatureIndexes: [0],
  };
  const areaLayer = new EditableGeoJsonLayer({
    id: 'area',
    data: area,
    mode: areaMode,
    onStopDragging: () => {
      if (area === undefined) return;

      // setIn(formik.values, 'area', area.features[0].geometry);

      // setFieldValue('area', area.features[0].geometry, false);
      // setFieldTouched('area', true, false);

      // setFieldValue('location', location.features[0].geometry, false);
    },
    onEdit: ({ updatedData, editContext }) => {
      // console.log('updated data from nebula');
      // console.log(updatedData);
      // console.log(editContext);
      setArea(updatedData);
    },
    ...commonProps,
  });
  const locationLayer = new EditableGeoJsonLayer({
    id: 'location',
    data: location,
    mode: locationMode,
    onStopDragging: () => {
      if (location === undefined) return;
      const event: React.ChangeEvent<any> = {
        bubbles: true,
        cancelable: false,
        currentTarget: {},
        nativeEvent: new Event('location'),
        target: {},
        defaultPrevented: true,
        eventPhase: 0,
        isTrusted: true,
        preventDefault: () => {},
        isDefaultPrevented: () => true,
        stopPropagation: () => {},
        isPropagationStopped: () => true,
        persist: () => {},
        timeStamp: Date.now(),
        type: 'location',
      };
      // var ev2 = new Event('input', { bubbles: true });
      handleUpdates(event, location.features[0].geometry);
      // setValues({ ...values, location: location.features[0].geometry });
      // formik.setFieldValue('location', location.features[0].geometry);
      // formik.setValues({
      //   ...formik.values,
      //   ...setIn(formik.values, 'location', location.features[0].geometry),
      // });
      // formik.setFieldTouched('location', true, false);
      // formik.setFormikState((prevState: FormikState<IBathingspot>) => {
      //   return {
      //     ...prevState,
      //     values: setIn(
      //       prevState.values,
      //       'location',
      //       location.features[0].geometry,
      //     ),
      //     touched: setIn(prevState.touched, 'location', true),
      //   };
      // });
      // formik.values = setIn(
      //   formik.values,
      //   'location',
      //   location.features[0].geometry,
      // );

      // formik.dirty = true;

      // formik. setIn(formik.errors, 'location', undefined);
      // formik.touched = setIn(formik.touched, 'location', true);
      // setFieldValue('location', location.features[0].geometry, false);
      // setFieldTouched('location', true, false);
      // setFieldValue('location', location.features[0].geometry, false);
    },
    onEdit: ({ updatedData, editContext }) => {
      // console.log('updated data from nebula');
      // console.log(updatedData);
      // console.log(editContext);
      setLocation(updatedData);
    },
    ...commonProps,
  });
  return (
    <DeckGL
      width={width}
      height={height}
      initialViewState={initialViewState}
      controller={true}
      layers={[locationLayer, areaLayer]}
      getCursor={(() => {
        if (activeEditor === 'area') {
          return areaLayer.getCursor.bind(areaLayer);
        } else if (activeEditor === 'location') {
          return locationLayer.getCursor.bind(locationLayer);
        } else {
          return;
        }
      })()}
    >
      <StaticMap
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_TOKEN}
        width={width}
        height={height}
      />
    </DeckGL>
  );
};

export default FormikSpotEditorMap;
