import React from 'react';

const GameModeSelector = ({ setMode }) => {
  return (
    <div className="flex justify-center mb-4">
      <button
        onClick={() => setMode('human-ai')}
        className="mx-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
      >
        Human vs AI
      </button>
      <button
        onClick={() => setMode('human-human')}
        className="mx-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
      >
        Human vs Human
      </button>
      <button
        onClick={() => setMode('ai-ai')}
        className="mx-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
      >
        AI vs AI
      </button>
    </div>

  );
};

export default GameModeSelector;