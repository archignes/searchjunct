import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../../components/SearchBar';
import { AppProvider,
    SearchProvider,
    SystemsProvider,
    StorageProvider,
    SortProvider,
    SystemSearchProvider,
    SystemToggleProvider,
    SystemExpansionProvider,
    QueryProvider } from '../';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import { getShortcutCandidate } from '../ShortcutContext';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

const originalOpen = window.open;
window.open = jest.fn();

// Test shortcut at the beginning of the query
test('getShortcutCandidate returns shortcut at the beginning of the query', () => {
    // Arrange
    const query = "/shortcut query";

    // Act
    const result = getShortcutCandidate(query);

    // Assert
    expect(result).toBe("shortcut");
});

// Test shortcut at the end of the query
test('getShortcutCandidate returns shortcut at the end of the query', () => {
    // Arrange
    const query = "query /shortcut";

    // Act
    const result = getShortcutCandidate(query);

    // Assert
    expect(result).toBe("shortcut");
});

// Test query without a shortcut
test('getShortcutCandidate returns null for query without a shortcut', () => {
    // Arrange
    const query = "regular query";

    // Act
    const result = getShortcutCandidate(query);

    // Assert
    expect(result).toBeNull();
});

// Test query with a shortcut in the middle
test('getShortcutCandidate returns shortcut for query with shortcut in the middle', () => {
    // Arrange
    const query = "query /shortcut query";

    // Act
    const result = getShortcutCandidate(query);

    // Assert
    expect(result).toBe("shortcut");
});

// Test query with multiple backslashes
test('getShortcutCandidate handles query with multiple forward slashes', () => {
    // Arrange
    const query = "//shortcut query";

    // Act
    const result = getShortcutCandidate(query);

    // Assert
    expect(result).toBeNull();
});

// Test empty query string
test('getShortcutCandidate returns null for empty query string', () => {
    // Arrange
    const query = "";

    // Act
    const result = getShortcutCandidate(query);

    // Assert
    expect(result).toBeNull();
});


afterAll(() => {
    window.open = originalOpen;
});