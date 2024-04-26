import React from 'react';
import Image from 'next/image';

import { System } from '@/types';


export const SpecialFeatureImage: React.FC<{ image: string, title: string }> = ({ image, title }) => {
  if (!image) return null;

  return (
    <Image
      src={`/screenshots/special_features/${image}`}
      alt={`Screenshot of ${title}`}
      layout="responsive"
      width={500}
      height={500}
      className="rounded-md border m-1 mx-auto"
    />
    );
};

export const LandingPageScreenshots: React.FC<{ system: System }> = ({ system }) => {
  if (!system.landingPageScreenshots) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-center">
      {system.landingPageScreenshots.map((screenshot, index) => {
        const isQueryExample = screenshot.includes("query_example");
        return (
          <div key={index} className="m-1">
            <Image
              src={`/screenshots/landing_pages/${screenshot}`}
              alt={`Screenshot ${index + 1}`}
              layout="responsive"
              width={isQueryExample ? 300 : 100}
              height={isQueryExample ? 300 : 100}
              className="rounded-md border mx-auto"
            />
          </div>
        );
      })}
    </div>
  );
};
