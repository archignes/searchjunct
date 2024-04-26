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
    <ul>
      {system.landingPageScreenshots.map((screenshot, index) => (
        <li key={index}>
          <Image
            src={`/screenshots/landing_pages/${screenshot}`}
            alt={`Screenshot ${index + 1}`}
            width={150}
            height={150}
            className="rounded-md border m-1 mx-auto"
          />
        </li>
      ))}
    </ul>
  );
};