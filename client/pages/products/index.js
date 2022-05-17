// ReactJS
import { useEffect, useState } from "react";

// NextJS
import { useRouter } from "next/router";
import Head from 'next/head';

// Material UI
// Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from "@mui/material/MenuItem";
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Rating from '@mui/material/Rating';
import Select from "@mui/material/Select";
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// Other Dependencies
import { motion } from 'framer-motion';

// Custom
// Components
import ListPagination from "../../components/ListPagination";
import Product from "../../components/products/Product"
// Services
import { getAllProducts } from "../../services/products";
import { getAllCategories } from "../../services/categories";


const ProductsDashboard = () => {
    const router = useRouter();

    const [sortBy, setSortBy] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const initialFiltersState = {
        categories: new Set(),
        priceMin: 0,
        priceMax: 100000,
        rating: 0,
        discount: 0
    };
    const [filters, setFilters] = useState(initialFiltersState);

    const sortProducts = (products) => {
        switch (sortBy) {
            case "Rating": return products.sort((prev, curr) => curr.rating - prev.rating);
            case "Latest": return products.sort((prev, curr) => prev.createdAt < curr.createdAt ? 1 : -1)
            case "Discount": return products.sort((prev, curr) => curr.discount - prev.discount);
            case "Price: Low to High": return products.sort((prev, curr) => prev.price - curr.price);
            case "Price: High to Low": return products.sort((prev, curr) => curr.price - prev.price);
            default: return products;
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getAllProducts()
            .then((products) => setProducts(products))
            .catch((err) => setHasError(true))
            .finally(() => setIsLoading(false));
        getAllCategories()
            .then((categories) => setCategories(categories.map((category) => category.name)));
    }, []);

    useEffect(() => {
        if (router.query.sortBy) {
            setSortBy(router.query.sortBy);
        }
    }, [router.query.sortBy]);

    useEffect(() => {
        if (router.query.category) {
            setFilters({
                ...initialFiltersState,
                categories: new Set([router.query.category])
            });
        }
    }, [router.query.category]);

    if (hasError) {
        return <Typography variant="body2" color="error">Something went wrong</Typography>;
    }
    if (isLoading) {
        return <Typography variant="body2" color="text.secondary">Loading...</Typography>;
    }
    return (
        <>
            <Head>
                <title>SKY | Products</title>
            </Head>
            <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex' }}>
                        <FormControl sx={{ minWidth: "8em", ml: "auto" }} size="small">
                            <InputLabel id="sort-by-label">Sort By</InputLabel>
                            <Select
                                id="sortBy"
                                labelId="sort-by-label"
                                label="Sort By"
                                autoWidth
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value)}
                            >
                                <MenuItem value="Rating">Rating</MenuItem>
                                <MenuItem value="Latest">Latest</MenuItem>
                                <MenuItem value="Discount">Discount</MenuItem>
                                <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
                                <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>
                </Grid>
                <Grid item xs={3} container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Box>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Categories
                                </Typography>
                                {categories.map((category) => (
                                    <FormControlLabel
                                        key={category}
                                        control={<Checkbox value={category} size="small" checked={filters.categories.has(category)} onChange={(event) => {
                                            const categories = new Set(filters.categories);
                                            event.target.checked ? categories.add(category) : categories.delete(category);
                                            setFilters({ ...filters, categories });
                                        }} />}
                                        label={category}
                                    />
                                ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Price Range
                                </Typography>
                                <Box mt={1} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        inputProps={{ min: 0, max: filters.priceMax }}
                                        value={filters.priceMin}
                                        onChange={(event) => setFilters({ ...filters, priceMin: event.target.value })}
                                    />
                                    <Box px={1}>-</Box>
                                    <TextField
                                        size="small"
                                        type="number"
                                        inputProps={{ min: filters.priceMin }}
                                        value={filters.priceMax}
                                        onChange={(event) => setFilters({ ...filters, priceMax: event.target.value })}
                                    />
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Ratings
                                </Typography>
                                <RadioGroup>
                                    {[4, 3, 2, 1].map((rating) => (
                                        <FormControlLabel
                                            key={rating}
                                            control={<Radio value={rating} size="small" checked={filters.rating === rating} onChange={() => setFilters({ ...filters, rating })} />}
                                            label={
                                                <Typography sx={{ display: 'inline-flex', verticalAlign: 'bottom' }}>
                                                    <Rating name="read-only" value={rating} readOnly /> &nbsp;&amp; Up
                                                </Typography>
                                            }
                                        />
                                    ))}
                                </RadioGroup>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Discounts
                                </Typography>
                                <RadioGroup>
                                    {[75, 50, 25, 10].map((discount) => (
                                        <FormControlLabel
                                            key={discount}
                                            control={<Radio value={discount} size="small" checked={filters.discount === discount} onChange={() => setFilters({ ...filters, discount })} />}
                                            label={`${discount}% off or more`}
                                        />
                                    ))}
                                </RadioGroup>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" fullWidth onClick={() => setFilters(initialFiltersState)}>Clear filters</Button>
                    </Grid>
                </Grid>
                <Grid item xs={9} container spacing={3} component={motion.div} layout>
                    <ListPagination
                        type="products"
                        list={sortProducts(products.filter((product) => {
                            if ((filters.categories.size !== 0) && !(filters.categories.has(product.category.name))) {
                                return false;
                            }
                            if ((filters.priceMin > product.price) || (filters.priceMax < product.price)) {
                                return false;
                            }
                            if (filters.rating > product.rating) {
                                return false;
                            }
                            if (filters.discount > product.discount) {
                                return false;
                            }
                            return true;
                        })).map((product) => (
                            <Grid key={product.id} item xs={4} component={motion.div} layout>
                                <Product product={product} />
                            </Grid>
                        ))}
                        itemsPerPage={9}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default ProductsDashboard;