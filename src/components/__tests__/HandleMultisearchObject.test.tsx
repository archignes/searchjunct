// __tests__/HandleMultisearchObject.test.tsx

import HandleMultisearchObject, { MultisearchObjectShortcut } from '../search/HandleMultisearchObject';
import { System } from '@/types';
import { PreppedSearchLinkParams } from'@/types';
import CopyQueryToClipboard from '../search/CopyQueryToClipboard';

jest.mock('../search/CopyQueryToClipboard');


const systems = [
    { id: 'sys1', name: 'System 1', searchLink: 'https://example.com/system1' },
    { id: 'sys2', name: 'System 2', searchLink: 'https://example.com/system2' },
    { id: 'sys3', name: 'System 3', searchLink: 'https://example.com/system3' },
    { id: 'sys4', name: 'System 4', searchLink: 'https://example.com/system4' },
];

const systemsSearched = {};


describe('HandleMultisearch', () => {
    let cleanupSearchMock: jest.Mock;
    let getPreppedSearchLinkMock: jest.Mock;

    beforeEach(() => {
        cleanupSearchMock = jest.fn();
        getPreppedSearchLinkMock = jest.fn(({system, query}) => `search-link-${system.id}-${query}`);
        
        jest.spyOn(window, 'open').mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should handle always selected systems', async () => {
        const cleanupSearchMock = jest.fn();
        const getPreppedSearchLinkMock = jest.fn(({system, query}: PreppedSearchLinkParams) => `search-link-${system.id}-${query}`);
        const shortcut: MultisearchObjectShortcut = {
            type: 'multisearch_object',
            name: 'test_shortcut',
            action: {
                name: 'test_action',
                systems: { always: ['sys1', 'sys2'], randomly: [] },
                count_from_randomly: 0,
            },
        };

        HandleMultisearchObject({
            queryObject: {
                rawString: 'query',
                query: 'query',
                shortcut: shortcut,
                in_address_bar: false,
                from_address_bar: false,
            },
            systemsSearched,
            systems,
            cleanupSearch: cleanupSearchMock,
            getPreppedSearchLink: getPreppedSearchLinkMock,
        });

        expect(window.open).toHaveBeenCalledWith('search-link-sys1-query', '_blank');
        expect(window.open).toHaveBeenCalledWith('search-link-sys2-query', '_blank');
        expect(cleanupSearchMock).toHaveBeenCalledWith(systems[0], 'query');
        expect(cleanupSearchMock).toHaveBeenCalledWith(systems[1], 'query');
    });
    it('should handle randomly selected systems', () => {
        const shortcut: MultisearchObjectShortcut = {
            type: 'multisearch_object',
            name: 'test_shortcut',
            action: {
                name: 'test_action',
                systems: { always: [], randomly: ['sys1', 'sys2', 'sys3'] },
                count_from_randomly: 2,
            },
        };
        const systems: System[] = [
            { id: 'sys1', name: 'System 1', searchLink: 'search-link-sys1' },
            { id: 'sys2', name: 'System 2', searchLink: 'search-link-sys2' },
            { id: 'sys3', name: 'System 3', searchLink: 'search-link-sys3' },
        ];

        HandleMultisearchObject({
            queryObject: {
                rawString: 'query',
                query: 'query',
                shortcut: shortcut,
                in_address_bar: false,
                from_address_bar: false,
            },
            systems,
            systemsSearched,
            cleanupSearch: cleanupSearchMock,
            getPreppedSearchLink: getPreppedSearchLinkMock,
        });

        expect(CopyQueryToClipboard).toHaveBeenCalledWith({query: 'query'});
        expect(window.open).toHaveBeenCalledTimes(2);
        expect(cleanupSearchMock).toHaveBeenCalledTimes(2);
    });

    test('should handle shortcut with no selected systems', () => {
        const shortcut: MultisearchObjectShortcut = {
            type: 'multisearch_object',
            name: 'test_shortcut',
            action: {
                name: 'test_action',
                systems: { always: [], randomly: [] },
                count_from_randomly: 0,
            },
        };
        const cleanupSearchMock = jest.fn();
        const getPreppedSearchLinkMock = jest.fn();

        HandleMultisearchObject({
            queryObject: {
                rawString: 'query',
                query: 'query',
                shortcut: shortcut,
                in_address_bar: false,
                from_address_bar: false,
            },
            systemsSearched,
            systems,
            cleanupSearch: cleanupSearchMock,
            getPreppedSearchLink: getPreppedSearchLinkMock,
        });

        expect(window.open).not.toHaveBeenCalled();
        expect(cleanupSearchMock).not.toHaveBeenCalled();
    });

    test('should search all available randomly systems when count_from_randomly exceeds length', () => {
        const shortcut: MultisearchObjectShortcut = {
            type: 'multisearch_object',
            name: 'test_shortcut',
            action: {
                name: 'test_action',
                systems: { always: ['sys1', 'sys2'], randomly: [] },
                count_from_randomly: 3,
            },
        };
        const cleanupSearchMock = jest.fn();
        const getPreppedSearchLinkMock = jest.fn(
            ({system, query}: PreppedSearchLinkParams) => `search-link-${system.id}-${query}`
        );

        HandleMultisearchObject({
            queryObject: {
                rawString: 'query',
                query: 'query',
                shortcut: shortcut,
                in_address_bar: false,
                from_address_bar: false,
            },
            systems,
            systemsSearched,
            cleanupSearch: cleanupSearchMock,
            getPreppedSearchLink: getPreppedSearchLinkMock,
        });

        expect(window.open).toHaveBeenCalledTimes(2);
        expect(cleanupSearchMock).toHaveBeenCalledTimes(2);
    });
});