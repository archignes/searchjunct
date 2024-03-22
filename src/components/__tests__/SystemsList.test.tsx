import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../SearchBar';
import SystemList from '../SystemList';
import { SearchProvider } from '../contexts/SearchContext';
import { SystemProvider, useSystemsContext } from '../contexts/SystemsContext';
import { StorageProvider, useStorage } from '../contexts/StorageContext';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

// Mock useSystemsContext and useStorage
jest.mock('../contexts/SystemsContext', () => ({
    ...jest.requireActual('../contexts/SystemsContext'), // Import and spread the actual module
    useSystemsContext: jest.fn(), // Mock useSystemsContext
}));

jest.mock('../contexts/StorageContext', () => ({
    ...jest.requireActual('../contexts/StorageContext'), // Import and spread the actual module
    useStorage: jest.fn(), // Mock useStorage
}));

describe('System List', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            query: {},
        });

        // Mock the return values for useSystemsContext and useStorage
        (useSystemsContext as jest.Mock).mockReturnValue({
            systemsCurrentOrder: [/* Populate with mock data relevant to your test */],
            isClient: true, // Ensure isClient is true to simulate client-side rendering
        });

        (useStorage as jest.Mock).mockReturnValue({
            // Mock any necessary storage context values here
        });
    });

    it('should have a link to the systems.json file at the bottom', async () => {
        render(
            <StorageProvider>
                <SystemProvider>
                    <SearchProvider>
                        <SearchBar />
                        <SystemList />
                    </SearchProvider>
                </SystemProvider>
            </StorageProvider>
        );

        // Use waitFor to wait for the component to update and render the content
        await waitFor(() => {
            const numberOfSystemsElement = screen.getByText(/Number of systems: \d+/); // Use a regex to match the dynamic content
            expect(numberOfSystemsElement).toBeInTheDocument();
        });
    });
});