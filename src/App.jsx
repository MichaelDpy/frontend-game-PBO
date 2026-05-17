import AnimatedBackground from './components/AnimatedBackground';
import GameContainer from './components/GameContainer';
import { GameProvider } from './context/GameContext';
import RotateScreen from './components/RotateScreen';

function App() {
  return (
    <GameProvider>
      <RotateScreen />
      <div className="relative min-h-screen overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10">
          <GameContainer />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;