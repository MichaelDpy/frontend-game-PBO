// components/LawnMower.jsx
const LawnMower = ({ color, size = 'medium' }) => {
  const deckColorClasses = {
    blue: '#3B82F6',
    green: '#16A34A',
    yellow: '#EAB308',
    red: '#DC2626',
  };

  const sizeClasses = {
    small: { width: 180, height: 140 },
    medium: { width: 240, height: 170 },
    large: { width: 300, height: 200 },
  };

  const { width, height } = sizeClasses[size] || sizeClasses.medium;
  const scale = width / 240;

  const deckColor = deckColorClasses[color] || deckColorClasses.green;

  // Trapesium: kiri tinggi, kanan rendah
  const leftTopY = 60 * scale;    // Kiri atas (tinggi)
  const rightTopY = 85 * scale;  // Kanan atas (rendah)
  const leftBottomY = 120 * scale;
  const rightBottomY = 120 * scale;
  const leftX = 40 * scale;
  const rightX = width - 40 * scale;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`deckGrad${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={deckColor} />
          <stop offset="100%" stopColor={deckColor} stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* GERGaji OVAL - di bawah tengah trapesium, lebih naik agar tidak kena */}
      <ellipse
        cx={width / 2}
        cy={128 * scale}
        rx={35 * scale}
        ry={10 * scale}
        fill="#6B7280"
        stroke="#374151"
        strokeWidth={3 * scale}
      />
      {/* Detail gergaji - garis-garis */}
      <line x1={(width / 2) - 25 * scale} y1={128 * scale} x2={(width / 2) + 25 * scale} y2={128 * scale} stroke="#4B5563" strokeWidth={1 * scale} />
      <line x1={(width / 2) - 20 * scale} y1={123 * scale} x2={(width / 2) + 20 * scale} y2={123 * scale} stroke="#4B5563" strokeWidth={1 * scale} />
      <line x1={(width / 2) - 20 * scale} y1={133 * scale} x2={(width / 2) + 20 * scale} y2={133 * scale} stroke="#4B5563" strokeWidth={1 * scale} />

      {/* RODA - 4 roda di setiap pojok bawah trapesium */}
      {/* Roda kiri belakang (besar) */}
      <circle cx={leftX - 5 * scale} cy={135 * scale} r={18 * scale} fill="#1F2937" stroke="#374151" strokeWidth={2 * scale} />
      <circle cx={leftX - 5 * scale} cy={135 * scale} r={10 * scale} fill="#DC2626" stroke="#991B1B" strokeWidth={2 * scale} />
      <circle cx={leftX - 5 * scale} cy={135 * scale} r={5 * scale} fill="#7F1D1D" />

      {/* Roda kanan belakang (besar) */}
      <circle cx={rightX + 5 * scale} cy={135 * scale} r={18 * scale} fill="#1F2937" stroke="#374151" strokeWidth={2 * scale} />
      <circle cx={rightX + 5 * scale} cy={135 * scale} r={10 * scale} fill="#DC2626" stroke="#991B1B" strokeWidth={2 * scale} />
      <circle cx={rightX + 5 * scale} cy={135 * scale} r={5 * scale} fill="#7F1D1D" />

      {/* Roda kiri depan (kecil) */}
      <circle cx={leftX + 25 * scale} cy={138 * scale} r={12 * scale} fill="#1F2937" stroke="#374151" strokeWidth={2 * scale} />
      <circle cx={leftX + 25 * scale} cy={138 * scale} r={6 * scale} fill="#DC2626" stroke="#991B1B" strokeWidth={1.5 * scale} />
      <circle cx={leftX + 25 * scale} cy={138 * scale} r={3 * scale} fill="#7F1D1D" />

      {/* Roda kanan depan (kecil) */}
      <circle cx={rightX - 25 * scale} cy={138 * scale} r={12 * scale} fill="#1F2937" stroke="#374151" strokeWidth={2 * scale} />
      <circle cx={rightX - 25 * scale} cy={138 * scale} r={6 * scale} fill="#DC2626" stroke="#991B1B" strokeWidth={1.5 * scale} />
      <circle cx={rightX - 25 * scale} cy={138 * scale} r={3 * scale} fill="#7F1D1D" />

      {/* TRAPESIUM UTAMA - Body mesin */}
      <path
        d={`
          M ${leftX} ${leftTopY}
          L ${rightX} ${rightTopY}
          L ${rightX} ${rightBottomY}
          L ${leftX} ${leftBottomY}
          Z
        `}
        fill={`url(#deckGrad${color})`}
        stroke="#1F2937"
        strokeWidth={3 * scale}
      />

      {/* Handle - garis hitam menempel di sisi kiri (tinggi) */}
      <path
        d={`
          M ${leftX} ${(leftTopY + leftBottomY) / 2}
          Q ${15 * scale} ${80 * scale} ${20 * scale} ${30 * scale}
          L ${45 * scale} ${30 * scale}
        `}
        stroke="#1F2937"
        strokeWidth={6 * scale}
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Handle grip merah */}
      <rect
        x={18 * scale}
        y={24 * scale}
        width={28 * scale}
        height={10 * scale}
        rx={3 * scale}
        fill="#DC2626"
        stroke="#991B1B"
        strokeWidth={2 * scale}
      />

      {/* Titik sambungan handle ke body */}
      <circle cx={leftX} cy={(leftTopY + leftBottomY) / 2} r={4 * scale} fill="#1F2937" />

      {/* KOTAK GENERATOR - di sisi miring dekat sisi kanan (yang rendah) */}
      <path
        d={`
          M ${rightX - 35 * scale} ${rightTopY - 5 * scale}
          L ${rightX - 10 * scale} ${rightTopY + 2 * scale}
          L ${rightX - 10 * scale} ${rightTopY + 25 * scale}
          L ${rightX - 35 * scale} ${rightTopY + 18 * scale}
          Z
        `}
        fill="#DC2626"
        stroke="#1F2937"
        strokeWidth={2 * scale}
      />
      {/* Detail garis pada generator */}
      <line x1={rightX - 30 * scale} y1={rightTopY + 5 * scale} x2={rightX - 15 * scale} y2={rightTopY + 10 * scale} stroke="#991B1B" strokeWidth={1 * scale} />
      <line x1={rightX - 30 * scale} y1={rightTopY + 12 * scale} x2={rightX - 15 * scale} y2={rightTopY + 17 * scale} stroke="#991B1B" strokeWidth={1 * scale} />

    </svg>
  );
};

export default LawnMower;
