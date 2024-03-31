// __tests__/HandleSearch.test.tsx

import { getShortcut, getShortcutCandidate, handleShortcutSearch, handleSkipLogic } from '../search/HandleSearch';
import HandleMultisearchNumber from '../search/HandleMultisearchNumber';
import HandleMultisearchShortcut from '../search/HandleMultisearchShortcut';
import CopyQueryToClipboard from '../search/CopyQueryToClipboard';

jest.mock('../search/CopyQueryToClipboard', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../search/HandleMultisearchNumber');
jest.mock('../search/HandleMultisearchShortcut');

describe('HandleMultisearchNumber', () => {
    let clipboardSpy: jest.SpyInstance;
    let windowOpenSpy: jest.SpyInstance;
    let sessionStorageSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.mock('../search/CopyQueryToClipboard', () => ({
            __esModule: true,
            default: jest.fn().mockResolvedValue(true),
        }));
        windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
        sessionStorageSpy = jest.spyOn(Storage.prototype, 'setItem');
    });


    afterEach(() => {
        clipboardSpy?.mockRestore();
        windowOpenSpy?.mockRestore();
        sessionStorageSpy?.mockRestore();
    });

// Test getShortcut with existing shortcut
test('getShortcut returns the correct shortcut when it exists', () => {
    // Arrange
    const multisearchShortcuts = [{ name: 'g', systems: { always: [], randomly: [] }, count_from_randomly: 1 }, { name: 'b', systems: { always: [], randomly: [] }, count_from_randomly: 1 }];
    const shortcutCandidate = 'g';

    // Act
    const result = getShortcut(multisearchShortcuts, shortcutCandidate);

    // Assert
    expect(result).toEqual({ name: 'g', systems: { always: [], randomly: [] }, count_from_randomly: 1 });
    });

// Test getShortcut with non-existent shortcut

test('getShortcut returns undefined when the shortcut does not exist', () => {
    // Arrange
    const multisearchShortcuts = [{ name: 'g', systems: { always: [], randomly: [] }, count_from_randomly: 1 }, { name: 'b', systems: { always: [], randomly: [] }, count_from_randomly: 1 }];
    const shortcutCandidate = 'x';

    // Act
    const result = getShortcut(multisearchShortcuts, shortcutCandidate);

    // Assert
    expect(result).toBeUndefined();

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
    const currentQuery = 'search term';
    const shortcutCandidate = '3';
    const multisearchShortcuts = [{ name: 'g', systems: { always: [], randomly: [] }, count_from_randomly: 1 }];
    const systems = [{ id: 'system-1', name: 'System 1', search_link: 'https://example.com/system1' },
        { id: 'system-2', name: 'System 2', search_link: 'https://example.com/system2' },
        { id: 'system-3', name: 'System 3', search_link: 'https://example.com/system3' }];
    const cleanupSearch = jest.fn();
    const preppedSearchLink = jest.fn();
    const getNextUnsearchedSystems = jest.fn()
        .mockReturnValueOnce([{ id: 'system-1' }, { id: 'system-2' }, { id: 'system-3' }]);
    // Act

    handleShortcutSearch({
        currentQuery,
        shortcutCandidate,
        multisearchShortcuts,
        systems,
        cleanupSearch,
        preppedSearchLink,
        getNextUnsearchedSystems
    });

    // Assert
    expect(HandleMultisearchNumber).toHaveBeenCalledWith({

        currentQuery: 'search term',
        systemsToSearch: [{ id: 'system-1' }, { id: 'system-2' }, { id: 'system-3' }],
        shortcut: '3',
        cleanupSearch,
        preppedSearchLink

    });
});

// Test handleShortcutSearch with valid shortcut
test('handleShortcutSearch calls HandleMultisearchShortcut with correct params for a valid shortcut', () => {
    // Arrange
    const currentQuery = 'search term';
    const shortcutCandidate = 'g';
    const multisearchShortcuts = [{ name: 'g', systems: { always: [], randomly: [] }, count_from_randomly: 1 }];
    const systems = [{ id: 'system-1', name: 'System 1', search_link: 'https://example.com/system1' },
        { id: 'system-2', name: 'System 2', search_link: 'https://example.com/system2' },
        { id: 'system-3', name: 'System 3', search_link: 'https://example.com/system3' }];
    const getNextUnsearchedSystems = jest.fn();
    const cleanupSearch = jest.fn();
    const preppedSearchLink = jest.fn();

    // Act
    handleShortcutSearch({
        currentQuery,
        shortcutCandidate,
        getNextUnsearchedSystems,
        multisearchShortcuts,
        systems,
        cleanupSearch,
        preppedSearchLink
    });

    // Assert

    expect(HandleMultisearchShortcut).toHaveBeenCalledWith({
        currentQuery: 'search term',
        shortcut: { name: 'g', systems: { always: [], randomly: [] }, count_from_randomly: 1 },
        systems: [{ id: 'system-1', name: 'System 1', search_link: 'https://example.com/system1' },
        { id: 'system-2', name: 'System 2', search_link: 'https://example.com/system2' },
        { id: 'system-3', name: 'System 3', search_link: 'https://example.com/system3' }],

        cleanupSearch,
        preppedSearchLink
    });
});

// Test handleShortcutSearch with invalid shortcut
test('handleShortcutSearch does not call any functions for an invalid shortcut', () => {
    // Arrange
    const currentQuery = 'search term';
    const shortcutCandidate = 'x';

    const multisearchShortcuts = [{ name: 'g', systems: { always: [], randomly: [] }, count_from_randomly: 1 }];
    const systems = [{ id: 'system-1', name: 'System 1', search_link: 'https://example.com/system1' },
        { id: 'system-2', name: 'System 2', search_link: 'https://example.com/system2' },
        { id: 'system-3', name: 'System 3', search_link: 'https://example.com/system3' }];
    const cleanupSearch = jest.fn();
    const getNextUnsearchedSystems = jest.fn();
    const preppedSearchLink = jest.fn();

    // Act
    handleShortcutSearch({
        currentQuery,
        shortcutCandidate,
        multisearchShortcuts,
        systems,
        cleanupSearch,
        preppedSearchLink,
        getNextUnsearchedSystems

    });

    // Assert
    expect(HandleMultisearchNumber).not.toHaveBeenCalled();
    expect(HandleMultisearchShortcut).not.toHaveBeenCalled();

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

// Test handleSkipLogic with invalid skip param
test('handleSkipLogic returns false and does not call any functions for an invalid skip param', () => {

    // Arrange
    const skip = 'jumpback';
    const getNextUnsearchedSystem = jest.fn();
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
    expect(result).toBe(false);
    expect(getNextUnsearchedSystem).not.toHaveBeenCalled();
    expect(getLastSkippedSystem).not.toHaveBeenCalled();
    expect(updateSystemsSkipped).not.toHaveBeenCalled();

    expect(handleSearch).not.toHaveBeenCalled();
});
});

