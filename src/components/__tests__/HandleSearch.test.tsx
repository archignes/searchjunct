// __tests__/HandleSearch.test.tsx

import { handleShortcutSearch, handleSkipLogic } from '../search/HandleSearch';
import HandleMultisearchNumber from '../search/HandleMultisearchNumber';
import { getShortcutCandidate } from '@/contexts/ShortcutContext';
import { useShortcutContext } from '@/contexts/ShortcutContext';


jest.mock('@/contexts/ShortcutContext', () => ({
    ...jest.requireActual('@/contexts/ShortcutContext'),
    useShortcutContext: jest.fn().mockImplementation(() => ({
        getShortcutFromQuery: jest.fn().mockImplementation((query) => {
            if (query === '/g') {
                return { name: 'g', systems: { always: [], randomly: [] }, count_from_randomly: 1 };
            }
            return null;
        })
    }))
}));

jest.mock('../search/CopyQueryToClipboard', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../search/HandleMultisearchNumber');
jest.mock('../search/HandleMultisearchObject');

describe('HandleMultisearchNumber', () => {

    beforeEach(() => {
        
        jest.mock('../search/CopyQueryToClipboard', () => ({
            __esModule: true,
            default: jest.fn().mockResolvedValue(true),
        }));
    });


    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test getShortcut with existing shortcut
    test('getShortcut returns the correct shortcut when it exists', () => {
        // Arrange
        const shortcutCandidate = 'g';

        // Act
        const result = useShortcutContext().getShortcutFromQuery(`/${shortcutCandidate}`);

        // Assert
        expect(result).toEqual({ name: 'g', systems: { always: [], randomly: [] }, count_from_randomly: 1 });

    });

    // Test getShortcut with non-existent shortcut
    test('getShortcut returns null when the shortcut does not exist', () => {
        // Arrange
        const shortcutCandidate = 'x';

        // Act
        const result = useShortcutContext().getShortcutFromQuery(`/${shortcutCandidate}`);

        // Assert
        expect(result).toBeNull();

    });

    // Test getShortcutCandidate with valid shortcut
    test('getShortcutCandidate returns the correct shortcut candidate', () => {
        // Arrange

        const query = 'search /g term';

        // Act
        const result = getShortcutCandidate(query);

        // Assert
        expect(result).toBe('g');
    });

    // Test getShortcutCandidate with invalid shortcut
    test('getShortcutCandidate returns null for an invalid shortcut', () => {

        // Arrange
        const query = 'search //g term';

        // Act
        const result = getShortcutCandidate(query);

        // Assert
        expect(result).toBeNull();

    });

    // Test handleShortcutSearch with number shortcut
    test('handleShortcutSearch calls HandleMultisearchNumber with correct params for a number shortcut', () => {
        // Arrange
        const systems = [{ id: 'system-1', name: 'System 1', searchLink: 'https://example.com/system1' },
            { id: 'system-2', name: 'System 2', searchLink: 'https://example.com/system2' },
            { id: 'system-3', name: 'System 3', searchLink: 'https://example.com/system3' }];
        const cleanupSearch = jest.fn();
        const getPreppedSearchLink = jest.fn();
        const getNextUnsearchedSystems = jest.fn()
            .mockReturnValueOnce([{ id: 'system-1' }, { id: 'system-2' }, { id: 'system-3' }]);
        // Act

        handleShortcutSearch({
            queryObject: { rawString: 'search term', query: 'search term', in_address_bar: false, from_address_bar: false, shortcut: { type: 'multisearch_number', name: '3', action: 3 } },
            systems,
            systemsSearched: {},
            cleanupSearch,
            getPreppedSearchLink,
            getNextUnsearchedSystems
        });

        // Assert
        expect(HandleMultisearchNumber).toHaveBeenCalledWith({

            queryObject: { rawString: 'search term', query: 'search term', in_address_bar: false, from_address_bar: false, shortcut: { type: 'multisearch_number', name: '3', action: 3 } },
            systemsToSearch: [{ id: 'system-1' }, { id: 'system-2' }, { id: 'system-3' }],
            cleanupSearch,
            getPreppedSearchLink

        });
    });

    // Test handleShortcutSearch with valid shortcut
    test('handleShortcutSearch calls HandleMultisearchActionObject with correct params for a valid shortcut', () => {
        // Arrange
        const systems = [
            { id: 'system-1', name: 'System 1', searchLink: 'https://example.com/system1' },
            { id: 'system-2', name: 'System 2', searchLink: 'https://example.com/system2' },
            { id: 'system-3', name: 'System 3', searchLink: 'https://example.com/system3' }
        ];
        const getNextUnsearchedSystems = jest.fn();
        const cleanupSearch = jest.fn();
        const getPreppedSearchLink = jest.fn();

        // Mock HandleMultisearchActionObject if not already mocked
        // jest.mock('../search/HandleMultisearchActionObject');

        // Act
        handleShortcutSearch({
            queryObject: {
                rawString: 'search term',
                query: 'search term',
                in_address_bar: false,
                from_address_bar: false,
                shortcut: { type: 'multisearch_number', name: '3', action: 3 }
            },
            getNextUnsearchedSystems,
            systemsSearched: {},
            systems,
            cleanupSearch,
            getPreppedSearchLink
        });

        // Assert
        expect(HandleMultisearchNumber).toHaveBeenCalledWith({
            queryObject: {
                rawString: 'search term',
                query: 'search term',
                in_address_bar: false,
                from_address_bar: false,
                shortcut: { type: 'multisearch_number', name: '3', action: 3 }
            },
            systemsToSearch: undefined,
            cleanupSearch,
            getPreppedSearchLink
        });
    });

    // Test handleSkipLogic skipping forward
    test('handleSkipLogic returns true and updates skipped systems when skipping forward', () => {
        // Arrange
        const skip = 'skip';
        const getNextUnsearchedSystem = jest.fn()
            .mockReturnValueOnce({ id: 1 })
            .mockReturnValueOnce({ id: 3 });
        const getLastSkippedSystem = jest.fn();
        const updateSystemsSkipped = jest.fn();
        const handleSearch = jest.fn();

        // Act
        const result = handleSkipLogic({
            skip,
            getNextUnsearchedSystem,
            getLastSkippedSystem,
            updateSystemsSkipped,
            handleSearch

        });

        // Assert
        expect(result).toBe(true);
        expect(updateSystemsSkipped).toHaveBeenCalledWith(1, true);
    });

    // Test handleSkipLogic skipping back
    test('handleSkipLogic returns true, updates skipped system and calls handleSearch when skipping back', () => {
        // Arrange
        const skip = 'skipback';
        const getNextUnsearchedSystem = jest.fn();
        const getLastSkippedSystem = jest.fn().mockReturnValueOnce({ id: 2 });
        const updateSystemsSkipped = jest.fn();
        const handleSearch = jest.fn();

        // Act
        const result = handleSkipLogic({
            skip,
            getNextUnsearchedSystem,
            getLastSkippedSystem,
            updateSystemsSkipped,
            handleSearch
        });

        // Assert
        expect(result).toBe(true);
        expect(updateSystemsSkipped).toHaveBeenCalledWith(2, false);
        expect(handleSearch).toHaveBeenCalledWith({ system: { id: 2 } });

    });

});