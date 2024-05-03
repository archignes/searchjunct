import React from "react";
const lastUpdated = "2024-05-03T05:46:13.941Z";

const LastUpdated: React.FC = () => {
  return (
      <p>Last Updated: <span id="last-updated-placeholder" title={new Date(lastUpdated).toLocaleString()}>{lastUpdated} UTC</span></p>
    );
};

export default LastUpdated;
