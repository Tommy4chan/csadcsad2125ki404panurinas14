import { render, screen, act, fireEvent } from '@testing-library/react';
import Game from '../../src/components/Game';
import { useSerial } from '../../src/utils/SerialProvider';
import { vi } from 'vitest';

vi.mock('../../src/utils/SerialProvider', () => ({
  useSerial: vi.fn(),
}));

describe('Game Component', () => {
  test('Should update response when a message is received', async () => {
    const mockSubscribe = vi.fn((callback) => {
      return vi.fn();
    });
    const mockSend = vi.fn();

    useSerial.mockReturnValue({
      subscribe: mockSubscribe,
      send: mockSend,
    });

    render(<Game mode="human-human" />);

    const messageCallback = mockSubscribe.mock.calls[0][0];

    act(() => {
      messageCallback({
        value: JSON.stringify({ winner: 1, player1Choice: 'Rock', player2Choice: 'Scissors' }),
        timestamp: Date.now(),
      });
    });

    await screen.findByText('Winner: Player 1');
  });

  test('Should call the send function when the button is clicked in AI vs AI mode', async () => {
    const mockSubscribe = vi.fn((callback) => {
      return vi.fn();
    });
    const mockSend = vi.fn();

    useSerial.mockReturnValue({
      subscribe: mockSubscribe,
      send: mockSend,
    });

    render(<Game mode="ai-ai" />);

    const button = screen.getByText('Play AI vs AI');
    act(() => {
      button.click();
    });

    expect(mockSend).toHaveBeenCalledWith({
      gameMode: 'ai-ai',
      player1Choice: null,
      player2Choice: null,
    });
  });

  test('Should update player choices and call send function in human-human mode', async () => {
    const mockSubscribe = vi.fn((callback) => {
      return vi.fn();
    });
    const mockSend = vi.fn();

    useSerial.mockReturnValue({
      subscribe: mockSubscribe,
      send: mockSend,
    });

    render(<Game mode="human-human" />);

    const rockButton = screen.getByText('Rock');
    act(() => {
      rockButton.click();
    });

    expect(mockSend).not.toHaveBeenCalled();

    const paperButton = screen.getByText('Paper');
    act(() => {
      paperButton.click();
    });

    expect(mockSend).toHaveBeenCalledWith({
      gameMode: 'human-human',
      player1Choice: 'Rock',
      player2Choice: 'Paper',
    });
  });

  test('Should reset the game when reset button is clicked', async () => {
    const mockSubscribe = vi.fn((callback) => {
      return vi.fn();
    });
    const mockSend = vi.fn();

    useSerial.mockReturnValue({
      subscribe: mockSubscribe,
      send: mockSend,
    });

    render(<Game mode="human-human" />);

    const rockButton = screen.getByText('Rock');
    act(() => {
      rockButton.click();
    });

    const paperButton = screen.getByText('Paper');
    act(() => {
      paperButton.click();
    });

    const messageCallback = mockSubscribe.mock.calls[0][0];

    act(() => {
      messageCallback({
        value: JSON.stringify({ winner: 1, player1Choice: 'Rock', player2Choice: 'Scissors' }),
        timestamp: Date.now(),
      });
    });

    const resetButton = screen.getByText('Reset');
    act(() => {
      resetButton.click();
    });

    expect(screen.queryByText('Winner: Player 1')).toBeNull();
    expect(screen.getByText('Player 1 Turn')).toBeInTheDocument();
  });
});