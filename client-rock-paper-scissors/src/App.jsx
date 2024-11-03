import React, { useState } from 'react';
import { useSerial } from './utils/SerialProvider';
import GameModeSelector from './components/GameModeSelector';
import Game from './components/Game';
import Serial from './components/Serial';

const App = () => {
  const [mode, setMode] = useState(null);

  const {
    portState,
  } = useSerial();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <Serial />
      {portState === 'open' ? (
        <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-md text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-100">Rock-Paper-Scissors</h1>

          {!mode && <GameModeSelector setMode={setMode} />}

          {mode && (
            <>
              <Game mode={mode} />
              <button
                onClick={() => setMode(null)}
                className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300"
              >
                Change Mode
              </button>
            </>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-6">Please connect to a serial port</p>
      )}
    </div>
  );
}

export default App;