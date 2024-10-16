import React, { useState } from 'react';
import { useSerial } from './utils/SerialProvider';
import Serial from './components/Serial';
import Game from './components/Game';

const App = () => {

  const {
    portState,
  } = useSerial();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <Serial />
      {portState === 'open' ? (
        <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-md text-center">
          <Game />
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-6">Please connect to a serial port</p>
      )}
    </div>
  );
}

export default App;