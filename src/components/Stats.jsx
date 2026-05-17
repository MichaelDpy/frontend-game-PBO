// components/Stats.jsx
import { useState, useEffect } from 'react';
import BushBackground from './BushBackground';
import WoodenButton from './WoodenButton';
import { useGameContext } from '../context/GameContext';
import { api } from '../services/websocket';

const StatRow = ({ label, value, color = 'text-white' }) => (
  <div className="flex justify-between items-center bg-green-800/50 rounded-lg px-3 py-2">
    <span className="text-white/80 font-semibold text-sm">{label}</span>
    <span className={`font-black text-base ${color}`}>{value}</span>
  </div>
);

const Stats = ({ onBack }) => {
  const { myPlayerId } = useGameContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!myPlayerId) return;
    setLoading(true);
    api.getStats(myPlayerId)
      .then(data => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [myPlayerId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <BushBackground variant="messy" className="w-full max-w-md">
        <h1
          className="text-4xl md:text-5xl font-black text-white text-center mb-8"
          style={{
            fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
            textShadow: '3px 3px 0px #1a5c1a, -1px -1px 0px #32CD32, 4px 4px 8px rgba(0,0,0,0.5)',
            WebkitTextStroke: '1px #0d3d0d',
          }}
        >
          Statistik
        </h1>

        {loading ? (
          <p className="text-white text-center py-8">Memuat...</p>
        ) : stats ? (
          <div className="space-y-2">
            <p className="text-yellow-300 text-lg font-bold text-center mb-3">
              {stats.playerName}
            </p>
            <StatRow label="Total Game"      value={stats.totalGamesPlayed} />
            <StatRow label="Menang"          value={stats.totalWins}        color="text-green-400" />
            <StatRow label="Kalah"           value={stats.totalLosses}      color="text-red-400" />
            <StatRow label="Win Rate"        value={`${stats.winRate.toFixed(1)}%`} color="text-yellow-400" />
            <StatRow label="Rumput Dipotong" value={stats.totalGrassCut} />
            <StatRow label="Total Ronde"     value={stats.totalRoundsPlayed} />
            <StatRow label="Kuis Dijawab"    value={stats.totalQuizAnswered} />
            <StatRow label="Kuis Benar"      value={stats.totalQuizCorrect} color="text-green-400" />
            <StatRow label="Akurasi Kuis"    value={`${stats.quizAccuracy.toFixed(1)}%`} color="text-blue-400" />
          </div>
        ) : (
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

        <div className="flex justify-center mt-8">
          <WoodenButton text="BACK" onClick={onBack} />
        </div>
      </BushBackground>
    </div>
  );
};

export default Stats;
