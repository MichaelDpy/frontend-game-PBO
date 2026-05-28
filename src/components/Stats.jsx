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
  const { isLoggedIn, authUser } = useGameContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    setError('');
    api.getMyStats()
      .then(data => setStats(data))
      .catch(err => {
        const msg = err.message || '';
        if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
          setError('Sesi kamu sudah habis. Silakan login ulang.');
        } else {
          setError(msg || 'Gagal memuat statistik');
        }
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <BushBackground variant="messy" className="w-full max-w-md">
        <h1
          className="text-4xl md:text-5xl font-black text-white text-center mb-6"
          style={{
            fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
            textShadow: '3px 3px 0px #1a5c1a, -1px -1px 0px #32CD32, 4px 4px 8px rgba(0,0,0,0.5)',
            WebkitTextStroke: '1px #0d3d0d',
          }}
        >
          Statistik
        </h1>

        {/* Not logged in */}
        {!isLoggedIn && (
          <div className="flex flex-col items-center py-6 gap-3">
            {/* Person icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
              width="56" height="56" className="opacity-50 mb-2">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            <p className="text-white font-bold text-center text-lg">
              Login untuk melihat statistik
            </p>
            <p className="text-white/60 text-sm text-center">
              Statistik hanya tersimpan untuk pengguna yang memiliki akun.
              Klik ikon orang di menu utama untuk login atau daftar.
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoggedIn && loading && (
          <p className="text-white text-center py-8 animate-pulse">Memuat...</p>
        )}

        {/* Error */}
        {isLoggedIn && error && (
          <div className="mb-4 px-3 py-2 bg-red-500/30 border border-red-400 rounded-lg">
            <p className="text-red-200 text-sm font-semibold text-center">{error}</p>
          </div>
        )}

        {/* Stats */}
        {isLoggedIn && !loading && stats && (
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
        )}

        {/* Logged in but no stats yet (all zeros) */}
        {isLoggedIn && !loading && !error && stats && stats.totalGamesPlayed === 0 && (
          <p className="text-white/50 text-xs text-center mt-3">
            Belum ada game yang dimainkan dengan akun ini.
          </p>
        )}

        <div className="flex justify-center mt-8">
          <WoodenButton text="BACK" onClick={onBack} />
        </div>
      </BushBackground>
    </div>
  );
};

export default Stats;
