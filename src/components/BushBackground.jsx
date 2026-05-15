// components/BushBackground.jsx
const BushBackground = ({ children, className = '', variant = 'messy' }) => {
  const isMessy = variant === 'messy';
  const isRectangle = variant === 'rectangle';

  return (
    <div className={`relative ${className}`}>
      {/* Daun-daun di BELAKANG kotak untuk varian messy - lebih realistis */}
      {isMessy && (
        <>
          {/* Daun kiri belakang */}
          <div className="absolute -left-4 top-[20%] w-10 h-12 bg-green-700 rounded-full transform -rotate-[35deg] -z-10 shadow-lg" style={{ clipPath: 'ellipse(40% 60% at 50% 50%)' }} />
          <div className="absolute -left-6 top-[45%] w-8 h-10 bg-green-600 rounded-full transform -rotate-[20deg] -z-10" style={{ clipPath: 'ellipse(45% 55% at 50% 50%)' }} />
          <div className="absolute -left-3 top-[65%] w-9 h-11 bg-green-800 rounded-full transform rotate-[15deg] -z-10" style={{ clipPath: 'ellipse(35% 65% at 50% 50%)' }} />
          <div className="absolute -left-5 top-[80%] w-7 h-9 bg-green-600 rounded-full transform -rotate-[40deg] -z-10" style={{ clipPath: 'ellipse(40% 60% at 50% 50%)' }} />
          
          {/* Daun kanan belakang */}
          <div className="absolute -right-4 top-[15%] w-10 h-12 bg-green-700 rounded-full transform rotate-[35deg] -z-10" style={{ clipPath: 'ellipse(40% 60% at 50% 50%)' }} />
          <div className="absolute -right-6 top-[40%] w-8 h-10 bg-green-600 rounded-full transform rotate-[25deg] -z-10" style={{ clipPath: 'ellipse(45% 55% at 50% 50%)' }} />
          <div className="absolute -right-3 top-[60%] w-9 h-11 bg-green-800 rounded-full transform -rotate-[10deg] -z-10" style={{ clipPath: 'ellipse(35% 65% at 50% 50%)' }} />
          <div className="absolute -right-5 top-[75%] w-7 h-9 bg-green-600 rounded-full transform rotate-[30deg] -z-10" style={{ clipPath: 'ellipse(40% 60% at 50% 50%)' }} />
          
          {/* Daun atas belakang */}
          <div className="absolute left-[15%] -top-4 w-9 h-11 bg-green-700 rounded-full transform -rotate-[15deg] -z-10" style={{ clipPath: 'ellipse(40% 60% at 50% 50%)' }} />
          <div className="absolute left-[35%] -top-6 w-10 h-13 bg-green-600 rounded-full transform rotate-[5deg] -z-10" style={{ clipPath: 'ellipse(45% 55% at 50% 50%)' }} />
          <div className="absolute left-[55%] -top-5 w-8 h-10 bg-green-800 rounded-full transform -rotate-[10deg] -z-10" style={{ clipPath: 'ellipse(35% 65% at 50% 50%)' }} />
          <div className="absolute left-[75%] -top-3 w-9 h-11 bg-green-600 rounded-full transform rotate-[20deg] -z-10" style={{ clipPath: 'ellipse(40% 60% at 50% 50%)' }} />
          
          {/* Daun bawah belakang */}
          <div className="absolute left-[20%] -bottom-4 w-8 h-10 bg-green-700 rounded-full transform rotate-[25deg] -z-10" style={{ clipPath: 'ellipse(40% 60% at 50% 50%)' }} />
          <div className="absolute left-[45%] -bottom-5 w-10 h-12 bg-green-600 rounded-full transform -rotate-[5deg] -z-10" style={{ clipPath: 'ellipse(45% 55% at 50% 50%)' }} />
          <div className="absolute left-[70%] -bottom-3 w-7 h-9 bg-green-800 rounded-full transform rotate-[15deg] -z-10" style={{ clipPath: 'ellipse(35% 65% at 50% 50%)' }} />
        </>
      )}

      {/* Bush shape background */}
      <div 
        className={`absolute inset-0 overflow-hidden ${isMessy ? 'rounded-3xl' : 'rounded-xl'}`}
        style={{
          background: isMessy ? `
            radial-gradient(circle at 20% 80%, #228B22 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #32CD32 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #006400 0%, transparent 40%),
            radial-gradient(circle at 60% 60%, #228B22 0%, transparent 50%),
            radial-gradient(circle at 10% 30%, #2E8B57 0%, transparent 35%),
            radial-gradient(circle at 90% 70%, #3CB371 0%, transparent 45%),
            radial-gradient(circle at 5% 60%, #32CD32 0%, transparent 40%),
            radial-gradient(circle at 95% 20%, #228B22 0%, transparent 40%),
            radial-gradient(circle at 50% 10%, #2E8B57 0%, transparent 30%),
            radial-gradient(circle at 70% 90%, #3CB371 0%, transparent 35%),
            #228B22
          ` : `
            radial-gradient(circle at 15% 15%, #32CD32 0%, transparent 40%),
            radial-gradient(circle at 85% 15%, #228B22 0%, transparent 40%),
            radial-gradient(circle at 15% 85%, #2E8B57 0%, transparent 40%),
            radial-gradient(circle at 85% 85%, #3CB371 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, #228B22 0%, transparent 50%),
            #1a6b1a
          `,
          boxShadow: isMessy 
            ? 'inset 0 0 40px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2)'
            : 'inset 0 0 30px rgba(0,0,0,0.4), 0 4px 15px rgba(0,0,0,0.3)',
        }}
      >
        {/* Leaf texture overlay */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: isMessy ? `
              radial-gradient(circle at 10% 20%, #32CD32 3px, transparent 3px),
              radial-gradient(circle at 30% 60%, #90EE90 4px, transparent 4px),
              radial-gradient(circle at 70% 30%, #228B22 3px, transparent 3px),
              radial-gradient(circle at 50% 80%, #006400 4px, transparent 4px),
              radial-gradient(circle at 80% 70%, #32CD32 3px, transparent 3px),
              radial-gradient(circle at 15% 50%, #3CB371 3px, transparent 3px),
              radial-gradient(circle at 85% 40%, #2E8B57 4px, transparent 4px),
              radial-gradient(circle at 5% 80%, #90EE90 2px, transparent 2px),
              radial-gradient(circle at 95% 10%, #228B22 3px, transparent 3px),
              radial-gradient(circle at 45% 15%, #32CD32 2px, transparent 2px)
            ` : `
              radial-gradient(circle at 20% 20%, #32CD32 2px, transparent 2px),
              radial-gradient(circle at 80% 20%, #228B22 2px, transparent 2px),
              radial-gradient(circle at 20% 80%, #2E8B57 2px, transparent 2px),
              radial-gradient(circle at 80% 80%, #3CB371 2px, transparent 2px),
              radial-gradient(circle at 50% 50%, #228B22 3px, transparent 3px)
            `,
            backgroundSize: isMessy ? '30px 30px' : '50px 50px',
          }}
        />
      </div>

      {/* Border untuk varian rectangle */}
      {isRectangle && (
        <div 
          className="absolute inset-0 rounded-xl border-4 border-green-800 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  );
};

export default BushBackground;