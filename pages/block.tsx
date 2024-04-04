// pages/block.tsx
// This page lets users block the plausible.io script from loading

import React, { useEffect } from 'react';

import { Button } from '../src/components/ui/button';

export default function BlockPage() {
  useEffect(() => {
    const handleLoad = () => {
      const exclusionState = window.localStorage.plausible_ignore === "true";
      const not = document.getElementById("plausible_not");
      const yes = document.getElementById("plausible_yes");
      const button = document.getElementById("plausible_button");

      if (exclusionState) {
        if (not && yes && button) {
          not.style.display = "none";
          yes.style.display = "inline";
          button.innerHTML = 'Stop excluding my visits';
        }
      } else {
        if (not && yes && button) {
          yes.style.display = "none";
          not.style.display = "inline";
          button.innerHTML = 'Exclude my visits';
        }
      }
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const toggleExclusion = () => {
    const exclusionState = window.localStorage.plausible_ignore === "true";
    const not = document.getElementById("plausible_not");
    const yes = document.getElementById("plausible_yes");
    const button = document.getElementById("plausible_button");

    if (exclusionState) {
      delete window.localStorage.plausible_ignore;
      if (yes && not && button) {
        yes.style.display = "none";
        not.style.display = "inline";
        button.innerHTML = 'Exclude my visits';
      }
    } else {
      window.localStorage.plausible_ignore = "true";
      if (not && yes && button) {
        not.style.display = "none";
        yes.style.display = "inline";
        button.innerHTML = 'Stop excluding my visits';
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl">Plausible.io Exclude</h1>
      <div>Click the button below to toggle your exclusion in analytics for this site</div>
      <div>You currently <span id="plausible_not">are not</span><span id="plausible_yes">are</span> excluding your visits.</div>
      <Button variant="outline" className="underline hover:bg-blue-100" id="plausible_button" onClick={e => { e.preventDefault(); toggleExclusion(); }}>Exclude my visits
      </Button>
    
      <div className="w-1/2">For more information on how this works, see the Plausible documentation <a className="underline hover:bg-blue-100 rounded-md p-1" href="https://plausible.io/docs/excluding-localstorage">"Opt out and exclude your visits from the analytics by setting a localStorage flag in your browser"</a></div>
    </div>
  );
}