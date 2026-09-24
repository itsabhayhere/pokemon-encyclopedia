import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
