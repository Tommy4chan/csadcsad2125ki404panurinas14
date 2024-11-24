import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../src/App';
import { useSerial } from '../src/utils/SerialProvider';

vi.mock('../src/utils/SerialProvider');

describe('App Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders "Please connect to a serial port" when portState is not open', () => {
    useSerial.mockReturnValue({ portState: 'closed' });
    render(<App />);
    expect(screen.getByText('Please connect to a serial port')).toBeInTheDocument();
  });

  it('renders GameModeSelector when portState is open and mode is null', () => {
    useSerial.mockReturnValue({ portState: 'open' });
    render(<App />);
    expect(screen.getByText('Rock-Paper-Scissors')).toBeInTheDocument();
    expect(screen.getByText('Human vs AI')).toBeInTheDocument();
    expect(screen.getByText('Human vs Human')).toBeInTheDocument();
    expect(screen.getByText('AI vs AI')).toBeInTheDocument();
  });

  it('renders Game component when mode is set', () => {
    const mockSubscribe = vi.fn(() => vi.fn());
    useSerial.mockReturnValue({ portState: 'open', subscribe: mockSubscribe });
    render(<App />);
    act(() => {
      fireEvent.click(screen.getByText('Human vs AI'));
    });
    expect(screen.queryByText('Human vs AI')).toBeNull();
    expect(screen.getByText('Change Mode')).toBeInTheDocument();
  });

  it('resets mode when "Change Mode" button is clicked', () => {
    const mockSubscribe = vi.fn(() => vi.fn());
    useSerial.mockReturnValue({ portState: 'open', subscribe: mockSubscribe });
    render(<App />);
    act(() => {
      fireEvent.click(screen.getByText('Human vs AI'));
    });
    act(() => {
      fireEvent.click(screen.getByText('Change Mode'));
    });
    expect(screen.getByText('Human vs AI')).toBeInTheDocument();
    expect(screen.queryByText('Change Mode')).toBeNull();
  });
});