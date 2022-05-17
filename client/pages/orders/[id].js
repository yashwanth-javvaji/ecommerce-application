// ReactJS
import { useEffect, useState } from "react";

// NextJS
import { useRouter } from 'next/router';
import Head from 'next/head';

// Material UI
// Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
// Icons
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Other Dependencies
import moment from 'moment';
import { useCart } from "react-use-cart";

// Custom
// Components
import ComponentHeader from "../../components/ComponentHeader";
import Item from "../../components/orders/Item";
import Timer from "../../components/payments/Timer";
// HOCs
import isAuthenticated from "../../HOC/isAuthenticated";
// Services
import { getMyOrderById } from "../../services/orders";
import { status } from "../../services/payments";
// Utils
import { numberToCurrency } from "../../utils/products/formatter";


const Order = () => {
    const router = useRouter();
    const { id } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    if (router.query.hasOwnProperty('success') || router.query.hasOwnProperty('canceled')) {
        const [paymentStatus, setPaymentStatus] = useState('');

        useEffect(() => {
            if (id) {
                setIsLoading(true);
                status(id)
                    .then((status) => setPaymentStatus(status))
                    .catch((err) => setHasError(true))
                    .finally(() => setIsLoading(false));
            }
        }, [id]);

        if (hasError) {
            return <Typography variant="body2" color="error">Something went wrong</Typography>;
        }
        if (isLoading) {
            return <Typography variant="body2" color="text.secondary">Loading...</Typography>;
        }
        
        if (paymentStatus === "Success") {
            const { emptyCart } = useCart();
            emptyCart();
            return <Typography variant="body2" color="success.main">Order placed!</Typography>;
        }

        if (paymentStatus === "Failed") {
            return <Typography variant="body2" color="error">Order canceled!</Typography>;
        }
    } else {
        const [order, setOrder] = useState();

        useEffect(() => {
            if (id) {
                setIsLoading(true);
                getMyOrderById(id)
                    .then((order) => setOrder(order))
                    .catch((err) => setHasError(true))
                    .finally(() => setIsLoading(false));
            }
        }, [id]);

        if (hasError) {
            return <Typography variant="body2" color="error">Something went wrong</Typography>;
        }
        if (isLoading) {
            return <Typography variant="body2" color="text.secondary">Loading...</Typography>;
        }
        if (!order) {
            return <Typography color="text.secondary">Order does not exist</Typography>
        }

        const { orderStatus, paymentStatus, deliveryStatus, createdAt, deliveredOn, items, total, shippingAddress, expiresAt } = order;
        const isAwaitingPayment = new Date(expiresAt) > new Date();

        if (paymentStatus === "unpaid" && isAwaitingPayment) {
            return (
                <Timer orderId={id} expiresAt={expiresAt} />
            );
        } else {
            return (
                <>
                    <Head>
                        <title>SKY | Order {id}</title>
                    </Head>
                    <Grid container spacing={2}>
                        <ComponentHeader
                            icon={ShoppingBagIcon}
                            title="Order Details"
                            href="/orders"
                            linkText="Bact to Orders List"
                        />
                        <Grid item xs={4}>
                            <Card>
                                <CardHeader title="Order Status" subheader={orderStatus} sx={{ textAlign: 'center' }} />
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card>
                                <CardHeader title="Payment Status" subheader={paymentStatus} sx={{ textAlign: 'center' }} />
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card>
                                <CardHeader title="Delivery Status" subheader={deliveryStatus} sx={{ textAlign: 'center' }} />
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ w: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.300' }}>
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                    <Typography color="text.secondary">
                                        Placed On:
                                    </Typography>
                                    &nbsp;
                                    <Typography>
                                        {moment(createdAt).format('MMMM Do, YYYY, hh:mm:ss a')}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                    <Typography color="text.secondary">
                                        Delivered On:
                                    </Typography>
                                    &nbsp;
                                    <Typography>
                                        {deliveredOn ? moment(deliveredOn).format('MMMM Do, YYYY, hh:mm:ss a') : "-"}
                                    </Typography>
                                </Box>
                            </Box>
                            <Table>
                                <TableBody>
                                    {items.map((item) => <Item key={item.id} item={item} />)}
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item xs={6}>
                            <Card>
                                <CardHeader title="Shipping Address" subheader={Object.values(shippingAddress).filter((element) => element).join(", ")} sx={{ textAlign: 'center' }} />
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card>
                                <CardHeader title="Total" subheader={numberToCurrency(total, 'en-IN', 'INR')} sx={{ textAlign: 'center' }} />
                            </Card>
                        </Grid>
                    </Grid>
                </>
            );
        }
    }
};


export default isAuthenticated(Order);