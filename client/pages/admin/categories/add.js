// ReactJS
import { useState } from "react";

// NextJS
import Head from 'next/head';
import Router from 'next/router';

// Material UI
// Components
import Alert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
// Icons
import CategoryIcon from '@mui/icons-material/Category';

// Custom
// Components
import ComponentHeader from "../../../components/ComponentHeader";
// HOCs
import isAdmin from "../../../HOC/isAdmin";
// Services
import { createCategory } from "../../../services/categories";
// Utils
import { checkIsEmpty, checkLength } from "../../../utils/error-handling/validation";
import { formatErrorMessage } from '../../../utils/error-handling/format-error-message';


const AddCategory = () => {
    const [formData, setFormData] = useState({
        name: ""
    });
    const [errors, setErrors] = useState({});

    const validate = (target) => {
        let isError = false;
        const attributes = target ? [target.name] : Object.keys(formData);
        // name
        if (attributes.includes("name")) {
            const value = target ? target.value : formData.name;
            isError |= checkIsEmpty(value, "name", errors, setErrors) || checkLength(value, { min: 3 }, "name", errors, setErrors);
        }
        return isError;
    };

    const handleBlur = (event) => {
        validate(event.target);
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
        validate(event.target);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isError = validate();
        if (!isError) {
            await createCategory({
                data: formData,
                onSuccess: () => Router.push('/admin/categories'),
                onError: (errors) => setErrors(formatErrorMessage(errors))
            });
        }
    };

    return (
        <>
            <Head>
                <title>SKY | Admin - Add Category</title>
            </Head>
            <Grid container spacing={2}>
                <ComponentHeader
                    icon={CategoryIcon}
                    title="Add Category"
                    href="/admin/categories"
                    linkText="Back to Categories List"
                />
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box component="form" id="addCategoryForm" noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {(!!errors.message) && (
                                    <Grid item xs={12}>
                                        <Alert severity="error">{errors.message}</Alert>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <TextField
                                        size="small"
                                        error={!!errors.name}
                                        required
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        name="name"
                                        value={formData.name}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        helperText={errors.name}
                                    />
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                    >
                                        Add Category
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default isAdmin(AddCategory);