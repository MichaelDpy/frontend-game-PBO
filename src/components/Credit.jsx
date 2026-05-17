// components/Credit.jsx
import BushBackground from './BushBackground';
import WoodenButton from './WoodenButton';

const CreditCard = ({ name, role, emoji }) => (
  <div className="bg-green-800/40 rounded-xl p-4 border border-green-600/40 flex items-center gap-4">
    <span className="text-4xl">{emoji}</span>
    <div>
      <p className="text-white font-black text-lg">{name}</p>
      <p className="text-white/60 text-sm">{role}</p>
    </div>
  </div>
);

const Credit = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {/* Bush persegi panjang dengan judul di atas tengah */}
      <BushBackground variant="messy" className="w-full max-w-3xl min-h-[500px]">
        {/* Judul di atas tengah */}
        <h1 
          className="text-4xl md:text-5xl font-black text-white text-center mb-8"
          style={{
            fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
            textShadow: `
              3px 3px 0px #1a5c1a,
              -1px -1px 0px #32CD32,
              4px 4px 8px rgba(0,0,0,0.5)
            `,
            WebkitTextStroke: '1px #0d3d0d',
          }}
        >
          Credits
        </h1>

        {/* Konten */}
        <div className="flex flex-col items-center justify-center py-16 text-white/60">
          <p className="text-lg font-semibold">Coming Soon</p>
        </div>

        {/* Tombol Back */}
        <div className="flex justify-center mt-8">
          <WoodenButton text="BACK" onClick={onBack} />
        </div>
      </BushBackground>
    </div>
  );
};

export default Credit;