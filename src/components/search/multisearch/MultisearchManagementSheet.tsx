import React, { useState, useEffect } from 'react';
import { useStorageContext } from '../../../contexts';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../../ui/button';
import { SpecialCardTitle } from '../../SystemTitle';
import ViewMultisearchShortcuts from './ViewMultisearchShortcuts';
import AddMultisearchActionObject from './AddMultisearchActionObject';

export default function ViewMultisearchSheet() {
    const { multisearchActionObjects } = useStorageContext();
    const [isClient, setIsClient] = useState(false);

    const [isOpen, setIsOpen] = useState(false);


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
        <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs hover:bg-blue-100 mx-2">
                Manage multisearch shortcuts
            </Button>
        </SheetTrigger>
            <SheetContent onClick={(event) => event.stopPropagation()             }
                className="p-2 w-[375px] sm:w-[840px] sm:max-w-2xl p-2">
            <SheetHeader>
                <SheetTitle>Manage multisearch shortcuts</SheetTitle>
            </SheetHeader>
                <AddMultisearchActionObject />
                <ViewMultisearchShortcuts />
            </SheetContent>
        </Sheet>
    );
}
