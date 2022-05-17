// Other Dependencies
import axios from 'axios';

// Custom
// Services
import getAuthHeader from './auth-header';


const API_BASE_URL = '/api/orders/';

// POST (User)
export const createOrder = async ({ data, onSuccess, onError }) => {
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            const res = await axios.post(API_BASE_URL, data, { headers: authHeader });
            if (onSuccess) {
                onSuccess(res.data);
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

// GET
// (Admin)
export const getAllOrders = async () => {
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            const res = await axios.get(API_BASE_URL, { headers: authHeader });
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }
};
// (Admin)
export const getOrderById = async (id) => {
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            const res = await axios.get(API_BASE_URL + id, { headers: authHeader });
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }
};
// (User)
export const getMyOrders = async () => {
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            const res = await axios.get(API_BASE_URL + "my", { headers: authHeader });
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }
};
// (User)
export const getMyOrderById = async (id) => {
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            const res = await axios.get(API_BASE_URL + "my/" + id, { headers: authHeader });
            return res.data;
        } catch (err) {
            console.log(err);
        }
    }
};

// PATCH (Admin)
export const updateOrder = async ({ id, data, onSuccess }) => {
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            const res = await axios.patch(API_BASE_URL + id, data, { headers: authHeader });
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.log(err);
        }
    }
};

// // DELETE (Admin)
// export const deleteOrder = () => {

// };