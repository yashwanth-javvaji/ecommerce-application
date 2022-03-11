// React
import { useEffect } from 'react';

// Next
import { useRouter } from 'next/router';
import Head from 'next/head';

// Material UI
// Components
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Other Dependencies
import PropTypes from 'prop-types';


const theme = createTheme();

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const { route } = router;

  useEffect(async () => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/* {!(['/signup', '/signin'].includes(route)) && <Navigation />} */}
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;