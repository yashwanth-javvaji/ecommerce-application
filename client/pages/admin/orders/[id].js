// ReactJS
import { useEffect, useState } from "react";

// NextJS
import { useRouter } from 'next/router';
import Head from 'next/head';

// Material UI
// Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from "@mui/material/Grid";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
// Icons
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Other Dependencies
import moment from 'moment';

// Custom
// Components
import ComponentHeader from "../../../components/ComponentHeader";
import Item from "../../../components/orders/Item";
// HOCs
import isAdmin from "../../../HOC/isAdmin";
// Services
import { getOrderById, updateOrder } from "../../../services/orders";
// Utils
import { numberToCurrency } from "../../../utils/products/formatter";


const Order = () => {
    const router = useRouter();
    const { id } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [order, setOrder] = useState();
    const [formData, setFormData] = useState({
        orderStatus: "",
        deliveryStatus: ""
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await updateOrder({
            id,
            data: formData,
            onSuccess: () => router.reload()
        });
    };

    useEffect(() => {
        if (id) {
            getOrderById(id)
                .then((order) => {
                    setOrder(order);
                    setFormData({
                        orderStatus: order.orderStatus,
                        deliveryStatus: order.deliveryStatus
                    });
                })
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

    const { orderStatus, deliveryStatus } = formData;
    const { paymentStatus, createdAt, deliveredOn, items, total, shippingAddress } = order;

    return (
        <>
            <Head>
                <title>SKY | Admin - Edit Order</title>
            </Head>
            <Box component="form" id="updateOrderForm" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <ComponentHeader
                        icon={ShoppingBagIcon}
                        title="Order Details"
                        href="/admin/orders"
                        linkText="Bact to Orders List"
                    />
                    <Grid item xs={4}>
                        <Card>
                            <CardHeader
                                title="Order Status"
                                subheader={
                                    <Select
                                        size="small"
                                        name="orderStatus"
                                        value={orderStatus}
                                        onChange={handleChange}
                                    >
                                        {["open", "confirmed", "complete", "canceled"].map((orderStatus, index) => <MenuItem key={index} value={orderStatus}>{orderStatus}</MenuItem>)}
                                    </Select>
                                }
                                sx={{ textAlign: 'center' }}
                            />
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card>
                            <CardHeader title="Payment Status" subheader={paymentStatus} sx={{ textAlign: 'center' }} />
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card>
                            <CardHeader
                                title="Delivery Status"
                                subheader={
                                    <Select
                                        size="small"
                                        name="deliveryStatus"
                                        value={deliveryStatus}
                                        onChange={handleChange}
                                    >
                                        {["queue", "shipping", "shipped", "delivered"].map((deliveryStatus, index) => <MenuItem key={index} value={deliveryStatus}>{deliveryStatus}</MenuItem>)}
                                    </Select>
                                }
                                sx={{ textAlign: 'center' }}
                            />
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
                    <Grid item xs={12} mt={2}>
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Save Changes
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default isAdmin(Order);