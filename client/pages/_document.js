/* eslint-disable react/jsx-filename-extension */
// ReactJS
import React from 'react';

// NextJS
import Document, { Html, Head, Main, NextScript } from 'next/document';

// Material UI
// Styles
import { ServerStyleSheets } from '@mui/styles';


export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body style={{ backgroundColor: "rgba(225, 245, 254, 0.25)" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () => originalRenderPage({
    enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
  });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};