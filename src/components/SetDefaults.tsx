import { useEffect } from "react";
import { MultisearchActionObject } from "@/types";
import { useStorageContext } from "../contexts";

const SetDefaults: React.FC = () => {
    const { addMultisearchActionObject, multisearchActionObjects } = useStorageContext();
    useEffect(() => {
        const defaultShortcutNames = ["links", "beta"];
        if (
            JSON.parse(localStorage.getItem('multisearchActionObjects') || '[]')
                .some((shortcut: MultisearchActionObject) => defaultShortcutNames.includes(shortcut.name))
            || localStorage.getItem('defaultMultisearchesHaveBeenDeleted') === 'true'
        ) {
            return;
        }
        const defaultShortcuts = [
            {
                name: "links",
                systems: {
                    always: ["google"],
                    randomly: ["kagi", "brave", "you-com", "mojeek", "yep", "duckduckgo", "exa"],
                },
                count_from_randomly: 2,
                description: "Searches from alternative systems with an emphasis on links (and Google as a backup)",
            },
            {
                name: "beta",
                systems: {
                    always: [],
                    randomly: ["ask-pandi", "findera", "globe-explorer", "komo", "lepton-search"],
                },
                count_from_randomly: 3,
                description: "Searches systems in beta and demos",
            }
        ];

        defaultShortcuts.forEach(shortcut => {
            addMultisearchActionObject(shortcut);
        });
    }, [addMultisearchActionObject, multisearchActionObjects]);

    return null;
}

export default SetDefaults;