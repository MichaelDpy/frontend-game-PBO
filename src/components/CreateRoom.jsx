// components/CreateRoom.jsx — OFFLINE MODE (no backend)
import { useState } from 'react';
import BushBackground from './BushBackground';
import WoodenButton from './WoodenButton';
import { useGameContext } from '../context/GameContext';

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const CreateRoom = ({ onBack, onRoomReady }) => {
  const { playerName, mowerColor, setMyPlayerId, setRoomCode, setIsHost } = useGameContext();
  const [roomLink, setRoomLink] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreateRoom = () => {
    const code = randomCode();
    const id = Date.now(); // mock player id
    setGeneratedCode(code);
    setMyPlayerId(id);
    setRoomCode(code);
    setIsHost(true);
  };

  const handleGoToWaiting = () => {
    if (generatedCode) onRoomReady(generatedCode);
  };

  const handleJoinRoom = () => {
    // Accept anything — just go to waiting room
    const input = roomLink.trim();
    const code = input.length > 0 ? input.toUpperCase().slice(0, 8) : randomCode();
    const id = Date.now();
    setMyPlayerId(id);
    setRoomCode(code);
    setIsHost(false);
    onRoomReady(code);
  };

  const generatedLink = generatedCode
    ? `${window.location.origin}/room/${generatedCode}`
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
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

        {/* Buat Room */}
        <div className="mb-8 p-6 bg-green-800/30 rounded-xl border-2 border-green-600/50">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Create New Room</h2>
          {!generatedCode ? (
            <div className="flex flex-col items-center">
              <p className="text-white/80 mb-4 text-center">Buat room dan undang temanmu!</p>
              <WoodenButton text="CREATE ROOM" onClick={handleCreateRoom} />
            </div>
          ) : (
            <div className="text-center">
              <p className="text-white/80 mb-2">Link room kamu:</p>
              <div className="flex items-center gap-2 justify-center mb-4 flex-wrap">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="px-4 py-2 rounded-lg bg-white/90 text-green-900 font-mono text-sm w-64"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-colors"
                >
                  Copy
                </button>
              </div>
              {copied && <p className="text-green-300 text-sm font-bold mb-2">Link sudah disalin!</p>}
              <p className="text-white/60 text-sm mb-6">
                Kode: <span className="font-black text-yellow-300 text-lg">{generatedCode}</span>
              </p>
              {/* Center button */}
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
            <p className="text-white/80 mb-4 text-center">Masukkan link atau kode room dari temanmu:</p>
            <input
              type="text"
              value={roomLink}
              onChange={(e) => setRoomLink(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
              placeholder="Kode atau link room (apa saja)..."
              className="px-4 py-3 rounded-lg border-4 border-green-700 bg-white/90 text-green-900 font-semibold text-center w-full max-w-md mb-4 focus:outline-none focus:ring-4 focus:ring-green-400 placeholder-green-700/50"
            />
            <WoodenButton text="JOIN ROOM" onClick={handleJoinRoom} />
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
