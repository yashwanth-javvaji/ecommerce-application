// ReactJS
import { useEffect, useState } from 'react';

// NextJS
import Head from 'next/head';

// Material UI
// Components
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// Icons
import CategoryIcon from '@mui/icons-material/Category';
import DiscountIcon from '@mui/icons-material/Discount';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import StarIcon from '@mui/icons-material/Star';

// Other Dependencies
import { motion } from 'framer-motion';

// Custom
// Components
import ComponentHeader from '../components/ComponentHeader';
import Product from "../components/products/Product"
// Services
import { getAllCategories } from '../services/categories';
import { getAllProducts } from "../services/products";


const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const topRated = products.sort((prev, curr) => curr.rating - prev.rating).slice(0, 9);
  const latestArrivals = products.sort((prev, curr) => prev.createdAt < curr.createdAt ? 1 : -1).slice(0, 9);
  const bigDiscounts = products.sort((prev, curr) => curr.discount - prev.discount).slice(0, 9);

  useEffect(() => {
    setIsLoading(true);
    getAllProducts()
      .then((products) => setProducts(products))
      .catch((err) => setHasError(true))
      .finally(() => setIsLoading(false));
    getAllCategories()
      .then((categories) => setCategories(categories.map((category) => category.name)));
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
        <title>SKY | Home</title>
      </Head>
      <Grid container spacing={9}>
        <Grid
          item
          xs={12}
          initial={{ opacity: 0 }}
          component={motion.div}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <ComponentHeader
            icon={StarIcon}
            title="Top Rated"
            href="/products?sortBy=Rating"
            linkText="View All"
            variant="text"
          />
          <Grid container spacing={3}>
            {topRated.map((product) => (
              <Grid key={product.id} item xs={4}>
                <Product product={product} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          initial={{ opacity: 0 }}
          component={motion.div}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <ComponentHeader
            icon={FiberNewIcon}
            title="Latest Arrivals"
            href="/products?sortBy=Latest"
            linkText="View All"
            variant="text"
          />
          <Grid container spacing={3}>
            {latestArrivals.map((product) => (
              <Grid key={product.id} item xs={4}>
                <Product product={product} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          initial={{ opacity: 0 }}
          component={motion.div}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <ComponentHeader
            icon={DiscountIcon}
            title="Big Discounts"
            href="/products?sortBy=Discount"
            linkText="View All"
            variant="text"
          />
          <Grid container spacing={3}>
            {bigDiscounts.map((product) => (
              <Grid key={product.id} item xs={4}>
                <Product product={product} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          initial={{ opacity: 0 }}
          component={motion.div}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <ComponentHeader
            icon={CategoryIcon}
            title="Categories"
            href="/products"
            linkText="View All"
            variant="text"
          />
          <Grid container spacing={1}>
            {categories.map((category) => (
              <Grid key={category} item xs="auto">
                <Button variant="outlined" href={`/products?category=${category}`} sx={{ fontWeight: 600 }}>{category}</Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;