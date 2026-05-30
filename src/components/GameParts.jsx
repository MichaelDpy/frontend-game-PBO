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
  const count = playerList.length;

  // Layout rules:
  // 2 players → 2 equal halves (50% each), P1 left, P2 right, round badge in center gap
  // 3 players → 3 equal thirds (33.33% each), P1+P2 left, P3 right, round badge between P2 and P3
  // 4 players → 4 equal quarters (25% each), P1+P2 left, P3+P4 right, round badge in center gap
  // Round badge sits in the gap between left group and right group — never overlaps a card.

  const slotPct = count <= 2 ? 50 : count === 3 ? 33.333 : 25;

  // Left group: first half of players (1 for 2p, 2 for 3p/4p)
  const leftCount  = count <= 2 ? 1 : 2;
  const rightCount = count - leftCount;
  const leftPlayers  = playerList.slice(0, leftCount);
  const rightPlayers = playerList.slice(leftCount, count);

  // Wood style matching WoodenButton component
  const WOOD_BG = `
    linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.15) 100%),
    repeating-linear-gradient(
      90deg,
      #d97706 0px, #d97706 3px,
      #b45309 3px, #b45309 6px,
      #92400e 6px, #92400e 9px
    )
  `;
  const WOOD_BORDER = '1px solid #78350f';

  const PlayerCard = ({ player, isLast }) => (
    <div style={{
      width: `${slotPct}%`,
      flexShrink: 0,
      background: WOOD_BG,
      borderRight: isLast ? 'none' : WOOD_BORDER,
      boxShadow: isLast ? 'none' : 'inset -1px 0 0 rgba(255,255,255,0.1)',
      opacity: player.alive ? 1 : 0.5,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 4, padding: '4px 6px', boxSizing: 'border-box', minHeight: 72,
    }}>
      <MiniMowerIcon color={COLOR_MAP[player.color]||'#16A34A'} crashed={player.crashed} />
      <div style={{ textAlign: 'center', minWidth: 0, overflow: 'hidden' }}>
        <p style={{ fontWeight: 700, fontSize: 'clamp(8px,1.4vw,12px)', color: 'white',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)', margin: 0 }}>
          {player.name}{player.id===myId?' (Kamu)':''}
        </p>
        <p style={{ color: '#FCD34D', fontWeight: 700, fontSize: 'clamp(7px,1.1vw,10px)',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)', margin: '1px 0' }}>
          {player.grassCutThisRound ?? player.grassCut} grass
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {[0,1].map(i => (
            i < player.lives
              ? <FaHeart key={i} style={{ color:'#EF4444', fontSize:'clamp(8px,1.4vw,13px)' }} />
              : <FaHeartBroken key={i} style={{ color:'#6B7280', fontSize:'clamp(8px,1.4vw,13px)' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <div style={{
            background: player.heldPowerUp ? 'rgba(234,179,8,0.3)' : 'rgba(0,0,0,0.2)',
            border: `1.5px solid ${player.heldPowerUp ? 'rgba(253,224,71,0.7)' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: 5, padding: '1px 2px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 20, minHeight: 20,
          }}>
            <PowerUpBadge type={player.heldPowerUp} size={16} />
          </div>
        </div>
      </div>
    </div>
  );

  // Round badge width — fixed so it never overlaps cards
  const BADGE_W = 52;

  return (
    <div style={{
      background: '#78350f', color: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
      flexShrink: 0, position: 'relative',
      display: 'flex', alignItems: 'stretch',
      minHeight: 72, width: '100%',
      borderBottom: '3px solid #451a03',
    }}>
      {/* Left group */}
      <div style={{ display: 'flex', alignItems: 'stretch', flex: leftCount }}>
        {leftPlayers.map((p, i) => (
          <PlayerCard key={p.id} player={p} isLast={i === leftPlayers.length - 1} />
        ))}
      </div>

      {/* Center gap — round badge lives here */}
      <div style={{
        width: BADGE_W, flexShrink: 0,
        background: '#451a03',
        borderLeft: WOOD_BORDER, borderRight: WOOD_BORDER,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 0 8px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: '#EAB308', border: '3px solid white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
        }}>
          <span style={{ color: '#1F2937', fontWeight: 900, fontSize: 'clamp(12px,2vw,18px)' }}>{round}</span>
        </div>
      </div>

      {/* Right group */}
      <div style={{ display: 'flex', alignItems: 'stretch', flex: rightCount || 1 }}>
        {rightPlayers.map((p, i) => (
          <PlayerCard key={p.id} player={p} isLast={i === rightPlayers.length - 1} />
        ))}
        {/* Empty slots if right group has fewer than expected */}
        {count === 2 && (
          <div style={{ flex: 1, background: '#92400e', opacity: 0.5 }} />
        )}
      </div>

      {/* Mute button — top right, above everything */}
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
          aria-label={isMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
          style={{
            position: 'absolute', top: 6, right: 6,
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 10, flexShrink: 0,
          }}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="14" height="14">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="14" height="14">
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3">
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
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="absolute inset-0 bg-blue-800/90" />
      <div className="relative z-10 flex flex-col items-center justify-start min-h-full p-4 py-8">
        <h1 className="font-black text-white mb-3 text-center"
          style={{ fontFamily:'"Comic Sans MS",sans-serif',
            fontSize:'clamp(2.5rem,8vw,4rem)', textShadow:'4px 4px 0 #1e40af' }}>
          GAME OVER
        </h1>

        <div className="w-full max-w-2xl">
          {winner && (
            <div className="bg-yellow-400/20 border-4 border-yellow-400 rounded-2xl p-4 mb-4 text-center">
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
              <p className="text-yellow-300 font-black text-sm tracking-widest text-center">PAPAN PERINGKAT</p>
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

          <div className="flex gap-3 justify-center flex-wrap pb-4">
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

  const BTN = 52; // button size px
  const GAP = 5;

  const dBtn = (dir, label) => (
    <button
      onTouchStart={touch(dir)}
      onTouchEnd={(e) => e.preventDefault()}
      style={{
        width: BTN, height: BTN,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 12, touchAction: 'none', userSelect: 'none',
        background: 'rgba(30,60,120,0.72)',
        border: '2px solid rgba(147,197,253,0.55)',
        fontSize: 22, fontWeight: 'bold', color: 'white',
        opacity: isPlaying ? 1 : 0.45,
        WebkitTapHighlightColor: 'transparent',
      }}
    >{label}</button>
  );

  const puLabels = { ROCK: 'BATU', BOMB: 'BOM', SPEED_BOOST: 'BOOST' };
  const puLabel = heldPowerUp ? puLabels[heldPowerUp] || '' : '';

  return (
    <>
      {/* D-pad — fixed bottom-left, overlays the game */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: 16,
        zIndex: 100,
        display: 'grid',
        gridTemplateColumns: `${BTN}px ${BTN}px ${BTN}px`,
        gridTemplateRows: `${BTN}px ${BTN}px ${BTN}px`,
        gap: GAP,
        pointerEvents: 'auto',
      }}>
        <div />{dBtn('up', '↑')}<div />
        {dBtn('left', '←')}
        <div style={{
          width: BTN, height: BTN, borderRadius: 12,
          background: 'rgba(30,60,120,0.35)',
          border: '2px solid rgba(147,197,253,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.4)', fontSize: 18,
        }}>+</div>
        {dBtn('right', '→')}
        <div />{dBtn('down', '↓')}<div />
      </div>

      {/* Power-up button — fixed bottom-right, overlays the game */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 16,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        pointerEvents: 'auto',
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: 700,
          textAlign: 'center', margin: 0,
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        }}>
          {heldPowerUp ? 'AKTIFKAN' : 'POWER-UP'}
        </p>
        <button
          onTouchStart={touchPU}
          onTouchEnd={(e) => e.preventDefault()}
          style={{
            width: 76, height: 76, borderRadius: 20,
            touchAction: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 2,
            background: heldPowerUp ? 'rgba(180,130,0,0.82)' : 'rgba(100,80,0,0.45)',
            border: `3px solid ${heldPowerUp ? 'rgba(253,224,71,0.9)' : 'rgba(253,224,71,0.3)'}`,
            opacity: isPlaying ? 1 : 0.45,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <PowerUpIcon type={heldPowerUp} size={34} />
          {puLabel && <span style={{ fontSize: 8, color: '#fff', fontWeight: 900, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{puLabel}</span>}
        </button>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, margin: 0 }}>
          {heldPowerUp ? '' : 'Kosong'}
        </p>
      </div>
    </>
  );
};