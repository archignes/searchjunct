import React from 'react';
import { render, screen } from '@testing-library/react';
import SystemList from '../SystemList';
import { StorageProvider, SystemsProvider, SearchProvider } from '../../contexts/';
import systemsData from '../../data/systems.json';

// Mock data
const systemsMock = [
    { id: "system-1", name: 'System 1', search_link: "ddd" },
    { id: "system-2", name: 'System 2', search_link: "ddd" }
];

// Mock SystemsContext
const MockSystemProvider = ({ children }: { children: React.ReactNode }) => (
    <SystemsProvider testSystems={systemsMock}>
        {children}
    </SystemsProvider>
);


const systemsDataLength = systemsData.length;


// Helper function to render the component within its required providers
function renderSystemList() {
    return render(
        <StorageProvider>
            <MockSystemProvider>
                <SearchProvider>
                    <SystemList />
                </SearchProvider>
            </MockSystemProvider>
        </StorageProvider>
    );
}

// Test cases
describe('SystemList Component', () => {
    it('renders without crashing with initialized data', async () => {
        // Act
        renderSystemList();
        // Assert
        await screen.findByText(/Showing/i);
    });

    it('displays the correct number of systems in the link', async () => {
        // Act
        renderSystemList();
        // Assert
        const link = await screen.findByRole('link', { name: /Showing/i });
        expect(link).toHaveTextContent(`${systemsDataLength} systems`);
    });
});