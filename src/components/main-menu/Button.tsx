// MainMenuButton.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import { Button } from "@/src/components/ui/button";
import { useAppContext } from "@/contexts";

type MainMenuButtonProps = {
    TargetIcon: JSX.Element;
    TargetComponent: JSX.Element;
    TargetTitle: string;
    TargetTooltip: string;
    ButtonIndex: number;
    PortalButton?: {label: string};
};

type TargetButtonProps = {
    isButtonTargetOpen: boolean;
    TargetIcon: JSX.Element;
    toggleButtonTargetOpen: () => void;
    TargetTitle: string;
};

const TargetButton: React.ForwardRefRenderFunction<HTMLButtonElement, TargetButtonProps> = (
    { isButtonTargetOpen, TargetIcon, toggleButtonTargetOpen, TargetTitle },
    ref
) => {
    const { isMainMenuExpanded } = useAppContext();

    return (
        <Button
            ref={ref}
            id={`${TargetTitle.toLowerCase().replace(/ /g, "-")}-button`}
            variant="ghost"
            size="sm"
            onClick={toggleButtonTargetOpen}
            className={`p-0 h-7 px-1 flex items-center justify-center ${isButtonTargetOpen ? "bg-blue-500 text-white hover:bg-blue-600" : "text-current hover:bg-blue-100"
                }`}
        >
            {React.cloneElement(TargetIcon, {
                className: `w-4 h-4 ${isButtonTargetOpen ? "text-white" : "text-current"}`,
            })}
            {isMainMenuExpanded && <span className="ml-2">{TargetTitle}</span>}
        </Button>
    );
};

const TargetButtonWithRef = React.forwardRef(TargetButton);


export const MainMenuButton: React.FC<MainMenuButtonProps> = ({
    TargetIcon,
    TargetComponent,
    TargetTitle,
    TargetTooltip,
    ButtonIndex,
    PortalButton,
}: MainMenuButtonProps) => {
    const [isButtonTargetOpen, setIsButtonTargetOpen] = useState<boolean>(false);
    const { isAddSearchSystemOpen, toggleIsAddSearchSystemOpen } = useAppContext();

    useEffect(() => {
        if (TargetTitle === "Add") {
            setIsButtonTargetOpen(isAddSearchSystemOpen);
        }
    }, [isAddSearchSystemOpen, TargetTitle]);

    const popoverContentRef = useRef<HTMLDivElement>(null);
    const { setIsMainMenuExpanded } = useAppContext();


    const toggleButtonTargetOpen = useCallback(() => {
        setIsButtonTargetOpen((prevState) => !prevState);
        if (TargetTitle === "Add") {
            toggleIsAddSearchSystemOpen();
        }
    }, [TargetTitle, toggleIsAddSearchSystemOpen]);

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const buttonId = `${TargetTitle.toLowerCase().replace(/ /g, "-")}-button`;
            const isClickedInsidePopover = popoverContentRef.current?.contains(target);
            const isClickedInsideButton = document.getElementById(buttonId)?.contains(target);

            if (!isClickedInsideButton && !isClickedInsidePopover) {
                setIsButtonTargetOpen(false);
            }
        };

        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [TargetTitle]);

    useEffect(() => {
        if (window.innerWidth < 640 && isButtonTargetOpen) {
            setIsMainMenuExpanded(false);
        }
    }, [isButtonTargetOpen, setIsMainMenuExpanded]);

    return (
        <Popover open={isButtonTargetOpen} onOpenChange={setIsButtonTargetOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <TargetButtonWithRef
                                isButtonTargetOpen={isButtonTargetOpen}
                                TargetIcon={TargetIcon}
                                toggleButtonTargetOpen={toggleButtonTargetOpen}
                                TargetTitle={TargetTitle}
                            />
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-base">
                        {TargetTooltip}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <PopoverContent style={{ width: '92vw' }} ref={popoverContentRef}
                side="right" sideOffset={3}
                align="start" alignOffset={-28 * ButtonIndex} 
                className="border-none w-auto rounded-md min-h-[200px] p-0 max-w-[650px]">
                {TargetComponent}
            </PopoverContent>
        </Popover>
    );
};