// components/Game.jsx - OFFLINE MODE
import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import { useLocalGame } from '../hooks/useLocalGame';
import {
  COLOR_MAP, RockSvg, PowerUpBadge, PlayerMower,
  TopBar, QuizOverlay, GameOverScreen, MobileControls,
} from './GameParts';

const GRID_SIZE = 10;

function useCellSize() {
  const [cellSize, setCellSize] = useState(56);
  useEffect(() => {
    const calc = () => {
      const isMobile = window.innerWidth <= 1024;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const usableW = isMobile ? vw - 16 : vw - 32;
      const usableH = isMobile ? vh - 90 - 36 - 150 : vh - 90 - 36 - 16;
      const byW = Math.floor(usableW / GRID_SIZE);
      const byH = Math.floor(usableH / GRID_SIZE);
      setCellSize(Math.max(28, Math.min(byW, byH, 72)));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return cellSize;
}

const Game = ({ onExit }) => {
  const { playerName, mowerColor } = useGameContext();
  const cellSize = useCellSize();
  const {
    MY_ID, phase, round, countdown, grassGrid, rockGrid,
    players, quizState, winnerId, powerUpNotifs, bombs,
    setDirection, activatePowerUp, answerQuiz, retry,
  } = useLocalGame(playerName, mowerColor);

  const [pixelPositions, setPixelPositions] = useState({});
  const pixelRef = useRef({});
  const targetRef = useRef({});
  const animFrameRef = useRef(null);
  const dirRef = useRef('right');
  const lastInputRef = useRef(0);

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
    const opp = { up:'down', down:'up', left:'right', right:'left' };
    if (opp[dir] !== dirRef.current) {
      dirRef.current = dir;
      setDirection(dir);
    }
  }, [setDirection]);

  const sendPowerUp = useCallback(() => activatePowerUp(), [activatePowerUp]);

  const handleKeyDown = useCallback((e) => {
    const map = {
      ArrowUp:'up', w:'up', W:'up',
      ArrowDown:'down', s:'down', S:'down',
      ArrowLeft:'left', a:'left', A:'left',
      ArrowRight:'right', d:'right', D:'right',
    };
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
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

  const myPlayer = players.find(p => p.id === MY_ID);
  const myHeldPowerUp = myPlayer ? myPlayer.heldPowerUp : null;

  return (
    <div className="min-h-screen w-full bg-green-800 flex flex-col select-none overflow-hidden">
      <TopBar players={players} myId={MY_ID} round={round} />

      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="relative flex-shrink-0"
          style={{ width: GRID_SIZE * cellSize, height: GRID_SIZE * cellSize }}>

          {Array(GRID_SIZE).fill(null).map((_, y) =>
            Array(GRID_SIZE).fill(null).map((_, x) => {
              const isDark = (x + y) % 2 === 0;
              const hasGrass = grassGrid && grassGrid[y] ? grassGrid[y][x] : true;
              const hasRock = rockGrid && rockGrid[y] ? rockGrid[y][x] : false;
              return (
                <div key={`${x}-${y}`} className="absolute overflow-hidden"
                  style={{ left: x*cellSize, top: y*cellSize, width: cellSize, height: cellSize,
                    backgroundColor: isDark ? '#8B5E3C' : '#C49A6C' }}>
                  {hasGrass && !hasRock && (
                    <div className="absolute inset-0">
                      {grassBlades[y][x].map((b, i) => (
                        <div key={i} className="absolute bottom-0 rounded-t-full" style={{
                          left:`${b.left}%`, width:`${b.width}px`, height:`${b.height}%`,
                          transform:`rotate(${b.tilt}deg)`, transformOrigin:'bottom center',
                          background:'linear-gradient(to top,#166534,#22c55e,#86efac)',
                        }} />
                      ))}
                    </div>
                  )}
                  {!hasGrass && !hasRock && (
                    <div className="absolute inset-0">
                      {stubbleBlades[y][x].map((b, i) => (
                        <div key={i} className="absolute bottom-0 rounded-t-full"
                          style={{ left:`${b.left}%`, width:'2px', height:`${b.height}px`, background:'#166534' }} />
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
            const pos = pixelPositions[key] || { x: player.posX*cellSize, y: player.posY*cellSize };
            return (
              <PlayerMower key={player.id} player={player} pos={pos}
                cellSize={cellSize} isMe={player.id === MY_ID} />
            );
          })}

          {bombs.map(bomb => {
            const now = Date.now();
            const prog = Math.min(1, (now - bomb.launch) / (bomb.arrival - bomb.launch));
            const bx = (bomb.fromX + (bomb.toX - bomb.fromX) * prog) * cellSize + cellSize/2;
            const by = (bomb.fromY + (bomb.toY - bomb.fromY) * prog) * cellSize + cellSize/2;
            const arc = Math.sin(prog * Math.PI) * cellSize * 2;
            return (
              <div key={bomb.id} className="absolute pointer-events-none"
                style={{ left: bx-16, top: by-arc-16, zIndex:30, fontSize:24, fontWeight:'bold', color:'#F87171' }}>
                [B]
              </div>
            );
          })}

          {powerUpNotifs.map(notif => {
            const p = players.find(pl => pl.id === notif.playerId);
            if (!p) return null;
            const pos = pixelPositions[String(p.id)] || { x: p.posX*cellSize, y: p.posY*cellSize };
            return (
              <div key={notif.id} className="absolute pointer-events-none animate-bounce"
                style={{ left: pos.x + cellSize/2 - 18, top: pos.y - 44, zIndex:30 }}>
                <PowerUpBadge type={notif.type} size={34} />
              </div>
            );
          })}

          {phase === 'COUNTDOWN' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40" style={{ zIndex:40 }}>
              <div className="text-white font-black text-center" style={{
                fontSize: countdown===0 ? 'clamp(3rem,10vw,5rem)' : 'clamp(5rem,15vw,8rem)',
                textShadow:'0 0 30px rgba(255,255,0,0.8)',
                fontFamily:'"Comic Sans MS",sans-serif',
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
        <GameOverScreen players={players} winnerId={winnerId} myId={MY_ID}
          round={round} onRetry={retry} onExit={onExit} />
      )}
    </div>
  );
};

export default Game;
