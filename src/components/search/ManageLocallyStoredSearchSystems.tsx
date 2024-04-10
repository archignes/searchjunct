// ViewPrivateSystemsSheet.tsx

import React, { useState, useEffect } from 'react';
import { useStorageContext } from '../../contexts';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '../ui/button';

const ManagePrivateSystems: React.FC = () => {
    const { locallyStoredSearchSystems,
        importLocallyStoredSearchSystems,
        exportLocallyStoredSearchSystems,
        removeLocallyStoredSearchSystem } = useStorageContext();
    return (
        <div>
            {locallyStoredSearchSystems.map((system, index) => (
                <p key={index}>{system.name}</p>
            ))}
        </div>
    );
}

const ManageLocallyStoredSearchSystemsSheet: React.FC = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    
    return (
        <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs hover:bg-blue-100 mx-auto">
                Manage your locally stored search systems
            </Button>
        </SheetTrigger>
            <SheetContent onClick={(event) => event.stopPropagation()             }
                className="p-2 w-[375px] sm:w-[840px] sm:max-w-2xl p-2">
            <SheetHeader>
                <SheetTitle>Manage your locally stored search systems</SheetTitle>
            </SheetHeader>
                <ManagePrivateSystems />
            </SheetContent>
        </Sheet>
    );
}

export default ManageLocallyStoredSearchSystemsSheet;

