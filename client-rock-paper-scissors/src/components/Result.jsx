import React from 'react';

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