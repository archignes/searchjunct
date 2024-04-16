import React from "react";
import { System, Query } from "@/types";


interface LaunchSearchProps {
    preppedSearchLink: string;
    queryObject: Query;
    system: System;
}
const LaunchSearch: React.FC<LaunchSearchProps> = ({ preppedSearchLink, system, queryObject }) => {
    let modifiedSearchLink = preppedSearchLink;
    console.log(window.location.href);
    if (window.location.href.startsWith("http://localhost:3000")) {
        const encoded_original_url = encodeURIComponent(preppedSearchLink);
        modifiedSearchLink = `http://localhost:3000/testing/?url=${encoded_original_url}`;
    }
    if (queryObject.query === "" && system.searchLinkRequiresQuery) {
        console.log("should alert")
    } else {
        window.open(modifiedSearchLink, '_blank');
    }
    return null;
}

export default LaunchSearch;
