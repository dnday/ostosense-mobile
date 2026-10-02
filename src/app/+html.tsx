import type { PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

// Web saja: muat Poppins supaya fontFamily 'Poppins' tidak jatuh ke sans-serif bawaan.
// Native memuat Poppins dari assets/fonts lewat plugin expo-font di app.json.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
