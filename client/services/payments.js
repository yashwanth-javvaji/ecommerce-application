// Other Dependencies
import axios from 'axios';

// Custom
// Services
import getAuthHeader from './auth-header';


const API_BASE_URL = '/api/payments/';

// POST (User)
export const createPayment = async ({ data, onSuccess }) => {
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            const res = await axios.post(API_BASE_URL, data, { headers: authHeader });
            if (onSuccess) {
                onSuccess(res.data);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
};

// GET
// (User)
export const status = async (orderId) => {
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            const res = await axios.get(API_BASE_URL + orderId + '/status', { headers: authHeader });
            return res.data;
        }
        catch (err) {
            console.log(err);
        }
    }
};
// (Admin)
export const getAllPayments = async () => {
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            const res = await axios.get(API_BASE_URL, { headers: authHeader });
            return res.data;
        }
        catch (err) {
            console.log(err);
        }
    }
};