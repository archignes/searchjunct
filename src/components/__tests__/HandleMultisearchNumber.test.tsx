// __tests__/HandleMultisearchNumber.test.tsx
import HandleMultisearchNumber from '../search/HandleMultisearchNumber';
import { PreppedSearchLinkParams } from 'types/search';

describe('HandleMultisearchNumber', () => {
    let clipboardSpy: jest.SpyInstance;
    let windowOpenSpy: jest.SpyInstance;
    let sessionStorageSpy: jest.SpyInstance;

    beforeEach(() => {
        // Define or override navigator.clipboard with a mock implementation
        Object.defineProperty(global.navigator, 'clipboard', {
            value: {
                writeText: jest.fn(),
            },
            writable: true, // Allow modifications to this property
        });

        clipboardSpy = jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(() => Promise.resolve());
        windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
        sessionStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
    });


    afterEach(() => {
        clipboardSpy?.mockRestore();
        windowOpenSpy?.mockRestore();
        sessionStorageSpy?.mockRestore();
    });

    it('should perform multi-search on all provided systems', async () => {
        // Arrange
        const systems = [
            { id: 'system-1', name: 'System 1', search_link: 'https://system1.com/search?q=%s' },
            { id: 'system-2', name: 'System 2', search_link: 'https://system2.com/search?q=%s' },
            { id: 'system-3', name: 'System 3', search_link: 'https://system3.com/search?q=%s' }
        ];
        const cleanupSearch = jest.fn();
        const preppedSearchLink = (params: PreppedSearchLinkParams) =>
            `${params.system.name}/search?q=${params.query}`;

        // Act  
        await HandleMultisearchNumber({
            currentQuery: '/3 test',
            systemsToSearch: systems,
            cleanupSearch,
            preppedSearchLink
        });

        // Assert
        expect(clipboardSpy).toHaveBeenCalledWith('test');
        expect(sessionStorageSpy).toHaveBeenCalledWith('searchInitiatedBlock', 'true');
        expect(windowOpenSpy).toHaveBeenCalledTimes(3);
        expect(cleanupSearch).toHaveBeenCalledTimes(3);
        systems.forEach(system => {
            expect(cleanupSearch).toHaveBeenCalledWith(system, 'test');
        });
    });

    it('should handle empty systemsToSearch array', async () => {
        // Arrange
        const cleanupSearch = jest.fn();
        const preppedSearchLink = (params: PreppedSearchLinkParams) =>
            `${params.system.name}/search?q=${params.query}`;

        // Act
        await HandleMultisearchNumber({
            currentQuery: '/0 test',
            systemsToSearch: [],
            cleanupSearch,
            preppedSearchLink
        });

        // Assert  
        expect(clipboardSpy).toHaveBeenCalledWith('test');
        expect(sessionStorageSpy).toHaveBeenCalledWith('searchInitiatedBlock', 'true');
        expect(windowOpenSpy).not.toHaveBeenCalled();
        expect(cleanupSearch).not.toHaveBeenCalled();
    });

    it('should handle empty search query', async () => {
        // Arrange
        const systems = [
            { id: 'system-1', name: 'System 1', search_link: 'https://system1.com/search?q=' },
            { id: 'system-2', name: 'System 2', search_link: 'https://system2.com/search?q=' }
        ];
        const cleanupSearch = jest.fn();
        const preppedSearchLink = (params: PreppedSearchLinkParams) =>
            `${params.system.name}/search?q=${params.query}`;

        // Act
        await HandleMultisearchNumber({
            currentQuery: '/2',
            systemsToSearch: systems,
            cleanupSearch,
            preppedSearchLink
        });

        // Assert
        expect(clipboardSpy).toHaveBeenCalledWith('');
        expect(sessionStorageSpy).toHaveBeenCalledWith('searchInitiatedBlock', 'true');
        expect(windowOpenSpy).toHaveBeenCalledTimes(2);
        expect(cleanupSearch).toHaveBeenCalledTimes(2);
        expect(cleanupSearch).toHaveBeenCalledWith(systems[0], '');
    });

    it('should only search up to the number of systems specified in query', async () => {
        // Arrange
        const systems = [
            { id: 'system-1', name: 'System 1', search_link: 'https://system1.com/search?q=' },
            { id: 'system-2', name: 'System 2', search_link: 'https://system2.com/search?q=' }
        ];
        const cleanupSearch = jest.fn();
        const preppedSearchLink = (params: PreppedSearchLinkParams) =>
            `${params.system.name}/search?q=${params.query}`;

        // Act  
        await HandleMultisearchNumber({
            currentQuery: '/2 test',
            systemsToSearch: systems,
            cleanupSearch,
            preppedSearchLink
        });

        // Assert
        expect(clipboardSpy).toHaveBeenCalledWith('test');
        expect(sessionStorageSpy).toHaveBeenCalledWith('searchInitiatedBlock', 'true');
        expect(windowOpenSpy).toHaveBeenCalledTimes(2);
        expect(cleanupSearch).toHaveBeenCalledTimes(2);
        systems.forEach(system => {
            expect(cleanupSearch).toHaveBeenCalledWith(system, 'test');
        });
    });
});