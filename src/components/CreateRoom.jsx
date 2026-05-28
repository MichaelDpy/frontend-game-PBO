// components/CreateRoom.jsx
import { useState } from 'react';
import BushBackground from './BushBackground';
import WoodenButton from './WoodenButton';
import { useGameContext } from '../context/GameContext';
import { api } from '../services/websocket';

const CreateRoom = ({ onBack, onRoomReady }) => {
  const { playerName, mowerColor, setMyPlayerId, setRoomCode, setIsHost, authUser } = useGameContext();
  const [roomLink, setRoomLink] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    const trimmedName = playerName.trim();
    
    if (!trimmedName) { 
      setError('Masukkan nama terlebih dahulu'); 
      return; 
    }
    
    if (trimmedName.length < 1 || trimmedName.length > 20) {
      setError('Nama harus 1-20 karakter');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const data = await api.createRoom(trimmedName, mowerColor, authUser?.username ?? null);
      // data = RoomDto { id, code, status, players, myPlayerId }
      setGeneratedCode(data.code);
      setMyPlayerId(data.myPlayerId);
      setRoomCode(data.code);
      setIsHost(true);
    } catch (err) {
      setError(err.message || 'Gagal membuat room');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToWaiting = () => {
    if (generatedCode) onRoomReady(generatedCode);
  };

  const handleJoinRoom = async () => {
    const trimmedName = playerName.trim();
    
    if (!trimmedName) { 
      setError('Masukkan nama terlebih dahulu'); 
      return; 
    }
    
    if (trimmedName.length < 1 || trimmedName.length > 20) {
      setError('Nama harus 1-20 karakter');
      return;
    }
    
    const input = roomLink.trim().toUpperCase();
    // Support full link or just code
    const code = input.includes('/') ? input.split('/').pop() : input;
    
    if (!code) { 
      setError('Masukkan kode room'); 
      return; 
    }
    
    if (code.length < 1 || code.length > 8) {
      setError('Kode room tidak valid');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const data = await api.joinRoom(trimmedName, mowerColor, code, authUser?.username ?? null);
      setMyPlayerId(data.myPlayerId);
      setRoomCode(data.code);
      setIsHost(false);
      onRoomReady(data.code);
    } catch (err) {
      setError(err.message || 'Gagal bergabung ke room');
    } finally {
      setLoading(false);
    }
  };

  const generatedLink = generatedCode
    ? `${window.location.origin}/room/${generatedCode}`
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode); // copy just the code
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
      <BushBackground variant="rectangle" className="w-full max-w-2xl">
        <h1
          className="font-black text-white text-center mb-8"
          style={{
            fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            textShadow: '3px 3px 0px #1a5c1a, -1px -1px 0px #32CD32, 4px 4px 8px rgba(0,0,0,0.5)',
            WebkitTextStroke: '1px #0d3d0d',
          }}
        >
          Create Room
        </h1>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-500/30 border border-red-400 rounded-lg">
            <p className="text-red-200 text-sm font-semibold text-center">{error}</p>
          </div>
        )}

        {/* Buat Room */}
        <div className="mb-8 p-6 bg-green-800/30 rounded-xl border-2 border-green-600/50">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Create New Room</h2>
          {!generatedCode ? (
            <div className="flex flex-col items-center">
              <p className="text-white/80 mb-4 text-center">Buat room dan undang temanmu!</p>
              {loading ? (
                <p className="text-white font-bold animate-pulse">Membuat room...</p>
              ) : (
                <WoodenButton text="CREATE ROOM" onClick={handleCreateRoom} />
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-white/80 mb-2">Kode room kamu:</p>
              <div className="flex items-center gap-2 justify-center mb-4 flex-wrap">
                <span className="text-yellow-300 font-black text-3xl tracking-widest px-4 py-2 bg-black/20 rounded-lg">
                  {generatedCode}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-colors"
                >
                  Copy
                </button>
              </div>
              {copied && <p className="text-green-300 text-sm font-bold mb-2">Kode disalin!</p>}
              <div className="flex justify-center">
                <WoodenButton text="MASUK WAITING ROOM" onClick={handleGoToWaiting} />
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-0.5 bg-green-400/50" />
          <span className="text-white/60 font-bold">ATAU</span>
          <div className="flex-1 h-0.5 bg-green-400/50" />
        </div>

        {/* Join Room */}
        <div className="mb-8 p-6 bg-green-800/30 rounded-xl border-2 border-green-600/50">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Join Existing Room</h2>
          <div className="flex flex-col items-center">
            <p className="text-white/80 mb-4 text-center">Masukkan kode room dari temanmu:</p>
            <input
              type="text"
              value={roomLink}
              onChange={(e) => setRoomLink(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
              placeholder="Contoh: ABC123"
              maxLength={8}
              className="px-4 py-3 rounded-lg border-4 border-green-700 bg-white/90 text-green-900 font-semibold text-center w-full max-w-md mb-4 focus:outline-none focus:ring-4 focus:ring-green-400 placeholder-green-700/50 uppercase"
            />
            {loading ? (
              <p className="text-white font-bold animate-pulse">Bergabung...</p>
            ) : (
              <WoodenButton text="JOIN ROOM" onClick={handleJoinRoom} />
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <WoodenButton text="BACK" onClick={onBack} />
        </div>
      </BushBackground>
    </div>
  );
};

export default CreateRoom;
