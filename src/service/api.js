/* eslint-disable camelcase */
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

const api = {
  postLogin: async (input, signal) => {
    try {
      const { data } = await (
        axiosInstance.request({
          method: 'POST',
          url: 'login',
          data: input,
          cancelToken: signal.token,
        })
      );

      return data.access_token;
    } catch (error) {
      if (axios.isCancel(error)) {
        return 'axios request cancelled';
      }
      return error;
    }
  },
  getClients: async (signal) => {
    try {
      const clients = await axiosInstance.request({
        method: 'GET',
        url: 'adroit/v2/get_farms_by_client/',
        cancelToken: signal.token,
      });
      return clients.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return 'axios request cancelled';
      }
      return error;
    }
  },
  getBlocksByFarmId: async (id, signal) => {
    const blocks = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v3/get_blockdates_by_farm/?farm_id=${id}`,
      cancelToken: signal.token,
    });
    return blocks.data;
  },
  getFarmById: async (id, signal) => {
    try {
      const farm = await axiosInstance.request({
        method: 'GET',
        url: `adroit/v2/get_block_info_by_farm/?farm_id=${id}`,
        cancelToken: signal.token,
      });
      return farm.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return 'axios request cancelled';
      }
      return error;
    }
  },
  getFruitCount: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const fruit = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_fruitsize_histogram_by_date_farm_block/${URL}`,
      signal,
    });
    return fruit.data;
  },
  getRipeningsCount: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const ripenings = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_count_by_class/${URL}`,
      signal,
    });
    return ripenings.data;
  },
  getTreeHeighCount: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const treeHeighCount = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_tree_height_by_date_block/${URL}`,
      signal,
    });
    return treeHeighCount.data;
  },
  getFruitsOnGround: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const fruitsOnGround = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_images_detections_on_ground_sum_by_date/${URL}`,
      signal,
    });
    return fruitsOnGround.data;
  },
  getMissingTree: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const missingTree = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v2/get_missing_trees_by_lane_new/${URL}`,
      signal,
    });
    return missingTree.data;
  },
  getTreeInventory: async (period, block, signal) => {
    const URL = `?initial_date=${period[0]}&final_date=${formatEndDate(period[1])}&block_id=${block}`;
    const treeInventory = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v3/get_graph_treeinventory/${URL}&by_lines=False`,
      signal,
    });
    return treeInventory.data;
  },
};

const login = async (loginFromInput) => {
  const { data } = await axios.post(
    `${BASE_URL}login`,
    loginFromInput,
  );
  return data.access_token;
};

const clients = async (token) => {
  const clientsData = await axios.get(
    `${BASE_URL}adroit/v2/get_farms_by_client/`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return clientsData.data;
};

const farmById = async (token, id, signal) => {
  const farm = await axios.get(
    `${BASE_URL}adroit/v2/get_block_info_by_farm/?farm_id=${id}`,
    { headers: { Authorization: `Bearer ${token}` } },
    signal,
  );
  return farm.data;
};

const fruitCount = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_fruitsize_histogram_by_date_farm_block/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const ripeningsCount = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_count_by_class/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const treeHeighCount = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_tree_height_by_date_block/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const fruitsOnGround = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_images_detections_on_ground_sum_by_date/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const missingTree = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_missing_trees_by_lane_new/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const detFlower = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_flowers_count/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const anomalies = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_anomalies_det/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const volumetries = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v2/get_volumetry_by_lane/${url}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

const treeInventory = async (token, period, block) => {
  const url = `?initial_date=${period[0]}&final_date=${(period[2])}&block_id=${block}`;
  const response = await axios.get(
    `${BASE_URL}adroit/v3/get_graph_treeinventory/${url}&by_lines=True`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export {
  api,
  login,
  clients,
  farmById,
  fruitCount,
  ripeningsCount,
  treeHeighCount,
  fruitsOnGround,
  missingTree,
  detFlower,
  anomalies,
  volumetries,
  treeInventory,
};
