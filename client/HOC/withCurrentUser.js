// ReactJS
import { useEffect, useState } from "react";

// Material UI
// Components
import Typography from '@mui/material/Typography';

// Custom
// Services
import { getCurrentUser } from "../services/auth";


const withCurrentUser = (WrappedComponent) => {
    return (props) => {
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);
        const [currentUser, setCurrentUser] = useState();

        useEffect(() => {
            setIsLoading(true);
            getCurrentUser()
                .then((currentUser) => setCurrentUser(currentUser || null))
                .catch((err) => setHasError(true))
                .finally(() => setIsLoading(false));
            return () => setCurrentUser();
        }, []);

        if (hasError) {
            return <Typography variant="body2" color="error">Something went wrong</Typography>;
        }
        if (isLoading) {
            return <Typography variant="body2" color="text.secondary">Loading...</Typography>;
        }
        return <WrappedComponent currentUser={currentUser} {...props} />;
    };
};

export default withCurrentUser;