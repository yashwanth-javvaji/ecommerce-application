// ReactJS
import { useEffect, useState } from 'react';

// NextJS
import Router from 'next/router';

// Material UI
// Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
// Icons
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Other Dependencies
import { motion } from 'framer-motion';
import { useCart } from "react-use-cart";

// Custom
// Services
import { getProductImage } from '../../services/products';
// Utils
import { numberToCurrency } from '../../utils/products/formatter';


const Product = ({ product }) => {
    const { getItem, addItem, updateItemQuantity } = useCart();
    const item = getItem(product.id);
    const { name, brand, stock, price, discount, rating } = product;

    const [productImage, setProductImage] = useState();

    useEffect(async () => {
        if (!!product.productImage) {
            setProductImage(await getProductImage(product.productImage));
        }
    }, [product.productImage]);

    return (
        <Card        >
            <CardActionArea
                component={motion.div}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                sx={{ position: 'relative' }}
                onClick={() => Router.push(`/products/${product.id}`)}
            >
                <CardMedia
                    component="img"
                    height={300}
                    width={300}
                    image={productImage}
                />
                <Chip label={`${discount}% off`} color="primary" sx={{ position: 'absolute', right: 8, top: 8 }} />
            </CardActionArea>
            <CardContent>
                <Typography variant="body1">
                    {name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    {brand}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                        {numberToCurrency(price * (1 - (discount / 100)), 'en-IN', 'INR')}
                    </Typography>
                    {(!!discount) && (
                        <Typography variant="subtitle1" color="error" sx={{ ml: 2, textDecoration: "line-through", fontWeight: 500 }}>
                            {numberToCurrency(price, 'en-IN', 'INR')}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                    <Rating defaultValue={rating} precision={0.1} readOnly />
                    &nbsp;
                    <Typography variant="body1">({rating})</Typography>
                </Box>
            </CardContent>
            <CardActions>
                {(!!item) ? (
                    <Button
                        variant="contained"
                        color={(stock === item.quantity) ? 'error' : 'primary'}
                        startIcon={<RemoveIcon onClick={() => updateItemQuantity(item.id, item.quantity - 1)} />}
                        endIcon={<AddIcon onClick={() => (stock > item.quantity) && updateItemQuantity(item.id, item.quantity + 1)} />}
                        sx={{ ml: 'auto' }}
                    >
                        {item.quantity}
                    </Button>
                ) : (
                    (!stock) ? (
                        <Button variant="contained" color="error" sx={{ ml: 'auto', textTransform: 'none', fontWeight: 600, pointerEvents: 'none', cursor: 'not-allowed' }}>
                            Not in stock
                        </Button>
                    ) : (
                        <Button variant="contained" sx={{ ml: 'auto' }} onClick={() => addItem(product)}>
                            Add to Cart
                        </Button>
                    )
                )}
            </CardActions>
        </Card >
    );
};

export default Product;