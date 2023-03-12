import axios from 'axios';
import { showVersion } from '../utils/format';
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

const apiReports = {
  postSaveReport: async (object, signal) => {
    const saved = await axiosInstance.request({
      method: 'POST',
      url: 'adroit/v3/save_report',
      data: object,
      signal,
    });
    return saved.data;
  },
  getAllReports: async (signal) => {
    const all = await axiosInstance.request({
      method: 'GET',
      url: 'adroit/v3/get_all_reports',
      signal,
    });
    return all.data;
  },
  putUpdateOneReport: async (id, update, signal) => {
    const updated = await axiosInstance.request({
      method: 'PUT',
      url: `adroit/v3/update_report/${id}`,
      data: update,
      signal,
    });
    return updated.data;
  },
  deleteOneReport: async (id, signal) => {
    const deleted = await axiosInstance.request({
      method: 'DELETE',
      url: `adroit/v3/delete_report/${id}`,
      signal,
    });
    return deleted.data;
  },
  getOneReport: async (id, signal) => {
    const one = await axiosInstance.request({
      method: 'GET',
      url: `adroit/v3/get_report/${id}`,
      signal,
    });
    return one.data;
  },
};

const saveReport = async (token, object) => {
  // console.log(REACT_APP_API, object, token);
  const reportSaved = await axios.post(
    `${BASE_URL}adroit/v3/save_report`,
    object,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  // console.log(reportSaved.data);
  return reportSaved.data;
};

const allReports = async (token, signal) => {
  // console.log(REACT_APP_API);
  const all = await axios.get(
    `${BASE_URL}adroit/v3/get_all_reports`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    },
  );
  return all.data;
};

const updateOneReport = async (token, id, update) => {
  // console.log(`${REACT_APP_API}adroit/v3/update_report/${id}`, id, update, token);
  const repUpdated = await axios.put(
    `${BASE_URL}adroit/v3/update_report/${id}`,
    update,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  // console.log(repUpdated);
  return repUpdated.data;
};

const deleteOne = async (token, id) => {
  const deleted = await axios.delete(
    `${BASE_URL}adroit/v3/delete_report/${id}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  // console.log(RepUpdated.data);
  return deleted.data;
};

const getOne = async (token, id) => {
  // console.log(REACT_APP_API);
  const one = await axios.get(
    `${BASE_URL}adroit/v3/get_report/${id}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  // console.log(RepUpdated.data);
  return one.data;
};

export {
  apiReports,
  saveReport,
  allReports,
  updateOneReport,
  deleteOne,
  getOne,
};
