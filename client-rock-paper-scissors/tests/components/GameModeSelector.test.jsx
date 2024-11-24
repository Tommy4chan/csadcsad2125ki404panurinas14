import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import GameModeSelector from '../../src/components/GameModeSelector';

describe('GameModeSelector', () => {
    let setMode;

    beforeEach(() => {
        setMode = vi.fn();
    });

    it('renders all buttons', () => {
        const { getByText } = render(<GameModeSelector setMode={setMode} />);
        
        expect(getByText('Human vs AI')).toBeDefined();
        expect(getByText('Human vs Human')).toBeDefined();
        expect(getByText('AI vs AI')).toBeDefined();
    });

    it('calls setMode with "human-ai" when Human vs AI button is clicked', () => {
        const { getByText } = render(<GameModeSelector setMode={setMode} />);
        fireEvent.click(getByText('Human vs AI'));
        
        expect(setMode).toHaveBeenCalledWith('human-ai');
    });

    it('calls setMode with "human-human" when Human vs Human button is clicked', () => {
        const { getByText } = render(<GameModeSelector setMode={setMode} />);
        fireEvent.click(getByText('Human vs Human'));
        
        expect(setMode).toHaveBeenCalledWith('human-human');
    });
});
