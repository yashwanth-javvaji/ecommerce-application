// ReactJS
import { useEffect, useState } from "react";

// NextJS
import Router from "next/router";

// Material UI
// Components
import Typography from '@mui/material/Typography';

// Other Dependencies
import Cookies from 'js-cookie';

// Custom
// Services
import { getCurrentUser } from "../services/auth";
// Utils
import { verifyTokens } from '../utils/auth/verify-tokens';


const isAdmin = (WrappedComponent) => {
    return (props) => {
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);
        const [verified, setVerified] = useState(false);

        useEffect(() => {
            setIsLoading(true);
            verifyTokens()
                .then((isValid) => {
                    if (isValid) {
                        return getCurrentUser();
                    } else {
                        Cookies.remove('accessToken', {
                            path: "/"
                        });
                        Cookies.remove('refreshToken', {
                            path: "/"
                        });
                        Router.replace("/auth/signin");
                    }
                })
                .then((user) => {
                    if (!!user && user.roles.includes("admin")) {
                        setVerified(true);
                    }
                })
                .catch((err) => setHasError(true))
                .finally(() => setIsLoading(false));
        }, []);

        if (hasError) {
            return <Typography variant="body2" color="error">Something went wrong</Typography>;
        }
        if (isLoading) {
            return <Typography variant="body2" color="text.secondary">Loading...</Typography>;
        }
        if (verified) {
            return <WrappedComponent {...props} />;
        }
        return <Typography variant="body2" color="text.secondary">You are not authorized to view this page</Typography>;
    };
};

export default isAdmin;