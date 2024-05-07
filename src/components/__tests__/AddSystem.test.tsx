// AddSystem.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddSystem } from '../main-menu/AddSystem';
import '@testing-library/jest-dom';

// Mock the required context providers
jest.mock('@/contexts/StorageContext', () => ({
  useStorageContext: () => ({
    addLocallyStoredSearchSystem: jest.fn(),
    updateLocallyStoredSearchSystem: jest.fn(),
    locallyStoredSearchSystems: [],
  }),
}));

jest.mock('@/contexts/SystemsContext', () => ({
  useSystemsContext: () => ({
    allSystems: [],
  }),
}));

describe('Adding a new search system', () => {
  beforeEach(() => {
    // Mock implementations are set directly in the jest.mock calls above
  });

  // Test case 1: Add a new search system with valid inputs
  test('adds a new search system with valid inputs', async () => {
    render(<AddSystem />);

    const nameInput = screen.getByLabelText('Search System Name');
    const linkInput = screen.getByLabelText('Search Link');
    const descriptionInput = screen.getByLabelText('Description');
    const faviconInput = screen.getByLabelText('Favicon');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    userEvent.type(nameInput, 'New System');
    userEvent.type(linkInput, 'https://example.com/search?q=%s');
    userEvent.type(descriptionInput, 'A new search system');
    userEvent.type(faviconInput, 'https://example.com/favicon.ico');

    fireEvent.click(submitButton);

    // await waitFor(() => {
    //   expect(useStorageContext().addLocallyStoredSearchSystem).toHaveBeenCalledWith({
    //     name: 'New System',
    //     id: 'new-system',
    //     searchLink: 'https://example.com/search?q=%s',
    //     description: 'A new search system',
    //     favicon: 'https://example.com/favicon.ico',
    //   });
    // });
    await waitFor(() => {


      const consoleSpy = jest.spyOn(console, 'log');
      expect(consoleSpy).toHaveBeenCalledWith('Added search system: New System');
    });
  });

  // Test case 2: Add a new search system with missing required fields
  test('displays validation errors for missing required fields', async () => {
    render(<AddSystem />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('A system name is required')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Search link must be a valid URL.')).toBeInTheDocument();
    });
  });

  // // Test case 3: Add a new search system with a duplicate name
  // test('displays an error for duplicate system name', async () => {
  //   const mockUseSystemsContext = require('@/contexts/SystemsContext').useSystemsContext;
  //   mockUseSystemsContext.mockReturnValueOnce({
  //     allSystems: [{ id: 'existing-system', name: 'Existing System' }],
  //   });

  //   render(<AddSystem />);

  //   const nameInput = screen.getByLabelText('Search System Name');
  //   const linkInput = screen.getByLabelText('Search Link');
  //   const submitButton = screen.getByRole('button', { name: 'Submit' });

  //   userEvent.type(nameInput, 'Existing System');
  //   userEvent.type(linkInput, 'https://example.com/search?q=%s');
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(screen.getByText('System name already exists.')).toBeInTheDocument();
  //   });
  // });

  // Test case 4: Add a new search system with an invalid search link
  test('displays an error for invalid search link', async () => {
    render(<AddSystem />);

    const nameInput = screen.getByLabelText('Search System Name');
    const linkInput = screen.getByLabelText('Search Link');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    userEvent.type(nameInput, 'Invalid Link System');
    userEvent.type(linkInput, 'invalid-url');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Search link must be a valid URL.')).toBeInTheDocument();
    });
  });
});

// describe('Editing an existing search system', () => {

//   // Test case 5: Edit an existing search system with valid inputs
//   test('updates an existing search system with valid inputs', async () => {
//     const defaultValues = {
//       name: 'Existing System',
//       searchLink: 'https://example.com/search?q=%s',
//     };

//     const mockUseSystemsContext = require('@/contexts/SystemsContext').useSystemsContext;
//     mockUseSystemsContext.mockReturnValueOnce({
//       allSystems: [{ id: 'existing-system', name: 'Existing System' }],
//     });

//     render(<AddSystem defaultValues={{ ...defaultValues, id: 'existing-system' }} />);

//     const nameInput = screen.getByLabelText('Search System Name');
//     const linkInput = screen.getByLabelText('Search Link');
//     const submitButton = screen.getByRole('button', { name: 'Submit' });

//     userEvent.clear(nameInput);
//     userEvent.type(nameInput, 'Updated System');
//     userEvent.clear(linkInput);
//     userEvent.type(linkInput, 'https://updated.com/search?q=%s');
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(useStorageContext().updateLocallyStoredSearchSystem).toHaveBeenCalledWith('existing-system', {
//         id: 'updated-system',
//         name: 'Updated System',
//         searchLink: 'https://updated.com/search?q=%s',
//         description: '',
//         favicon: '',
//       });
//     });

//       await waitFor(() => {
//         expect(screen.getByText('Successfully edited a search system!')).toBeInTheDocument();
//       });
//     });
  

//   // Test case 6: Edit an existing search system with a duplicate name
//   test('displays an error for duplicate system name when editing', async () => {
//     const defaultValues = {
//       name: 'Existing System',
//       searchLink: 'https://example.com/search?q=%s',
//     };

//     jest.mock('@/contexts/SystemsContext', () => ({
//       useSystemsContext: () => ({
//         allSystems: [
//           { id: 'existing-system', name: 'Existing System' },
//           { id: 'another-existing-system', name: 'Another Existing System' },
//         ],
//       }),
//     }));
//     render(<AddSystem defaultValues={{ ...defaultValues, id: 'test-system-id' }} />);

//     const nameInput = screen.getByLabelText('Search System Name');
//     const submitButton = screen.getByRole('button', { name: 'Submit' });
//     userEvent.clear(nameInput);
//     userEvent.type(nameInput, 'Another Existing System');
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(screen.getByText('System name already exists.')).toBeInTheDocument();
//     });
//   });
// });

describe('UI interactions', () => {

  // Test case 7: Cancel adding/editing a search system
  test('closes the form when cancel button is clicked', () => {
    const onClose = jest.fn();
    render(<AddSystem onClose={onClose} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

});

