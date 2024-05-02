// cards/Settings/MultisearchCustomsUI.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useStorageContext } from '../../../contexts/';
import { Card, CardContent, CardHeader, CardFooter } from '../../ui/card';
import MiniSystemItem from '../../systems/MiniItem';
import { MultisearchActionObject } from '@/types';
import { Button } from '../../ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import { getExampleQueryLink } from '../get-example-queries';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '../../ui/alert-dialog';


const MultisearchActionObjectBucket: React.FC<{ title: string, systems: string[], additionalClasses?: string }> = ({ title, systems, additionalClasses }) => {
    const { systemsSearched } = useStorageContext();
    const [containerClasses, setContainerClasses] = useState('');

    useEffect(() => {
        const allSystemsSearched = systems.every(system => systemsSearched[system]);
        setContainerClasses(allSystemsSearched ? 'bg-gray-300' : '');
    }, [systems, systemsSearched]);

    return (
        <div className={`border rounded-md px-1 ${containerClasses} ${additionalClasses}`}>            
            <span className="text-sm">{title}</span>
            <div className="flex flex-wrap">
                {systems.length > 0 ? systems.map((system) => (
                    <div key={system} className="chip">
                        <MiniSystemItem systemId={system} />
                    </div>
                )) : <div className="w-[60px] h-5 mt-1 rounded-md border-white border border-dashed text-sm text-center text-gray-500">none</div>}
            </div>
        </div>
    );
}


export const MultisearchActionObjectBuckets: React.FC<{shortcut: MultisearchActionObject}> = ({ shortcut }) => {
    return (
        <CardContent className="flex flex-row gap-1 pb-1">
            <MultisearchActionObjectBucket
                title="Always search:"
                systems={shortcut.systems.always}
            />
            {shortcut.systems.randomly.length > 0 && <MultisearchActionObjectBucket
                title={`Randomly search ${shortcut.count_from_randomly}:`}
                systems={shortcut.systems.randomly}
            />}
        </CardContent>
    )
}

export const ViewIndividualMultisearchActionObject: React.FC<{shortcut: MultisearchActionObject, index?: number}> = ({ shortcut, index }) => {
    const { removeMultisearchActionObject } = useStorageContext();


    const exampleQueryLink = useMemo(() => getExampleQueryLink(shortcut), [shortcut]);

    const deleteShortcut = (name: string) => {
        removeMultisearchActionObject(name);
        if (name === "links" || name === "beta") {
            localStorage.setItem('defaultMultisearchesHaveBeenDeleted', 'true');
        }
    }


    return (
        <Card className={`p-0 m-3 w:full ${index !== undefined ? "md:w-1/3" : ""}`} {...(index !== undefined ? { key: index } : {})}>
        <CardHeader className='p-1 space-y-0'>
            <code className='text-sm text-center'>[... /{shortcut.name}]</code>
            <div className='border p-1 w-2/3 mx-auto rounded-md text-center'>
                {shortcut.description && <span className='text-sm ml-6 pb-0'>{shortcut.description}</span>}
                </div>
            <span className='text-xs w-full ml-6 pb-0'>An example query:</span>
            {exampleQueryLink}
        </CardHeader>
        <CardContent className="flex flex-row gap-1 pb-3">
                <MultisearchActionObjectBucket
                title="Always initiate:"
                systems={shortcut.systems.always}
            />
                {shortcut.systems.randomly.length > 0 && <MultisearchActionObjectBucket
                title={`Randomly initiate ${shortcut.count_from_randomly}:`}
                systems={shortcut.systems.randomly}
            />}
        </CardContent>
        <CardFooter className="pb-3">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <TrashIcon />Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the shortcut.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteShortcut(shortcut.name)}
                            >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
    </Card>
)}


export default function ViewMultisearchShortcuts() {
    const { multisearchActionObjects } = useStorageContext();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }




    if (!Array.isArray(multisearchActionObjects)) {
        
        return (
            <div>
                <div><p className='text-gray-500 text-sm'>You don't have any custom multi-search shortcuts.</p></div>
            </div>
        );
    }


    return (
        <Card className="border-none rounded-none mx-0 shadow-none">
            <div className='flex flex-wrap justify-center gap-1'>
            {multisearchActionObjects.map((shortcut, index) => (
                <ViewIndividualMultisearchActionObject key={index} shortcut={shortcut} />
            ))}
            </div>
        </Card>
    )
}
