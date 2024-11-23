import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Result from '../../src/components/Result';

describe('Result Component', () => {
    it('renders Result heading', () => {
        const { getByText } = render(<Result winner={1} choices={['Rock', 'Paper']} score={[1, 0]} />);
        expect(getByText('Result')).toBeTruthy();
    });

    it('displays the correct score', () => {
        const { getByText } = render(<Result winner={1} choices={['Rock', 'Paper']} score={[1, 0]} />);
        expect(getByText('1 : 0')).toBeTruthy();
    });
});