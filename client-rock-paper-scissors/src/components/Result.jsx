import React from 'react';

/**
 * Result component displays the result of the rock-paper-scissors game.
 *
 * @param {Object} props - The properties object.
 * @param {number} props.winner - The winner of the game (1 for Player 1, 2 for Player 2, 3 for Draw).
 * @param {string[]} props.choices - The choices made by the players.
 * @param {number[]} props.score - The current score of the game [Player 1 score, Player 2 score].
 * @returns {JSX.Element} The rendered Result component.
 */
const Result = ({ winner, choices, score }) => {
  return (
    <div className="text-center mt-4">
      <h2 className="text-2xl font-bold text-gray-100 mb-2">Result</h2>
      <h3 className='text-xl text-gray-100 mb-2'>{score[0]} : {score[1]}</h3>
      {winner === 3 ? (
        <p className="text-xl text-gray-200">Draw</p>
      ) : (
        <p className="text-xl text-gray-200">Winner: Player {winner}</p>
      )}
      <p className="text-lg text-gray-300">Choices: {choices.join(' vs ')}</p>
    </div>
  );
};

export default Result;