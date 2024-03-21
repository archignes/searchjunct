import React from "react";
import { GitHubLogoIcon, TwitterLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';
import { Button } from "./shadcn-ui/button";
import { Input } from ".//shadcn-ui//input";
import Image from 'next/image';
const lastUpdated = "2024-02-21T00:47:33.762Z";

const Footer: React.FC = () => {
  return (
    <footer className="p-4 mt-5 w-full border-t">
      <div className="flex justify-center items-center space-x-4"><a href="https://github.com/danielsgriffin/searchjunct" target="_blank" rel="noopener noreferrer">
        <GitHubLogoIcon className="text-gray-600 hover:text-gray-900" />
      </a>
        <a href="https://twitter.com/danielsgriffin" target="_blank" rel="noopener noreferrer">
        <TwitterLogoIcon className="text-blue-400 hover:text-blue-600" />
      </a>
        <a href="https://www.linkedin.com/in/danielsgriffin/" target="_blank" rel="noopener noreferrer">
        <LinkedInLogoIcon className="text-blue-600 hover:text-blue-800" />
      </a>
      </div>
      <div className="flex justify-center mb-4">
        <Image
          id="magnifying-glass-logo-footer"
          src="/searchjunct.svg"
          alt="Searchjunct Logo"
          width={30}
          height={30}
        />
        <p className="text-center px-2 overflow-hidden break-words">Made with deliberate doubt<br></br>by <a className="underline" href="https://danielsgriffin.com">Daniel Griffin, Ph.D.</a></p>
        <div className="w-12"></div>
      </div>
      <div className="flex mx-auto justify-center items-center space-x-4 md:w-1/3 w-full">
        <form
        action="https://buttondown.email/api/emails/embed-subscribe/danielsgriffin"
        method="post"
        target="popupwindow"
        onSubmit={(e) => {
          e.preventDefault();
          window.open('https://buttondown.email/danielsgriffin', 'popupwindow');
        }}
        className="embeddable-buttondown-form"
      >
        <label className="text-center" htmlFor="bd-email">Sign up to receive updates.</label>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="email" name="email" id="bd-email" placeholder="Email" />
          <Button type="submit" value="Subscribe">Subscribe</Button>
        </div>
        <p className="text-xs">
            <a href="https://buttondown.email/refer/danielsgriffin" target="_blank" rel="noopener noreferrer">Powered by Buttondown.</a>
        </p>
      </form>
      </div>
    <div className="text-center mt-4 text-xs">
      <p>Last Updated: <span id="last-updated-placeholder" title={new Date(lastUpdated).toLocaleString()}>{lastUpdated} UTC</span></p>
    </div>
    </footer>
  );
};

export default Footer;
