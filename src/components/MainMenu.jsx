// components/MainMenu.jsx
import WoodenButton from './WoodenButton';
import LawnMower from './LawnMower';
import ColorPicker from './ColorPicker';
import BushBackground from './BushBackground';
import NameInput from './NameInput';
import { useGameContext } from '../context/GameContext';

const MainMenu = ({ onPlay, onHowToPlay, onCredit, onStats }) => {
  const { playerName, setPlayerName, mowerColor, setMowerColor, myPlayerId } = useGameContext();

  const colors = [
    { name: 'blue',   bg: 'bg-blue-500',   border: 'border-blue-700'   },
    { name: 'green',  bg: 'bg-green-500',  border: 'border-green-700'  },
    { name: 'yellow', bg: 'bg-yellow-400', border: 'border-yellow-600' },
    { name: 'red',    bg: 'bg-red-500',    border: 'border-red-700'    },
  ];

  const handleShowStats = () => {
    onStats?.();
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen gap-6 lg:gap-10 p-4 sm:p-6 lg:p-8">

      {/* Column 1: Title + Menu */}
      <div className="flex flex-col items-center">
        {/* Title block — "Quiz Game" naik mendekati "LawnMower" */}
        <div className="mb-4 text-center">
          <h1
            className="font-black text-white leading-none"
            style={{
              fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
              fontSize: 'clamp(2.8rem, 8vw, 5rem)',
              textShadow: '4px 4px 0px #228B22, -2px -2px 0px #32CD32, 6px 6px 12px rgba(0,0,0,0.5)',
              WebkitTextStroke: '2px #1a5c1a',
            }}
          >
            LawnMower
          </h1>
          {/* "Quiz Game" langsung di bawah, margin minimal */}
          <p
            className="font-bold text-white leading-none"
            style={{
              fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
              fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
              textShadow: '2px 2px 0px #228B22, -1px -1px 0px #32CD32, 3px 3px 6px rgba(0,0,0,0.5)',
              WebkitTextStroke: '1px #1a5c1a',
              marginTop: '-1em',
            }}
          >
            Quiz Game
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-0">
          <WoodenButton text="PLAY"       onClick={onPlay}        />
          <WoodenButton text="HOW TO PLAY" onClick={onHowToPlay}  />
          <WoodenButton text="STATS"      onClick={handleShowStats} />
          <WoodenButton text="CREDIT"     onClick={onCredit}      />
        </div>
      </div>

      {/* Column 2: Customization */}
      <BushBackground className="w-full max-w-xs sm:max-w-sm lg:min-w-72">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 drop-shadow-lg text-center">
          Customize
        </h2>
        <div className="flex justify-center mb-4">
          <LawnMower color={mowerColor} size="medium" />
        </div>
        <div className="flex justify-center mb-4">
          <ColorPicker colors={colors} selectedColor={mowerColor} onColorChange={setMowerColor} />
        </div>
        <div className="flex justify-center">
          <NameInput
            value={playerName}
            onChange={setPlayerName}
            label="Enter Your Name"
            placeholder="Your name..."
          />
        </div>
      </BushBackground>
    </div>
  );
};

export default MainMenu;
