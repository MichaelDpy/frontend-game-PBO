// components/WoodenButton.jsx
const WoodenButton = ({ text, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative
        w-52 h-18
        bg-amber-600
        border-4 border-amber-800
        rounded-lg
        font-bold text-xl text-amber-50
        shadow-xl
        active:translate-y-1 active:shadow-lg
        hover:bg-amber-500
        transition-all
        flex items-center justify-center
        mb-4
        overflow-visible
        ${className}
      `}
      style={{
        backgroundImage: `
          linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.2) 100%),
          repeating-linear-gradient(
            90deg,
            #d97706 0px,
            #d97706 3px,
            #b45309 3px,
            #b45309 6px,
            #92400e 6px,
            #92400e 9px
          )
        `,
        boxShadow: `
          inset 0 2px 4px rgba(255,255,255,0.3),
          inset 0 -2px 4px rgba(0,0,0,0.3),
          0 4px 8px rgba(0,0,0,0.4),
          0 6px 0 #78350f
        `,
      }}
    >
      {/* Lubang kecil di kiri */}
      <div 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-amber-900/60"
        style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}
      />
      {/* Lubang kecil di kanan */}
      <div 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-amber-900/60"
        style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}
      />
      
      {/* Text dengan efek kayu */}
      <span 
        className="drop-shadow-md relative z-10"
        style={{
          textShadow: '2px 2px 0 rgba(0,0,0,0.3), -1px -1px 0 rgba(255,255,255,0.2)',
        }}
      >
        {text}
      </span>
    </button>
  );
};

export default WoodenButton;
