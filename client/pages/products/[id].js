// ReactJS
import { useEffect, useState } from "react";

// NextJS
import { useRouter } from 'next/router';
import Head from "next/head";
import Image from "next/image";

// Material UI
// Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
// Icons
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ReviewsIcon from '@mui/icons-material/Reviews';

// Other Dependencies
import { useCart } from "react-use-cart";

// Custom
// Components
import ComponentHeader from "../../components/ComponentHeader";
import Form from "../../components/reviews/Form";
import ListPagination from "../../components/ListPagination";
import Review from "../../components/reviews/Review";
// Services
import { getProductById, getProductImage } from "../../services/products";
// Utils
import { numberToCurrency } from '../../utils/products/formatter';


const Product = () => {
    const router = useRouter();
    const { id } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [product, setProduct] = useState();
    const [productImage, setProductImage] = useState();

    const { getItem, addItem, updateItemQuantity } = useCart();

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            getProductById(id)
                .then(async (product) => {
                    setProduct(product);
                    setProductImage(await getProductImage(product.productImage));
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
    if (!product) {
        return <Typography color="text.secondary">Product does not exist</Typography>
    }

    const item = getItem(id);
    const { name, category, brand, description, stock, price, discount, reviews, rating } = product;

    return (
        <>
            <Head>
                <title>SKY | Product {id}</title>
            </Head>
            <Grid container rowSpacing={9} columnSpacing={3} alignItems="flex-start">
                <Grid item container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
                        {(!!productImage) && (
                            <Image
                                src={productImage}
                                width={300}
                                height={300}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" gutterBottom component="div">{name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                            <Typography variant="body2" color="text.secondary">Category:</Typography>
                            &nbsp;
                            <Typography variant="body1">{category.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                            <Typography variant="body2" color="text.secondary">Brand:</Typography>
                            &nbsp;
                            <Typography variant="body1">{brand}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                            <Typography variant="body2" color="text.secondary">Rating:</Typography>
                            &nbsp;
                            <Rating defaultValue={rating} precision={0.1} readOnly />
                            &nbsp;
                            <Typography variant="body1">({rating})</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">Description:</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>{description}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                                {numberToCurrency(price * (1 - (discount / 100)), 'en-IN', 'INR')}
                            </Typography>
                            {(!!discount) && (
                                <Typography variant="h6" color="error" sx={{ ml: 2, textDecoration: "line-through", fontWeight: 500 }}>
                                    {numberToCurrency(price, 'en-IN', 'INR')}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            {(!!item) ? (
                                <Button
                                    variant="contained"
                                    startIcon={<RemoveIcon onClick={() => updateItemQuantity(item.id, item.quantity - 1)} />}
                                    endIcon={<AddIcon onClick={() => updateItemQuantity(item.id, item.quantity + 1 > stock ? stock : item.quantity + 1)} />}
                                >
                                    {item.quantity}
                                </Button>
                            ) : (
                                (!stock) ? (
                                    <Button variant="contained" color="error" sx={{ textTransform: 'none', fontWeight: 600, pointerEvents: 'none', cursor: 'not-allowed' }}>
                                        Not in stock
                                    </Button>
                                ) : (
                                    <Button variant="contained" disabled={stock === 0} onClick={() => addItem(product)}>
                                        Add to Cart
                                    </Button>
                                )
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={6} container spacing={2}>
                    <Grid item xs={12}>
                        <ComponentHeader
                            icon={ReviewsIcon}
                            title="Reviews"
                        />
                    </Grid>
                    <Grid item xs={12} container spacing={2}>
                        <ListPagination
                            type="reviews"
                            list={reviews.map((review, index) => (
                                <Grid item xs={12}>
                                    <Review key={index} review={review} />
                                </Grid>
                            ))}
                            itemsPerPage={5}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Form productId={id} />
                </Grid>
            </Grid>
        </>
    );
};

export default Product;