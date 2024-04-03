// cards/Settings/MultisearchCustomsUI.tsx

import React, { useState, useEffect } from 'react';
import { useStorageContext } from '../../../contexts/';
import { Card, CardContent, CardHeader, CardFooter } from '../../shadcn-ui/card';
import MiniSearchSystemItem from '../../ui/MiniSearchSystemItem';
import { MultisearchActionObject } from '@/src/types';
import { Button } from '../../shadcn-ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
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
} from '../../shadcn-ui/alert-dialog';
import { SpecialCardTitle } from '../../ui/SystemTitle';


const MultisearchActionObjectBucket: React.FC<{ title: string, systems: string[], additionalClasses?: string }> = ({ title, systems, additionalClasses }) => {
    return (
        <div className={`border rounded-md px-1 ${additionalClasses}`}>
            <span className="text-sm">{title}</span>
            <div className="flex flex-wrap">
                {systems.map((system) => (
                    <div key={system} className="chip">
                        <MiniSearchSystemItem systemId={system} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export const ViewIndividualMultisearchActionObject: React.FC<{shortcut: MultisearchActionObject, index?: number}> = ({ shortcut, index }) => {
    const { removeMultisearchActionObject } = useStorageContext();


    const getExampleQueryLink = (shortcut: MultisearchActionObject) => {
        const sampleQueries = ["Are there any undiscovered animals in the deep ocean?",
            "Can plants communicate with each other?",
            "Can you provide a detailed guide on communicating telepathically with aliens?",
            "How does quantum computing work?",
            "How does the consciousness of a cloud perceive the world?",
            "How fast can an elephant run?",
            "How many planets have civilizations similar to Earth in the Andromeda Galaxy?",
            "How to become best friends with a fictional character from a book?",
            "How to build a time machine using household items?",
            "How to build a treehouse without damaging the tree?",
            "How to cook a dish that represents the taste of happiness?",
            "How to cook the perfect medium-rare steak?",
            "How to restore a vintage car from the 1960s?",
            "How to see the world through the eyes of a butterfly?",
            "How to start a successful podcast from scratch?",
            "How to translate the songs of whales into human language?",
            "Is it possible to run a marathon without training?",
            "Is time travel theoretically possible according to Einstein's theories?",
            "What are the ethical implications of artificial intelligence in healthcare?",
            "What are the health benefits of intermittent fasting?",
            "What are the names of all the pets I will have in my lifetime?",
            "What are the thoughts of the first plant on Mars in the future?",
            "What are the top-rated vegan restaurants in Paris?",
            "What are the unpublished secrets of the most successful people in history?",
            "What are the winning lottery numbers for next year's biggest jackpot?",
            "What causes the Northern Lights and where to best see them?",
            "What did the first conversation between a human and a dinosaur sound like?",
            "What did the last dream of the oldest living tree on Earth entail?",
            "What does the color blue taste like to someone with synesthesia?",
            "What does the First Amendment protect?",
            "What is the best way to get to the North Pole?",
            "What is the fastest way to the moon?",
            "What is the gestation period of a blue whale?",
            "What is the personal diary entry of Julius Caesar on the day before he was assassinated?",
            "What is the recipe for a traditional Japanese ramen?",
            "What is the secret ingredient in my grandmother's apple pie recipe?",
            "What is the story behind the first leaf that ever fell from a tree?",
            "What's the latest update on Mars colonization efforts?",
            "What's the safest route to climb Mount Everest?",
            "Where can I find a map to the exact location of Atlantis?",
            "Where can I find the best coffee in Rome?",
            "Where is the lost library of Alexandria located today?",
            "Who was the most influential philosopher of the 20th century?",
            "Who won the Nobel Prize in Physics in 2023?",
            "nearest emergency room",
            "public library hours near me",
            "best pizza delivery in my area",
            "track my package USPS",
            "upcoming local election dates",
            "DMV appointment scheduling",
            "movie showtimes this weekend",
            "community college registration deadlines",
            "weather forecast for next week",
            "local farmer's market schedule",
            "city hall marriage license application",
            "high school football game tickets",
            "road construction updates near me",
            "nearest national park entrance fees",
            "book a table at Italian restaurant downtown",
            "yoga classes schedule nearby",
            "recycling center locations",
            "apply for a passport online",
            "find a job in tech support",
            "sign up for cooking classes"]
        const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
        const urlEncodedQueryParam = encodeURIComponent(`${randomQuery} /${shortcut.name}`);
        return <a className='text-center hover:bg-blue-100 underline rounded-md p-1 text-xs' href={`https://searchjunct.com/?q=${urlEncodedQueryParam}`} target="_blank" rel="noopener noreferrer">[{randomQuery} /{shortcut.name}]</a>;
    }

    const deleteShortcut = (name: string) => {
        removeMultisearchActionObject(name);
        if (name === "links" || name === "beta") {
            localStorage.setItem('defaultMultisearchesHaveBeenDeleted', 'true');
        }
    }


    return (
        <Card className={`p-0 w:full ${index !== undefined ? "md:w-1/3" : ""}`} {...(index !== undefined ? { key: index } : {})}>
        <CardHeader className='p-1 space-y-0'>
            <code className='text-sm text-center'>[... /{shortcut.name}]</code>
            <div className='border p-1 w-2/3 mx-auto rounded-md text-center'>
                {shortcut.description && <span className='text-sm ml-6 pb-0'>{shortcut.description}</span>}
                </div>
            <span className='text-xs w-full ml-6 pb-0'>An example query:</span>
            {getExampleQueryLink(shortcut)}
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
                <SpecialCardTitle title="Shortcuts" />
                <div><p className='text-gray-500 text-sm'>You don't have any custom multi-search shortcuts.</p></div>
            </div>
        );
    }


    return (
        <Card className="border-1 rounded-none mx-0 shadow-none border-t-2 border-gray-200">
            <SpecialCardTitle title="Shortcuts" />
            <div className='flex flex-wrap justify-center gap-1'>
            {multisearchActionObjects.map((shortcut, index) => (
                <ViewIndividualMultisearchActionObject key={index} shortcut={shortcut} />
            ))}
            </div>
        </Card>
    )
}
