// pages/multisearch.tsx
import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Header from '../src/components/header/Header';
import Footer from '../src/components/Footer';
import AddMultisearchActionObject from '../src/components/search/multisearch/AddMultisearchActionObject';
import ViewMultisearchShortcuts from '../src/components/search/multisearch/ViewMultisearchShortcuts';

const title = "Searchjunct's Multisearch"
const description = "View and set your Searchjunct Multisearch shortcuts.";
const url = "https://searchjunct.com/multisearch";
const image = "https://searchjunct.com/screenshots/home.png";


const MultisearchPage = () => {
  return (
      <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/searchjunct.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* <!-- HTML Meta Tags --> */}
        <meta name="description" content={description} />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      {typeof window !== 'undefined' && !window.location.href.includes('localhost') ? (
      <Script defer data-domain="searchjunct.com" src="https://plausible.io/js/script.js" />
      ) : null}
      

      <Header pageTitleParts={["Multi", "search"]} />
      <div className="mx-1 w-9/10 sm:w-3/4 sm:mx-auto md:w-3/7 lg:w-3/5 xl:w-2/4">
        <AddMultisearchActionObject />
        <ViewMultisearchShortcuts />
        <Footer />
      </div>
    </>
  );
};

export default MultisearchPage;