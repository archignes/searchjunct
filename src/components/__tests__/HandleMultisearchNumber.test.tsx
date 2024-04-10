// __tests__/HandleMultisearchNumber.test.tsx
import HandleMultisearchNumber, { MultisearchNumberShortcut } from '../search/HandleMultisearchNumber';
import { PreppedSearchLinkParams } from'@/types';
import { CopyQueryToClipboard } from '../search/';

jest.mock('../search/CopyQueryToClipboard');

describe('HandleMultisearchNumber', () => {
    let windowOpenSpy: jest.SpyInstance;
    let sessionStorageSpy: jest.SpyInstance;

    beforeEach(() => {
        windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
        sessionStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
    });

    afterEach(() => {
        windowOpenSpy.mockRestore();
        sessionStorageSpy.mockRestore();
    });

    it('should remove numeric shortcut from query', () => {
        // Arrange
        const systems = [
            { id: 'system-1', name: 'System 1', search_link: 'https://system1.com/search?q=%s' },
            { id: 'system-2', name: 'System 2', search_link: 'https://system2.com/search?q=%s' },
            { id: 'system-3', name: 'System 3', search_link: 'https://system3.com/search?q=%s' }
        ];
        const cleanupSearch = jest.fn();
        const getPreppedSearchLink = (params: PreppedSearchLinkParams) =>
            `${params.system.name}/search?q=${params.query}`;
        const shortcut: MultisearchNumberShortcut = {
            type: 'multisearch_number',
            name: 'test_shortcut',
            action: 3
        };

        // Act
        HandleMultisearchNumber({
            queryObject: {
                rawString: 'test /3',
                query: 'test',
                shortcut: shortcut,
                in_address_bar: false,
                from_address_bar: false,
            },
            systemsToSearch: systems,
            cleanupSearch,
            getPreppedSearchLink,
        });

        // Assert
        expect(CopyQueryToClipboard).toHaveBeenCalledWith({query: 'test'});
    });

    it('should perform multi-search on all provided systems', async () => {
        // Arrange
        const systems = [
            { id: 'system-1', name: 'System 1', search_link: 'https://system1.com/search?q=%s' },
            { id: 'system-2', name: 'System 2', search_link: 'https://system2.com/search?q=%s' },
            { id: 'system-3', name: 'System 3', search_link: 'https://system3.com/search?q=%s' }
        ];
        const cleanupSearch = jest.fn();
        const getPreppedSearchLink = (params: PreppedSearchLinkParams) =>
            `${params.system.name}/search?q=${params.query}`;
        const shortcut: MultisearchNumberShortcut = {
            type: 'multisearch_number',
            name: 'test_shortcut',
            action: 3
        };

        // Act
        HandleMultisearchNumber({
            queryObject: {
                rawString: 'test /3',
                query: 'test',
                shortcut: shortcut,
                in_address_bar: false,
                from_address_bar: false,
            },
            systemsToSearch: systems,
            cleanupSearch,
            getPreppedSearchLink,
        });

        // Assert
        expect(CopyQueryToClipboard).toHaveBeenCalledWith({ query: 'test' });
        expect(windowOpenSpy).toHaveBeenCalledTimes(3);
        expect(cleanupSearch).toHaveBeenCalledTimes(3);
        systems.forEach(system => {
            expect(cleanupSearch).toHaveBeenCalledWith(system, 'test');
        });
    });


    it('should handle empty search query', async () => {
        // Arrange
        const systems = [
            { id: 'system-1', name: 'System 1', search_link: 'https://system1.com/search?q=' },
            { id: 'system-2', name: 'System 2', search_link: 'https://system2.com/search?q=' }
        ];
        const cleanupSearch = jest.fn();
        const getPreppedSearchLink = (params: PreppedSearchLinkParams) =>
            `${params.system.name}/search?q=${params.query}`;
        const shortcut: MultisearchNumberShortcut = {
            type: 'multisearch_number',
            name: 'test_shortcut',
            action: 2
        };

        // Act
        HandleMultisearchNumber({
            queryObject: {
                rawString: '/2',
                query: '',
                shortcut: shortcut,
                in_address_bar: false,
                from_address_bar: false,
            },
            systemsToSearch: systems,
            cleanupSearch,
            getPreppedSearchLink,

        });

        // Assert
        expect(CopyQueryToClipboard).toHaveBeenCalledWith({query: ''});
        expect(windowOpenSpy).toHaveBeenCalledTimes(2);
        expect(cleanupSearch).toHaveBeenCalledTimes(2);
        expect(cleanupSearch).toHaveBeenCalledWith(systems[0], '');
    }); 
});