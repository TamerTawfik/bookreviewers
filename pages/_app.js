import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';


import { CacheProvider } from '@emotion/react';

import createEmotionCache from '../lib/createEmotionCache';


import { Toaster } from 'react-hot-toast';

import { UserContext } from '../lib/context';
import { MaterialUIControllerProvider } from '../context';
import { useUserData } from '../lib/hooks';


import '../styles/globals.css'

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();


function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const userData = useUserData();

  return (
    <>
      <UserContext.Provider value={userData}>
        <MaterialUIControllerProvider>
          <CacheProvider value={emotionCache}>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
              <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
            </Head>
            <Component {...pageProps} />
            <Toaster toastOptions={{
              className: '',
              style: {
                fontSize: '12px'
              },
            }} />
          </CacheProvider>
        </MaterialUIControllerProvider>
      </UserContext.Provider>
    </>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp
