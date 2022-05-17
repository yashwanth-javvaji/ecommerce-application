// Other Dependencies
import axios from 'axios';
import { getCurrentUser } from './auth';

// Custom
// Services
import getAuthHeader from './auth-header';


const API_BASE_URL = '/api/users/';

// POST (User)
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const authHeader = getAuthHeader('accessToken');
  if (!!authHeader) {
    try {
      const user = await getCurrentUser();
      await axios.post(API_BASE_URL + user.id + '/upload-profile-image', formData, { headers: authHeader, "Content-Type": "multipart/form-data" });
    }
    catch (err) {
      console.log(err);
    }
  }
};

// GET (Public)
export const getProfileImage = async (filename) => {
  if (!!filename) {
    try {
      const res = await axios.get(API_BASE_URL + 'profile-images/' + filename, { responseType: 'blob' });
      return URL.createObjectURL(res.data);
    }
    catch (err) {
      console.log(err);
    }
  }
};

// PATCH (Auth)
export const updateProfile = async ({ data, onSuccess, onError }) => {
  const authHeader = getAuthHeader('accessToken');
  if (!!authHeader) {
    try {
      const user = await getCurrentUser();
      await axios.patch(API_BASE_URL + user.id, data, { headers: authHeader });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err.response && onError) {
        onError(err.response.data.message);
      }
    }
  }
};