// Other Dependencies
import axios from 'axios';

// Custom
// Services
import getAuthHeader from './auth-header';


const API_BASE_URL = '/api/categories/';

// POST (Admin)
export const createCategory = async ({ data, onSuccess, onError }) => {
  const authHeader = getAuthHeader('accessToken');
  if (!!authHeader) {
    try {
      const res = await axios.post(API_BASE_URL, data, { headers: authHeader });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err.response && onError) {
        onError(err.response.data.message);
      } else {
        console.log(err);
      }
    }
  }
};

// GET (Public)
export const getAllCategories = async () => {
  try {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getCategoryById = async (id) => {
  try {
    const res = await axios.get(API_BASE_URL + id);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
export const getCategoryByName = async (name) => {
  try {
    const res = await axios.get(API_BASE_URL + `name/${name}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// PATCH (Admin)
export const updateCategory = async ({ id, data, onSuccess, onError }) => {
  const authHeader = getAuthHeader('accessToken');
  if (!!authHeader) {
    try {
      const res = await axios.patch(API_BASE_URL + id, data, { headers: authHeader });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err.response && onError) {
        onError(err.response.data.message);
      } else {
        console.log(err);
      }
    }
  }
};

// DELETE (Admin)
export const deleteCategory = async (id) => {
  const authHeader = getAuthHeader('accessToken');
  if (!!authHeader) {
    try {
      const res = await axios.delete(API_BASE_URL + id, { headers: authHeader});
    } catch (err) {
      console.log(err);
    }
  }
};