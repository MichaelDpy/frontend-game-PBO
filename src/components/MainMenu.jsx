// components/MainMenu.jsx
import { useState } from 'react';
import WoodenButton from './WoodenButton';
import LawnMower from './LawnMower';
import ColorPicker from './ColorPicker';
import BushBackground from './BushBackground';
import NameInput from './NameInput';
import { useGameContext } from '../context/GameContext';
import { api } from '../services/websocket';

const MainMenu = ({ onPlay, onHowToPlay, onCredit }) => {
  const { playerName, setPlayerName, mowerColor, setMowerColor, myPlayerId } = useGameContext();
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const colors = [
    { name: 'blue',   bg: 'bg-blue-500',   border: 'border-blue-700'   },
    { name: 'green',  bg: 'bg-green-500',  border: 'border-green-700'  },
    { name: 'yellow', bg: 'bg-yellow-400', border: 'border-yellow-600' },
    { name: 'red',    bg: 'bg-red-500',    border: 'border-red-700'    },
  ];

  const handleShowStats = async () => {
    setShowStats(true);
    if (!myPlayerId) {
      // Belum pernah main — tampilkan stats kosong, tidak perlu alert
      setStats(null);
      return;
    }
    setStatsLoading(true);
    try {
      const data = await api.getStats(myPlayerId);
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
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
              marginTop: '0.05em',
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

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <BushBackground variant="messy">
              <h1
                className="text-3xl sm:text-4xl font-black text-white text-center mb-6"
                style={{
                  fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
                  textShadow: '3px 3px 0px #1a5c1a, -1px -1px 0px #32CD32, 4px 4px 8px rgba(0,0,0,0.5)',
                  WebkitTextStroke: '1px #0d3d0d',
                }}
              >
                📊 Statistik
              </h1>

              {statsLoading ? (
                <p className="text-white text-center py-8">Memuat...</p>
              ) : stats ? (
                <div className="space-y-2">
                  <p className="text-yellow-300 text-lg font-bold text-center mb-3">
                    {stats.playerName}
                  </p>
                  <StatRow label="Total Game"       value={stats.totalGamesPlayed} />
                  <StatRow label="Menang"           value={stats.totalWins}        color="text-green-400" />
                  <StatRow label="Kalah"            value={stats.totalLosses}      color="text-red-400"   />
                  <StatRow label="Win Rate"         value={`${stats.winRate.toFixed(1)}%`}       color="text-yellow-400" />
                  <StatRow label="Rumput Dipotong"  value={stats.totalGrassCut}    />
                  <StatRow label="Total Ronde"      value={stats.totalRoundsPlayed} />
                  <StatRow label="Kuis Dijawab"     value={stats.totalQuizAnswered} />
                  <StatRow label="Kuis Benar"       value={stats.totalQuizCorrect} color="text-green-400" />
                  <StatRow label="Akurasi Kuis"     value={`${stats.quizAccuracy.toFixed(1)}%`}  color="text-blue-400"   />
                </div>
              ) : (
                /* Belum pernah main — tampilkan semua 0 */
                <div className="space-y-2">
                  <p className="text-white/60 text-sm text-center mb-3">Belum pernah bermain</p>
                  {[
                    ['Total Game', 0], ['Menang', 0], ['Kalah', 0],
                    ['Win Rate', '0.0%'], ['Rumput Dipotong', 0],
                    ['Total Ronde', 0], ['Kuis Dijawab', 0],
                    ['Kuis Benar', 0], ['Akurasi Kuis', '0.0%'],
                  ].map(([label, val]) => (
                    <StatRow key={label} label={label} value={val} />
                  ))}
                </div>
              )}

              <div className="flex justify-center mt-6">
                <WoodenButton text="TUTUP" onClick={() => setShowStats(false)} />
              </div>
            </BushBackground>
          </div>
        </div>
      )}
    </div>
  );
};

const StatRow = ({ label, value, color = 'text-white' }) => (
  <div className="flex justify-between items-center bg-green-800/50 rounded-lg px-3 py-2">
    <span className="text-white/80 font-semibold text-sm">{label}</span>
    <span className={`font-black text-base ${color}`}>{value}</span>
  </div>
);

export default MainMenu;
