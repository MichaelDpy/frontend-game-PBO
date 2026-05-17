import { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [playerName, setPlayerName] = useState('');
  const [mowerColor, setMowerColor] = useState('red'); // default merah
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [isHost, setIsHost] = useState(false);

  const reset = useCallback(() => {
    setMyPlayerId(null);
    setRoomCode(null);
    setIsHost(false);
  }, []);

  return (
    <GameContext.Provider value={{
      playerName, setPlayerName,
      mowerColor, setMowerColor,
      myPlayerId, setMyPlayerId,
      roomCode, setRoomCode,
      isHost, setIsHost,
      reset,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
};
