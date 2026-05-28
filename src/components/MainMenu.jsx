// components/MainMenu.jsx
import { useState } from 'react';
import WoodenButton from './WoodenButton';
import LawnMower from './LawnMower';
import ColorPicker from './ColorPicker';
import BushBackground from './BushBackground';
import NameInput from './NameInput';
import MusicButton from './MusicButton';
import { useGameContext } from '../context/GameContext';
import { api } from '../services/websocket';

// ---- Person icon (SVG inline) ----
const PersonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="white"
    width="22"
    height="22"
  >
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);

// ---- Wooden icon button ----
const WoodenIconButton = ({ onClick, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="relative flex items-center justify-center w-11 h-11 rounded-lg border-[3px] border-amber-800 active:translate-y-0.5 hover:brightness-110 transition-all"
    style={{
      backgroundImage: `
        linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(0,0,0,0.18) 100%),
        repeating-linear-gradient(
          90deg,
          #d97706 0px, #d97706 3px,
          #b45309 3px, #b45309 6px,
          #92400e 6px, #92400e 9px
        )
      `,
      boxShadow: `
        inset 0 2px 3px rgba(255,255,255,0.25),
        inset 0 -2px 3px rgba(0,0,0,0.25),
        0 3px 0 #78350f,
        0 4px 6px rgba(0,0,0,0.35)
      `,
    }}
  >
    {children}
  </button>
);

// ---- Auth Modal (wooden panel) ----
const AuthModal = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { handleLogin, handleLogout, isLoggedIn, authUser } = useGameContext();

  const handleSubmit = async () => {
    // Validasi frontend
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedUsername || !trimmedPassword) {
      setError('Username dan password tidak boleh kosong');
      return;
    }
    
    if (mode === 'register') {
      if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
        setError('Username harus 3-20 karakter');
        return;
      }
      if (trimmedPassword.length < 4 || trimmedPassword.length > 50) {
        setError('Password harus 4-50 karakter');
        return;
      }
      // Validasi karakter username (alphanumeric dan underscore)
      if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
        setError('Username hanya boleh huruf, angka, dan underscore');
        return;
      }
    } else {
      // Login validation
      if (trimmedUsername.length < 3) {
        setError('Username minimal 3 karakter');
        return;
      }
      if (trimmedPassword.length < 4) {
        setError('Password minimal 4 karakter');
        return;
      }
    }
    
    setError('');
    setLoading(true);
    try {
      let data;
      if (mode === 'login') {
        data = await api.login(trimmedUsername, trimmedPassword);
      } else {
        data = await api.register(trimmedUsername, trimmedPassword);
      }
      handleLogin(data);
      onSuccess?.(data);
      onClose();
    } catch (err) {
      try {
        const parsed = JSON.parse(err.message);
        setError(parsed.message || 'Terjadi kesalahan');
      } catch {
        setError(err.message || 'Terjadi kesalahan');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
    onClose();
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Wooden panel */}
      <div
        className="relative w-full max-w-sm rounded-2xl border-4 border-amber-800 p-6 shadow-2xl"
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 40%, rgba(0,0,0,0.15) 100%),
            repeating-linear-gradient(
              90deg,
              #d97706 0px, #d97706 4px,
              #b45309 4px, #b45309 8px,
              #92400e 8px, #92400e 12px
            )
          `,
          boxShadow: `
            inset 0 3px 6px rgba(255,255,255,0.2),
            inset 0 -3px 6px rgba(0,0,0,0.3),
            0 8px 0 #78350f,
            0 12px 24px rgba(0,0,0,0.5)
          `,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-amber-900/60 hover:bg-amber-900 text-amber-100 font-black text-sm transition-colors"
        >
          ✕
        </button>

        {isLoggedIn ? (
          // ---- Logged-in view ----
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-amber-600"
              style={{ background: 'rgba(0,0,0,0.25)' }}
            >
              <PersonIcon />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36" height="36">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            <p
              className="text-amber-100 font-black text-xl text-center"
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
            >
              {authUser?.username}
            </p>
            <p className="text-amber-200/70 text-sm text-center -mt-2">
              Sudah masuk
            </p>
            <WoodenButton text="LOGOUT" onClick={handleLogoutClick} />
          </div>
        ) : (
          // ---- Login / Register view ----
          <>
            <h2
              className="text-center font-black text-amber-100 mb-5"
              style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                fontSize: '1.6rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              Akun
            </h2>

            {/* Tab switch */}
            <div className="flex mb-5 rounded-xl overflow-hidden border-2 border-amber-900">
              {['login', 'register'].map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 py-2 font-bold text-sm transition-colors ${
                    mode === m
                      ? 'bg-amber-900 text-amber-100'
                      : 'bg-amber-800/40 text-amber-200/60 hover:bg-amber-800/60'
                  }`}
                >
                  {m === 'login' ? 'LOGIN' : 'DAFTAR'}
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="text-amber-200/80 text-sm font-semibold block mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="Masukkan username..."
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_]+"
                  title="Username hanya boleh huruf, angka, dan underscore"
                  className="w-full px-3 py-2 rounded-lg border-2 border-amber-700 bg-amber-50 text-amber-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-amber-700/40"
                />
              </div>
              <div>
                <label className="text-amber-200/80 text-sm font-semibold block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="Masukkan password..."
                  minLength={4}
                  maxLength={50}
                  className="w-full px-3 py-2 rounded-lg border-2 border-amber-700 bg-amber-50 text-amber-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-amber-700/40"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-3 px-3 py-2 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-200 text-xs font-semibold text-center">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-center">
              {loading ? (
                <p className="text-amber-200 font-bold animate-pulse py-2">Memproses...</p>
              ) : (
                <WoodenButton
                  text={mode === 'login' ? 'MASUK' : 'DAFTAR'}
                  onClick={handleSubmit}
                />
              )}
            </div>

            {mode === 'register' && (
              <p className="text-amber-200/40 text-xs text-center mt-2">
                Username 3–20 karakter · Password min. 4 karakter
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ---- Main Menu ----
const MainMenu = ({ onPlay, onHowToPlay, onCredit, onStats }) => {
  const { playerName, setPlayerName, mowerColor, setMowerColor, isLoggedIn, authUser, isMuted, toggleMute } = useGameContext();
  const [showAuth, setShowAuth] = useState(false);

  const colors = [
    { name: 'blue',   bg: 'bg-blue-500',   border: 'border-blue-700'   },
    { name: 'green',  bg: 'bg-green-500',  border: 'border-green-700'  },
    { name: 'yellow', bg: 'bg-yellow-400', border: 'border-yellow-600' },
    { name: 'red',    bg: 'bg-red-500',    border: 'border-red-700'    },
  ];

  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-center min-h-screen gap-6 lg:gap-10 p-4 sm:p-6 lg:p-8">

      {/* ---- Account button — top left ---- */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
        <WoodenIconButton onClick={() => setShowAuth(true)} title="Akun">
          <PersonIcon />
        </WoodenIconButton>
        {isLoggedIn && (
          <span
            className="text-amber-100 font-bold text-sm drop-shadow"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}
          >
            {authUser?.username}
          </span>
        )}
      </div>

      {/* ---- Music button — top right ---- */}
      <div className="absolute top-4 right-4 z-20">
        <MusicButton />
      </div>

      {/* ---- Auth modal ---- */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}

      {/* Column 1: Title + Menu */}
      <div className="flex flex-col items-center">
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

        <div className="flex flex-col items-center gap-0">
          <WoodenButton text="PLAY"        onClick={onPlay}        />
          <WoodenButton text="HOW TO PLAY" onClick={onHowToPlay}   />
          <WoodenButton text="STATS"       onClick={onStats}       />
          <WoodenButton text="CREDIT"      onClick={onCredit}      />
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
