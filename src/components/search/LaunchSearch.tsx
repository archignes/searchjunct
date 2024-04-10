import React from "react";
import { System, Query } from "@/types";

interface LaunchSearchProps {
    preppedSearchLink: string;
    queryObject: Query;
    system: System;
}

const LaunchSearch: React.FC<LaunchSearchProps> = ({ preppedSearchLink, system, queryObject }) => {
    if (queryObject.query === "" && system.search_link_requires_query) {
        alert(`This search link requires a query. Please enter a query and try again. Note: ${system.search_link_note}`);
    } else {
        window.open(preppedSearchLink, '_blank');
    }
    return null;
}

export default LaunchSearch;
