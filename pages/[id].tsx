'use client';

// [id].tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { GetStaticProps, GetStaticPaths } from 'next';
import Header from '../src/components/header/Header';
import Footer from '../src/components/Footer';
import { FeedbackAction } from "../src/components/FeedbackAction";
import SystemCard from '../src/components/systems/SystemCard';
import OpenGraphCardMetaData from '../src/components/OpenGraphCardMetadata';
import { System } from '../src/types/system';
import { baseSystems } from '../src/contexts/SystemsContext';
import SearchBar from '../src/components/SearchBar';

export const getStaticProps: GetStaticProps = async (context) => {
    // Ensure `params` is not undefined
    const id = context.params?.id;
    const system = baseSystems.find(item => item.id === id);

    // Handle the case where no item is found
    if (!system) {
        return { notFound: true };
    }

    return {
        props: {
            system,
        },
    };
};


export const getStaticPaths: GetStaticPaths = async () => {
    // Generate paths based on IDs
    const paths = baseSystems.map(system => ({
        params: { id: system.id.toString() },
    }));

    return { paths, fallback: 'blocking' };
}



const SystemPage = ({ system }: { system: System }) => {
    const [isClient, setIsClient] = useState(false);
    const { title, description, url, image } = OpenGraphCardMetaData(system);


    useEffect(() => {
        if (typeof window !== 'undefined' && !window.location.href.includes('localhost')) {
            const script = document.createElement('script');
            script.defer = true;
            script.src = "https://plausible.io/js/script.js";
            script.setAttribute('data-domain', 'searchjunct.com');
            document.body.appendChild(script);
        }
    }, []);

    useEffect(() => {
        setIsClient(typeof window !== 'undefined');
    }, []);

    if (!isClient) {
        return null;
    }


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
                <meta property="og:image" content={`/screenshots/shareCards/${system.id}.png`} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            {typeof window !== 'undefined' && !window.location.href.includes('localhost') ? (
                <Script defer data-domain="searchjunct.com" src="https://plausible.io/js/script.js" />
            ) : null}
            <div className="mx-1 w-9/10 sm:w-3/4 sm:mx-auto md:w-3/7 lg:w-3/5 xl:w-2/4">
                <Header system={system}/>
                <div className="flex flex-row mx-7">
                    <div className={`w-full bg-white rounded-md mr-1 p-1`}>
                        <SearchBar system={system} />
                        <SystemCard system={system} systemPage={true} />
                        <Footer />
                        <FeedbackAction />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SystemPage; 

