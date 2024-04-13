// SettingsItem.tsx
import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardTitle, CardContent } from "@/src/components/ui/card";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/src/components/ui/accordion"

interface SettingsItemProps {
    title: string;
    disabled?: boolean;
    children: React.ReactNode;
    startOpen?: boolean;
}

interface SettingsTextProps {
    lines: string[];
}

interface SettingsButtonProps {
    onClick: () => void;
    ariaDisabled?: boolean;
    label: string;
    status?: string;
    variant?: "outline" | "destructive";
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick, label, ariaDisabled, status, variant }) => {
    return (
        <div className="flex flex-row items-center justify-left">
        <Button
            variant={variant || "outline"}
            className={`w-auto my-2 ${ariaDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}`}
            onClick={onClick}
            aria-disabled={ariaDisabled}>
            {label}
        </Button>
        { status && <span className="ml-2 text-xs text-gray-500">{status}</span>}
        </div>
    );
};

export const SettingsSubtitle: React.FC<{subtitle: string}> = ({ subtitle }) => {
    return (
        <div className="text-md font-bold">{subtitle}</div>
    );
};

export const SettingsText: React.FC<SettingsTextProps> = ({ lines }) => {
    return (    
        <div>
            {lines.map((line, index) => (
                <p key={index} className='text-sm py-1'>{line}</p>
            ))}
        </div>
    );
};

export const SettingsItem: React.FC<SettingsItemProps> = ({ title, disabled, children, startOpen }) => {
    const [isOpen, setIsOpen] = useState<boolean>(!!startOpen);
    const toggleOpen = () => setIsOpen(!isOpen);
    const openValue = isOpen ? "item-open" : "item-closed";

    return (
        <Accordion type="single" collapsible value={openValue} onValueChange={toggleOpen}>
            <AccordionItem value={openValue} className="mx-3">
                <Card className="rounded-md border-none bg-white pl-2 shadow-none mb-2">
                    <AccordionTrigger className="p-0" onClick={toggleOpen}>
                        <CardTitle className={`text-lg text-left py-0 ${disabled ? 'text-gray-500' : ''}`}>{title}</CardTitle>
                    </AccordionTrigger>
                    {isOpen && (
                        <AccordionContent>
                            <CardContent className="p-0 pl-2 flex items-left flex-col">
                                {children}
                            </CardContent>
                        </AccordionContent>
                    )}
                </Card>
            </AccordionItem>
        </Accordion>
        
            
        
    );
};