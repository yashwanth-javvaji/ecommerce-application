// Other Dependencies
import axios from 'axios';
import Cookies from 'js-cookie';

// Custom
import getAuthHeader from './auth-header';


const API_BASE_URL = '/api/auth/';

export const signup = async ({ data, onSuccess, onError }) => {
  try {
    const res = await axios.post(API_BASE_URL + 'signup', data);
    Cookies.set("tokens", JSON.stringify(res.data), {
      path: "/",
      expires: 1 / 24, // Expires after 1hr
      sameSite: 'strict',
    });
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    if (err.response && onError) {
      onError(err.response.data.message);
    }
  }
};

export const signin = async ({ data, onSuccess, onError }) => {
  try {
    const res = await axios.post(API_BASE_URL + 'signin', data);
    Cookies.set("tokens", JSON.stringify(res.data), {
      path: "/",
      expires: 1 / 24, // Expires after 1hr
      sameSite: 'strict',
    });
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    if (err.response && onError) {
      onError(err.response.data.message);
    }
  }
};

export const getCurrentUser = async () => {
  const authHeader = getAuthHeader('accessToken');
  if (!!authHeader) {
    try {
      const res = await axios.get(API_BASE_URL + 'current-user', { headers: authHeader });
      return res.data;
    }
    catch (err) {
      console.log(err);
    }
  }
};

export const signout = async ({ onSuccess }) => {
  const authHeader = getAuthHeader('accessToken');
  if (!!authHeader) {
    try {
      const res = await axios.post(API_BASE_URL + 'signout', {}, { headers: authHeader });
      if (res.data.statusCode === 201) {
        Cookies.remove('tokens', {
          path: "/"
        });
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};