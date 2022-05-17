// ReactJS
import { useEffect, useState } from "react";

// NextJS
import Head from 'next/head';
import Link from "next/link";
import Router from 'next/router';

// Material UI
// Components
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// Data Grid
import { DataGrid } from '@mui/x-data-grid';
// Icons
import CategoryIcon from '@mui/icons-material/Category';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Custom
// Components
import ComponentHeader from "../../../components/ComponentHeader";
// HOCs
import isAdmin from "../../../HOC/isAdmin";
// Services
import { deleteCategory, getAllCategories } from '../../../services/categories';


const columns = [
    { field: 'name', headerName: 'Name', hideable: false, flex: 1 },
    {
        field: "action",
        headerName: "",
        width: 120,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
            <>
                <Link href={`/admin/categories/${params.id}`}>
                    <IconButton color="primary">
                        <EditIcon />
                    </IconButton>
                </Link>
                <IconButton color="error" onClick={async () => {
                    await deleteCategory(params.id);
                    Router.reload();
                }}>
                    <DeleteIcon />
                </IconButton>
            </>
        )
    }
];

const CategoriesDashboard = () => {
    const [pageSize, setPageSize] = useState(5);

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        getAllCategories()
            .then((categories) => setCategories(categories))
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
                <title>SKY | Admin - Categories</title>
            </Head>
            <Grid container spacing={2}>
                <ComponentHeader
                    icon={CategoryIcon}
                    title="Categories"
                    href="/admin/categories/add"
                    linkText="Add Category"
                />
                <Grid item xs={12}>
                    <DataGrid
                        rows={categories}
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

export default isAdmin(CategoriesDashboard);