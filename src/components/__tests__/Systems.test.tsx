// __tests__/Systems.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for extended matchers
import Systems from '../main-menu/Systems';
import { useStorageContext } from '@/contexts/StorageContext';

describe('Systems Component', () => {
    it('renders without crashing', () => {
        render(<Systems />);
        expect(screen.getByTestId('systems-settings-scroll-area')).toBeInTheDocument();
    });

});
