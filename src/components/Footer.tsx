import React from "react";
import { GitHubLogoIcon, TwitterLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';
import { Button } from "./shadcn-ui/button";
import { Input } from ".//shadcn-ui//input";
import Image from 'next/image';
const lastUpdated = "2024-03-23T08:58:57.452Z";

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
