// components/Game.jsx — ONLINE MODE (backend WebSocket)
import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import { api, ws } from '../services/websocket';
import {
  RockSvg, PowerUpBadge, PowerUpIcon, PlayerMower,
  TopBar, QuizOverlay, GameOverScreen, MobileControls,
} from './GameParts';

const GRID_SIZE = 10;

// ---- Procedurally generated Sound Effects using Web Audio API ----
const playSfx = (type) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);

    if (type === 'CRASH') {
      // Suara tabrakan biasa: Kebisingan sawtooth frekuensi rendah memudar cepat
      masterGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      const osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.4);
      osc.connect(masterGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } 
    else if (type === 'BOMB') {
      // Suara ledakan bom: Distorsi berat frekuensi rendah berlipat ganda
      masterGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(20, audioCtx.currentTime + 0.6);
      
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(80, audioCtx.currentTime);
      osc2.frequency.linearRampToValueAtTime(10, audioCtx.currentTime + 0.5);

      osc.connect(masterGain);
      osc2.connect(masterGain);
      osc.start(); osc2.start();
      osc.stop(audioCtx.currentTime + 0.6);
      osc2.stop(audioCtx.currentTime + 0.6);
    } 
    else if (type === 'POWERUP') {
      // Suara dapat item: Nada sine wave ceria berbunyi naik dengan kilat
      masterGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.3);
      osc.connect(masterGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {
    console.error("Gagal memainkan SFX:", e);
  }
};

// ---- Procedurally generated game music using Web Audio API ----
function useGameMusic(isMuted) {
  const ctxRef = useRef(null);
  const intervalRef = useRef(null);

  const stopMusic = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    }
  };

  const startMusic = () => {
    stopMusic(); // pastikan bersih dulu
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = audioCtx;

      const melody = [
        [392.00, 0.0,  0.12], [440.00, 0.15, 0.12], [493.88, 0.3,  0.12],
        [523.25, 0.45, 0.20], [493.88, 0.7,  0.12], [440.00, 0.85, 0.12],
        [392.00, 1.0,  0.20], [349.23, 1.25, 0.12], [392.00, 1.4,  0.12],
        [440.00, 1.55, 0.12], [523.25, 1.7,  0.12], [587.33, 1.85, 0.20],
        [659.25, 2.1,  0.12], [587.33, 2.25, 0.12], [523.25, 2.4,  0.12],
        [493.88, 2.55, 0.30],
      ];
      const bass = [
        [130.81, 0.0, 0.18], [130.81, 0.5, 0.18],
        [146.83, 1.0, 0.18], [146.83, 1.5, 0.18],
        [130.81, 2.0, 0.18], [130.81, 2.5, 0.18],
      ];
      const loopDur = 2.9;

      const masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.15;
      masterGain.connect(audioCtx.destination);

      const scheduleLoop = (offset) => {
        if (!ctxRef.current || ctxRef.current.state === 'closed') return;
        const ctx = ctxRef.current;
        melody.forEach(([freq, t, dur]) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.value = freq;
          const at = ctx.currentTime + offset + t;
          gain.gain.setValueAtTime(0.001, at);
          gain.gain.linearRampToValueAtTime(0.5, at + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, at + dur);
          osc.connect(gain); gain.connect(masterGain);
          osc.start(at); osc.stop(at + dur + 0.05);
        });
        bass.forEach(([freq, t, dur]) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          const at = ctx.currentTime + offset + t;
          gain.gain.setValueAtTime(0.001, at);
          gain.gain.linearRampToValueAtTime(0.4, at + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, at + dur);
          osc.connect(gain); gain.connect(masterGain);
          osc.start(at); osc.stop(at + dur + 0.05);
        });
      };

      const play = () => {
        for (let i = 0; i < 3; i++) scheduleLoop(i * loopDur);
        intervalRef.current = setInterval(() => {
          if (!ctxRef.current || ctxRef.current.state === 'closed') {
            clearInterval(intervalRef.current); intervalRef.current = null; return;
          }
          scheduleLoop(3 * loopDur);
        }, loopDur * 1000);
      };

      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(play).catch(() => {});
      } else {
        play();
      }
    } catch {}
  };

  useEffect(() => {
    if (isMuted) {
      stopMusic();
      return;
    }
    startMusic();
    const onInteract = () => startMusic();
    window.addEventListener('click', onInteract, { once: true });
    window.addEventListener('keydown', onInteract, { once: true });
    window.addEventListener('touchstart', onInteract, { once: true });
    return () => {
      window.removeEventListener('click', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('touchstart', onInteract);
    };
  }, [isMuted]);

  useEffect(() => {
    return () => stopMusic();
  }, []);
}

function useCellSize() {
  const [cellSize, setCellSize] = useState(56);
  useEffect(() => {
    const calc = () => {
      const isMobile = window.innerWidth <= 1024;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // Improved mobile calculation
      const topBarHeight = 72;
      const mobileControlsHeight = isMobile ? 140 : 0;
      const desktopControlsHeight = isMobile ? 0 : 36;
      const padding = isMobile ? 8 : 16;
      
      const usableW = vw - (padding * 2);
      const usableH = vh - topBarHeight - (isMobile ? mobileControlsHeight : desktopControlsHeight) - (padding * 2);
      
      const byW = Math.floor(usableW / GRID_SIZE);
      const byH = Math.floor(usableH / GRID_SIZE);
      
      // Better size constraints for mobile
      const minSize = isMobile ? 24 : 28;
      const maxSize = isMobile ? 56 : 72;
      
      setCellSize(Math.max(minSize, Math.min(byW, byH, maxSize)));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return cellSize;
}

const Game = ({ onExit }) => {
  const { myPlayerId, roomCode, isMuted, toggleMute } = useGameContext();
  const cellSize = useCellSize();

  useGameMusic(isMuted);

  const [phase, setPhase] = useState('COUNTDOWN');
  const [round, setRound] = useState(1);
  const [countdown, setCountdown] = useState(3);
  const [grassGrid, setGrassGrid] = useState(() =>
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(true))
  );
  const [rockGrid, setRockGrid] = useState(() =>
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  );
  const [players, setPlayers] = useState([]);
  const [quizState, setQuizState] = useState(null);
  const [winnerId, setWinnerId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [powerUpNotifs, setPowerUpNotifs] = useState({});
  const [bombs, setBombs] = useState([]);

  const [pixelPositions, setPixelPositions] = useState({});
  const pixelRef = useRef({});
  const targetRef = useRef({});
  const animFrameRef = useRef(null);
  const dirRef = useRef('right');
  const lastInputRef = useRef(0);
  const prevPlayersRef = useRef([]);

  const [grassBlades] = useState(() =>
    Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() =>
        Array(14).fill(null).map((_, i) => ({
          height: 45 + Math.random() * 20,
          left: 3 + i * 6.8,
          tilt: (Math.random() - 0.5) * 10,
          width: 1.5 + Math.random() * 1,
        }))
      )
    )
  );

  const [stubbleBlades] = useState(() =>
    Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() =>
        Array(10).fill(null).map((_, i) => ({
          left: 5 + i * 9.5,
          height: 6 + Math.random() * 5,
        }))
      )
    )
  );

  useEffect(() => {
    if (!roomCode) return;

    if (!ws.isConnected()) {
      ws.connect(() => {
        subscribeToRoom();
      });
    } else {
      subscribeToRoom();
    }

    function subscribeToRoom() {
      ws.subscribeRoom(roomCode, (data) => {
        if (data.phase !== undefined) setPhase(data.phase);
        if (data.round !== undefined) setRound(data.round);
        if (data.countdownValue !== undefined) setCountdown(data.countdownValue);
        if (data.grassGrid) setGrassGrid(data.grassGrid);
        if (data.rockGrid) setRockGrid(data.rockGrid);
        if (data.quizState !== undefined) setQuizState(data.quizState);
        if (data.winnerId !== undefined) setWinnerId(data.winnerId);
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        if (data.activeBombs) setBombs(data.activeBombs);

        if (data.players) {
          // Deteksi perubahan status player untuk trigger SFX secara real-time
          data.players.forEach(p => {
            const prevPlayer = prevPlayersRef.current.find(prev => prev.id === p.id);
            if (prevPlayer) {
              const now = Date.now();
              const currentStunned = p.stunned && p.stunEndTime > now;
              const prevStunned = prevPlayer.stunned && prevPlayer.stunEndTime > now;

              // 1. Baru terkena efek STUN (Dari Bom)
              if (!prevStunned && currentStunned) {
                if (!isMuted) playSfx('BOMB');
              }
              // 2. Baru menabrak hancur mendadak (Mati biasa)
              else if (!prevPlayer.crashed && p.crashed) {
                if (!isMuted) playSfx('CRASH');
              }
            }
          });
          prevPlayersRef.current = data.players;
          setPlayers(data.players);
        }
      });

      ws.subscribePowerUp(roomCode, (event) => {
        // 3. Play SFX pengambilan item power-up
        if (!isMuted) playSfx('POWERUP');

        const notifId = Date.now();
        setPowerUpNotifs(prev => ({ ...prev, [event.playerId]: { type: event.type, id: notifId } }));
        setTimeout(() => {
          setPowerUpNotifs(prev => {
            const cur = prev[event.playerId];
            if (cur && cur.id === notifId) {
              const next = { ...prev };
              delete next[event.playerId];
              return next;
            }
            return prev;
          });
        }, 1200);
      });
    }

    return () => {};
  }, [roomCode, isMuted]);

  useEffect(() => {
    players.forEach(p => {
      const key = String(p.id);
      const tx = p.posX * cellSize;
      const ty = p.posY * cellSize;
      if (!targetRef.current[key]) {
        targetRef.current[key] = { x: tx, y: ty };
        pixelRef.current[key] = { x: tx, y: ty };
      } else {
        targetRef.current[key] = { x: tx, y: ty };
      }
    });
  }, [players, cellSize]);

  useEffect(() => {
    const animate = () => {
      let changed = false;
      const newPos = { ...pixelRef.current };
      Object.keys(targetRef.current).forEach(key => {
        const cur = pixelRef.current[key] || targetRef.current[key];
        const tgt = targetRef.current[key];
        if (!cur) return;
        const dx = tgt.x - cur.x;
        const dy = tgt.y - cur.y;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          newPos[key] = { x: cur.x + dx * 0.25, y: cur.y + dy * 0.25 };
          pixelRef.current[key] = newPos[key];
          changed = true;
        } else {
          newPos[key] = tgt;
          pixelRef.current[key] = tgt;
        }
      });
      if (changed) setPixelPositions({ ...newPos });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const sendDir = useCallback((dir) => {
    const now = Date.now();
    if (now - lastInputRef.current < 50) return;
    lastInputRef.current = now;
    const opp = { up: 'down', down: 'up', left: 'right', right: 'left' };
    if (opp[dir] === dirRef.current) return;
    dirRef.current = dir;
    ws.sendInput(roomCode, myPlayerId, dir, false);
  }, [roomCode, myPlayerId]);

  const sendPowerUp = useCallback(() => {
    ws.sendInput(roomCode, myPlayerId, null, true);
  }, [roomCode, myPlayerId]);

  const answerQuiz = useCallback((selectedIndex) => {
    ws.sendQuizAnswer(roomCode, myPlayerId, selectedIndex);
  }, [roomCode, myPlayerId]);

  const retry = useCallback(async () => {
    try {
      await api.retryGame(roomCode);
    } catch (err) {
      console.error('Retry failed', err);
    }
  }, [roomCode]);

  const handleKeyDown = useCallback((e) => {
    const map = {
      ArrowUp: 'up', w: 'up', W: 'up',
      ArrowDown: 'down', s: 'down', S: 'down',
      ArrowLeft: 'left', a: 'left', A: 'left',
      ArrowRight: 'right', d: 'right', D: 'right',
    };
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === ' ') { sendPowerUp(); return; }
    const dir = map[e.key];
    if (dir) sendDir(dir);
  }, [sendDir, sendPowerUp]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const myPlayer = players.find(p => p.id === myPlayerId);
  const myHeldPowerUp = myPlayer?.heldPowerUp ?? null;
  const MY_ID = myPlayerId;

  return (
    <div className="min-h-screen w-full bg-green-800 flex flex-col select-none overflow-hidden touch-none">
      <TopBar players={players} myId={MY_ID} round={round} isMuted={isMuted} onToggleMute={toggleMute} />

      <div className="flex-1 flex items-center justify-center relative overflow-hidden p-1 sm:p-2">
        <div className="relative flex-shrink-0"
          style={{ width: GRID_SIZE * cellSize, height: GRID_SIZE * cellSize }}>

          {Array(GRID_SIZE).fill(null).map((_, y) =>
            Array(GRID_SIZE).fill(null).map((_, x) => {
              const isDark = (x + y) % 2 === 0;
              const hasGrass = grassGrid?.[y]?.[x] ?? true;
              const hasRock = rockGrid?.[y]?.[x] ?? false;
              return (
                <div key={`${x}-${y}`} className="absolute overflow-hidden"
                  style={{
                    left: x * cellSize, top: y * cellSize,
                    width: cellSize, height: cellSize,
                    backgroundColor: isDark ? '#8B5E3C' : '#C49A6C',
                  }}>
                  {hasGrass && !hasRock && (
                    <div className="absolute inset-0">
                      {grassBlades[y][x].map((b, i) => (
                        <div key={i} className="absolute bottom-0 rounded-t-full" style={{
                          left: `${b.left}%`, width: `${b.width}px`, height: `${b.height}%`,
                          transform: `rotate(${b.tilt}deg)`, transformOrigin: 'bottom center',
                          background: 'linear-gradient(to top,#166534,#22c55e,#86efac)',
                        }} />
                      ))}
                    </div>
                  )}
                  {!hasGrass && !hasRock && (
                    <div className="absolute inset-0">
                      {stubbleBlades[y][x].map((b, i) => (
                        <div key={i} className="absolute bottom-0 rounded-t-full"
                          style={{ left: `${b.left}%`, width: '2px', height: `${b.height}px`, background: '#166534' }} />
                      ))}
                    </div>
                  )}
                  {hasRock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RockSvg size={cellSize * 0.7} />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {players.map(player => {
            const key = String(player.id);
            const pos = pixelPositions[key] || { x: player.posX * cellSize, y: player.posY * cellSize };
            return (
              <PlayerMower key={player.id} player={player} pos={pos}
                cellSize={cellSize} isMe={player.id === MY_ID} />
            );
          })}

          {bombs.map((bomb, i) => {
            const now = Date.now();
            const launch = bomb.launchTime || bomb.launch || now;
            const arrival = bomb.arrivalTime || bomb.arrival || now + 1500;
            const prog = Math.min(1, (now - launch) / (arrival - launch));
            const bx = (bomb.fromX + (bomb.toX - bomb.fromX) * prog) * cellSize + cellSize / 2;
            const by = (bomb.fromY + (bomb.toY - bomb.fromY) * prog) * cellSize + cellSize / 2;
            const arc = Math.sin(prog * Math.PI) * cellSize * 2;
            return (
              <div key={i} className="absolute pointer-events-none"
                style={{ left: bx - 16, top: by - arc - 16, zIndex: 30, fontSize: 24, fontWeight: 'bold', color: '#F87171' }}>
                💣
              </div>
            );
          })}

          {Object.entries(powerUpNotifs).map(([playerId, notif]) => {
            const p = players.find(pl => String(pl.id) === String(playerId));
            if (!p) return null;
            const pos = pixelPositions[String(p.id)] || { x: p.posX * cellSize, y: p.posY * cellSize };
            return (
              <div key={notif.id} className="absolute pointer-events-none"
                style={{
                  left: pos.x + cellSize / 2 - 17,
                  top: pos.y - 10,
                  zIndex: 30,
                  animation: 'powerUpFloat 1.2s ease-out forwards',
                }}>
                <PowerUpIcon type={notif.type} size={34} />
              </div>
            );
          })}

          <style>{`
            @keyframes powerUpFloat {
              0%   { opacity: 1; transform: translateY(0px) scale(1); }
              60%  { opacity: 1; transform: translateY(-40px) scale(1.15); }
              100% { opacity: 0; transform: translateY(-70px) scale(0.8); }
            }
          `}</style>

          {phase === 'COUNTDOWN' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40" style={{ zIndex: 40 }}>
              <div className="text-white font-black text-center" style={{
                fontSize: countdown === 0 ? 'clamp(3rem,10vw,5rem)' : 'clamp(5rem,15vw,8rem)',
                textShadow: '0 0 30px rgba(255,255,0,0.8)',
                fontFamily: '"Comic Sans MS",sans-serif',
              }}>
                {countdown === 0 ? 'START!' : countdown}
              </div>
            </div>
          )}
        </div>

        {phase === 'QUIZ' && quizState && (
          <QuizOverlay quizState={quizState} myId={MY_ID} onAnswer={answerQuiz} />
        )}
      </div>

      <MobileControls onDirection={sendDir} onActivatePowerUp={sendPowerUp}
        heldPowerUp={myHeldPowerUp} phase={phase} />

      <div className="hidden lg:block bg-green-900 text-white py-1 text-center text-xs">
        Arrow Keys / WASD = Arah | Space = Aktifkan Power-Up
      </div>

      {phase === 'GAME_OVER' && (
        <GameOverScreen players={players} leaderboard={leaderboard} winnerId={winnerId} myId={MY_ID}
          round={round} onRetry={retry} onExit={onExit} />
      )}
    </div>
  );
};

export default Game;