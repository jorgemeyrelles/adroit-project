import axios from 'axios';
import { formatEndDate, showVersion } from '../utils/format';
import { axiosInstance } from './axiosUtils';

const { REACT_APP_API, REACT_APP_API_TEST } = process.env;

let BASE_URL = REACT_APP_API_TEST;

if (showVersion() === 'test' || showVersion() === 'development') {
  // development URL
  BASE_URL = REACT_APP_API_TEST;
} else {
  // production URL
  BASE_URL = REACT_APP_API;
}

const apiMaps = {
  getMapsGeotiff: async (idate, fdate, blockIds, signal) => {
    const URL = `?initial_date=${idate}&final_date=${fdate}&block_id=${blockIds}`;
    const maps = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v3/get_maps/${URL}`,
      validateStatus: (s) => s <= 500,
      responseType: 'blob',
      signal,
    });
    return maps.data;
  },
  getLowImage: async (currentArr, indexPoint, signal) => {
    const URL = `${currentArr[indexPoint].image_id}/7?clahe=true`;
    const lowImg = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_image/${URL}`,
      validateStatus: (s) => s <= 500,
      responseType: 'blob',
      signal,
    });
    return lowImg.data;
  },
  getRegularImage: async (img, clahe, signal) => {
    const URL = `${img}?clahe=${clahe}`;
    const regImg = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_fullhd_image/${URL}`,
      validateStatus: (s) => s <= 500,
      responseType: 'blob',
      signal,
    });
    return regImg.data;
  },
  getPrevHDImage: async (img, signal) => {
    // const URL = `${img}`;
    const prevImg = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_prev_image_info/${img}`,
      validateStatus: (s) => s <= 500,
      responseType: 'blob',
      signal,
    });
    return prevImg.data;
  },
  getNxHDImage: async (img, signal) => {
    // const URL = `${img}`;
    const nxImg = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_next_image_info/${img}`,
      validateStatus: (s) => s <= 500,
      responseType: 'blob',
      signal,
    });
    return nxImg.data;
  },
  getBlockShape: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const blocks = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_block_shape/${URL}`,
      signal,
    });
    return blocks.data;
  },
  getCountGeo: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const count = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_detectioncount_geo_by_date_farm_block/${URL}`,
      signal,
    });
    return count.data;
  },
  getVolumetry: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const vol = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_volumetry/${URL}`,
      signal,
    });
    return vol.data;
  },
  getOnGround: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const ground = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_det_on_ground/${URL}`,
      signal,
    });
    return ground.data;
  },
  getMissingTree: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const missing = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_missing_trees_new/${URL}`,
      signal,
    });
    return missing.data;
  },
  getReplantedTree: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const replanted = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_replanted_trees/${URL}`,
      signal,
    });
    return replanted.data;
  },
  getDryTree: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const dry = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_dry_trees/${URL}`,
      signal,
    });
    return dry.data;
  },
  getAnomalyByIdAndBlock: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const vines = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_anomalies_det/${URL}`,
      signal,
    });
    return vines.data;
  },
  getAnomaly: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const anom = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_anomaly_det_count_geo/${URL}`,
      signal,
    });
    return anom.data;
  },
  getDensity: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const density = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_canopy_density/${URL}`,
      signal,
    });
    return density.data;
  },
};

const getVariety = async (token) => {
  const variety = await axios.get(
    `${BASE_URL}adroit/v2/get_variedades/`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return variety.data;
};

const getMaps = async (token, period, blockIds) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${blockIds}`;

  const response = await axios.get(
    `${BASE_URL}adroit/v3/get_maps/${url}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: (s) => s <= 500,
      responseType: 'blob',
    },
  );
  return response.data;
};

const getLowResImage = async (token, currentArr, indexPoint) => {
  const url = `${currentArr[indexPoint].image_id}/7?clahe=true`;

  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_image/${url}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: (s) => s <= 500,
      responseType: 'blob',
    },
  );
  return response.data;
};

const getImage = async (token, img, clahe) => {
  const url = `${img}?clahe=${clahe}`;

  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_fullhd_image/${url}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: (s) => s <= 500,
      responseType: 'blob',
    },
  );
  return response.data;
};

const getPreviousHDImage = async (token, img) => {
  const url = `${img}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_prev_image_info/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const getNextHDImage = async (token, img) => {
  const url = `${img}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_next_image_info/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const blockShape = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_block_shape/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const countGeo = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_detectioncount_geo_by_date_farm_block/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};

const volumetryMaps = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_volumetry/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const onGroundMaps = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_det_on_ground/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const missingTreeMaps = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_missing_trees_new/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const replantedTreeMaps = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_replanted_trees/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const dryTreeMaps = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_dry_trees/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const anomalyByIdAndBlockMaps = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_anomalies_det/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const anomalyMaps = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_anomaly_det_count_geo/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const densityMaps = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_canopy_density/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export {
  apiMaps,
  getVariety,
  getMaps,
  blockShape,
  countGeo,
  volumetryMaps,
  onGroundMaps,
  missingTreeMaps,
  replantedTreeMaps,
  dryTreeMaps,
  anomalyByIdAndBlockMaps,
  anomalyMaps,
  densityMaps,
  getImage,
  getPreviousHDImage,
  getNextHDImage,
  getLowResImage,
};
