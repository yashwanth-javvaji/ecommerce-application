// ReactJS
import { useEffect, useState } from "react";

// NextJS
import Router from "next/router";

// Material UI
// Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

// Custom
// HOCs
import isAuthenticated from "../../HOC/isAuthenticated";
// Services
import { createPayment } from "../../services/payments";


const Timer = ({ orderId, expiresAt }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        setTimeLeft(Math.round((new Date(expiresAt) - new Date()) / 1000));
        const timer = setInterval(() => setTimeLeft(Math.round((new Date(expiresAt) - new Date()) / 1000)), 1000)
        return () => {
            clearInterval(timer);
        }
    }, []);

    if (timeLeft < 0) {
        return <Typography variant="body2" color="error">Order Expired!</Typography>;
    }

    return (
        <Box sx={{ my: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Time left to pay:</Typography>
                &nbsp;
                <Typography variant="body1">{timeLeft} seconds</Typography>
            </Box>
            <LinearProgress variant="determinate" value={(1 - (timeLeft / 300)) * 100} sx={{ mb: 1 }} />
            <Button
                variant="contained"
                size="large"
                onClick={() => createPayment({
                    data: {
                        orderId
                    },
                    onSuccess: (stripeSession) => Router.push(stripeSession.url)
                })}
                sx={{ display: 'block', mx: 'auto' }}
            >
                Pay
            </Button>
        </Box >
    );
};

export default isAuthenticated(Timer);