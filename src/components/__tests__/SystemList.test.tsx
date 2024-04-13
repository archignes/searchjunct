// __tests__/SystemsList.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for extended matchers
import SystemList from '../SystemList';

describe('SystemList Component', () => {
  it('renders without crashing', () => {
    render(<SystemList />);
    expect(screen.getByTestId('system-list')).toBeInTheDocument();
  });
});
