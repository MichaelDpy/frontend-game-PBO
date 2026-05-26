// components/WaitingRoom.jsx
import { useState, useEffect, useRef } from 'react';
import WoodenButton from './WoodenButton';
import { useGameContext } from '../context/GameContext';
import { api, ws } from '../services/websocket';

const COLOR_HEX = {
  BLUE: '#3B82F6', GREEN: '#16A34A', YELLOW: '#EAB308', RED: '#DC2626',
  blue: '#3B82F6', green: '#16A34A', yellow: '#EAB308', red: '#DC2626',
};

const WaitingRoom = ({ onBack, onStartGame, onDisbanded }) => {
  const { myPlayerId, roomCode, isHost } = useGameContext();
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const navigatedRef = useRef(false);

  // Connect WebSocket and subscribe to room updates
  useEffect(() => {
    if (!roomCode) return;

    // Connect WebSocket
    ws.connect(
      () => {
        // Subscribe to room topic — receives RoomDto updates
        ws.subscribeRoom(roomCode, (data) => {
          // data is RoomDto: { id, code, status, players, myPlayerId }
          if (data.players) {
            setPlayers(data.players);
          }
          // If host started the game, navigate all clients to game
          if (data.status === 'PLAYING' && !navigatedRef.current) {
            navigatedRef.current = true;
            onStartGame();
          }
          // Room disbanded
          if (data.status === 'FINISHED') {
            onDisbanded?.();
          }
        });
      },
      (err) => {
        console.error('WS error', err);
        setError('Koneksi WebSocket gagal');
      }
    );

    // Also do an initial HTTP fetch to get current player list
    api.getRoom(roomCode, myPlayerId)
      .then(data => {
        if (data.players) setPlayers(data.players);
      })
      .catch(() => {});

    return () => {
      ws.disconnect();
    };
  }, [roomCode]);

  const handleStartGame = async () => {
    if (starting) return;
    setStarting(true);
    try {
      await api.startGame(roomCode);
      // Navigation happens via WebSocket broadcast (status → PLAYING)
    } catch (err) {
      setError(err.message || 'Gagal memulai game');
      setStarting(false);
    }
  };

  const handleBack = async () => {
    try {
      if (isHost) await api.disbandRoom(roomCode);
    } catch (_) {}
    onBack();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build 4 slots: fill with real players, rest empty
  const slots = Array(4).fill(null).map((_, i) => players[i] || null);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-blue-600">
        <ArrowBackground />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full p-4 sm:p-8">
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
              onClick={copyCode}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-bold text-sm transition-colors"
            >
              Copy
            </button>
          </div>
          {copied && <p className="text-blue-200 text-sm font-bold mt-1 text-center">Kode disalin!</p>}
        </div>

        {/* Player count */}
        <p className="text-white/70 text-sm mb-4">
          {players.length}/4 pemain · {players.length < 2 ? 'Menunggu pemain lain...' : 'Siap bermain!'}
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-500/40 border border-red-400 rounded-lg">
            <p className="text-red-200 text-sm font-semibold text-center">{error}</p>
          </div>
        )}

        {/* Players Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-2xl">
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
                      {player.isHost && <span className="text-yellow-300 text-sm block">👑 Host</span>}
                      {player.id === myPlayerId && <span className="text-green-300 text-xs block">(Kamu)</span>}
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <MiniLawnMower color={COLOR_HEX[player.color] || '#16A34A'} />
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
          {isHost && (
            <WoodenButton
              text={starting ? 'Memulai...' : 'MULAI GAME'}
              onClick={players.length >= 2 ? handleStartGame : undefined}
              className={players.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}
            />
          )}
          <WoodenButton text="BACK" onClick={handleBack} />
        </div>

        {isHost && players.length < 2 && (
          <p className="text-yellow-300 text-sm mt-3 font-semibold">
            Butuh minimal 2 pemain untuk memulai
          </p>
        )}

        {!isHost && (
          <p className="text-white/50 text-sm mt-4">Menunggu host memulai game...</p>
        )}
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
