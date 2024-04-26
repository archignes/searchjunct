import React from 'react';
import Image from 'next/image';

import { System } from '@/types';

const responsiveClassItems = "w-full max-w-full h-auto"

export const SpecialFeatureImage: React.FC<{ image: string, title: string }> = ({ image, title }) => {
  if (!image) return null;

  return (
    <Image
      src={`/screenshots/special_features/${image}`}
      alt={`Screenshot of ${title}`}
      width={500}
      height={500}
      className={`${responsiveClassItems} rounded-md border m-1 mx-auto`}
      loading="lazy"
    />
    );
};

export const LandingPageScreenshots: React.FC<{ system: System }> = ({ system }) => {
  const screenshots = system.landingPageScreenshots;

  if (!screenshots || screenshots.length === 0) {
    return null; // No images to display
  }

  return (
    <div className="my-1 flex flex-col sm:flex-row gap-1 justify-center w-full">
      {screenshots.slice(0, 2).map((screenshot, index) => {
        const isWide = index === 1; // Assume second image might be wider

        return (
          <div
            key={index}
            className={`${isWide ? 'sm:w-2/3' : 'sm:w-1/3'}`} // Adjust width for second image
          >
            <Image
              src={`/screenshots/landing_pages/${screenshot}`}
              alt={`Screenshot ${index + 1}`}
              width={isWide ? 800 : 400} // Wider for second image
              height={422}
              className="rounded-md border"
              quality={100} // Retain high quality
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
};
