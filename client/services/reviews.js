// Other Dependencies
import axios from 'axios';

// Custom
// Services
import getAuthHeader from './auth-header';


const API_BASE_URL = '/api/reviews/';

// POST (User)
export const createReview = async ({ data, onSuccess, onError }) => {
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

// GET (Public)
export const getAllReviews = async () => {
    try {
        const res = await axios.get(API_BASE_URL);
        const reviews = res.data;
        return reviews;
    } catch (err) {
        console.log(err);
    }
};
export const getReviewById = async (id) => {
    try {
        const res = await axios.get(API_BASE_URL + id);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

// // PATCH (User)
// export const updateReview = () => {

// };

// // DELETE (User)
// export const deleteReview = () => {

// };