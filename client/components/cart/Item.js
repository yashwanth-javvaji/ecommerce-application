// ReactJS
import { useEffect, useState } from 'react';

// NextJS
import Image from 'next/image';

// Material UI
// Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';

// Other Dependencies
import { useCart } from "react-use-cart";

// Custom
// Services
import { getProductImage } from '../../services/products';
// Utils
import { numberToCurrency } from '../../utils/products/formatter';


const Item = ({ item }) => {
    const { removeItem, updateItemQuantity } = useCart();
    const { id, name, brand, stock, price, quantity } = item;
    price *= 1 - (item.discount / 100);

    const [productImage, setProductImage] = useState();

    useEffect(async () => {
        if (!!item.productImage) {
            setProductImage(await getProductImage(item.productImage));
        }
    }, [item.productImage]);

    return (
        <Card sx={{ display: 'flex' }}>
            {(!!productImage) && (
                <Image
                    height={200}
                    width={200}
                    src={productImage}
                />
            )}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: "space-between" }}>
                <CardHeader
                    action={
                        <IconButton color="error" onClick={() => removeItem(id)}>
                            <DeleteIcon />
                        </IconButton>
                    }
                    title={name}
                    subheader={brand}
                />
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>
                        {numberToCurrency(price, 'en-IN', 'INR')} &times; {quantity} = {numberToCurrency(price * quantity, 'en-IN', 'INR')}
                    </Typography>
                    <Button
                        variant="contained"
                        color={(stock === item.quantity) ? 'error' : 'primary'}
                        startIcon={<RemoveIcon onClick={() => updateItemQuantity(item.id, item.quantity - 1)} />}
                        endIcon={<AddIcon onClick={() => (stock > item.quantity) && updateItemQuantity(item.id, item.quantity + 1)} />}
                    >
                        {quantity}
                    </Button>
                </CardContent>
            </Box>
        </Card>
    );
};

export default Item;