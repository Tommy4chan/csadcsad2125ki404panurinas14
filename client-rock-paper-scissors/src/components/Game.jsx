import React, { useEffect, useState } from 'react';
import { useSerial } from '../utils/SerialProvider';

const Game = () => {
  const {
    subscribe,
    send
  } = useSerial();

  const [response, setResponse] = useState("");

  useEffect(() => {
    // Subscribe to incoming serial messages
    const unsubscribe = subscribe((message) => {
      console.log(message);
      setResponse(JSON.parse(message["value"]));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [subscribe]);

  const handleSend = async () => {
    send({
      message: 'Hello World',
    })
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl bg-gray-800 p-6">

      <button
        onClick={handleSend}
        className="m-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
      >
        Send Message
      </button>

      <h1 className="text-2xl font-bold text-gray-100 mb-4">Response: {response.message}</h1>

    </div>
  );
};

export default Game;