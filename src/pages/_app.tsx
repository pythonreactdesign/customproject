import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import Layout from 'components/Layout';

import i18n from '../../next-i18next.config.js';

import { MobileProvider } from 'contexts/MobileContext';

import 'styles/globals.scss';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <div className="root">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no viewport-fit=cover" />
      </Head>
      <MobileProvider>
        <Layout>
          <div className="main-container">
            <Component {...pageProps} />
          </div>
        </Layout>
      </MobileProvider>
    </div>
  );
};

export default appWithTranslation(App, i18n);
