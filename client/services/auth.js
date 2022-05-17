// Other Dependencies
import axios from 'axios';
import Cookies from 'js-cookie';

// Custom
// Services
import getAuthHeader from './auth-header';


const API_BASE_URL = '/api/auth/';

// POST
// (Public)
export const signup = async ({ data, onSuccess, onError }) => {
  try {
    const res = await axios.post(API_BASE_URL + 'signup', data);
    Cookies.set("accessToken", res.data.accessToken, {
      path: "/",
      expires: 1 / 24, // Expires after 1hr
      sameSite: 'strict',
    });
    Cookies.set("refreshToken", res.data.refreshToken, {
      path: "/",
      expires: 7, // Expires after 7d
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
// (Public)
export const signin = async ({ data, onSuccess, onError }) => {
  try {
    const res = await axios.post(API_BASE_URL + 'signin', data);
    Cookies.set("accessToken", res.data.accessToken, {
      path: "/",
      expires: 1 / 24, // Expires after 1hr
      sameSite: 'strict',
    });
    Cookies.set("refreshToken", res.data.refreshToken, {
      path: "/",
      expires: 7, // Expires after 7d
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
// (Auth)
export const signout = async ({ onSuccess }) => {
  const authHeader = getAuthHeader('accessToken');
  if (!!authHeader) {
    try {
      const res = await axios.post(API_BASE_URL + 'signout', {}, { headers: authHeader });
      if (res.status === 201) {
        Cookies.remove('accessToken', {
          path: "/"
        });
        Cookies.remove('refreshToken', {
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
// (Auth)
export const refreshAccessToken = async () => {
  const authHeader = getAuthHeader('refreshToken');
  if (!!authHeader) {
    try {
      const res = await axios.post(API_BASE_URL + 'refresh-access-token', {}, { headers: authHeader });
      Cookies.set("accessToken", res.data.accessToken, {
        path: "/",
        expires: 1 / 24, // Expires after 1hr
        sameSite: 'strict',
      });
    } catch (err) {
      console.log(err);
    }
  }
};
// (Public)
export const verifyToken = async (token) => {
  try {
    return await axios.post(API_BASE_URL + 'verify-token/' + token, {});
  } catch (err) {
    if (err.response) {
      return err.response;
    } else {
      console.log(err);
    }
  }
};

// GET (Auth)
export const getCurrentUser = async () => {
  const authHeader = getAuthHeader('accessToken');
  if (!!authHeader) {
    try {
      const res = await axios.get(API_BASE_URL + 'current-user', { headers: authHeader });
      const user = res.data;
      return user;
    }
    catch (err) {
      console.log(err);
    }
  }
};