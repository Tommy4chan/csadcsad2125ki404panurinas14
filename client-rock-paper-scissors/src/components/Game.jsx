import React, { useEffect, useState } from 'react';
import Result from './Result';
import { useSerial } from '../utils/SerialProvider';

const choices = ['Rock', 'Paper', 'Scissors'];

const Game = ({ mode }) => {

  const {
    subscribe,
    send
  } = useSerial();

  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState([0, 0]);

  const [response, setResponse] = useState("");

  useEffect(() => {
    const localScoreForMode = JSON.parse(localStorage.getItem(mode));

    if (localScoreForMode) {
      setScore(localScoreForMode);
    }

    // Subscribe to incoming serial messages
    const unsubscribe = subscribe((message) => {
      setResponse(JSON.parse(message["value"]));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [subscribe]);

  useEffect(() => {
    if (mode === 'human-human' && player1Choice && player2Choice) {
      console.log({
        gameMode: mode,
        player1Choice: player1Choice,
        player2Choice: player2Choice,
      });
      handleSend();
    }
    else if (mode === 'human-ai' && player1Choice) {
      console.log({
        gameMode: mode,
        player1Choice: player1Choice,
      });
      handleSend();
    }
  }, [player1Choice, player2Choice]);

  useEffect(() => {
    if (response) {
      setWinner(response.winner);

      if (response.winner === 1) {
        score[0] += 1;
      } else if (response.winner === 2) {
        score[1] += 1;
      }

      localStorage.setItem(mode, JSON.stringify(score));
    }
  }, [response]);

  useEffect(() => {
    handleRestart();
  }, [mode]);

  const handleChoice = (choice) => {
    if (!player1Choice) {
      setPlayer1Choice(choice);
    } else if (!player2Choice) {
      setPlayer2Choice(choice);
    }
  };

  const handleSend = async () => {
    send({
      gameMode: mode,
      player1Choice: player1Choice,
      player2Choice: player2Choice,
    })
  }

  const handleRestart = () => {
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setWinner(null);
  }

  const handleReset = () => {
    setScore([0, 0]);
    localStorage.removeItem(mode);
    handleRestart();
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl bg-gray-800 p-6">
      {mode !== 'ai-ai' && !winner && (
        <>
          <h2 className="text-2xl text-gray-100 mb-4">Player {player1Choice ? '2' : '1'} Turn</h2>
          <div className="flex mb-6">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => handleChoice(choice)}
                className="m-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                {choice}
              </button>
            ))}
          </div>
        </>
      )}

      {mode === 'ai-ai' && (
        <button
          onClick={handleSend}
          className="m-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          Play AI vs AI
        </button>
      )}

      {winner && (
        <Result winner={winner} choices={[response.player1Choice, response.player2Choice]} score={score} />
      )}

      {winner && mode !== 'ai-ai' && (
        <button
          onClick={handleRestart}
          className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
        >
          Play Again
        </button>
      )}

      {winner &&
        <button
          onClick={handleReset}
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-300"
        >
          Reset
        </button>
      }
    </div>
  );
};

export default Game;