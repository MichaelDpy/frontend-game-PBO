// components/WaitingRoom.jsx — OFFLINE MODE (no backend)
import { useState } from 'react';
import WoodenButton from './WoodenButton';
import { useGameContext } from '../context/GameContext';

const COLOR_HEX = {
  blue: '#3B82F6', green: '#16A34A', yellow: '#EAB308', red: '#DC2626',
};

const WaitingRoom = ({ onBack, onStartGame }) => {
  const { playerName, mowerColor, roomCode, isHost } = useGameContext();
  const [copied, setCopied] = useState(false);

  const displayName = playerName.trim() || 'Unknown';
  const roomLink = `${window.location.origin}/room/${roomCode}`;

  // Mock: show only the current player in slot 1, rest empty
  const slots = [
    { name: displayName, color: mowerColor.toUpperCase(), host: isHost, isMe: true },
    null, null, null,
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-blue-600">
        <ArrowBackground />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
        <h1
          className="font-black text-white text-center mb-4"
          style={{
            fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            textShadow: '4px 4px 0px #1e40af, -2px -2px 0px #60a5fa, 6px 6px 12px rgba(0,0,0,0.5)',
            WebkitTextStroke: '2px #1e3a8a',
          }}
        >
          Waiting Room
        </h1>

        {/* Room code */}
        <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm rounded-xl border-2 border-white/30">
          <p className="text-white/80 text-sm mb-2 text-center">Kode Room:</p>
          <div className="flex items-center gap-3 justify-center">
            <span className="text-yellow-300 font-black text-2xl tracking-widest">{roomCode}</span>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-bold text-sm transition-colors"
            >
              Copy Link
            </button>
          </div>
          {copied && <p className="text-blue-200 text-sm font-bold mt-1 text-center">Link disalin!</p>}
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-4xl">
          {slots.map((player, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border-4 min-h-[180px] flex flex-col ${
                player ? 'bg-white/20 border-white/40' : 'bg-white/10 border-white/20 border-dashed'
              }`}
            >
              {player ? (
                <>
                  <div className="h-12 flex items-center justify-center mb-3">
                    <p className="text-white font-bold text-base text-center leading-tight">
                      {player.name}
                      {player.host && <span className="text-yellow-300 text-sm block">(Host)</span>}
                      {player.isMe && <span className="text-green-300 text-xs block">(Kamu)</span>}
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <MiniLawnMower color={COLOR_HEX[player.color.toLowerCase()] || '#16A34A'} />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <p className="text-white/50 font-semibold">Slot Kosong</p>
                  <p className="text-white/30 text-sm mt-1">Menunggu...</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <WoodenButton text="MULAI GAME" onClick={onStartGame} />
          <WoodenButton text="BACK" onClick={onBack} />
        </div>
      </div>
    </div>
  );
};

// ---- Arrow Background ----
const ArrowBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-x-0 h-[23%] top-[1%]"><InfiniteArrowRow direction="right" /></div>
    <div className="absolute inset-x-0 h-[3px] top-[25%] bg-white/40" />
    <div className="absolute inset-x-0 h-[23%] top-[26%]"><InfiniteArrowRow direction="left" /></div>
    <div className="absolute inset-x-0 h-[3px] top-[50%] bg-white/40" />
    <div className="absolute inset-x-0 h-[23%] top-[51%]"><InfiniteArrowRow direction="right" /></div>
    <div className="absolute inset-x-0 h-[3px] top-[75%] bg-white/40" />
    <div className="absolute inset-x-0 h-[23%] top-[76%]"><InfiniteArrowRow direction="left" /></div>
  </div>
);

const InfiniteArrowRow = ({ direction }) => {
  const isRight = direction === 'right';
  const spacing = 100;
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute h-full flex items-center"
        style={{ animation: isRight ? 'flowRight 6s linear infinite' : 'flowLeft 6s linear infinite' }}
      >
        {Array(14).fill(null).map((_, i) => (
          <svg key={i} width={spacing} height="100%" viewBox="0 0 100 60"
            preserveAspectRatio="xMidYMid meet" className="flex-shrink-0">
            <g transform="translate(50, 30)">
              {isRight
                ? <path d="M -25 -18 L 35 0 L -25 18 Z" fill="#60a5fa" />
                : <path d="M 25 -18 L -35 0 L 25 18 Z" fill="#93c5fd" />}
            </g>
          </svg>
        ))}
      </div>
      <style>{`
        @keyframes flowRight { 0%{transform:translateX(-${spacing}px)} 100%{transform:translateX(0)} }
        @keyframes flowLeft  { 0%{transform:translateX(0)} 100%{transform:translateX(-${spacing}px)} }
      `}</style>
    </div>
  );
};

const MiniLawnMower = ({ color }) => (
  <svg width="80" height="60" viewBox="0 0 100 80">
    <path d="M 10 30 L 90 40 L 90 65 L 10 65 Z" fill={color} stroke="#1F2937" strokeWidth="2" />
    <rect x="65" y="32" width="25" height="18" fill="#DC2626" stroke="#1F2937" strokeWidth="1.5" />
    <ellipse cx="50" cy="68" rx="20" ry="6" fill="#6B7280" stroke="#1F2937" strokeWidth="1.5" />
    <circle cx="20" cy="70" r="10" fill="#1F2937" />
    <circle cx="80" cy="70" r="10" fill="#1F2937" />
    <circle cx="20" cy="70" r="4" fill="#DC2626" />
    <circle cx="80" cy="70" r="4" fill="#DC2626" />
    <path d="M 10 40 Q -10 20 0 5" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="-8" y="2" width="15" height="6" fill="#DC2626" rx="2" />
  </svg>
);

export default WaitingRoom;
