import React from "react";
const lastUpdated = "2024-05-03T17:46:41.541Z";

const LastUpdated: React.FC = () => {
  return (
      <p>Last Updated: <span id="last-updated-placeholder" title={new Date(lastUpdated).toLocaleString()}>{lastUpdated} UTC</span></p>
    );
};

export default LastUpdated;
