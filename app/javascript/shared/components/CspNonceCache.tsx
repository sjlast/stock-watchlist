import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const nonce: string = (document.querySelector('meta[name=csp-nonce]') as HTMLMetaElement).content;

const cache = createCache({
  key: 'csp-nonce',
  nonce: nonce,
  prepend: true,
});

/**
 * This component caches a CSP nonce Emotion needs for in-line styles to load correctly.
 */
export const CspNonceCache = (props: React.PropsWithChildren) => {
  return <CacheProvider value={cache}>{props.children}</CacheProvider>;
};
