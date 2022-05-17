// ReactJS
import { useEffect, useState } from "react";

// NextJS
import Head from 'next/head';

// Material UI
// Components
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
// Data Grid
import { DataGrid } from '@mui/x-data-grid';
// Icons
import PaymentsIcon from '@mui/icons-material/Payments';

// Custom
// Components
import ComponentHeader from "../../../components/ComponentHeader";
// HOCs
import isAdmin from "../../../HOC/isAdmin";
// Services
import { getAllPayments } from '../../../services/payments';


const columns = [
    { field: 'id', headerName: 'Payment ID', hideable: false, flex: 1 },
    { field: 'userId', headerName: 'User ID', flex: 1 },
    { field: 'orderId', headerName: 'Order ID', flex: 1 },
    { field: 'checkoutSession', headerName: 'Checkout Session', flex: 1 },
    { field: 'paymentIntent', headerName: 'Payment Intent', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
];

const PaymentsDashboard = () => {
    const [pageSize, setPageSize] = useState(5);

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        getAllPayments()
            .then((payments) => setPayments(payments))
            .catch((err) => setHasError(true))
            .finally(() => setIsLoading(false));
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
                <title>SKY | Admin - Payments</title>
            </Head>
            <Grid container spacing={2}>
                <ComponentHeader
                    icon={PaymentsIcon}
                    title="Payments"
                />
                <Grid item xs={12}>
                    <DataGrid
                        rows={payments}
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

export default isAdmin(PaymentsDashboard);