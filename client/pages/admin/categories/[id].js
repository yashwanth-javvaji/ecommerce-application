// React
import { useEffect, useState } from "react";

// Next
import { useRouter } from 'next/router';

// Material UI
// Components
import Alert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// Icons
import CategoryIcon from '@mui/icons-material/Category';

// Custom
// Components
import ComponentHeader from "../../../components/ComponentHeader";
// HOC
import isAdmin from "../../../HOC/isAdmin";
// Services
import { getCategoryById, updateCategory } from "../../../services/categories";
// Utils
import { checkIsEmpty } from "../../../utils/error-handling/validation";
import { formatErrorMessage } from '../../../utils/error-handling/format-error-message';


const EditCategory = () => {
    const router = useRouter();
    const { id } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
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
            isError |= checkIsEmpty(value, "name", errors, setErrors);
        }
        return isError;
    }

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

    const handleSubmit = (event) => {
        event.preventDefault();
        const isError = validate();
        if (!isError) {
            updateCategory({
                id,
                data: formData,
                onSuccess: () => router.push('/admin/categories'),
                onError: (errors) => setErrors(formatErrorMessage(errors))
            });
        }
    };

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            getCategoryById(id)
                .then((category) => setFormData({ ...formData, name: category.name }))
                .catch((err) => setHasError(true))
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    if (hasError) {
        return <p>Something went wrong</p>
    }
    if (isLoading) {
        return <p>Loading...</p>
    }
    if (!category) {
        return <Typography color="text.secondary">Category does not exist</Typography>
    }
    return (
        <Container>
            <Grid container spacing={3}>
                <ComponentHeader
                    icon={CategoryIcon}
                    title="Edit Category"
                    href="/admin/categories"
                    linkText="Back to Categories List"
                />
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box component="form" id="addCategoryForm" noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {!!errors.message && (
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
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default isAdmin(EditCategory);