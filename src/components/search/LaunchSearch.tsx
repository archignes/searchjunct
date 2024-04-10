import React from "react";
import { System, Query } from "@/types";

interface LaunchSearchProps {
    preppedSearchLink: string;
    queryObject: Query;
    system: System;
}

const LaunchSearch: React.FC<LaunchSearchProps> = ({ preppedSearchLink, system, queryObject }) => {
    if (queryObject.query === "" && system.searchLink_requires_query) {
        alert(`This search link requires a query. Please enter a query and try again. Note: ${system.searchLink_note}`);
    } else {
        window.open(preppedSearchLink, '_blank');
    }
    return null;
}

export default LaunchSearch;
