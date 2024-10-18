import { render, screen, fireEvent, act } from '@testing-library/react';
import SerialProvider from '../../src/utils/SerialProvider';
import Serial from '../../src/components/Serial';

beforeAll(() => {
  global.navigator.serial = {
    requestPort: vi.fn(),
    getPorts: vi.fn().mockResolvedValue([]),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
});

describe('Serial Component', () => {
  beforeEach(() => {
    global.navigator.serial = {
      requestPort: vi.fn().mockResolvedValue({
        open: vi.fn().mockResolvedValue(),
        writable: {
          getWriter: vi.fn().mockReturnValue({
            write: vi.fn(),
            releaseLock: vi.fn(),
          }),
        },
      }),
      getPorts: vi.fn().mockResolvedValue([]),

      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
  });

  test('Should render "Connect to Serial Port" button when port is closed', () => {
    render(
      <SerialProvider>
        <Serial />
      </SerialProvider>
    );

    expect(screen.getByText('Connect to Serial Port')).toBeInTheDocument();
  });

  test('Should call connect when "Connect to Serial Port" is clicked', async () => {
    render(
      <SerialProvider>
        <Serial />
      </SerialProvider>
    );

    const connectButton = screen.getByText('Connect to Serial Port');

    await act(async () => {
      fireEvent.click(connectButton);
    });

    expect(navigator.serial.requestPort).toHaveBeenCalled();
  });

  test('Should show "Disconnect" button when port is open', async () => {
    render(
      <SerialProvider>
        <Serial />
      </SerialProvider>
    );

    const connectButton = screen.getByText('Connect to Serial Port');

    await act(async () => {
      fireEvent.click(connectButton);
    });

    await screen.findByText('Disconnect');
  });
});