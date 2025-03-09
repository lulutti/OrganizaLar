import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'antd/dist/reset.css';
import '../styles/globals.css';

import { ConfigProvider } from 'antd';
import { theme } from '@/styles/themeConfig';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider theme={theme}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}
