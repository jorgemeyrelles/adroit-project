/* eslint-disable quote-props */
/* eslint-disable camelcase */
import axios from 'axios';

const generateCustomUrl = async () => {
  const { data: { url } } = await axios.post(
    'https://cfv-oauth2-helper.withleaf.io/url',
    {
      client_id: process.env.REACT_APP_CLIMATE_FIELDVIEW_CLIENT_ID,
      scope: [
        // 'asApplied:read',
        // 'asHarvested:read',
        // 'asPlanted:read',
        // 'farmOrganizations:read',
        // 'resourceOwners:read',
        // 'imagery:write',
        // 'fields:write',
        'fields:read',
      ],
      redirect_uri: 'https://adroitfrontend.netlify.app/dashboard',
    },
  );
  return url;
};

const getUserToken = async (pathCode, encoded) => {
  const redirect = 'https://adroitfrontend.netlify.app/dashboard';
  const data = await axios.post(
    'https://api.climate.com/api/oauth/token',
    `code=${pathCode}&redirect_uri=${redirect}&grant_type=authorization_code`,
    {
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    },
  );

  return data;
};

const leafUserAuthentication = async (username, password) => {
  const response = await axios.post(
    'https://api.withleaf.io/api/authenticate',
    {
      username,
      password,
      rememberMe: true,
    },
  );

  return response;
};

const addFieldViewCredentialsToLeaf = async (leafToken, refreshToken) => {
  const leafUserId = process.env.REACT_APP_LEAF_USER_ID;
  const clientId = process.env.REACT_APP_CLIMATE_FIELDVIEW_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const apiKey = process.env.REACT_APP_CLIENT_API_KEY;

  const data = await axios.post(
    `https://api.withleaf.io/services/usermanagement/api/users/${leafUserId}/climate-field-view-credentials`,
    {
      clientId,
      clientSecret,
      apiKey,
      refreshToken,
    },
    {
      headers: {
        Authorization: `Bearer ${leafToken}`,
      },
    },
  );

  return data;
};

const getAllFields = async (leafToken) => {
  const leaf_api_url = 'api.withleaf.io';
  const leafUserId = process.env.REACT_APP_LEAF_USER_ID;
  const data = await axios.get(
    `https://${leaf_api_url}/services/fields/api/fields?leafUserId=${leafUserId}`,
    {
      headers: {
        Authorization: `Bearer ${leafToken}`,
      },
    },
  );
  return data;
};

const getAllOperationsFiles = async (leafToken) => {
  const leaf_api_url = 'api.withleaf.io';
  const data = await axios.get(
    `https://${leaf_api_url}/services/operations/api/files`,
    {
      headers: {
        Authorization: `Bearer ${leafToken}`,
      },
    },
  );
  return data;
};

export {
  addFieldViewCredentialsToLeaf,
  leafUserAuthentication,
  generateCustomUrl,
  getUserToken,
  getAllFields,
  getAllOperationsFiles,
};
