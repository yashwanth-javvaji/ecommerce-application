// Other Dependencies
import Cookies from 'js-cookie';

// Custom
// Services
import { refreshAccessToken, verifyToken } from "../../services/auth";


const verify = async (token) => {
    if (!token) {
        return false;
    } else {
        // call to the api that verifies the token.
        const res = await verifyToken(token);
        return res.status === 201;
    };
};

export const verifyTokens = async () => {
    if (await verify(Cookies.get('accessToken'))) {
        return true;
    } else {
        const refreshToken = Cookies.get('refreshToken');
        if (await verify(refreshToken)) {
            // get new accessToken
            await refreshAccessToken(refreshToken);
            if (await verify(Cookies.get('accessToken'))) {
                return true;
            }
        }
    }
    return false;
};