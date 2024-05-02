import React from "react";
const lastUpdated = "2024-05-02T06:18:57.024Z";

const LastUpdated: React.FC = () => {
  return (
      <p>Last Updated: <span id="last-updated-placeholder" title={new Date(lastUpdated).toLocaleString()}>{lastUpdated} UTC</span></p>
    );
};

export default LastUpdated;
