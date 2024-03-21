import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SystemCard from '../cards/SystemCard'; // Adjust the import path according to your project structure

const system = {
  name: 'Test System',
  id: 'test-system',
  account_required: false,
  search_link: 'https://www.google.com',
  mobile_app_breaks_links_warning: false,
  searched: false,
  linkedin_link: 'https://www.linkedin.com',
  wikipedia_link: 'https://www.wikipedia.com',
};

describe('SystemCard', () => {

  it('renders with correct search link', () => {
    render(<SystemCard system={system} />);

    expect(screen.getByText('https://www.google.com')).toBeInTheDocument();
  });
  it('renders with Disable and Delete buttons', () => {
    render(<SystemCard system={system} />);

    expect(screen.getByText('Disable')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  it('renders with at least one link in system-card-footer', () => {
    render(<SystemCard system={system} />);
    const footer = screen.getByTestId('system-card-footer');
    expect(footer).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).not.toHaveLength(0);
  });
});

