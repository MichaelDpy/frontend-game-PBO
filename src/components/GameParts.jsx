// components/GameParts.jsx - Sub-components for Game
import { useState, useEffect } from 'react';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';

export const COLOR_MAP = { BLUE:'#3B82F6', GREEN:'#16A34A', YELLOW:'#EAB308', RED:'#DC2626' };

export const RockSvg = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <ellipse cx="20" cy="24" rx="16" ry="12" fill="#6B7280" stroke="#374151" strokeWidth="2" />
    <ellipse cx="20" cy="22" rx="14" ry="10" fill="#9CA3AF" />
    <ellipse cx="15" cy="18" rx="5" ry="3" fill="#D1D5DB" opacity="0.6" />
  </svg>
);

// ---- Power-up SVG Icons ----
export const PowerUpIcon = ({ type, size = 28 }) => {
  if (type === 'ROCK') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <ellipse cx="20" cy="26" rx="15" ry="11" fill="#4B5563" stroke="#1F2937" strokeWidth="2" />
        <ellipse cx="20" cy="24" rx="13" ry="9" fill="#6B7280" />
        <ellipse cx="14" cy="19" rx="5" ry="3" fill="#9CA3AF" opacity="0.7" />
        <ellipse cx="24" cy="22" rx="3" ry="2" fill="#9CA3AF" opacity="0.5" />
      </svg>
    );
  }
  if (type === 'SPEED_BOOST') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <polygon points="22,4 12,22 20,22 18,36 28,18 20,18" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="22,4 12,22 20,22 18,36 28,18 20,18" fill="url(#bolt-grad)" />
        <defs>
          <linearGradient id="bolt-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  if (type === 'BOMB') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="24" r="13" fill="#1F2937" stroke="#374151" strokeWidth="2" />
        <circle cx="20" cy="24" r="11" fill="#374151" />
        <circle cx="15" cy="19" r="3" fill="#6B7280" opacity="0.5" />
        <path d="M20 11 Q26 6 30 8" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="8" r="2.5" fill="#FCD34D" />
        <circle cx="30" cy="8" r="1.5" fill="#FEF08A" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="14" fill="none" stroke="#4B5563" strokeWidth="2" strokeDasharray="4 3" />
      <text x="20" y="25" textAnchor="middle" fontSize="14" fill="#6B7280">?</text>
    </svg>
  );
};

export const PowerUpBadge = ({ type, size }) => {
  const sz = size || 24;
  if (!type) return <PowerUpIcon type={null} size={sz} />;
  return <PowerUpIcon type={type} size={sz} />;
};

export const MiniMowerIcon = ({ color, crashed }) => (
  <svg width="32" height="24" viewBox="0 0 100 80" style={{ flexShrink:0, opacity: crashed ? 0.4 : 1 }}>
    <path d="M 10 30 L 90 40 L 90 65 L 10 65 Z" fill={color} stroke="#1F2937" strokeWidth="2" />
    <rect x="65" y="32" width="25" height="18" fill="#DC2626" stroke="#1F2937" strokeWidth="1.5" />
    <circle cx="20" cy="70" r="10" fill="#1F2937" />
    <circle cx="80" cy="70" r="10" fill="#1F2937" />
    <circle cx="20" cy="70" r="4" fill="#DC2626" />
    <circle cx="80" cy="70" r="4" fill="#DC2626" />
  </svg>
);

export const MowerSvg = ({ direction, color, cellSize }) => {
  const isLR = direction === 'left' || direction === 'right';
  return (
    <svg width={cellSize} height={cellSize} viewBox="0 0 60 60"
      style={{ padding: Math.max(1, cellSize * 0.04),
        transform: direction==='left' ? 'scaleX(-1)' : direction==='up' ? 'scaleY(-1)' : 'none' }}>
      {isLR ? (<>
        <rect x="10" y="25" width="40" height="20" fill={color} stroke="#1F2937" strokeWidth="2" rx="2" />
        <rect x="35" y="20" width="15" height="10" fill="#DC2626" rx="1" />
        <ellipse cx="30" cy="50" rx="15" ry="5" fill="#6B7280" />
        <circle cx="15" cy="52" r="6" fill="#1F2937" /><circle cx="45" cy="52" r="6" fill="#1F2937" />
        <circle cx="15" cy="52" r="3" fill="#DC2626" /><circle cx="45" cy="52" r="3" fill="#DC2626" />
        <path d="M 10 30 Q 0 15 5 5" stroke="#1F2937" strokeWidth="3" fill="none" />
        <rect x="2" y="2" width="8" height="4" fill="#DC2626" rx="1" />
      </>) : (<>
        <rect x="15" y="20" width="30" height="35" fill={color} stroke="#1F2937" strokeWidth="2" rx="3" />
        <rect x="22" y="10" width="16" height="15" fill="#DC2626" stroke="#1F2937" strokeWidth="2" rx="2" />
        <path d="M 20 5 L 20 10 M 40 5 L 40 10" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
        <rect x="18" y="2" width="24" height="4" fill="#1F2937" rx="2" />
        <rect x="20" y="2" width="20" height="4" fill="#DC2626" rx="1" />
        <rect x="4"  y="24" width="11" height="8" rx="2" fill="#1F2937" />
        <rect x="5"  y="26" width="9"  height="4" rx="1" fill="#DC2626" />
        <rect x="45" y="24" width="11" height="8" rx="2" fill="#1F2937" />
        <rect x="46" y="26" width="9"  height="4" rx="1" fill="#DC2626" />
        <rect x="4"  y="46" width="11" height="8" rx="2" fill="#1F2937" />
        <rect x="5"  y="48" width="9"  height="4" rx="1" fill="#DC2626" />
        <rect x="45" y="46" width="11" height="8" rx="2" fill="#1F2937" />
        <rect x="46" y="48" width="9"  height="4" rx="1" fill="#DC2626" />
        <ellipse cx="30" cy="52" rx="12" ry="6" fill="#6B7280" opacity="0.7" />
      </>)}
    </svg>
  );
};

export const PlayerMower = ({ player, pos, cellSize, isMe }) => {
  const color = COLOR_MAP[player.color] || '#16A34A';
  const dir = player.direction || 'right';
  const isStunned = player.stunned && player.stunEndTime > Date.now();
  
  return (
    <div className="absolute" style={{
      left: pos.x, top: pos.y, width: cellSize, height: cellSize,
      zIndex: 10, willChange: 'left,top',
    }}>
      {/* Efek Garis Angin Kecepatan Tinggi */}
      {player.speedBoosted && !player.crashed && !isStunned && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex:20 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} className="absolute rounded-full bg-cyan-300/60" style={{
              width:3, height: 6 + i*3, left:`${10+i*18}%`, top:'30%',
              animation:`windLine 0.4s ${i*0.08}s linear infinite`,
            }} />
          ))}
        </div>
      )}

      {/* ANIMASI BINTANG BERPUTAR (Kena Bom / Stunned) — Model Utama Tetap Normal */}
      {isStunned && !player.crashed && (
        <div className="absolute pointer-events-none" style={{
          zIndex: 40, top: -cellSize * 0.55, left: '50%', transform: 'translateX(-50%)',
          width: cellSize * 1.1, height: cellSize * 0.55,
        }}>
          {[0,1,2,3].map(i => (
            <div key={i} className="absolute" style={{
              fontSize: Math.max(10, cellSize * 0.22),
              animation: `stunOrbit 0.8s ${i * 0.2}s linear infinite`,
              transformOrigin: `${cellSize * 0.55}px ${cellSize * 0.27}px`,
            }}>⭐</div>
          ))}
        </div>
      )}

      {/* Penunjuk Segitiga untuk Karakter Utama */}
      {isMe && !player.crashed && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 font-black"
          style={{ fontSize:'clamp(8px,1.5vw,12px)', zIndex:20 }}>▼</div>
      )}

      {/* LOGIC REVISI MODEL MESIN */}
      {player.crashed ? (
        // MODEL MESIN HANCUR BERASAP (Menggantikan Tanda Huruf "X" merah tua lama)
        <div className="relative w-full h-full flex items-center justify-center scale-95">
          {/* Efek partikel asap hitam mengepul keluar dari mesin hancur */}
          <div className="absolute top-0 left-1/4 w-3 h-3 bg-gray-600 rounded-full blur-xs opacity-70" style={{ animation: 'smokeUp 0.8s ease-out infinite' }} />
          <div className="absolute top-1 left-1/2 w-4 h-4 bg-gray-500 rounded-full blur-xs opacity-60" style={{ animation: 'smokeUp 1s ease-out infinite 0.2s' }} />
          
          <svg width={cellSize} height={cellSize} viewBox="0 0 60 60" style={{ filter: 'grayscale(0.8) brightness(0.4)' }}>
            <g transform="rotate(15 30 30)">
              <MowerSvg direction={dir} color={color} cellSize={cellSize} />
            </g>
            {/* Tekstur Retakan Hancur Lebur */}
            <path d="M15 20 L25 35 L18 50 M45 15 L35 30 L42 45" stroke="#EF4444" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      ) : (
        // MODEL MESIN NORMAL (Berlaku saat jalan biasa ataupun kena stun bom karena model tetap sama)
        <div style={{ filter: isStunned ? 'brightness(0.7) saturate(0.5) sepia(0.2)' : 'none' }}>
          <MowerSvg direction={dir} color={color} cellSize={cellSize} />
        </div>
      )}

      {/* Kumpulan Keyframe Animasi Baru */}
      <style>{`
        @keyframes windLine{0%{opacity:.8;transform:translateX(0)}100%{opacity:0;transform:translateX(${dir==='left'?'12px':'-12px'})}}
        @keyframes stunOrbit{0%{transform:rotate(0deg) translateX(${Math.max(8,cellSize*0.18)}px)}100%{transform:rotate(360deg) translateX(${Math.max(8,cellSize*0.18)}px)}}
        @keyframes smokeUp {
          0% { transform: translateY(0px) scale(0.6); opacity: 0.8; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-20px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export const TopBar = ({ players, myId, round, isMuted, onToggleMute }) => {
  const playerList = players || [];

  // Fixed card width = 25vw always, regardless of player count.
  // Slots: [P1][P2] [ROUND] [P3][P4]
  // 2 players: P1 left, P2 right of round badge
  // 3 players: P1+P2 left, P3 right of round badge (far-right slot empty)
  // 4 players: P1+P2 left, P3+P4 right of round badge
  const CARD_W = '25vw';

  const p1 = playerList[0] || null;
  const p2 = playerList[1] || null;
  const p3 = playerList[2] || null;
  const p4 = playerList[3] || null;

  const PlayerCard = ({ player }) => (
    <div
      className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-2 py-2"
      style={{
        opacity: player.alive ? 1 : 0.4,
        width: CARD_W,
        flexShrink: 0,
        boxSizing: 'border-box',
        minWidth: 0,
      }}
    >
      <MiniMowerIcon color={COLOR_MAP[player.color]||'#16A34A'} crashed={player.crashed} />
      <div className="text-center min-w-0 overflow-hidden">
        <p className="font-bold truncate" style={{ fontSize:'clamp(9px,1.5vw,13px)' }}>
          {player.name}{player.id===myId?' (Kamu)':''}
        </p>
        <p className="text-yellow-400 font-bold" style={{ fontSize:'clamp(8px,1.2vw,11px)' }}>
          {player.grassCutThisRound ?? player.grassCut} grass
        </p>
        <div className="flex justify-center gap-0.5">
          {[0,1].map(i => (
            i < player.lives
              ? <FaHeart key={i} style={{ color:'#EF4444', fontSize:'clamp(9px,1.5vw,14px)' }} />
              : <FaHeartBroken key={i} style={{ color:'#6B7280', fontSize:'clamp(9px,1.5vw,14px)' }} />
          ))}
        </div>
        <div className="flex justify-center items-center mt-0.5">
          <div style={{
            background: player.heldPowerUp ? 'rgba(234,179,8,0.25)' : 'rgba(255,255,255,0.05)',
            border: `1.5px solid ${player.heldPowerUp ? 'rgba(253,224,71,0.6)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 6, padding: '1px 3px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 22, minHeight: 22,
          }}>
            <PowerUpBadge type={player.heldPowerUp} size={18} />
          </div>
        </div>
      </div>
    </div>
  );

  const EmptySlot = () => (
    <div style={{ width: CARD_W, flexShrink: 0 }} />
  );

  const BORDER = '2px solid #14532d';

  return (
    <div className="bg-green-900 text-white shadow-lg relative flex-shrink-0" style={{ minHeight: 72 }}>
      {/*
        Layout: [P1][P2] | [center 50vw for round badge] | [P3][P4]
        Each card is exactly 25vw. The center area is 50vw (2 empty card slots).
        Round badge is absolutely centered over the whole bar.
      */}
      <div className="flex items-stretch w-full" style={{ minHeight: 72 }}>

        {/* Left side: always 2 slots = 50vw */}
        <div className="flex items-stretch flex-shrink-0">
          {p1
            ? <div style={{ borderRight: BORDER }}><PlayerCard player={p1} /></div>
            : <div style={{ width: CARD_W, flexShrink: 0, borderRight: BORDER }} />
          }
          {p2
            ? <div style={{ borderRight: BORDER }}><PlayerCard player={p2} /></div>
            : <div style={{ width: CARD_W, flexShrink: 0, borderRight: BORDER }} />
          }
        </div>

        {/* Center spacer: 50vw — round badge floats here via absolute */}
        <div style={{ width: '50vw', flexShrink: 0 }} />

        {/* Right side: always 2 slots = 50vw (may be empty) */}
        <div className="flex items-stretch flex-shrink-0">
          {p3
            ? <div style={{ borderLeft: BORDER }}><PlayerCard player={p3} /></div>
            : <EmptySlot />
          }
          {p4
            ? <div style={{ borderLeft: BORDER }}><PlayerCard player={p4} /></div>
            : <EmptySlot />
          }
        </div>
      </div>

      {/* Round badge — absolutely centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-400 border-4 border-white flex items-center justify-center shadow-lg">
          <span className="text-black font-black text-sm sm:text-lg">{round}</span>
        </div>
      </div>

      {/* Mute button — top right */}
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
          aria-label={isMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-green-800 hover:bg-green-700 border border-green-600 transition-colors z-10"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export const QuizOverlay = ({ quizState, myId, onAnswer }) => {
  const isTarget = quizState.targetPlayerId === myId;
  const answered = quizState.answered;

  const [timeLeft, setTimeLeft] = useState(Math.ceil((quizState.timeRemainingMs ?? 10000) / 1000));
  useEffect(() => {
    setTimeLeft(Math.ceil((quizState.timeRemainingMs ?? 10000) / 1000));
  }, [quizState.targetPlayerId]);

  useEffect(() => {
    if (answered !== null && answered !== undefined) return;
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, answered]);

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 p-3">
      <div className="bg-green-900 border-4 border-yellow-400 rounded-2xl p-4 sm:p-6 w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-yellow-300 font-black text-base sm:text-xl"
            style={{ fontFamily:'"Comic Sans MS",sans-serif' }}>
            {isTarget ? 'Kamu Kena Kuis!' : 'Menunggu...'}
          </h2>
          <div className={`text-xl sm:text-2xl font-black ${timeLeft<=3?'text-red-400 animate-pulse':'text-white'}`}>
            {timeLeft}s
          </div>
        </div>
        <p className="text-white font-semibold text-sm sm:text-lg mb-3 text-center">{quizState.question}</p>
        <div className="grid grid-cols-1 gap-2">
          {quizState.choices.map((choice, i) => {
            let cls = 'w-full p-2 sm:p-3 rounded-xl font-bold text-left text-sm transition-all border-2 ';
            if (answered !== null && answered !== undefined) {
              cls += i === quizState.selectedIndex
                ? (answered ? 'bg-green-500 border-green-300 text-white' : 'bg-red-500 border-red-300 text-white')
                : 'bg-white/10 border-white/20 text-white/50';
            } else {
              cls += isTarget
                ? 'bg-white/20 border-white/40 text-white hover:bg-white/30 cursor-pointer'
                : 'bg-white/10 border-white/20 text-white/60 cursor-not-allowed';
            }
            return (
              <button key={i} className={cls}
                onClick={() => isTarget && answered === null && onAnswer(i)}
                disabled={!isTarget || answered !== null}>
                <span className="text-yellow-300 font-black mr-2">{String.fromCharCode(65+i)}.</span>
                {choice}
              </button>
            );
          })}
        </div>
        {answered !== null && (
          <div className={`mt-3 text-center font-black text-lg ${answered?'text-green-400':'text-red-400'}`}>
            {answered ? 'Benar!' : 'Salah! -1 Nyawa'}
          </div>
        )}
      </div>
    </div>
  );
};

export const GameOverScreen = ({ players, leaderboard, winnerId, myId, round, onRetry, onExit }) => {
  const ranked = leaderboard && leaderboard.length > 0 ? leaderboard : (players || []);
  const winner = ranked[0] || null;
  const rankMedal = ['🥇', '🥈', '🥉', '4️⃣'];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-blue-800 opacity-80" />
      <div className="relative z-10 text-center w-full max-w-2xl">
        <h1 className="font-black text-white mb-3"
          style={{ fontFamily:'"Comic Sans MS",sans-serif',
            fontSize:'clamp(2.5rem,8vw,4rem)', textShadow:'4px 4px 0 #1e40af' }}>
          GAME OVER
        </h1>

        {winner && (
          <div className="bg-yellow-400/20 border-4 border-yellow-400 rounded-2xl p-4 mb-4">
            <p className="text-yellow-300 text-xl font-black mb-1">🏆 Pemenang!</p>
            <MiniMowerIcon color={COLOR_MAP[winner.color]||'#16A34A'} crashed={false} />
            <p className="text-white text-2xl font-black mt-1">{winner.name}{winner.id===myId?' (Kamu)':''}</p>
            <p className="text-white/80 text-sm mt-1">
              {winner.roundsSurvived} ronde · {winner.grassCut} rumput
            </p>
          </div>
        )}

        <div className="bg-white/10 rounded-2xl border-2 border-white/20 overflow-hidden mb-4">
          <div className="bg-white/10 px-4 py-2 border-b border-white/20">
            <p className="text-yellow-300 font-black text-sm tracking-widest">PAPAN PERINGKAT</p>
          </div>
          {ranked.map((p, i) => (
            <div key={p.id}
              className={`flex items-center gap-3 px-4 py-3 border-b border-white/10 last:border-b-0 ${
                p.id === myId ? 'bg-yellow-400/10' : ''
              }`}>
              <span className="text-2xl w-8 flex-shrink-0">{rankMedal[i] || `${i+1}.`}</span>
              <MiniMowerIcon color={COLOR_MAP[p.color]||'#16A34A'} crashed={false} />
              <div className="flex-1 text-left min-w-0">
                <p className="text-white font-bold text-sm truncate">
                  {p.name}{p.id===myId?' (Kamu)':''}
                </p>
                <p className="text-white/60 text-xs">
                  {p.roundsSurvived} ronde · {p.grassCut} rumput
                </p>
              </div>
              {i === 0 && <span className="text-yellow-300 font-black text-xs">WINNER</span>}
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={onRetry}
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-black text-lg rounded-xl border-4 border-green-300 transition-all">
            MAIN LAGI
          </button>
          <button onClick={onExit}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-lg rounded-xl border-4 border-red-400 transition-all">
            EXIT
          </button>
        </div>
      </div>
    </div>
  );
};

export const MobileControls = ({ onDirection, onActivatePowerUp, heldPowerUp, phase }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  if (!isMobile) return null;
  const isPlaying = phase === 'PLAYING';
  const touch = (dir) => (e) => { e.preventDefault(); if (isPlaying) onDirection(dir); };
  const touchPU = (e) => { e.preventDefault(); if (isPlaying) onActivatePowerUp(); };
  const dBtn = (dir, label) => (
    <button onTouchStart={touch(dir)} style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      width:48, height:48, borderRadius:10, touchAction:'none', cursor:'pointer',
      userSelect:'none', background:'rgba(59,130,246,0.85)',
      border:'2px solid rgba(147,197,253,0.7)', fontSize:20, fontWeight:'bold',
      opacity: isPlaying ? 1 : 0.4, color:'white',
    }}>{label}</button>
  );

  const puLabels = { ROCK:'BATU', BOMB:'BOM', SPEED_BOOST:'BOOST' };
  const puLabel = heldPowerUp ? puLabels[heldPowerUp] || '' : '';

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'8px 12px', background:'rgba(0,0,0,0.4)', minHeight:140, gap:12 }}>
      <div style={{ display:'grid', gridTemplateColumns:'48px 48px 48px',
        gridTemplateRows:'48px 48px 48px', gap:6 }}>
        <div />{dBtn('up','↑')}<div />
        {dBtn('left','←')}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
          width:48, height:48, borderRadius:10, background:'rgba(59,130,246,0.3)',
          border:'2px solid rgba(147,197,253,0.3)', fontSize:18, color:'white' }}>+</div>
        {dBtn('right','→')}
        <div />{dBtn('down','↓')}<div />
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
        <p style={{ color:'rgba(255,255,255,0.7)', fontSize:10, fontWeight:700, textAlign:'center' }}>
          {heldPowerUp ? 'AKTIFKAN' : 'POWER-UP'}
        </p>
        <button onTouchStart={touchPU} style={{
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          width:72, height:72, borderRadius:16, touchAction:'none', cursor:'pointer', gap:2,
          background: heldPowerUp ? 'rgba(234,179,8,0.9)' : 'rgba(234,179,8,0.3)',
          border:`3px solid ${heldPowerUp?'rgba(253,224,71,0.9)':'rgba(253,224,71,0.3)'}`,
          opacity: isPlaying ? 1 : 0.4,
        }}>
          <PowerUpIcon type={heldPowerUp} size={32} />
          {puLabel && <span style={{ fontSize:8, color:'#1a1a1a', fontWeight:900 }}>{puLabel}</span>}
        </button>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:9 }}>{heldPowerUp ? '' : 'Kosong'}</p>
      </div>
    </div>
  );
};