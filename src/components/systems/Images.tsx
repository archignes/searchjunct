import React from 'react';
import Image from 'next/image';

import { System } from '@/types';
import { useAddressContext } from '@/contexts/AddressContext';

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

export const PageScreenshots: React.FC<{ system: System }> = ({ system }) => {
  const { shareCardPage, systemPage } = useAddressContext();
  const combinedScreenshots = [
    ...(system.exampleSerpScreenshots?.map(ss => `example_serps/${ss}`) || []),
    ...(system.landingPageScreenshots?.map(ss => `landing_pages/${ss}`) || [])
  ];
  


  if (!combinedScreenshots || combinedScreenshots.length === 0) {
    return null; // No images to display
  }

  if (shareCardPage) {
    const imageSrc = combinedScreenshots[0];
    return (
      <Image
        src={`/screenshots/${imageSrc}`}
        alt={`Share card screenshot`}
        width={390}
        height={844}
        className="rounded-md border"
        quality={100} // Retain high quality
        loading="lazy"
      />
    )}

    if (systemPage) {
      return (
        <div className={`my-1 ${shareCardPage ? 'flex flex-col sm:flex-row gap-1 justify-center w-full' : ''}`}>
          {combinedScreenshots.map((screenshot, index) => {
          const isWide = index === 1; // Assume second image might be wider

          return (
            <div
              key={index}
              className={`mx-auto ${isWide ? 'sm:w-2/3' : 'sm:w-1/3'}`} // Adjust width for second image
            >
              <Image
                src={`/screenshots/${screenshot}`}
                alt={`Screenshot ${index + 1}`}
                width={isWide ? 800 : 400}
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
  return null;
}


