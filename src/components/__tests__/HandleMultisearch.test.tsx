import HandleMultisearch from '../multisearch/HandleMultisearch';
import { System } from 'types/system';
import MultisearchShortcut from 'types/multisearch-shortcuts';

describe('HandleMultisearch', () => {
    let cleanupSearchMock: jest.Mock;
    let preppedSearchLinkMock: jest.Mock;

    beforeEach(() => {
        cleanupSearchMock = jest.fn();
        preppedSearchLinkMock = jest.fn((system, query) => `search-link-${system.id}-${query}`);

        // Mock navigator.clipboard
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn(),
            },
        });
        
        jest.spyOn(navigator.clipboard, 'writeText');
        jest.spyOn(window, 'open').mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should handle always selected systems', () => {
        const shortcut: MultisearchShortcut = {
            name: 'shortcut',
            systems: { always: ['sys1', 'sys2'], randomly: [] },
            count_from_randomly: 0,
        };
        const systems: System[] = [
            { id: 'sys1', name: 'System 1', search_link: 'search-link-sys1' },
            { id: 'sys2', name: 'System 2', search_link: 'search-link-sys2' },
        ];

        HandleMultisearch({
            currentQuery: '/shortcut query',
            shortcut,
            systems,
            cleanupSearch: cleanupSearchMock,
            preppedSearchLink: preppedSearchLinkMock,
        });

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('query');
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

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('query');
        expect(window.open).toHaveBeenCalledTimes(2);
        expect(cleanupSearchMock).toHaveBeenCalledTimes(2);
    });

    // Add more test cases for other scenarios...
});