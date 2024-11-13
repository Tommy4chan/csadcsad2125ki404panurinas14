import React from 'react';

/**
 * GameModeSelector component allows the user to select the game mode.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setMode - Function to set the selected game mode.
 *
 * @returns {JSX.Element} The rendered component.
 */
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