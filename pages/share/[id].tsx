'use client';

// share/[id].tsx
import React, { useEffect, useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { PageScreenshots } from '../../src/components/systems/Images';
import { System } from '../../src/types/system';
import { baseSystems } from '../../src/contexts/SystemsContext';
import { OpenSourceLicense } from '../../src/components/systems/Elements';
import { SystemTitle } from '../../src/components/systems/Title';

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
            sharePage: true
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

    useEffect(() => {
        setIsClient(typeof window !== 'undefined');
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <>
            <div className="mx-1 mt-5">
                <div className="flex flex-row">
                    <div className={`w-full justify-center bg-white flex flex-row rounded-md mr-1 p-1`}>
                        <div className="mt-5 min-w-[350px] mr-4">
                            <SystemTitle system={system} favicon_included={true} />
                            <pre className="my-2 border-l-2 border-gray-300 bg-gray-100 p-2">{system.searchLink.replace('https://', '').replace('/', '')}</pre>
                            <div className="mt-5">
                                <OpenSourceLicense system={system} />
                            {system.characteristics && system.characteristics.output && (
                                <div>
                                    <p className="ml-1"><span className="font-bold">output type:</span> {system.characteristics.output}</p>
                                </div>
                            )}
                            </div>
                        </div>
                        <PageScreenshots system={system}/>
                    </div>
                    
                </div>
            </div>
        </>
    );
};

export default SystemPage; 
