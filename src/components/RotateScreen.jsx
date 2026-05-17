// components/RotateScreen.jsx
// Muncul hanya di perangkat mobile saat orientasi portrait
import { useState, useEffect } from 'react';

const RotateScreen = () => {
  const [showRotate, setShowRotate] = useState(false);

  useEffect(() => {
    const check = () => {
      // Hanya tampilkan di layar kecil (mobile/tablet) saat portrait
      const isMobile = window.innerWidth <= 1024;
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowRotate(isMobile && isPortrait);
    };

    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (!showRotate) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)' }}
    >
      {/* Animated phone rotate icon */}
      <div style={{ animation: 'rotatePhone 2s ease-in-out infinite' }}>
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          {/* Phone body */}
          <rect x="30" y="15" width="40" height="70" rx="6" fill="#1F2937" stroke="#4B5563" strokeWidth="2" />
          <rect x="34" y="22" width="32" height="50" rx="2" fill="#374151" />
          {/* Home button */}
          <circle cx="50" cy="78" r="3" fill="#6B7280" />
          {/* Rotate arrow */}
          <path d="M 15 50 A 35 35 0 0 1 85 50" stroke="#22c55e" strokeWidth="4" fill="none"
            strokeLinecap="round" markerEnd="url(#arrow)" />
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 Z" fill="#22c55e" />
            </marker>
          </defs>
        </svg>
      </div>

      <p
        className="text-white font-black text-2xl mt-6 text-center px-8"
        style={{
          fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
          textShadow: '2px 2px 0 #14532d',
        }}
      >
        Putar Layarmu!
      </p>
      <p className="text-white/70 text-base mt-2 text-center px-8">
        Game ini dimainkan dalam mode <strong className="text-green-300">landscape</strong>
      </p>

      <style>{`
        @keyframes rotatePhone {
          0%   { transform: rotate(0deg);   }
          40%  { transform: rotate(-90deg); }
          60%  { transform: rotate(-90deg); }
          100% { transform: rotate(0deg);   }
        }
      `}</style>
    </div>
  );
};

export default RotateScreen;
