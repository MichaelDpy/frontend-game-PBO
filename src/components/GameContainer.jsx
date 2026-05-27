// components/GameContainer.jsx
import { useState, useEffect, useRef } from 'react';
import MainMenu from './MainMenu';
import HowToPlay from './HowToPlay';
import Credit from './Credit';
import Stats from './Stats';
import CreateRoom from './CreateRoom';
import WaitingRoom from './WaitingRoom';
import Game from './Game';
import MusicButton from './MusicButton';
import { useGameContext } from '../context/GameContext';
import { ws } from '../services/websocket';

// ---- Menu music hook (shared across non-game views) ----
function useMenuMusicGlobal(isMuted, active) {
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

      const notes = [
        [523.25, 0.0,  0.18], [659.25, 0.2,  0.18], [783.99, 0.4,  0.18],
        [880.00, 0.6,  0.28], [783.99, 0.9,  0.18], [659.25, 1.1,  0.18],
        [523.25, 1.3,  0.28], [392.00, 1.6,  0.18], [440.00, 1.8,  0.18],
        [523.25, 2.0,  0.18], [587.33, 2.2,  0.18], [659.25, 2.4,  0.28],
        [783.99, 2.7,  0.18], [880.00, 2.9,  0.18], [1046.5, 3.1,  0.38],
        [880.00, 3.5,  0.18], [783.99, 3.7,  0.18], [659.25, 3.9,  0.18],
        [523.25, 4.1,  0.38],
      ];
      const loopDur = 4.6;

      const masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.18;
      masterGain.connect(audioCtx.destination);

      const scheduleLoop = (offset) => {
        if (!ctxRef.current || ctxRef.current.state === 'closed') return;
        const ctx = ctxRef.current;
        notes.forEach(([freq, t, dur]) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.value = freq;
          const at = ctx.currentTime + offset + t;
          gain.gain.setValueAtTime(0.001, at);
          gain.gain.linearRampToValueAtTime(0.7, at + 0.01);
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
    if (!active || isMuted) {
      stopMusic();
      return;
    }
    // Aktif dan tidak muted: mulai musik
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
  }, [isMuted, active]);

  // Cleanup saat komponen unmount
  useEffect(() => {
    return () => stopMusic();
  }, []);
}

const GameContainer = () => {
  const [currentView, setCurrentView] = useState('mainMenu');
  const [animationState, setAnimationState] = useState('idle');
  const [pendingView, setPendingView] = useState(null);
  const { reset, isMuted, toggleMute } = useGameContext();

  // Menu music plays on all non-game views
  const isGameView = currentView === 'game';
  useMenuMusicGlobal(isMuted, !isGameView);

  const navigateTo = (view) => {
    if (view === currentView) return;
    setAnimationState('exiting');
    setPendingView(view);
  };

  useEffect(() => {
    if (animationState === 'exiting' && pendingView) {
      const timer = setTimeout(() => {
        setCurrentView(pendingView);
        setAnimationState('entering');
        setPendingView(null);
      }, 400);
      return () => clearTimeout(timer);
    }
    if (animationState === 'entering') {
      const timer = setTimeout(() => setAnimationState('idle'), 400);
      return () => clearTimeout(timer);
    }
  }, [animationState, pendingView]);

  const getAnimationClasses = () => {
    switch (animationState) {
      case 'exiting': return 'animate-slide-down-out';
      case 'entering': return 'animate-slide-up-in';
      default: return '';
    }
  };

  const handleRoomReady = (code) => {
    navigateTo('waitingRoom');
  };

  const handleDisbanded = () => {
    reset();
    navigateTo('mainMenu');
  };

  const renderView = () => {
    switch (currentView) {
      case 'mainMenu':
        return (
          <MainMenu
            onPlay={() => navigateTo('createRoom')}
            onHowToPlay={() => navigateTo('howToPlay')}
            onCredit={() => navigateTo('credit')}
            onStats={() => navigateTo('stats')}
          />
        );
      case 'createRoom':
        return (
          <CreateRoom
            onBack={() => navigateTo('mainMenu')}
            onRoomReady={handleRoomReady}
          />
        );
      case 'waitingRoom':
        return (
          <WaitingRoom
            onBack={() => { reset(); navigateTo('createRoom'); }}
            onStartGame={() => navigateTo('game')}
            onDisbanded={handleDisbanded}
          />
        );
      case 'game':
        return (
          <Game
            onExit={() => { ws.disconnect(); reset(); navigateTo('mainMenu'); }}
          />
        );
      case 'howToPlay':
        return <HowToPlay onBack={() => navigateTo('mainMenu')} />;
      case 'credit':
        return <Credit onBack={() => navigateTo('mainMenu')} />;
      case 'stats':
        return <Stats onBack={() => navigateTo('mainMenu')} />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className={`transition-all duration-400 ease-in-out ${getAnimationClasses()}`}>
        {renderView()}
      </div>

      {/* Floating mute button for intermediate views (createRoom, waitingRoom, howToPlay, credit, stats) */}
      {!isGameView && currentView !== 'mainMenu' && (
        <div className="fixed top-4 right-4 z-50">
          <MusicButton />
        </div>
      )}

      <style>{`
        @keyframes slideDownOut {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes slideUpIn {
          0% { transform: translateY(100vh); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down-out { animation: slideDownOut 0.4s ease-in forwards; }
        .animate-slide-up-in { animation: slideUpIn 0.4s ease-out forwards; }
        .duration-400 { transition-duration: 400ms; }
      `}</style>
    </div>
  );
};

export default GameContainer;
