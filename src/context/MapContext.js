/* eslint-disable import/no-cycle */
import React, {
  createContext, useState, useMemo, useContext, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { StateGlobal } from './StateGlobal';
import {
  getAnomaliesResponse,
  getBlocksResponse,
  getDryTreesResponse,
  getFruitsCountResponse,
  getFruitsOnTheGroundResponse,
  getGeotiffProductivityResponse,
  getLeafDensityResponse,
  getMissingTreesResponse,
  getReplantedTreesResponse,
  getVinesTreesResponse,
  getVolumetriesResponse,
} from '../utils/getMapRequests';
import { ChartContext } from './ChartContext';
import {
  empty, emptyBlock, emptyFruit, emptyGeotiff,
} from '../utils/format';

import { classIdOld } from '../constants';
import { getVariety } from '../service/apiMaps';

export const MapContext = createContext({});

export function MapProvider({ children }) {
  const id = window.location.pathname.split('report/')[1];
  const { period } = useContext(StateGlobal);
  const { params } = useContext(ChartContext);

  const [slideIn, setSlideIn] = useState(false);

  const handleSlide = (val) => {
    setSlideIn(val);
  };

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [selectedMap, setSelectedMap] = useState(false);

  const [imageDetections, setImageDetections] = useState([]);
  const [renderCenter, setRenderCenter] = useState(false);
  const [filterBar, setFilterBar] = useState([]);

  const { startDate, endDate } = useMemo(() => ({
    startDate: new Date(period.startDate),
    endDate: new Date(period.endDate),
  }), [period]);

  const dateAndId = { startDate, endDate, id };

  const [getBlocksRequest, setBlocksResponse] = useState(emptyBlock(false, dateAndId));
  const [getDryTreesRequest, setDryTreesResponse] = useState(empty(false, dateAndId));
  // const [dryTrees, setDryTree] = useState({});
  const [
    getAnomaliesRequest, setAnomaliesResponse] = useState(empty(false, dateAndId));
  // const [anomalies, setAnomalies] = useState({});
  const [
    getVinesTreesRequest, setVinesTreesResponse] = useState(empty(false, dateAndId));
  // const [vinesTrees, setVinesTrees] = useState({});
  const [
    getVolumetriesRequest, setVolumetriesResponse] = useState(empty(false, dateAndId));
  // const [volumetries, setVolumetries] = useState({});
  const [
    getFruitsCountRequest,
    setFruitsCountResponse] = useState(emptyFruit(false, dateAndId));
  // const [fruitsCount, setFruitsCount] = useState({});
  const [
    productivityRequest,
    setProductivityRequest] = useState(emptyGeotiff(false, dateAndId));
  // const [productivity, setProductivity] = useState({});
  const [
    getLeafDensityRequest, setLeafDensityResponse] = useState(empty(false, dateAndId));
  // const [leafDensity, setLeafDensity] = useState({});
  const [
    getMissingTreesRequest,
    setMissingTreesResponse] = useState(empty(false, dateAndId));
  // const [missingTrees, setMissingTrees] = useState({});
  const [
    getReplantedTreesRequest,
    setReplantedTreesResponse] = useState(empty(false, dateAndId));
  // const [replantedTrees, setReplantedTrees] = useState({});
  const [
    getFruitsOnTheGroundRequest,
    setFruitsOnTheGroundResponse] = useState(empty(false, dateAndId));
  // const [fruitsOnTheGround, setFruitsOnTheGround] = useState({});
  const [propArr, setPropArr] = useState([]);
  const [filterModal, setFilterModal] = useState('');

  function selectHeatmap(name) {
    setSelectedFilters((filters) => {
      const filterExists = filters.find((item) => item.name === name);

      if (filterExists && filters.length === 1) {
        return filters.filter((item) => item.name !== name);
      }

      return (filterExists && filters.length > 1)
        ? filters.filter((item) => item.name !== name) // select the own [{ name, selected: true }]
        : [
          ...filters, // permite selecionar mais um botão ao mesmo tempo
          { name, selected: true },
        ];
    });
  }

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleVisibilityToggle = useCallback((state) => {
    // event.stopPropagation();
    setIsDropdownVisible(state);
  }, []);

  function clearHeatmaps() {
    setSelectedFilters([]);
    handleVisibilityToggle(false);
  }

  const { value, redirect } = params;
  const blocks = value.length !== 0 && value.blocks.map((bl) => bl.id);
  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    if (blocks.length === 0) {
      clearHeatmaps();
    }
  }, []);

  useEffect(() => {
    const getInfos = async () => {
      const varietyNameList = await getVariety(token);
      const blockGeo = await getBlocksResponse(value, token);

      const newCoords = blockGeo.data.coords.map((item) => {
        const filteredVariety = varietyNameList.find((variety) => variety.ID === item.variety_id);
        const newCoord = {
          ...item,
          variety_name: filteredVariety === undefined ? '' : filteredVariety.nome,
        };
        return newCoord;
      });

      const newBlockGeo = {
        ...blockGeo,
        data: {
          ...blockGeo.data,
          coords: newCoords,
        },
      };

      setBlocksResponse(newBlockGeo);
    };

    if (blocks.length === 0) {
      setFruitsCountResponse(emptyFruit(false, dateAndId));
      setProductivityRequest(emptyGeotiff(false, dateAndId));
      setDryTreesResponse(empty(false, dateAndId));
      setAnomaliesResponse(empty(false, dateAndId));
      setVinesTreesResponse(empty(false, dateAndId));
      setVolumetriesResponse(empty(false, dateAndId));
      setLeafDensityResponse(empty(false, dateAndId));
      setMissingTreesResponse(empty(false, dateAndId));
      setReplantedTreesResponse(empty(false, dateAndId));
      setFruitsOnTheGroundResponse(empty(false, dateAndId));
    }
    if (redirect) return getInfos();

    return false;
  }, [params]);

  useMemo(() => {
    const getInfosFruitCount = async () => {
      const fruitGeo = await getFruitsCountResponse(value, blocks, token);
      setImageDetections(fruitGeo[2]);
      setFruitsCountResponse(fruitGeo[0]);
      const fruitToPropArr = { fruit: fruitGeo[1].length ? fruitGeo[1] : [fruitGeo[1]] };
      setPropArr((update) => [...update, fruitToPropArr]);
    };

    if (blocks.length === 0) return setFruitsCountResponse(emptyFruit(true, dateAndId));

    if (blocks.length > 0 && redirect) return getInfosFruitCount();

    return false;
  }, [getBlocksRequest]);

  useMemo(() => {
    const getInfosGeotiff = async () => {
      const prod = await getGeotiffProductivityResponse(value, blocks, token);
      setProductivityRequest(prod[0]);
      const prodToPropArr = { productivity: prod[1].length ? prod[1] : [prod[1]] };
      setPropArr((update) => [...update, prodToPropArr]);
    };

    if (blocks.length === 0) return setProductivityRequest(emptyGeotiff(true, dateAndId));

    if (blocks.length > 0 && redirect) return getInfosGeotiff();

    return false;
  }, [getBlocksRequest]);

  useMemo(() => {
    const getInfosOnGround = async () => {
      const onGround = await getFruitsOnTheGroundResponse(value, blocks, token);

      setFruitsOnTheGroundResponse(onGround[0]);
      const groundToPropArr = { ground: onGround[1].length ? onGround[1] : [onGround[1]] };
      setPropArr((update) => [...update, groundToPropArr]);
    };

    if (blocks.length === 0) return setFruitsOnTheGroundResponse(empty(true, dateAndId));

    if (blocks.length > 0 && redirect) return getInfosOnGround();

    return false;
  }, [getBlocksRequest]);

  useMemo(() => {
    const getInfos = async () => {
      const vol = await getVolumetriesResponse(value, blocks, token);
      setVolumetriesResponse(vol[0]);
      const volToPropArr = { volumetry: vol[1].length ? vol[1] : [vol[1]] };
      setPropArr((update) => [...update, volToPropArr]);
    };

    if (blocks.length === 0) return setVolumetriesResponse(empty(true, dateAndId));

    if (blocks.length > 0 && redirect) return getInfos();

    return false;
  }, [getBlocksRequest]);

  useMemo(() => {
    const getInfos = async () => {
      const missing = await getMissingTreesResponse(value, blocks, token);
      setMissingTreesResponse(missing[0]);
      const missingToPropArr = { missingTree: missing[1].length ? missing[1] : [missing[1]] };
      setPropArr((update) => [...update, missingToPropArr]);
    };

    if (blocks.length === 0) return setMissingTreesResponse(empty(true, dateAndId));

    if (blocks.length > 0 && redirect) return getInfos();

    return false;
  }, [getBlocksRequest]);

  useMemo(() => {
    const getInfosVines = async () => {
      const vines = await getVinesTreesResponse(value, blocks, token);
      setVinesTreesResponse(vines[0]);
      const vinesToPropArr = { vinesTree: vines[1].length ? vines[1] : [vines[1]] };
      setPropArr((update) => [...update, vinesToPropArr]);
    };

    if (blocks.length === 0) return setVinesTreesResponse(empty(true, dateAndId));

    if (blocks.length > 0 && redirect) return getInfosVines();

    return false;
  }, [getBlocksRequest]);

  useMemo(() => {
    const getInfos = async () => {
      const dryTree = await getDryTreesResponse(value, blocks, token);
      setDryTreesResponse(dryTree[0]);
      const dryToPropArr = { dry: dryTree[1].length ? dryTree[1] : [dryTree[1]] };
      setPropArr((update) => [...update, dryToPropArr]);
    };

    if (blocks.length === 0) return setDryTreesResponse(empty(true, dateAndId));

    if (blocks.length > 0 && redirect) return getInfos();

    return false;
  }, [getBlocksRequest]);

  useMemo(() => {
    const getInfos = async () => {
      const anomaly = await getAnomaliesResponse(value, blocks, token);
      setAnomaliesResponse(anomaly[0]);
      const anomToPropArr = { anom: anomaly[1].length ? anomaly[1] : [anomaly[1]] };
      setPropArr((update) => [...update, anomToPropArr]);
    };

    if (blocks.length === 0) return setAnomaliesResponse(empty(true, dateAndId));

    if (blocks.length > 0 && redirect) return getInfos();

    return false;
  }, [getBlocksRequest]);

  useMemo(() => {
    const getInfos = async () => {
      const replanted = await getReplantedTreesResponse(value, blocks, token);
      setReplantedTreesResponse(replanted[0]);
      const replantedToPropArr = { replant: replanted[1].length ? replanted[1] : [replanted[1]] };
      setPropArr((update) => [...update, replantedToPropArr]);
    };

    if (blocks.length === 0) return setReplantedTreesResponse(empty(true, dateAndId));

    if (blocks.length > 0 && redirect) return getInfos();

    return false;
  }, [getBlocksRequest]);

  useMemo(() => {
    const getInfos = async () => {
      const leaf = await getLeafDensityResponse(value, blocks, token);
      setLeafDensityResponse(leaf[0]);
      const leafToPropArr = { leafDens: leaf[1].length ? leaf[1] : [leaf[1]] };
      setPropArr((update) => [...update, leafToPropArr]);
    };

    if (blocks.length === 0) return setLeafDensityResponse(empty(true, dateAndId));

    if (blocks.length > 0 && redirect) return getInfos();

    return false;
  }, [getBlocksRequest]);

  const data = useMemo(() => {
    const countFruits = (getFruitsCountRequest.data?.coords || []);
    const countFruitsKeysData = classIdOld.map((item) => ({
      ...item,
      loading: getFruitsCountRequest.loading,
      disabled: !(countFruits[item.id] || []).every(
        (subItem) => subItem.latitude === 0 || subItem.longitude === 0,
      ),
      data: countFruits[item.id] || [],
    }));

    const filtersKeysWithData = [
      {
        name: 'Volumes',
        loading: getVolumetriesRequest.loading,
        data: getVolumetriesRequest.data?.coords || [],
      },
      {
        name: 'Frutos no chão',
        loading: getFruitsOnTheGroundRequest.loading,
        data: getFruitsOnTheGroundRequest.data?.coords || [],
      },
      {
        name: 'Árvores ausentes',
        loading: getMissingTreesRequest.loading,
        data: getMissingTreesRequest.data?.coords || [],
      },
      {
        name: 'Replantio',
        loading: getReplantedTreesRequest.loading,
        data: getReplantedTreesRequest.data?.coords || [],
      },
      {
        name: 'Cipó',
        loading: getVinesTreesRequest.loading,
        data: getVinesTreesRequest.data?.coords || [],
      },
      {
        name: 'Anomalias Frutos',
        loading: getAnomaliesRequest.loading,
        data: getAnomaliesRequest.data?.coords || [],
      },
      {
        name: 'Densidade foliar',
        loading: getLeafDensityRequest.loading,
        data: getLeafDensityRequest.data?.coords || [],
      },
      {
        name: 'Plantas secas',
        loading: getDryTreesRequest.loading,
        data: getDryTreesRequest.data?.coords || [],
      },
    ].map((item) => ({
      ...item,
      disabled: item.data.every(
        (subItem) => subItem.latitude === 0 || subItem.longitude === 0,
      ),
    }));

    const geotiffsData = [
      {
        name: 'Produtividade',
        loading: productivityRequest.loading,
        data: productivityRequest.data?.overlay || [],
      },
    ].map((item) => ({
      ...item,
      disabled: item.data.every(
        (subItem) => subItem.url === '' || subItem.position === '',
      ),
    }));

    const checkItemByProperty = (itemName, property) => !!selectedFilters.find(
      (selectedItem) => selectedItem.name === itemName && selectedItem[property],
    );

    const coordinates = (getBlocksRequest.data?.coords || []).map((item) => ({
      ...item,
      coords: item.coords.map((block) => {
        const [latitude, longitude] = block.split(',');

        return {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
        };
      }),
    }));

    const ret = {
      loading: getBlocksRequest.loading,
      coordinates,
      countFruitsHeatmaps: countFruitsKeysData.map((item) => ({
        name: item.name,
        loading: item.loading,
        selected: checkItemByProperty(item.name, 'selected'), // check ? true :
        disabled: !item.disabled,
        data: item.data || [],
      })),
      heatmaps: filtersKeysWithData.map((item) => ({
        name: item.name,
        loading: item.loading,
        selected: checkItemByProperty(item.name, 'selected'),
        disabled: !item.disabled,
        data: item.data || [],
      })),
      geotiffs: geotiffsData.map((item) => ({
        name: item.name,
        loading: item.loading,
        selected: checkItemByProperty(item.name, 'selected'),
        disabled: !item.disabled,
        data: item.data || [],
      })),
    };
    setRenderCenter(getBlocksRequest.loading);
    return ret;
  }, [
    selectedFilters,
    getFruitsCountRequest,
    productivityRequest,
    getDryTreesRequest,
    getAnomaliesRequest,
    getVinesTreesRequest,
    getVolumetriesRequest,
    getLeafDensityRequest,
    getMissingTreesRequest,
    getReplantedTreesRequest,
    getFruitsOnTheGroundRequest,
    getBlocksRequest,
  ]);

  const value2 = useMemo(() => ({
    slideIn,
    setSlideIn,
    handleSlide,
    setBlocksResponse,
    setPropArr,
    selectHeatmap,
    setRenderCenter,
    renderCenter,
    clearHeatmaps,
    isDropdownVisible,
    handleVisibilityToggle,
    filterModal,
    setFilterModal,
    imageDetections,
    propArr,
    isImageModalOpen,
    setIsImageModalOpen,
    selectedMap,
    setSelectedMap,
    selectedFilters,
    setSelectedFilters,
    filterBar,
    setFilterBar,
    ...data,
  }), [
    selectHeatmap,
    clearHeatmaps,
    data,
  ]);

  MapProvider.propTypes = {
    children: PropTypes.node,
  }.isRequired;

  return (
    <MapContext.Provider value={value2}>
      {children}
    </MapContext.Provider>
  );
}
