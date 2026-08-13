import React from 'react';
import type { AppProps } from 'next/app';
import { LocaleProvider } from '../context/LocaleContext';
import { CartProvider } from '../context/CartContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocaleProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </LocaleProvider>
  );
}
