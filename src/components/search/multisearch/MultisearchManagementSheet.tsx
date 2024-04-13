import React, { useState, useEffect } from 'react';
import { useAppContext, useStorageContext } from '../../../contexts';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/src/components/ui/sheet"
import { SpecialCardTitle } from '../../SystemTitle';
import ViewMultisearchShortcuts from './ViewMultisearchShortcuts';
import AddMultisearchActionObject from './AddMultisearchActionObject';

export default function ViewMultisearchSheet() {
    const { multisearchActionObjects } = useStorageContext();
    const { isMultisearchManagementSheetOpen, toggleIsMultisearchManagementSheetOpen } = useAppContext();
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
        <Sheet open={isMultisearchManagementSheetOpen} onOpenChange={toggleIsMultisearchManagementSheetOpen}>
        
            <SheetContent 
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
