import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../Searchbar';
import { SearchProvider } from '../contexts/SearchContext';
import { SystemProvider } from '../contexts/SystemsContext';
import { StorageProvider } from '../contexts/StorageContext';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('SearchBar Component', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            query: {},
        });
    });

    beforeEach(() => {
        // Mock the navigator.clipboard.writeText function
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn().mockResolvedValue(undefined),
            },
        });
    });

    
    it('updates the document title with the search query upon submission', async () => {
        render(
            <StorageProvider>
                <SystemProvider>
                    <SearchProvider>
                        <SearchBar />
                    </SearchProvider>
                </SystemProvider>
            </StorageProvider>
        );
        const query = 'test query';
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: query } });
        fireEvent.submit(input);

        console.log('Document title after submission:', document.title);

        await waitFor(() => {
            expect(document.title).toBe(`[${query}] - Searchjunct`);
        }, { timeout: 5000 });
    });
});