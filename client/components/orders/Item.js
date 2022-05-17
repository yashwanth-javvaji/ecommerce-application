// ReactJS
import { useEffect, useState } from 'react';

// NextJS
import Image from 'next/image';

// Material UI
// Components
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// Custom
// Services
import { getProductImage } from '../../services/products';
// Utils
import { numberToCurrency } from '../../utils/products/formatter';


const Item = ({ item, isAdmin = false }) => {
    const { id, name, price, quantity } = item;
    price *= 1 - (item.discount / 100);

    const [productImage, setProductImage] = useState();

    useEffect(async () => {
        if (!!item.productImage) {
            setProductImage(await getProductImage(item.productImage));
        }
    }, [item.productImage]);

    return (
        <TableRow>
            <TableCell sx={{ width: 100 }}>
                {(!!productImage) && (
                    <Image
                        height={90}
                        width={90}
                        src={productImage}
                    />
                )}
            </TableCell>
            <TableCell>
                <Typography variant="h6">
                    {name}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    {numberToCurrency(price, 'en-IN', 'INR')} &times; {quantity} = {numberToCurrency(price * quantity, 'en-IN', 'INR')}
                </Typography>
            </TableCell>
            {(!isAdmin) && (
                <TableCell sx={{ textAlign: 'right' }}>
                    <Button href={`/products/${id}`} sx={{ textTransform: 'none' }}>Write a Review</Button>
                </TableCell>
            )}
        </TableRow>
    );
};

export default Item;