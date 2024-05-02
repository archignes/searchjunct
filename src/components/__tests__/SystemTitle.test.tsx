import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for extended matchers
import { SystemTitle } from '../systems/Title';
import { System } from '../../types/system';
import { baseSystems } from '../../contexts/SystemsContext';

describe('SystemTitle Component', () => {
  baseSystems.slice(0, 3).forEach((system: System) => {
    const expectedName = system.name.replace(' - ', ' ');

    it(`renders ${expectedName} without crashing`, () => {
      render(<SystemTitle system={system} />);
      expect(screen.getByText(expectedName)).toBeInTheDocument();
    });

    it(`displays the correct name for ${expectedName}`, () => {
      render(<SystemTitle system={system} />);
      expect(screen.getByText(expectedName)).toBeInTheDocument();
    });
  });
});