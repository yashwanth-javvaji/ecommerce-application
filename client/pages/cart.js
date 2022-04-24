// NextJS
import Head from 'next/head';

// Material UI
// Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Other Dependencies
import { useCart } from "react-use-cart";

// Custom
// Components
import Item from "../components/cart/Item";
// Utils
import { numberToCurrency } from "../utils/products/formatter";


const Cart = () => {
    const { items } = useCart();
    const total = items.reduce((accumulator, item) => {
        const { itemTotal, discount } = item;
        return accumulator + (itemTotal * (1 - (discount / 100)));
    }, 0);

    return (
        <>
            <Head>
                <title>SKY | Cart</title>
            </Head>
            <Grid container spacing={3}>
                <Grid item xs={8} container spacing={3}>
                    {items.map((item) => (
                        <Grid key={item.id} item xs={12}>
                            <Item item={item} />
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Summary
                        </Typography>
                        {items.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                Cart is empty
                            </Typography>
                        ) : (
                            items.map((item) => {
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
                            })
                        )}
                        {(items.length !== 0) && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body1">
                                        Total
                                    </Typography>
                                    <Typography variant="body1">
                                        {numberToCurrency(total, 'en-IN', 'INR')}
                                    </Typography>
                                </Box>
                                <Button variant="contained" fullWidth href="/checkout">
                                    Checkout
                                </Button>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default Cart;