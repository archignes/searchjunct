// ViewPrivateSystemsSheet.tsx

import React, { useState, useEffect } from 'react';
import { useStorageContext } from '../../contexts';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/src/components/ui/sheet"
import { Button } from '../ui/button';
import {AddSystem} from '../main-menu/AddSystem';
import SystemItem from '../SystemItem';

const ManagePrivateSystems: React.FC = () => {

    const [isEditing, setIsEditing] = useState(false);
    const [editingSystemId, setEditingSystemId] = useState<string | null>(null);
    
    const { locallyStoredSearchSystems,
        removeLocallyStoredSearchSystem } = useStorageContext();

    if (locallyStoredSearchSystems.length === 0) {
        return <p>No locally stored search systems found.</p>;
    }


    return (
        <div className="space-y-4">
            {locallyStoredSearchSystems.map((system) => {
                return (
                    <React.Fragment key={system.id}>
                        {isEditing && system.id === editingSystemId ? (
                            <AddSystem defaultValues={{
                                name: system.name,
                                description: system?.description,
                                id: system.id,
                                searchLink: system.searchLink,
                                favicon: system.favicon
                            }} onClose={() => {setIsEditing(false); setEditingSystemId(null);}} />
                        ) : (
                            <div className="flex justify-between gap-2 items-center bg-gray-100 p-2 rounded-lg">
                                <div className="flex flex-col">
                                    <div className="border rounded-md shadow-sm w-[200px] bg-white">
                                        <SystemItem system={system} id={system.id} showDisableDeleteButtons={true} showDragHandle={false} activeSystemId={undefined} />
                                    </div>
                                    <span className="mt-2 text-sm">{system.description}</span>
                                </div>
                                    <div className="flex flex-col gap-2 w-[70px]">
                                    <Button variant="outline" size="sm" className="w-full mr-2" onClick={() => {setIsEditing(true); setEditingSystemId(system.id);}}>Edit</Button>
                                    <Button variant="outline" size="sm" className="w-full text-red-500 border-red-500 hover:bg-red-100" onClick={() => removeLocallyStoredSearchSystem(system.id)}>Remove</Button>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

interface ManageLocallyStoredSearchSystemsSheetProps {
    portal?: () => void;
}

const ManageLocallyStoredSearchSystemsSheet: React.FC<ManageLocallyStoredSearchSystemsSheetProps> = ({portal}) => {
    const [isClient, setIsClient] = useState(false);
    const {locallyStoredSearchSystems} = useStorageContext();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    
    return (
        <Sheet>
        <SheetTrigger asChild>
                <Button variant="outline"
                        size="sm"
                        className="text-xs w-[300px] hover:bg-blue-100 mx-auto"
                        onClick={(e) => e.stopPropagation()}>
                            
                Manage locally stored search systems
            </Button>
        </SheetTrigger>
            <SheetContent onClick={(event) => { event.stopPropagation();}}
                className="p-2 w-[375px] sm:w-[840px] sm:max-w-2xl p-2">
            <SheetHeader>
                <SheetTitle>Manage locally stored search systems</SheetTitle>
                <SheetDescription>You have {locallyStoredSearchSystems.length} locally stored search systems.</SheetDescription>
            </SheetHeader>
                <ManagePrivateSystems />
            </SheetContent>
        </Sheet>
    );
}

export default ManageLocallyStoredSearchSystemsSheet;

