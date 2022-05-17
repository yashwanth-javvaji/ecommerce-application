// Other Dependencies
import axios from 'axios';

// Custom
// Services
import getAuthHeader from './auth-header';


const API_BASE_URL = '/api/products/';

const calculateRating = (reviews) => {
    if (reviews.length === 0) {
        return 0;
    }
    return Math.round((reviews.reduce((accumulator, review) => accumulator + review.rating, 0) / reviews.length) * 100) / 100;
};

// POST (Admin)
export const createProduct = async ({ data, onSuccess, onError }) => {
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
export const uploadProductImage = async (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            await axios.post(API_BASE_URL + id + '/upload-product-image', formData, { headers: authHeader, "Content-Type": "multipart/form-data" });
        } catch (err) {
            console.log(err);
        }
    }
};

// GET (Public)
export const getAllProducts = async () => {
    try {
        const res = await axios.get(API_BASE_URL);
        const products = res.data;
        for (const product of products) {
            product.rating = calculateRating(product.reviews);
        }
        return products;
    } catch (err) {
        console.log(err);
    }
};
export const getProductById = async (id) => {
    try {
        const res = await axios.get(API_BASE_URL + id);
        const product = res.data;
        product.rating = calculateRating(product.reviews);
        return product;
    } catch (err) {
        console.log(err);
    }
};
export const getProductsByCategory = async (category) => {
    try {
        const res = await axios.get(API_BASE_URL + "category/" + category);
        const products = res.data;
        return products;
    } catch (err) {
        console.log(err);
    }
};
export const getProductImage = async (filename) => {
    try {
        const res = await axios.get(API_BASE_URL + 'product-images/' + filename, { responseType: 'blob' });
        return URL.createObjectURL(res.data);
    } catch (err) {
        console.log(err);
    }
};

// PATCH
// (Admin)
export const updateProduct = async ({ id, data, onSuccess, onError }) => {
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
// (User)
export const addReview = async ({ productId, reviewId, onSuccess }) => {
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            const res = await axios.patch(API_BASE_URL + productId + "/reviews", { reviewId }, { headers: authHeader });
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.log(err);
        }
    }
};

// DELETE (Admin)
export const deleteProduct = async (id) => {
    const authHeader = getAuthHeader('accessToken');
    if (!!authHeader) {
        try {
            const res = await axios.delete(API_BASE_URL + id, { headers: authHeader });
        } catch (err) {
            console.log(err);
        }
    }
};