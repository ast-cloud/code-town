import '@/styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import {RecoilRoot} from 'recoil';
import {AppBar} from '@/components/AppBar';
import { Footer } from '@/components/Footer';


export default function App({ Component, pageProps, router }: AppProps) {
  return <RecoilRoot>
    <Head>
      <title>Admin Code Town</title>
    </Head>
    <App2 Component={Component} pageProps={pageProps} router={router}></App2>
  </RecoilRoot>
}


function App2({Component, pageProps}: AppProps){

  return <div>
    <AppBar></AppBar>
    <Component {...pageProps} />
    <Footer/>
  </div>
}