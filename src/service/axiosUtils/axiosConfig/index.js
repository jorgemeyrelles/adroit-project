import axios from 'axios';
import { showVersion } from '../../../utils/format';

const { REACT_APP_API, REACT_APP_API_TEST } = process.env;

let BASE_URL = REACT_APP_API_TEST;

if (showVersion() === 'test' || showVersion() === 'development') {
  // development URL
  BASE_URL = REACT_APP_API_TEST;
} else {
  // production URL
  BASE_URL = REACT_APP_API;
}

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
});
