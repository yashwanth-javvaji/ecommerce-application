// ReactJS
import { useEffect, useState } from "react";

// NextJS
import Head from 'next/head';
import Link from "next/link";

// Material UI
// Components
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// Data Grid
import { DataGrid } from '@mui/x-data-grid';
// Icons
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Other Dependencies
import moment from 'moment';

// Custom
// Components
import ComponentHeader from "../../../components/ComponentHeader";
// HOCs
import isAdmin from "../../../HOC/isAdmin";
// Services
import { getAllOrders } from "../../../services/orders";
// Utils
import { numberToCurrency } from "../../../utils/products/formatter";


const columns = [
    { field: 'id', headerName: 'ID', hideable: false, minWidth: 209, flex: 1 },
    { field: 'orderStatus', headerName: 'Order Status', flex: 1 },
    { field: 'paymentStatus', headerName: 'Payment Status', flex: 1 },
    { field: 'deliveryStatus', headerName: 'Delivery Status', flex: 1 },
    { field: 'createdAt', headerName: 'Date Purchased', flex: 1, valueGetter: (params) => moment(params.row.createdAt).format('MMMM Do, YYYY') },
    { field: 'total', headerName: 'Total', flex: 1, valueGetter: (params) => numberToCurrency(params.row.total, 'en-IN', 'INR') },
    {
        field: "action",
        headerName: "",
        width: 80,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <Link href={`/admin/orders/${params.id}`}>
                <IconButton color="primary">
                    <ArrowCircleRightIcon />
                </IconButton>
            </Link>
        )
    }
];

const OrdersDashboard = () => {
    const [pageSize, setPageSize] = useState(5);

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        getAllOrders()
            .then((orders) => setOrders(orders))
            .catch((err) => setHasError(true))
            .finally(() => setIsLoading(false));
        setIsLoading(false);
    }, []);

    if (hasError) {
        return <Typography variant="body2" color="error">Something went wrong</Typography>;
    }
    if (isLoading) {
        return <Typography variant="body2" color="text.secondary">Loading...</Typography>;
    }
    return (
        <>
            <Head>
                <title>SKY | Admin - Orders</title>
            </Head>
            <Grid container spacing={2}>
                <ComponentHeader
                    icon={ShoppingBagIcon}
                    title="Orders"
                />
                <Grid item xs={12}>
                    <DataGrid
                        rows={orders}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[5, 10, 20]}
                        autoHeight
                        disableSelectionOnClick
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default isAdmin(OrdersDashboard);