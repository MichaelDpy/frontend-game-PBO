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

export const PowerUpBadge = ({ type, size }) => {
  const sz = size || 24;
  const labels = { ROCK:'ROCK', SPEED_BOOST:'SPD', BOMB:'BOMB' };
  const colors = { ROCK:'#9CA3AF', SPEED_BOOST:'#FCD34D', BOMB:'#F87171' };
  if (!type) return <span style={{ fontSize: sz * 0.6, color:'#6B7280' }}>-</span>;
  return (
    <span style={{ fontSize: sz * 0.55, fontWeight:900, color: colors[type]||'#fff', letterSpacing:'-0.5px' }}>
      {labels[type]||'?'}
    </span>
  );
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
  return (
    <div className="absolute" style={{
      left: pos.x, top: pos.y, width: cellSize, height: cellSize,
      zIndex: 10, willChange: 'left,top',
      filter: player.crashed ? 'grayscale(1) brightness(0.5)' : 'none',
    }}>
      {player.speedBoosted && !player.crashed && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex:20 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} className="absolute rounded-full bg-cyan-300/60" style={{
              width:3, height: 6 + i*3, left:`${10+i*18}%`, top:'30%',
              animation:`windLine 0.4s ${i*0.08}s linear infinite`,
            }} />
          ))}
        </div>
      )}
      {isMe && !player.crashed && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 font-black"
          style={{ fontSize:'clamp(8px,1.5vw,12px)', zIndex:20 }}>v</div>
      )}
      {player.crashed
        ? <svg width={cellSize} height={cellSize} viewBox="0 0 60 60">
            <text x="5" y="45" fontSize="36" fill="#EF4444">X</text>
          </svg>
        : <MowerSvg direction={dir} color={color} cellSize={cellSize} />
      }
      <style>{`@keyframes windLine{0%{opacity:.8;transform:translateX(0)}100%{opacity:0;transform:translateX(${dir==='left'?'12px':'-12px'})}}`}</style>
    </div>
  );
};

export const TopBar = ({ players, myId, round }) => (
  <div className="bg-green-900 text-white shadow-lg relative flex-shrink-0">
    <div className="flex items-stretch" style={{ minHeight:72 }}>
      {(players||[]).map(player => (
        <div key={player.id}
          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 border-r-2 border-black last:border-r-0 px-1 sm:px-2"
          style={{ borderWidth:2, opacity: player.alive ? 1 : 0.4 }}>
          <MiniMowerIcon color={COLOR_MAP[player.color]||'#16A34A'} crashed={player.crashed} />
          <div className="text-center min-w-0">
            <p className="font-bold truncate" style={{ fontSize:'clamp(9px,1.5vw,13px)' }}>
              {player.name}{player.id===myId?' *':''}
            </p>
            <p className="text-yellow-400 font-bold" style={{ fontSize:'clamp(8px,1.2vw,11px)' }}>
              {player.grassCut} grass
            </p>
            <div className="flex justify-center gap-0.5">
              {[0,1].map(i => (
                i < player.lives
                  ? <FaHeart key={i} style={{ color:'#EF4444', fontSize:'clamp(9px,1.5vw,14px)' }} />
                  : <FaHeartBroken key={i} style={{ color:'#6B7280', fontSize:'clamp(9px,1.5vw,14px)' }} />
              ))}
            </div>
            {player.heldPowerUp && <PowerUpBadge type={player.heldPowerUp} size={12} />}
          </div>
        </div>
      ))}
    </div>
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-400 border-4 border-white flex items-center justify-center shadow-lg">
        <span className="text-black font-black text-sm sm:text-lg">{round}</span>
      </div>
    </div>
  </div>
);

export const QuizOverlay = ({ quizState, myId, onAnswer }) => {
  const isTarget = quizState.targetPlayerId === myId;
  const timeLeft = Math.ceil(quizState.timeRemainingMs / 1000);
  const answered = quizState.answered;
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

export const GameOverScreen = ({ players, winnerId, myId, round, onRetry, onExit }) => {
  const winner = players ? players.find(p => p.id === winnerId) : null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-blue-800 opacity-80" />
      <div className="relative z-10 text-center w-full max-w-2xl">
        <h1 className="font-black text-white mb-3"
          style={{ fontFamily:'"Comic Sans MS",sans-serif',
            fontSize:'clamp(2.5rem,8vw,4rem)', textShadow:'4px 4px 0 #1e40af' }}>
          ROUND OVER
        </h1>
        {winner && (
          <div className="bg-yellow-400/20 border-4 border-yellow-400 rounded-2xl p-4 mb-4">
            <p className="text-yellow-300 text-xl font-black mb-1">Pemenang!</p>
            <MiniMowerIcon color={COLOR_MAP[winner.color]||'#16A34A'} crashed={false} />
            <p className="text-white text-2xl font-black mt-1">{winner.name}</p>
            <p className="text-white/80 text-sm">Total Rumput: {winner.grassCut} | {round} Ronde</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(players||[]).map(p => (
            <div key={p.id} className={`p-2 rounded-xl border-2 ${p.id===winnerId?'border-yellow-400 bg-yellow-400/10':'border-white/20 bg-white/10'}`}>
              <p className="text-white font-bold text-sm">{p.name}{p.id===myId?' (Kamu)':''}</p>
              <p className="text-green-300 text-xs">{p.grassCut} rumput</p>
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
    <div onTouchStart={touch(dir)} style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      width:52, height:52, borderRadius:12, touchAction:'none', cursor:'pointer',
      userSelect:'none', background:'rgba(59,130,246,0.85)',
      border:'2px solid rgba(147,197,253,0.7)', fontSize:22, opacity: isPlaying ? 1 : 0.4,
    }}>{label}</div>
  );
  const puLabel = heldPowerUp==='ROCK'?'BATU':heldPowerUp==='BOMB'?'BOM':heldPowerUp==='SPEED_BOOST'?'BOOST':'';
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'4px 16px 12px', background:'rgba(0,0,0,0.35)', minHeight:140 }}>
      <div style={{ display:'grid', gridTemplateColumns:'52px 52px 52px',
        gridTemplateRows:'52px 52px 52px', gap:4 }}>
        <div />{dBtn('up','^')}<div />
        {dBtn('left','<')}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
          width:52, height:52, borderRadius:12, background:'rgba(59,130,246,0.3)',
          border:'2px solid rgba(147,197,253,0.3)', fontSize:18 }}>+</div>
        {dBtn('right','>')}
        <div />{dBtn('down','v')}<div />
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:700, textAlign:'center' }}>
          {heldPowerUp ? 'AKTIFKAN' : 'POWER-UP'}
        </p>
        <div onTouchStart={touchPU} style={{
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          width:80, height:80, borderRadius:20, touchAction:'none', cursor:'pointer', gap:2,
          background: heldPowerUp ? 'rgba(234,179,8,0.9)' : 'rgba(234,179,8,0.3)',
          border:`3px solid ${heldPowerUp?'rgba(253,224,71,0.9)':'rgba(253,224,71,0.3)'}`,
          opacity: isPlaying ? 1 : 0.4,
        }}>
          <PowerUpBadge type={heldPowerUp} size={28} />
          {puLabel && <span style={{ fontSize:9, color:'#1a1a1a', fontWeight:900 }}>{puLabel}</span>}
        </div>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{heldPowerUp ? '' : 'Kosong'}</p>
      </div>
    </div>
  );
};
