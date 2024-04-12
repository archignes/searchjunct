import React from "react";
const lastUpdated = "2024-04-12T22:46:19.386Z";

const Footer: React.FC = () => {
  return (
    <footer className="p-4 mt-5 w-full text-center">
      Discover your search engines, route your queries.
    <div className="text-center mt-4 text-xs">
      <p>Last Updated: <span id="last-updated-placeholder" title={new Date(lastUpdated).toLocaleString()}>{lastUpdated} UTC</span></p>
    </div>
    </footer>
  );
};

export default Footer;
