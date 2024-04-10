// __tests__/SortContext.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SortProvider, useSortContext, shuffleSystems } from '../SortContext';
import { StorageProvider } from '../StorageContext';
import { SystemsProvider } from '../SystemsContext';
import { AddressProvider } from '../AddressContext';
import '@testing-library/jest-dom';

const TestComponent = () => {
    const { sortStatus, customSort, toggleAlphabeticalSortOrder, setShuffleSystems, updateDragOrder } = useSortContext();

    return (
        <div>
            <div data-testid="sort-status">{sortStatus}</div>
            <button onClick={() => customSort("click")}>Custom Sort</button>
            <button onClick={toggleAlphabeticalSortOrder}>Toggle Alphabetical Sort</button>
            <button onClick={() => setShuffleSystems(true)}>Shuffle Systems</button>
            <button onClick={() => updateDragOrder([
                { id: 'system-1', name: 'System 1', searchLink: 'https://example.com/system1' },
                { id: 'system-2', name: 'System 2', searchLink: 'https://example.com/system2' }])}>
                Update Drag Order
            </button>
        </div>
    );
};

const mockSystems = [
    { id: 'system-1', name: 'System 1', searchLink: 'https://example.com/system1' },
    { id: 'system-2', name: 'System 2', searchLink: 'https://example.com/system2' },
    { id: 'system-3', name: 'System 3', searchLink: 'https://example.com/system3' }
];

describe('SortContext', () => {
    it('should start in initial sort start', () => {
        render(
            <StorageProvider>
                <SystemsProvider testSystems={mockSystems}>
                    <AddressProvider>
                        <SortProvider>
                            <TestComponent />
                        </SortProvider>
                    </AddressProvider>
                </SystemsProvider>
            </StorageProvider>
        );

        expect(screen.getByTestId('sort-status')).toHaveTextContent('shuffled');
    });

    it('should update the sort status when custom sort is triggered', () => {
        render(
            <StorageProvider>
                <SystemsProvider testSystems={mockSystems}>
                    <AddressProvider>
                        <SortProvider>
                            <TestComponent />
                        </SortProvider>
                    </AddressProvider>
                </SystemsProvider>
            </StorageProvider>
        );

        fireEvent.click(screen.getByText('Update Drag Order'));
        expect(screen.getByTestId('sort-status')).toHaveTextContent('custom');
        fireEvent.click(screen.getByText('Shuffle Systems'));
        expect(screen.getByTestId('sort-status')).toHaveTextContent('shuffled');
        fireEvent.click(screen.getByText('Custom Sort'));
        expect(screen.getByTestId('sort-status')).toHaveTextContent('custom');
    });

    it('should toggle the alphabetical sort order', () => {
        render(
            <StorageProvider>
                <SystemsProvider testSystems={mockSystems}>
                    <AddressProvider>
                        <SortProvider>
                            <TestComponent />
                        </SortProvider>
                    </AddressProvider>
                </SystemsProvider>
            </StorageProvider>
        );

        fireEvent.click(screen.getByText('Toggle Alphabetical Sort'));
        expect(screen.getByTestId('sort-status')).toHaveTextContent('abc');

        fireEvent.click(screen.getByText('Toggle Alphabetical Sort'));
        expect(screen.getByTestId('sort-status')).toHaveTextContent('zyx');
    });

    it('should shuffle the systems', () => {
        render(
            <StorageProvider>
                <SystemsProvider testSystems={mockSystems}>
                    <AddressProvider>
                        <SortProvider>
                            <TestComponent />
                        </SortProvider>
                    </AddressProvider>
                </SystemsProvider>
            </StorageProvider>
        );

        fireEvent.click(screen.getByText('Shuffle Systems'));
        expect(screen.getByTestId('sort-status')).toHaveTextContent('shuffled');
    });

    it('should update the drag order', () => {
        render(
            <StorageProvider>
                <SystemsProvider testSystems={mockSystems}>
                    <AddressProvider>
                        <SortProvider>
                            <TestComponent />
                        </SortProvider>
                    </AddressProvider>
                </SystemsProvider>
            </StorageProvider>
        );

        fireEvent.click(screen.getByText('Update Drag Order'));
        expect(screen.getByTestId('sort-status')).toHaveTextContent('custom');
    });
});

describe('shuffleSystems', () => {
    it('should shuffle the systems', () => {
        const shuffled = shuffleSystems(mockSystems);
        expect(shuffled).not.toEqual(mockSystems);
        expect(shuffled).toHaveLength(mockSystems.length);
        expect(shuffled.every(system => mockSystems.includes(system as { id: string; name: string; searchLink: string; }))).toBe(true);    });
});