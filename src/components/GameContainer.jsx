// components/GameContainer.jsx
import { useState, useEffect } from 'react';
import MainMenu from './MainMenu';
import HowToPlay from './HowToPlay';
import Credit from './Credit';
import Stats from './Stats';
import CreateRoom from './CreateRoom';
import WaitingRoom from './WaitingRoom';
import Game from './Game';
import { useGameContext } from '../context/GameContext';
import { ws } from '../services/websocket';

const GameContainer = () => {
  const [currentView, setCurrentView] = useState('mainMenu');
  const [animationState, setAnimationState] = useState('idle');
  const [pendingView, setPendingView] = useState(null);
  const { reset } = useGameContext();

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