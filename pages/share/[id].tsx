'use client';

// share/[id].tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { GetStaticProps, GetStaticPaths } from 'next';
import Header from '../../src/components/header/Header';
import { LandingPageScreenshots } from '../../src/components/systems/ImageInserts';
import OpenGraphCardMetaData from '../../src/components/OpenGraphCardMetadata';
import { System } from '../../src/types/system';
import { baseSystems } from '../../src/contexts/SystemsContext';
import { OpenSourceLicense } from '../../src/components/systems/SystemElements';
import { SystemTitle } from '../../src/components/systems/SystemTitle';

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
                <div className="flex flex-row mx-7">
                    <div className={`w-full bg-white flex flex-row rounded-md mr-1 p-1`}>
                        <div className="mt-5 min-w-[250px] mr-4">
                            <SystemTitle system={system} favicon_included={true} />
                            <span className="ml-1">{system.searchLink.replace('https://', '').replace('/', '')}</span>
                            <div className="mt-5">
                                <OpenSourceLicense system={system} />
                            {system.characteristics && system.characteristics.output && (
                                <div>
                                    <p className="w-[250px] text-sm ml-1">output type: {system.characteristics.output}</p>
                                </div>
                            )}
                            </div>
                        </div>
                        <LandingPageScreenshots system={system} shareCard={true} />
                    </div>
                    
                </div>
            </div>
        </>
    );
};

export default SystemPage; 
