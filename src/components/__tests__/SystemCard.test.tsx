// __tests__/SystemCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SystemCard from '../systems/Card.Page'; // Adjust the import path according to your project structure


// mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {},
    asPath: '',
    pathname: '',
  }),
}));

const system = {
  name: 'Test System',
  id: 'test-system',
  account_required: false,
  searchLink: 'https://www.google.com',
  mobile_app_breaksLinks_warning: false,
  searched: false,
  linkedinLink: 'https://www.linkedin.com',
  wikipediaLink: 'https://www.wikipedia.com',
};

describe('SystemCard', () => {

  it('renders with correct search link', () => {
    render(<SystemCard system={system} />)
    const searchLinkElement = screen.queryByText('https://www.google.com');
    if (!searchLinkElement) {
      console.error('Search link is missing:', system.searchLink);
    }
    expect(searchLinkElement).toBeInTheDocument();
  });

  it('renders with Disable button', () => {
    render(<SystemCard system={system} />);
    const disableButton = screen.queryByText('Disable');
    if (!disableButton) {
      console.error('Disable button is missing. Current screen contents:', screen.debug);
    }
    expect(disableButton).toBeInTheDocument();
  });

  it('renders with at least one link in system-card-footer', () => {
    render(<SystemCard system={system} />);
    const footer = screen.getByTestId('system-card-footer');
    expect(footer).toBeInTheDocument();
    const links = screen.queryAllByRole('link');
    if (links.length === 0) {
      console.error('No links found in the footer. Current screen contents:', screen.debug);
    }
    expect(links).not.toHaveLength(0);
  });
});
