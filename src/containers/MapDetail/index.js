import React, {
  useState,
  useRef,
  useMemo,
  useContext,
  useEffect,
} from 'react';

import {
  GoogleMap,
  Polygon,
  HeatmapLayer,
  useJsApiLoader,
  InfoWindow,
  GroundOverlay,
} from '@react-google-maps/api';

import { trace } from 'firebase/performance';
import {
  Box, CircularProgress, Typography,
} from '@mui/material';
import { Tune } from '@mui/icons-material';
import { MapContext } from '../../context/MapContext';

import {
  getImage,
  getLowResImage,
  getNextHDImage,
  getPreviousHDImage,
} from '../../service/apiMaps';

import {
  calculateCentralGeoCoordinate,
  checkCoord,
  findOutClosestPoint,
  formatHeatmap,
} from '../../utils/format';

import { ImageModal } from '../ImageModal';
import { getValidationErrors } from '../../utils/getValidationErrors';

import {
  BlockView, Container, ExpanseButton,
  ImageContainer, InfoContent,
  LoadingContainer, LoadingContent, MapOptionsButton,
} from './styles';

import LegendMap from '../../components/LegendMap';
import { perf } from '../../service/firebase';
import { classId } from '../../constants';
import { CentralizeButton } from '../../components/CentralizeButton';
import { MapDropDown } from '../MapDropDown';

const libraries = ['visualization'];

export function MapDetail() {
  const libRef = useRef(libraries);
  const polygonRef = useRef(null);
  const {
    loading,
    coordinates,
    countFruitsHeatmaps,
    heatmaps,
    geotiffs,
    isImageModalOpen,
    setIsImageModalOpen,
    selectedFilters,
    propArr,
    handleSlide,
  } = useContext(MapContext);

  const { loadError, isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries: libRef.current,
  });

  const [infoWindow, setInfoWindow] = useState({});
  const [chosenImage, setChosenImage] = useState();
  const [lowResImage, setLowResImage] = useState();
  const [currentImageHD, setCurrentImageHD] = useState();
  const [checked, setChecked] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [currentBlockName, setCurrentBlockName] = useState(null);
  const [currentVarietyName, setCurrentVarietyName] = useState(null);
  const [clickCenter, setClickCenter] = useState(true);
  const [zoomVariable, setZoomVariable] = useState(15);

  const token = JSON.parse(localStorage.getItem('token'));

  const username = JSON.parse(localStorage.getItem('user'))?.includes('@')
    ? JSON.parse(localStorage.getItem('user')).split('@')[0] : JSON.parse(localStorage.getItem('user'));

  if (loadError) getValidationErrors(loadError);

  const polygons = useMemo(() => coordinates, [coordinates]);

  const center = useMemo(() => {
    if (coordinates.length === 0) {
      return {
        lat: -22.91949395764639,
        lng: -48.67460159319444,
      };
    }

    const newCoordinates = coordinates.map((coordinate) => coordinate.coords.map((coord) => ({
      latitude: coord.lat,
      longitude: coord.lng,
    }))).flat();

    if (polygons.length > 6) {
      setZoomVariable(15);
    } else {
      setZoomVariable(15.5);
    }

    return calculateCentralGeoCoordinate(newCoordinates);
  }, [clickCenter]);

  const geotiff = useMemo(() => {
    const ret = geotiffs[0].data.map((item) => item);
    return ret;
  }, [geotiffs]);

  const heatmap = useMemo(
    () => {
      const ret = formatHeatmap(heatmaps, countFruitsHeatmaps);

      return ret;
    },
    [heatmaps, countFruitsHeatmaps],
  );

  const [options, setOptions] = useState({
    id: '',
    color: '#074096',
  });

  const handleMouseOver = (id, color, path) => {
    polygonRef.current = id;
    setOptions({ id, color });
    setCurrentBlockName(path.blockName);
    setCurrentVarietyName(path.variety_name);
  };

  const getClosestDataProperties = async (lat, lng, polygonData) => {
    const currentArr = checkCoord(selectedFilters, propArr);
    // avoiding error if there is a unique selected and it is volumetry
    if (currentArr.length === 0) {
      setInfoWindow({});
    } else {
      const indexPoint = findOutClosestPoint(currentArr, lat, lng);
      const { distanceIndex, distance } = indexPoint;

      setChosenImage(currentArr[distanceIndex].image_id);

      setImageLoading(true);

      if (heatmap.length !== 0) {
        // loading spinner starts until InfoWindow image is processed
        setInfoWindow({
          isOpen: true,
          image_id: currentArr[distanceIndex].image_id,
          lat: currentArr[distanceIndex].latitude,
          lng: currentArr[distanceIndex].longitude,
          block_name: polygonData.blockName,
          block_id: polygonData.id,
          name: currentArr[distanceIndex].name,
        });
      }
      if (distance > 0.03) {
        setInfoWindow({});
      }
      // ga: tempo gasto para o request
      const t = trace(perf, `lowImage-${username}`);

      t.start();
      const blobLowResImage = await getLowResImage(token, currentArr, distanceIndex);
      t.stop();
      const resolvedImage = URL.createObjectURL(blobLowResImage);
      setLowResImage(resolvedImage);
    }
  };

  useEffect(() => {
    if (lowResImage) {
      // after low res image is loaded, spinner stops and image appears on InfoWindow
      setInfoWindow((oldState) => (
        {
          ...oldState,
          image_url: lowResImage,
        }
      ));
      setImageLoading(false);
    }
  }, [lowResImage]);

  useEffect(() => {
    if (heatmap.length === 0) {
      setInfoWindow({});
    }
  }, [heatmap]);

  const handleGetCurrentImage = (async (imgId, claheValue = !!checked) => {
    // ga: tempo gasto para o request
    const tImage = trace(perf, `image-${username}`);

    tImage.start();
    const blobImage = await getImage(token, imgId, claheValue);
    tImage.stop();
    const resolvedImage = URL.createObjectURL(blobImage);
    setCurrentImageHD(resolvedImage);
    setImageLoading(false);
  });

  const handleClick = (event, polygonData) => {
    if (selectedFilters.length > 0 && propArr.length > 0) {
      return getClosestDataProperties(event.latLng.lat(), event.latLng.lng(), polygonData);
    }
    return false;
  };

  const handleGetPreviousHDImage = async () => {
    setImageLoading(true);
    // ga: tempo gasto para o request
    const tImageHd = trace(perf, `imageHD-${username}`);

    tImageHd.start();
    const prevImage = await getPreviousHDImage(token, infoWindow.image_id);
    tImageHd.stop();
    setInfoWindow({ ...infoWindow, image_id: prevImage.id });
    await handleGetCurrentImage(prevImage.id);
  };

  const handleGetNextHDImage = async () => {
    setImageLoading(true);
    const nextImage = await getNextHDImage(token, infoWindow.image_id);
    setInfoWindow({ ...infoWindow, image_id: nextImage.id });
    await handleGetCurrentImage(nextImage.id);
  };

  const handleChangeClahe = (event) => {
    setImageLoading(true);

    if (event.target.checked === true) {
      setChecked(true);
      handleGetCurrentImage(infoWindow.image_id, true);
    } else {
      setChecked(false);
      handleGetCurrentImage(infoWindow.image_id, false);
    }
  };

  const handleImageModalVisibility = async () => {
    setImageLoading(true);
    setIsImageModalOpen(true);
    handleGetCurrentImage(chosenImage);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
  };

  const handleDownloadBlob = () => {
    const link = document.createElement('a');
    link.href = currentImageHD;
    link.download = `image-${infoWindow.image_id}.png`;
    link.click();
  };

  return (
    <Container>
      {(!isLoaded || loading) && (
        <LoadingContainer>
          <LoadingContent>
            <CircularProgress style={{ position: 'absolute' }} />
          </LoadingContent>
        </LoadingContainer>
      )}
      {(isLoaded && !loading) && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={zoomVariable}
          options={{
            gestureHandling: 'cooperative',
            mapTypeId: 'satellite',
            fullscreenControl: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
          }}
        >
          <Box>
            <MapOptionsButton
              title="Tipos de Mapas"
              onClick={() => handleSlide(true)}
            >
              <Tune />
            </MapOptionsButton>
            <Typography sx={{
              position: 'absolute',
              display: 'inline-block',
              top: 20,
              color: '#fefefe',
              fontWeight: 'bold',
            }}
            >
              Tipos de Mapas
            </Typography>
          </Box>

          <Box sx={{
            position: 'absolute',
            top: '0px',
            left: '0px',
          }}
          >
            <MapDropDown />
          </Box>

          <ImageModal
            checked={checked}
            data={infoWindow}
            loading={imageLoading}
            open={isImageModalOpen}
            imageHD={currentImageHD}
            onClose={handleImageModalClose}
            handleChangeClahe={handleChangeClahe}
            handleImageDownload={handleDownloadBlob}
            handleGetNextHDImage={handleGetNextHDImage}
            handleGetPreviousHDImage={handleGetPreviousHDImage}
          />

          {
            selectedFilters.find((prod) => prod.name === 'Produtividade')
            && geotiff !== undefined
            && geotiff.map((item) => (
              <div key={item.block_id}>
                <GroundOverlay
                  key={item.url}
                  url={item.url}
                  bounds={item.bounds}
                  opacity={0.7}
                />
              </div>
            ))
          }

          {heatmap.map((layer) => (
            <div key={layer.key}>
              <HeatmapLayer
                key={layer.key}
                data={layer.data}
                options={{
                  opacity: 0.95,
                  radius: 0.00002,
                  dissipating: false,
                  gradient: layer.gradient,
                  maxIntensity: layer.maxIntensity,
                  maxIntensityMult: 2.0,
                }}
              />
            </div>
          ))}
          {(selectedFilters.length > 0 && heatmap.length > 0) && (
            false && <LegendMap selectedFilters={selectedFilters} heatmap={heatmap} />
          )}

          {polygons.map((paths) => (
            <div key={paths.id}>
              <Polygon
                ref={polygonRef}
                style={{ position: 'relative' }}
                key={paths.id}
                paths={paths.coords}
                onClick={(event) => handleClick(event, paths)}
                onMouseOver={() => handleMouseOver(paths.id, 'red', paths)}
                onMouseOut={() => handleMouseOver(paths.id, paths.variety_color === undefined ? '#074096' : paths.variety_color, false)}
                options={{
                  fillOpacity: 0,
                  strokeColor: polygonRef.current === paths.id && paths.variety_color !== undefined
                    ? options.color
                    : paths.variety_color,
                  strokeWeight: 3,
                  zIndex: polygonRef.current === paths.id && 99,
                }}
              />

              {currentBlockName && (
                <BlockView>
                  <p>{`Quadra ${currentBlockName}`}</p>
                  <p>{currentVarietyName}</p>
                </BlockView>
              )}
            </div>
          ))}

          <CentralizeButton setClickCenter={setClickCenter} />

          {Object.keys(infoWindow).length !== 0
            ? (infoWindow.isOpen && (
              <InfoWindow
                position={{ lat: infoWindow.lat, lng: infoWindow.lng }}
                onCloseClick={() => setInfoWindow({ ...infoWindow, isOpen: false })}
              >
                <>
                  <ImageContainer>
                    {imageLoading
                      ? <CircularProgress style={{ position: 'absolute' }} />
                      : <img src={infoWindow.image_url} alt={`pic - ${infoWindow.image_url}`} />}
                  </ImageContainer>

                  <InfoContent>
                    <div>
                      <h3>{`Quadra - ${infoWindow.block_name}`}</h3>
                      <span>
                        {(classId.map((type) => type.name)).includes(infoWindow.name) ? 'Contagem' : infoWindow.name}
                      </span>
                      <span>{`(${infoWindow.lat}, ${infoWindow.lng})`}</span>
                    </div>
                    <ExpanseButton
                      onClick={() => handleImageModalVisibility()}
                      fullWidth={false}
                      disableElevation
                      variant="outlined"
                      color="primary"
                    >
                      Expandir
                    </ExpanseButton>
                  </InfoContent>
                </>
              </InfoWindow>
            )
            ) : null}
        </GoogleMap>
      )}
    </Container>
  );
}
