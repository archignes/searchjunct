import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../SearchBar';
import SystemList from '../SystemList';
import { SearchProvider } from '../contexts/SearchContext';
import { SystemProvider } from '../contexts/SystemsContext';
import { StorageProvider } from '../contexts/StorageContext';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

describe('System List', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            query: {},
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
        const systemList = screen.getByTestId('system-list');
        fireEvent.scroll(systemList, { target: { scrollY: systemList.scrollHeight } });
        console.log('Scroll event fired', systemList.scrollHeight);
        const numberOfSystemsElement = await screen.findByText('Number of systems');
        expect(numberOfSystemsElement).toBeInTheDocument();
    });
});