import React from 'react'
import { useSerial } from '../utils/SerialProvider';

/**
 * Serial component that provides an interface for connecting and disconnecting
 * to a serial port. It uses the `useSerial` hook to manage the serial port state
 * and connection status.
 *
 * @component
 * @returns {JSX.Element} The rendered Serial component.
 *
 * @example
 * return (
 *   <Serial />
 * )
 */
const Serial = () => {
  const {
    canUseSerial,
    portState,
    connect,
    disconnect
  } = useSerial();

  const handleConnect = async () => {
    const connected = await connect();
    if (connected) {
      console.log('Connected to serial port');
    } else {
      console.error('Failed to connect');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    console.log('Disconnected from serial port');
  };

  return (
      <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-md mb-4">
        <h1 className="text-2xl font-bold text-center text-gray-100 mb-4">Serial Port Interface</h1>

        {canUseSerial ? (
          <p className="text-green-400 text-center mb-4">Serial is supported on this browser.</p>
        ) : (
          <p className="text-red-400 text-center mb-4">Serial is not supported on this browser.</p>
        )}

        <p className="text-center text-gray-300 mb-6">
          <span className="font-semibold">Port State:</span> {portState}
        </p>

        {portState === "closed" && (
          <button
            onClick={handleConnect}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Connect to Serial Port
          </button>
        )}

        {portState === "open" && (
          <button
            onClick={handleDisconnect}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Disconnect
          </button>
        )}
      </div>
  )
}

export default Serial