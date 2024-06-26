# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project roughly adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Types of changes:

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

## [Unreleased]

## [0.4.1] - 2024-03-31

### Fixed

- Issue where the numeric search shortcut only worked on the first search for a given query.

## [0.4.0] - 2024-03-29

### Added

- Support for numeric multisearch shortcuts to search the next N unsearched systems - `HandleMultisearchNumber`
- Ability to custom multi-sort - `HandleMultisearchShortcut`
- `ShortcutsDropdownMenu` component to `Toolbar`.
- `react-window` library for efficiently rendering large lists.
- `Virtualized` list rendering to `SystemList` component using `react-window`.
- Padding classes to buttons in `ShareMenu`, `FeedbackMenu` and `ShortcutsMenu` to match other toolbar buttons.
- showDragHandle prop to `SearchSystemItem` to conditionally render drag handle.

### Changed

- `SystemList` to use `react-window` for rendering the list of systems.
- `SortingContainer` to accept an `include` prop instead of `filterOut` for included systems.
- Updated `SystemList` test to check for "Showing X systems" text instead of "Number of systems".
- `SearchSystemItem` to conditionally show drag handle based on `showDragHandle` prop.
- Refactored `SystemList` to handle scrolling to the active system.
- Updated `SystemsContext` to initialize active system to the first system in the current order.
- Refactored `handleSearch` in `SearchContext` to accept an object with system, urlQuery and skip properties.
- Extracted search cleanup logic into separate `cleanupSearch` function in `SearchContext`.
- Moved multisearch shortcut handling into `SearchContext` `handleSearch`
- Refactored `SystemTitle` component to accept `mini_mode` prop for rendering in mini view.
- Moved info and settings cards into their own subdirectories.

### Removed

- Console logging statements from various components.
- Unused imports and variables across multiple components.

## [0.3.0] - 2024-03-27

### Added

- DeletedSystems interface to SettingsCard for users to recover deleted systems.
- FeedbackMenu to Toolbar for users to report bugs or suggest features.
- Single trailing slash as a bypass of the searchImmediately.

### Removed

- SortingContainer from SettingsCard.