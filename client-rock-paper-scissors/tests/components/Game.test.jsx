import { render, screen, act } from '@testing-library/react';
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

    render(<Game />);

    const messageCallback = mockSubscribe.mock.calls[0][0];

    act(() => {
      messageCallback({
        value: JSON.stringify({ message: 'Test message' }),
        timestamp: Date.now(),
      });
    });

    await screen.findByText('Response: Test message');
  });

  test('Should call the send function when the button is clicked', async () => {
    const mockSubscribe = vi.fn((callback) => {
      return vi.fn();
    });
    const mockSend = vi.fn();

    useSerial.mockReturnValue({
      subscribe: mockSubscribe,
      send: mockSend,
    });

    render(<Game />);

    const button = screen.getByText('Send Message');
    act(() => {
      button.click();
    });

    expect(mockSend).toHaveBeenCalledWith({
      message: 'Hello World',
    });
  });
});