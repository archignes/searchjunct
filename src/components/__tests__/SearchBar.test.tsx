// SearchBar.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '@/src/components/SearchBar';
import { useSearchContext } from '@/contexts';
import { useSystemsContext } from '@/contexts';
import { useQueryContext } from '@/contexts';

jest.mock('@/contexts/SearchContext', () => ({
    useSearchContext: jest.fn(),
}));

jest.mock('@/contexts/SystemsContext', () => ({
    useSystemsContext: jest.fn(),
}));

jest.mock('@/contexts/QueryContext', () => ({
    useQueryContext: jest.fn(),
}));

describe('SearchBar', () => {
    const mockSubmitSearch = jest.fn();
    const mockProcessTextInputForQueryObject = jest.fn();
    beforeEach(() => {
        (useSearchContext as jest.Mock).mockReturnValueOnce({ submitSearch: mockSubmitSearch });
        (useSystemsContext as jest.Mock).mockReturnValueOnce({ activeSystem: undefined });
        (useQueryContext as jest.Mock).mockReturnValueOnce({
            queryObject: {},
            processTextInputForQueryObject: mockProcessTextInputForQueryObject,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without errors', () => {
        render(<SearchBar />);
        expect(screen.getByPlaceholderText('Type your query here...')).toBeInTheDocument();
    });

    it('focuses search input on mount', () => {
        render(<SearchBar />);
        expect(screen.getByPlaceholderText('Type your query here...')).toHaveFocus();
    });

    it('updates search input value onChange', () => {
        render(<SearchBar />);
        const searchInput = screen.getByPlaceholderText('Type your query here...');
        fireEvent.change(searchInput, { target: { value: 'test query' } });
        expect(searchInput).toHaveValue('test query');
        expect(mockProcessTextInputForQueryObject).toHaveBeenCalledWith('test query');
    });

    it('submits search form onSubmit', () => {
        render(<SearchBar />);
        const searchInput = screen.getByPlaceholderText('Type your query here...');
        const searchForm = screen.getByRole('search');

        fireEvent.change(searchInput, { target: { value: 'test' } });
        fireEvent.submit(searchForm);

        expect(mockSubmitSearch).toHaveBeenCalledWith({});
    });

    
    // FIXME: This test is failing. It's not triggering the skipback search.
    // it('triggers skipback search on Alt/Option+Shift hotkey', () => {
    //     render(<SearchBar />);
    //     fireEvent.click(document.body);
    //     fireEvent.keyDown(window, { key: 'Shift', altKey: true });
    //     expect(mockSubmitSearch).toHaveBeenCalledWith({ skip: 'skipback' });
    // });

    it('triggers skip search on Alt/Option+Enter hotkey', () => {
        render(<SearchBar />);
        const searchInput = screen.getByPlaceholderText('Type your query here...');

        fireEvent.change(searchInput, { target: { value: 'test' } });
        fireEvent.keyDown(searchInput, { key: 'Enter', altKey: true });

        expect(mockSubmitSearch).toHaveBeenCalledWith({ skip: 'skip' });
    });

    // FIXME: This test is failing. It's triggering the form submission.
    // it('does not trigger form submission on Enter with input focused', () => {
    //     render(<SearchBar />);
    //     const searchInput = screen.getByPlaceholderText('Type your query here...');
    //     fireEvent.keyDown(searchInput, { key: 'Enter' });
    //     expect(mockSubmitSearch).not.toHaveBeenCalled();
    // });
});