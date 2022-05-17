// ReactJS
import { useEffect, useState } from 'react';

// NextJS
import Head from 'next/head';
import Router from 'next/router';

// Material UI
// Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// Other Dependencies
import { useCart } from "react-use-cart";

// Custom
// HOC
import isAuthenticated from '../HOC/isAuthenticated';
// Services
import { createOrder } from '../services/orders';
// Utils
import { checkIsEmpty } from '../utils/error-handling/validation';
import { numberToCurrency } from '../utils/products/formatter';


const steps = ['Details', 'Review'];

const Checkout = () => {
    const { items } = useCart();

    const total = items.reduce((accumulator, item) => {
        const { itemTotal, discount } = item;
        return accumulator + (itemTotal * (1 - (discount / 100)));
    }, 0);

    const [shippingAddress, setShippingAddress] = useState({
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    });
    const [errors, setErrors] = useState({});

    const [order, setOrder] = useState();

    const [activeStep, setActiveStep] = useState(0);
    const handleNext = async () => {
        switch (activeStep) {
            case 0:
                const isError = validate();
                if (isError) {
                    return;
                } else {
                    setActiveStep(activeStep + 1);
                }
                break;
            case 1:
                await createOrder({
                    data: {
                        items,
                        shippingAddress,
                        total
                    },
                    onSuccess: async (order) => {
                        setOrder(order);
                    }
                });
                break;
        }
    };
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const validate = (target) => {
        let isError = false;
        const attributes = target ? [target.name] : Object.keys(shippingAddress);
        // address1
        if (attributes.includes("address1")) {
            const value = target ? target.value : shippingAddress.address1;
            isError |= checkIsEmpty(value, "address1", errors, setErrors);
        }
        // city
        if (attributes.includes("city")) {
            const value = target ? target.value : shippingAddress.city;
            isError |= checkIsEmpty(value, "city", errors, setErrors);
        }
        // state
        if (attributes.includes("state")) {
            const value = target ? target.value : shippingAddress.state;
            isError |= checkIsEmpty(value, "state", errors, setErrors);
        }
        // zip
        if (attributes.includes("zip")) {
            const value = target ? target.value : shippingAddress.zip;
            isError |= checkIsEmpty(value, "zip", errors, setErrors);
        }
        // country
        if (attributes.includes("country")) {
            const value = target ? target.value : shippingAddress.country;
            isError |= checkIsEmpty(value, "country", errors, setErrors);
        }
        return isError;
    };

    const handleBlur = (event) => {
        validate(event.target);
    };

    const handleChange = (event) => {
        setShippingAddress({
            ...shippingAddress,
            [event.target.name]: event.target.value
        });
        validate(event.target);
    };

    useEffect(() => {
        if (!!order) {
            Router.push(`/orders/${order.id}`);
        }
    }, [order]);

    if ((!order) && (items.length === 0)) {
        return (
            <Typography variant="body2" color="text.secondary">
                Your cart is empty. Please add items to your cart to checkout.
            </Typography>
        );
    }
    return (
        <>
            <Head>
                <title>SKY | Checkout</title>
            </Head>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        {(activeStep === 0) && (
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Shipping Address
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        size="small"
                                        error={!!errors.address1}
                                        required
                                        fullWidth
                                        id="address1"
                                        label="Address Line 1"
                                        name="address1"
                                        value={shippingAddress.address1}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        autoComplete="shipping address-line1"
                                        helperText={errors.address1}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        id="address2"
                                        label="Address Line 2"
                                        name="address2"
                                        value={shippingAddress.address2}
                                        onChange={handleChange}
                                        autoComplete="shipping address-line2"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        error={!!errors.city}
                                        required
                                        fullWidth
                                        id="city"
                                        label="City"
                                        name="city"
                                        value={shippingAddress.city}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        autoComplete="shipping address-level2"
                                        helperText={errors.city}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        error={!!errors.state}
                                        required
                                        fullWidth
                                        id="state"
                                        label="State / Province / Region"
                                        name="state"
                                        value={shippingAddress.state}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        helperText={errors.state}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        error={!!errors.zip}
                                        required
                                        fullWidth
                                        id="zip"
                                        label="Zip / Postal code"
                                        name="zip"
                                        value={shippingAddress.zip}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        autoComplete="shipping postal-code"
                                        helperText={errors.zip}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        error={!!errors.country}
                                        required
                                        fullWidth
                                        id="country"
                                        label="Country"
                                        name="country"
                                        value={shippingAddress.country}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        autoComplete="shipping country"
                                        helperText={errors.country}
                                    />
                                </Grid>
                            </Grid>
                        )}
                        {(activeStep === 1) && (
                            <Grid container spacing={5}>
                                <Grid item xs={12} container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Order Summary
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {items.map((item) => {
                                            const { id, name, quantity, itemTotal, discount } = item;

                                            return (
                                                <Box key={id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body1">
                                                        <strong>{quantity}</strong> &times; {name}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {numberToCurrency(itemTotal * (1 - (discount / 100)), 'en-IN', 'INR')}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body1">
                                                Total
                                            </Typography>
                                            <Typography variant="body1">
                                                {numberToCurrency(total, 'en-IN', 'INR')}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Shipping Address
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>
                                            {Object.values(shippingAddress).filter((element) => element).join(", ")}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                    Back
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ mt: 3, ml: 1 }}
                            >
                                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default isAuthenticated(Checkout);