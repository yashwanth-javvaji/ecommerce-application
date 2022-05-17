// ReactJS
import { useEffect, useState } from "react";

// NextJS
import Head from 'next/head';
import Image from 'next/image';
import Router from 'next/router';

// Material UI
// Components
import Alert from '@mui/material/Alert';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from "@mui/material/Grid";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from "@mui/material/Paper";
import Select from '@mui/material/Select';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
// Icons
import CreateIcon from '@mui/icons-material/Create';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// Custom
// Components
import ComponentHeader from "../../../components/ComponentHeader";
// HOCs
import isAdmin from "../../../HOC/isAdmin";
// Services
import { getAllCategories } from '../../../services/categories';
import { createProduct, uploadProductImage } from "../../../services/products";
// Utils
import { checkFloatRange, checkImage, checkIntRange, checkIsEmpty, checkLength } from "../../../utils/error-handling/validation";
import { formatErrorMessage } from '../../../utils/error-handling/format-error-message';


const AddProduct = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productImage, setProductImage] = useState();
    const [productImageUrl, setProductImageUrl] = useState();
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        brand: "",
        stock: "",
        price: "",
        discount: ""
    });
    const [errors, setErrors] = useState({});

    const validate = (target) => {
        let isError = false;
        const attributes = target ? [target.name] : [...Object.keys(formData), "productImage"];
        // name
        if (attributes.includes("name")) {
            const value = target ? target.value : formData.name;
            isError |= checkIsEmpty(value, "name", errors, setErrors) || checkLength(value, { min: 3 }, "name", errors, setErrors);
        }
        // category
        if (attributes.includes("category")) {
            const value = target ? target.value : formData.category;
            isError |= checkIsEmpty(value, "category", errors, setErrors);
        }
        // productImage
        if (attributes.includes("productImage")) {
            isError |= checkIsEmpty(productImageUrl || "", "productImage", errors, setErrors);
        }
        // description
        if (attributes.includes("description")) {
            const value = target ? target.value : formData.description;
            isError |= checkIsEmpty(value, "description", errors, setErrors) || checkLength(value, { min: 20 }, "description", errors, setErrors);
        }
        // brand
        if (attributes.includes("brand")) {
            const value = target ? target.value : formData.brand;
            isError |= checkIsEmpty(value, "brand", errors, setErrors) || checkLength(value, { min: 3 }, "brand", errors, setErrors);
        }
        // stock
        if (attributes.includes("stock")) {
            const value = target ? target.value : formData.stock;
            isError |= checkIntRange(value, { min: 0 }, "stock", errors, setErrors);
        }
        // price
        if (attributes.includes("price")) {
            const value = target ? target.value : formData.price;
            isError |= checkFloatRange(value, { min: 0 }, "price", errors, setErrors);
        }
        // discount
        if (attributes.includes("discount")) {
            const value = target ? target.value : formData.discount;
            isError |= checkIntRange(value, { min: 0, max: 100 }, "discount", errors, setErrors);
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

    const handleProductImageChange = (event) => {
        if (!checkImage(event.target.files[0], 5, { width: 300, height: 300 }, "productImage", errors, setErrors)) {
            delete errors.productImage;
            setErrors(errors);
            setProductImage(event.target.files[0]);
        } else {
            setProductImage(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isError = validate();
        if (!isError) {
            await createProduct({
                data: {
                    ...formData,
                    stock: Number(formData.stock),
                    price: Number(formData.price),
                    discount: Number(formData.discount)
                },
                onSuccess: (product) => {
                    uploadProductImage(product.id, event.target.productImage.files[0]);
                    Router.push("/admin/products");
                },
                onError: (errors) => {
                    setErrors(formatErrorMessage(errors))
                }
            });
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getAllCategories()
            .then((categories) => setCategories(categories))
            .catch((err) => setHasError(true))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (!productImage) {
            setProductImageUrl(null);
            return;
        }
        const productImageUrl = URL.createObjectURL(productImage)
        setProductImageUrl(productImageUrl)
        return () => URL.revokeObjectURL(productImageUrl)
    }, [productImage]);

    if (hasError) {
        return <Typography variant="body2" color="error">Something went wrong</Typography>;
    }
    if (isLoading) {
        return <Typography variant="body2" color="text.secondary">Loading...</Typography>;
    }
    return (
        <>
            <Head>
                <title>SKY | Admin - Add Product</title>
            </Head>
            <Grid container spacing={2}>
                <ComponentHeader
                    icon={CreateIcon}
                    title="Add Product"
                    href="/admin/products"
                    linkText="Back to Products List"
                />
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box component="form" id="addProductForm" noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {(!!errors.message) && (
                                    <Grid item xs={12}>
                                        <Alert severity="error">{errors.message}</Alert>
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={6}>
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
                                <Grid item xs={12} sm={6}>
                                    <FormControl required fullWidth error={!!errors.category}>
                                        <InputLabel size="small" id="select-category-label">Category</InputLabel>
                                        <Select
                                            size="small"
                                            id="category"
                                            labelId="select-category-label"
                                            label="Category"
                                            name="category"
                                            value={formData.category}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        >
                                            {categories.map((category, index) => <MenuItem key={index} value={category.id}>{category.name}</MenuItem>)}
                                        </Select>
                                        <FormHelperText>{errors.category}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    {(!!productImageUrl) && (
                                        <Box>
                                            <Image
                                                src={productImageUrl}
                                                height={300}
                                                width={300}
                                            />
                                        </Box>
                                    )}
                                    <FormControl required error={!!errors.productImage}>
                                        <label htmlFor="productImage">
                                            <input accept="image/*" id="productImage" name="productImage" type="file" onChange={handleProductImageChange} style={{ display: 'none' }} />
                                            <Button variant="contained" component="span" startIcon={<PhotoCameraIcon />}>
                                                Upload
                                            </Button>
                                            <FormHelperText>{errors.productImage}</FormHelperText>
                                        </label>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        size="small"
                                        error={!!errors.description}
                                        required
                                        fullWidth
                                        multiline={true}
                                        minRows="5"
                                        maxRows="5"
                                        id="description"
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        helperText={errors.description}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        error={!!errors.brand}
                                        required
                                        fullWidth
                                        id="brand"
                                        label="Brand"
                                        name="brand"
                                        value={formData.brand}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        helperText={errors.brand}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        error={!!errors.stock}
                                        required
                                        fullWidth
                                        id="stock"
                                        label="Stock"
                                        name="stock"
                                        type="number"
                                        value={formData.stock}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        helperText={errors.stock}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        error={!!errors.price}
                                        required
                                        fullWidth
                                        id="price"
                                        label="Price"
                                        name="price"
                                        type="number"
                                        inputProps={{
                                            step: ".01"
                                        }}
                                        value={formData.price}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        helperText={errors.price}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        error={!!errors.discount}
                                        required
                                        fullWidth
                                        id="discount"
                                        label="Discount"
                                        name="discount"
                                        type="number"
                                        value={formData.discount}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        helperText={errors.discount}
                                    />
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                    >
                                        Add Product
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

export default isAdmin(AddProduct);