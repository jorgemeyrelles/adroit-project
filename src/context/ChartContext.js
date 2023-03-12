import React, {
  createContext,
  useEffect,
  useMemo,
  // useContext,
  // useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  getDiameterByBlockId,
} from '../utils/getChartFruitsRequest';
import { getRipeningsByBlockId } from '../utils/getChartRipeningsRequest';
import { getFruitsCountByBlockIdToTable } from '../utils/getTableFruitRequest';
import { getTreeHeightByBlockId } from '../utils/getChartHeightsRequest';
import { getOnGroundByBlockId } from '../utils/getChartOnGroundRequest';
import { getInventoryTreesById } from '../utils/getChartInventoryTreesRequest';
import { getSummaryRequest } from '../utils/format';
// import { getAnomaliesByBlockId } from '../utils/getChartAnomaliesRequest';

export const ChartContext = createContext();

function ChartProvider({ children }) {
  const [chartsSelected, setChartsSelected] = useState([]);
  const [isLoading, setIsLoading] = useState({
    table: true,
    ripening: true,
    diameter: true,
    treeHeight: true,
    onGround: true,
    // missing: true,
    // flower: true,
    inventory: true,
    // anomaly: true,
    // volumetry: true,
  });
  const empty = [{ loading: false, data: {} }];
  const [params, setParams] = useState({ redirect: false, value: [] });
  const [getSummaryResponse, setGetSummaryResponse] = useState([{ loading: true, data: {} }]);
  // const local = JSON.parse(localStorage.getItem('reportId'));

  const [selectedReport, setSelectedReport] = useState({});
  const [organizedKeysByblocks, setOrganizedKeysByblocks] = useState([]);

  const [
    getChartFruitsResponse,
    setGetChartFruitsResponse,
  ] = useState(empty);
  const [
    getChartRipeningsResponse,
    setGetChartRipeningsResponse,
  ] = useState(empty);
  const [
    getChartDiametersResponse,
    setGetChartDiametersResponse,
  ] = useState(empty);
  const [
    getChartHeightsResponse,
    setGetChartHeightsResponse,
  ] = useState(empty);
  const [
    getChartOnGroundResponse,
    setGetChartOnGroundResponse,
  ] = useState(empty);
  // const [
  // getChartMissingsResponse,
  // setGetChartMissingsResponse,
  // ] = useState([{ loading: false, data: {} }]);
  // const [
  // getChartFlowersResponse,
  // setGetChartFlowersResponse,
  // ] = useState([{ loading: false, data: {} }]);
  const [
    getChartInventoryTreesResponse,
    setChartInventoryTreesResponse,
  ] = useState(empty);
  // const [
  // getChartAnomaliesResponse,
  // setGetChartAnomaliesResponse,
  // ] = useState([{ loading: false, data: {} }]);
  // const [
  // getChartVolumetriesResponse,
  // setGetChartVolumetriesResponse,
  // ] = useState([{ loading: false, data: {} }]);

  const { value, redirect } = params;
  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    let isMounted = true;
    const callInventoryTree = async () => {
      let inventory = [];
      if (isMounted) {
        inventory = await getInventoryTreesById(value, token);
      }
      setIsLoading((obj) => ({ ...obj, inventory: false }));
      setChartInventoryTreesResponse(inventory);
      setParams({ redirect: false, value });
    };

    if (redirect) {
      setChartInventoryTreesResponse(empty);
      setIsLoading((obj) => ({ ...obj, inventory: true }));

      callInventoryTree();
    }

    return () => { isMounted = false; };
  }, [params]);

  useEffect(() => {
    const callFruitCountByBlock = async () => {
      const table = await getFruitsCountByBlockIdToTable(value, token);
      const toSummary = await getSummaryRequest(table);
      setIsLoading((obj) => ({ ...obj, table: false }));
      // feeding summary component
      setGetSummaryResponse(toSummary);
      setGetChartFruitsResponse(table);
      setParams({ redirect: false, value });
    };

    if (redirect) {
      setGetSummaryResponse([{ loading: true, data: {} }]);
      setGetChartFruitsResponse(empty);
      setIsLoading((obj) => ({ ...obj, table: true }));

      callFruitCountByBlock();
    }
  }, [params]);

  useEffect(() => {
    const callRipeningsByBlock = async () => {
      const ripenings = await getRipeningsByBlockId(value, token);
      setIsLoading((obj) => ({ ...obj, ripening: false }));
      setGetChartRipeningsResponse(ripenings);
      setParams({ redirect: false, value });
    };
    if (redirect) {
      setGetChartRipeningsResponse(empty);
      setIsLoading((obj) => ({ ...obj, ripening: true }));

      callRipeningsByBlock();
    }
  }, [params]);

  useEffect(() => {
    const callDiameterByBlock = async () => {
      const diameter = await getDiameterByBlockId(value, token);
      setIsLoading((obj) => ({ ...obj, diameter: false }));
      setGetChartDiametersResponse(diameter);
      setParams({ redirect: false, value });
    };
    if (redirect) {
      setGetChartDiametersResponse(empty);
      setIsLoading((obj) => ({ ...obj, diameter: true }));

      callDiameterByBlock();
    }
  }, [params]);

  useEffect(() => {
    const callTreeHeightByBlock = async () => {
      const treeHeight = await getTreeHeightByBlockId(value, token);
      setIsLoading((obj) => ({ ...obj, treeHeight: false }));
      setGetChartHeightsResponse(treeHeight);
      setParams({ redirect: false, value });
    };
    if (redirect) {
      setGetChartHeightsResponse(empty);
      setIsLoading((obj) => ({ ...obj, treeHeight: true }));

      callTreeHeightByBlock();
    }
  }, [params]);

  useEffect(() => {
    const callOnGround = async () => {
      const onGround = await getOnGroundByBlockId(value, token);
      setIsLoading((obj) => ({ ...obj, onGround: false }));
      setGetChartOnGroundResponse(onGround);
      setParams({ redirect: false, value });
    };
    if (redirect) {
      setGetChartOnGroundResponse(empty);
      setIsLoading((obj) => ({ ...obj, onGround: true }));

      callOnGround();
    }
  }, [params]);

  const data = useMemo(() => {
    const responses = {
      2: {
        loading: getChartFruitsResponse?.loading || false,
        data: getChartFruitsResponse.data || [],
      },
      3: {
        loading: getChartRipeningsResponse?.loading || false,
        data: getChartRipeningsResponse.data || [],
      },
      4: {
        loading: getChartDiametersResponse?.loading || false,
        data: getChartDiametersResponse.data || [],
      },
      5: {
        loading: getChartHeightsResponse?.loading || false,
        data: getChartHeightsResponse.data || [],
      },
      6: {
        loading: getChartOnGroundResponse?.loading || false,
        data: getChartOnGroundResponse.data || [],
      },
      // 7: {
      // loading: getChartMissingsResponse?.loading || false,
      // data: getChartMissingsResponse.data || [],
      // },
      // 8: {
      // loading: getChartFlowersResponse?.loading || false,
      // data: getChartFlowersResponse.data || [],
      // },
      9: {
        loading: getChartInventoryTreesResponse?.loading || false,
        data: getChartInventoryTreesResponse.data || [],
      },
      // 10: {
      // loading: getChartAnomaliesResponse?.loading || false,
      // data: getChartAnomaliesResponse.data || [],
      // },
      // 11: {
      // loading: getChartVolumetriesResponse?.loading || false,
      // data: getChartVolumetriesResponse.data || [],
      // },
    };

    localStorage.setItem('reportId', JSON.stringify(responses));
    return responses;
  }, [
    isLoading,
    getChartFruitsResponse,
    getChartRipeningsResponse,
    getChartDiametersResponse,
    getChartHeightsResponse,
    getChartOnGroundResponse,
    // getChartMissingsResponse,
    // getChartFlowersResponse,
    getChartInventoryTreesResponse,
    // getChartAnomaliesResponse,
    // getChartVolumetriesResponse,
  ]);

  const fromChart = useMemo(() => ({
    params,
    setParams,
    data,
    getSummaryResponse,
    setIsLoading,
    isLoading,
    chartsSelected,
    setChartsSelected,
    selectedReport,
    setSelectedReport,
    organizedKeysByblocks,
    setOrganizedKeysByblocks,
  }), [data, params, chartsSelected]);

  return (
    <ChartContext.Provider value={fromChart}>
      {children}
    </ChartContext.Provider>
  );
}

ChartProvider.propTypes = {
  children: PropTypes.node,
}.isRequired;

export { ChartProvider };
