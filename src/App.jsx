import AnimatedBackground from './components/AnimatedBackground';
import MainMenu from './components/MainMenu';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <div className="relative min-h-screen overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10">
          <MainMenu
            onPlay={() => {}}
            onHowToPlay={() => {}}
            onCredit={() => {}}
          />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;