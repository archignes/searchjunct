'use client';

// [id].tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import SystemPageCard from '../src/components/systems/Card.Page';
import OpenGraphCardMetaData from '../src/components/OpenGraphCardMetadata';
import { System } from '../src/types/system';
import { baseSystems } from '../src/contexts/SystemsContext';

import dynamic from 'next/dynamic';
const SearchBar = dynamic(() => import('../src/components/SearchBar'));

export const getStaticProps: GetStaticProps = async (context) => {
    const id = context.params?.id;
    const system = baseSystems.find(item => item.id === id);

    if (!system) {
        return { notFound: true };
    }

    const { title, description, url, image } = OpenGraphCardMetaData(system);

    return {
        props: {
            system,
            title,
            description,
            url,
            image,
        },
        revalidate: 10, // Revalidate at most once every 10 seconds
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = baseSystems.map(system => ({
        params: { id: system.id.toString() },
    }));

    return { paths, fallback: 'blocking' };
}

const SystemPage = ({ system, title, description, url, image }: { 
    system: System;
    title: string; 
    description: string; 
    url: string; 
    image: string; 
}) => {
    const [shouldRenderSearchBar, setShouldRenderSearchBar] = useState(false);

    useEffect(() => {
        // Delay rendering of SearchBar until hydration is complete
        setShouldRenderSearchBar(true);
    }, []);

    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/searchjunct.svg" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content={description} />
                <meta property="og:url" content={url} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={image} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
            </Head>
            <div className="mx-1 w-9/10 sm:w-3/4 sm:mx-auto md:w-3/7 lg:w-3/5 xl:w-2/4">
                <div className="flex flex-row mx-7">
                    <div className="w-full bg-white rounded-md mr-1 p-1">
                        {shouldRenderSearchBar && (
                            <SearchBar system={system} />
                        )}
                        <SystemPageCard system={system} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SystemPage;