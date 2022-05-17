// ReactJS
import { useEffect } from 'react';

// NextJS
import { useRouter } from 'next/router';
import Head from 'next/head';

// Material UI
// Components
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
// Styles
import { styled, useTheme, ThemeProvider } from '@mui/material/styles';

// Other Dependencies
import { CartProvider } from "react-use-cart";
import PropTypes from 'prop-types';

// Custom
// Components
import Navigation from '../components/Navigation';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const App = ({ Component, pageProps }) => {
  const theme = useTheme();

  const { route } = useRouter();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>SKY</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <CartProvider>
          {!(['/auth/signup', '/auth/signin'].includes(route)) && <Navigation />}
          <DrawerHeader />
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Component {...pageProps} />
          </Container>
        </CartProvider>
      </ThemeProvider>
    </>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;