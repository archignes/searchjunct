// __tests__/HandleMultisearchShortcut.test.tsx

import HandleMultisearch from '../search/HandleMultisearchShortcut';
import HandleMultisearchShortcut from '../search/HandleMultisearchShortcut';
import { System } from 'types/system';
import MultisearchShortcut from 'types/multisearch-shortcuts';
import { PreppedSearchLinkParams } from 'types/search';
import CopyQueryToClipboard from '../search/CopyQueryToClipboard';

jest.mock('../search/CopyQueryToClipboard');


const systems = [
    { id: 'sys1', name: 'System 1', search_link: 'https://example.com/system1' },
    { id: 'sys2', name: 'System 2', search_link: 'https://example.com/system2' },
    { id: 'sys3', name: 'System 3', search_link: 'https://example.com/system3' },
    { id: 'sys4', name: 'System 4', search_link: 'https://example.com/system4' },
];

describe('HandleMultisearch', () => {
    let cleanupSearchMock: jest.Mock;
    let preppedSearchLinkMock: jest.Mock;

    beforeEach(() => {
        cleanupSearchMock = jest.fn();
        preppedSearchLinkMock = jest.fn(({system, query}) => `search-link-${system.id}-${query}`);
        
        jest.spyOn(window, 'open').mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should handle always selected systems', async () => {
        const shortcut = {
            name: 'shortcut',
            systems: { always: ['sys1', 'sys2'], randomly: [] },
            count_from_randomly: 0,
        };
        const currentQuery = 'query';
        const cleanupSearchMock = jest.fn();
        const preppedSearchLinkMock = jest.fn(({system, query}: PreppedSearchLinkParams) => `search-link-${system.id}-${query}`);

        await HandleMultisearchShortcut({
            currentQuery,
            shortcut,
            systems,
            cleanupSearch: cleanupSearchMock,
            preppedSearchLink: preppedSearchLinkMock,
        });

        expect(window.open).toHaveBeenCalledWith('search-link-sys1-query', '_blank');
        expect(window.open).toHaveBeenCalledWith('search-link-sys2-query', '_blank');
        expect(cleanupSearchMock).toHaveBeenCalledWith(systems[0], 'query');
        expect(cleanupSearchMock).toHaveBeenCalledWith(systems[1], 'query');
    });
    it('should handle randomly selected systems', () => {
        const shortcut: MultisearchShortcut = {
            name: 'shortcut',
            systems: { always: [], randomly: ['sys1', 'sys2', 'sys3'] },
            count_from_randomly: 2,
        };
        const systems: System[] = [
            { id: 'sys1', name: 'System 1', search_link: 'search-link-sys1' },
            { id: 'sys2', name: 'System 2', search_link: 'search-link-sys2' },
            { id: 'sys3', name: 'System 3', search_link: 'search-link-sys3' },
        ];

        HandleMultisearch({
            currentQuery: '/shortcut query',
            shortcut,
            systems,
            cleanupSearch: cleanupSearchMock,
            preppedSearchLink: preppedSearchLinkMock,
        });

        expect(CopyQueryToClipboard).toHaveBeenCalledWith({query: 'query'});
        expect(window.open).toHaveBeenCalledTimes(2);
        expect(cleanupSearchMock).toHaveBeenCalledTimes(2);
    });

    test('should handle shortcut with no selected systems', () => {
        const shortcut = {
            name: 'empty',
            systems: { always: [], randomly: [] },
            count_from_randomly: 0,
        };
        const currentQuery = 'query';
        const cleanupSearchMock = jest.fn();
        const preppedSearchLinkMock = jest.fn();

        HandleMultisearchShortcut({
            shortcut,
            systems,
            currentQuery,
            cleanupSearch: cleanupSearchMock,
            preppedSearchLink: preppedSearchLinkMock,
        });

        expect(window.open).not.toHaveBeenCalled();
        expect(cleanupSearchMock).not.toHaveBeenCalled();
    });

    test('should search all available randomly systems when count_from_randomly exceeds length', () => {
        const shortcut = {
            name: 'overflow',
            systems: { always: [], randomly: ['sys1', 'sys2'] },
            count_from_randomly: 3,
        };
        const currentQuery = 'query';
        const cleanupSearchMock = jest.fn();
        const preppedSearchLinkMock = jest.fn(
            ({system, query}: PreppedSearchLinkParams) => `search-link-${system.id}-${query}`
        );

        HandleMultisearchShortcut({
            shortcut,
            systems,
            currentQuery,
            cleanupSearch: cleanupSearchMock,
            preppedSearchLink: preppedSearchLinkMock,
        });

        expect(window.open).toHaveBeenCalledTimes(2);
        expect(cleanupSearchMock).toHaveBeenCalledTimes(2);
    });

    test('should gracefully handle invalid or empty shortcut', () => {
        const invalidShortcut: any = {};
        const currentQuery = 'query';
        const cleanupSearchMock = jest.fn();
        const preppedSearchLinkMock = jest.fn();

        HandleMultisearchShortcut({
            shortcut: invalidShortcut,
            systems,
            currentQuery,
            cleanupSearch: cleanupSearchMock,
            preppedSearchLink: preppedSearchLinkMock,
        });

        expect(window.open).not.toHaveBeenCalled();
        expect(cleanupSearchMock).not.toHaveBeenCalled();
    });
});