// components/HowToPlay.jsx
import BushBackground from './BushBackground';
import WoodenButton from './WoodenButton';

// ─── SVG Illustrations ────────────────────────────────────────────────────────

const IlluGrid = () => (
  <svg viewBox="0 0 160 140" width="100%" height="100%">
    {[0,1,2,3].map(row => [0,1,2,3].map(col => (
      <rect key={`${row}-${col}`} x={10+col*35} y={10+row*30} width={33} height={28}
        fill={(row+col)%2===0?'#8B5E3C':'#C49A6C'} stroke="#5a3a1a" strokeWidth="0.5"/>
    )))}
    {[[0,0],[0,2],[1,1],[1,3],[2,0],[2,2],[3,1]].map(([r,c]) => (
      <g key={`g-${r}-${c}`}>
        {[0,1,2,3,4].map(i => (
          <line key={i} x1={13+c*35+i*6} y1={37+r*30} x2={14+c*35+i*6} y2={22+r*30}
            stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
        ))}
      </g>
    ))}
    <rect x="52" y="42" width="22" height="12" fill="#3B82F6" stroke="#1F2937" strokeWidth="1.5" rx="2"/>
    <rect x="62" y="39" width="10" height="6" fill="#DC2626" rx="1"/>
    <circle cx="57" cy="56" r="4" fill="#1F2937"/><circle cx="69" cy="56" r="4" fill="#1F2937"/>
    <circle cx="57" cy="56" r="2" fill="#DC2626"/><circle cx="69" cy="56" r="2" fill="#DC2626"/>
    <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#FCD34D"/></marker></defs>
    <path d="M78 48 L90 48" stroke="#FCD34D" strokeWidth="2" markerEnd="url(#arr)"/>
    <text x="80" y="130" textAnchor="middle" fontSize="9" fill="#FCD34D" fontWeight="bold">Potong Rumput!</text>
  </svg>
);

const IlluControls = () => (
  <svg viewBox="0 0 160 140" width="100%" height="100%">
    {[['W',55,20],['A',30,45],['S',55,45],['D',80,45]].map(([k,x,y]) => (
      <g key={k}>
        <rect x={x} y={y} width="22" height="22" rx="4" fill="#374151" stroke="#6B7280" strokeWidth="1.5"/>
        <text x={x+11} y={y+15} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">{k}</text>
      </g>
    ))}
    <rect x="20" y="78" width="80" height="18" rx="4" fill="#374151" stroke="#FCD34D" strokeWidth="1.5"/>
    <text x="60" y="91" textAnchor="middle" fontSize="9" fill="#FCD34D" fontWeight="bold">SPACE = Power-Up</text>
    <text x="80" y="118" textAnchor="middle" fontSize="8" fill="#e2e8f0">Mobile: tombol layar</text>
    <text x="55" y="135" textAnchor="middle" fontSize="8" fill="#86efac">WASD / Arrow Keys</text>
  </svg>
);

const IlluRound = () => (
  <svg viewBox="0 0 160 140" width="100%" height="100%">
    <circle cx="80" cy="45" r="28" fill="#EAB308" stroke="white" strokeWidth="3"/>
    <text x="80" y="52" textAnchor="middle" fontSize="22" fill="#1F2937" fontWeight="900">3</text>
    {[0,60,120,180,240,300].map((deg,i) => {
      const rad = deg*Math.PI/180;
      return <text key={i} x={80+42*Math.cos(rad)} y={45+42*Math.sin(rad)+4}
        textAnchor="middle" fontSize="10" fill="#FCD34D">→</text>;
    })}
    <text x="80" y="105" textAnchor="middle" fontSize="9" fill="#f1f5f9">Ronde berakhir saat</text>
    <text x="80" y="118" textAnchor="middle" fontSize="9" fill="#86efac">semua rumput habis</text>
    <text x="80" y="131" textAnchor="middle" fontSize="9" fill="#86efac">atau semua mati</text>
  </svg>
);

const IlluQuiz = () => (
  <svg viewBox="0 0 160 140" width="100%" height="100%">
    <rect x="10" y="10" width="140" height="90" rx="10" fill="#14532d" stroke="#EAB308" strokeWidth="2.5"/>
    <text x="80" y="30" textAnchor="middle" fontSize="9" fill="#FCD34D" fontWeight="bold">Kamu Kena Kuis!</text>
    <text x="80" y="44" textAnchor="middle" fontSize="8" fill="white">Ibukota Indonesia?</text>
    {[['A. Bandung','#374151'],['B. Jakarta','#16A34A'],['C. Surabaya','#374151']].map(([t,bg],i) => (
      <g key={i}>
        <rect x="18" y={52+i*16} width="124" height="13" rx="3" fill={bg}/>
        <text x="80" y={62+i*16} textAnchor="middle" fontSize="8" fill="white">{t}</text>
      </g>
    ))}
    <text x="80" y="118" textAnchor="middle" fontSize="11" fill="#EF4444" fontWeight="bold">10s</text>
    <text x="80" y="132" textAnchor="middle" fontSize="8" fill="#FCA5A5">Waktu menjawab</text>
  </svg>
);

const IlluPowerUp = () => (
  <svg viewBox="0 0 160 140" width="100%" height="100%">
    <g transform="translate(15,15)">
      <rect x="0" y="0" width="38" height="38" rx="8" fill="#1F2937" stroke="#FCD34D" strokeWidth="1.5"/>
      <polygon points="22,4 12,20 20,20 18,34 28,18 20,18" fill="#FCD34D"/>
      <text x="19" y="50" textAnchor="middle" fontSize="7" fill="#FCD34D">Speed</text>
    </g>
    <g transform="translate(61,15)">
      <rect x="0" y="0" width="38" height="38" rx="8" fill="#1F2937" stroke="#9CA3AF" strokeWidth="1.5"/>
      <ellipse cx="19" cy="24" rx="13" ry="9" fill="#6B7280"/>
      <ellipse cx="19" cy="22" rx="11" ry="7" fill="#9CA3AF"/>
      <text x="19" y="50" textAnchor="middle" fontSize="7" fill="#9CA3AF">Batu</text>
    </g>
    <g transform="translate(107,15)">
      <rect x="0" y="0" width="38" height="38" rx="8" fill="#1F2937" stroke="#EF4444" strokeWidth="1.5"/>
      <circle cx="19" cy="23" r="11" fill="#374151"/>
      <path d="M19 12 Q24 7 28 9" stroke="#D97706" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="28" cy="9" r="2" fill="#FCD34D"/>
      <text x="19" y="50" textAnchor="middle" fontSize="7" fill="#EF4444">Bom</text>
    </g>
    <text x="80" y="80" textAnchor="middle" fontSize="8" fill="#f1f5f9">Dapatkan saat memotong rumput</text>
    <text x="80" y="93" textAnchor="middle" fontSize="8" fill="#86efac">Tekan SPACE untuk aktifkan</text>
    <text x="80" y="115" textAnchor="middle" fontSize="14">⭐⭐⭐</text>
    <text x="80" y="132" textAnchor="middle" fontSize="8" fill="#FCA5A5">Bom = stun 2 detik</text>
  </svg>
);

const IlluRocks = () => (
  <svg viewBox="0 0 160 140" width="100%" height="100%">
    {[0,1,2,3].map(row => [0,1,2,3].map(col => {
      const isRock = (row===1&&col===1)||(row===1&&col===3)||(row===2&&col===0)||(row===3&&col===2);
      return (
        <g key={`${row}-${col}`}>
          <rect x={10+col*35} y={8+row*28} width={33} height={26}
            fill={(row+col)%2===0?'#8B5E3C':'#C49A6C'} stroke="#5a3a1a" strokeWidth="0.5"/>
          {isRock && <>
            <ellipse cx={26+col*35} cy={23+row*28} rx="12" ry="8" fill="#6B7280"/>
            <ellipse cx={26+col*35} cy={21+row*28} rx="10" ry="6" fill="#9CA3AF"/>
          </>}
        </g>
      );
    }))}
    <text x="80" y="125" textAnchor="middle" fontSize="8" fill="#FCD34D" fontWeight="bold">Ronde 4: +2 batu</text>
    <text x="80" y="137" textAnchor="middle" fontSize="8" fill="#FCD34D">Ronde 7: +4 batu, dst.</text>
  </svg>
);

const IlluWin = () => (
  <svg viewBox="0 0 160 140" width="100%" height="100%">
    <rect x="60" y="20" width="40" height="35" rx="20" fill="#EAB308" stroke="#D97706" strokeWidth="2"/>
    <rect x="55" y="18" width="50" height="8" rx="4" fill="#FCD34D"/>
    <rect x="68" y="55" width="24" height="12" fill="#D97706"/>
    <rect x="58" y="67" width="44" height="8" rx="3" fill="#EAB308"/>
    <text x="80" y="45" textAnchor="middle" fontSize="16">🏆</text>
    <text x="30" y="35" fontSize="14">⭐</text><text x="120" y="35" fontSize="14">⭐</text>
    {[['🥇 Pemain A','#EAB308'],['🥈 Pemain B','#9CA3AF'],['🥉 Pemain C','#D97706']].map(([t,c],i) => (
      <g key={i}>
        <rect x="25" y={88+i*14} width="110" height="12" rx="3"
          fill={i===0?'rgba(234,179,8,0.2)':'rgba(255,255,255,0.05)'}/>
        <text x="80" y={98+i*14} textAnchor="middle" fontSize="8" fill={c}>{t}</text>
      </g>
    ))}
    <text x="80" y="138" textAnchor="middle" fontSize="7" fill="#86efac">Berdasarkan ronde + rumput</text>
  </svg>
);

// ─── Section Row ──────────────────────────────────────────────────────────────

const Row = ({ index, title, body, Illustration }) => {
  const isOdd = index % 2 !== 0;
  const bgColor = isOdd ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)';

  const textBlock = (
    <div style={{
      flex: '0 0 68%', maxWidth: '68%',
      paddingRight: isOdd ? '1.25rem' : 0,
      paddingLeft: isOdd ? 0 : '1.25rem',
    }}>
      <h2 style={{
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
        fontWeight: 900, color: '#FCD34D',
        marginBottom: '0.4rem', textShadow: '2px 2px 0 #78350f',
      }}>{title}</h2>
      <p style={{
        color: 'rgba(255,255,255,0.95)',
        fontSize: 'clamp(0.72rem, 1.3vw, 0.88rem)',
        lineHeight: 1.65, margin: 0,
      }}>{body}</p>
    </div>
  );

  const imageBlock = (
    <div style={{
      flex: '0 0 28%', maxWidth: '28%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: 110,
    }}>
      <Illustration />
    </div>
  );

  return (
    <div style={{
      display: 'flex', flexDirection: 'row', alignItems: 'center',
      padding: 'clamp(0.85rem, 2.2vw, 1.4rem) clamp(0.9rem, 3vw, 1.75rem)',
      background: bgColor, gap: '0.75rem',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {isOdd ? <>{textBlock}{imageBlock}</> : <>{imageBlock}{textBlock}</>}
    </div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { title: '🌿 Arena & Tujuan', Illustration: IlluGrid,
    body: 'Game dimainkan di grid 10×10 kotak. Setiap kotak awalnya ditumbuhi rumput. Lawn mower kamu bergerak otomatis ke arah yang kamu pilih dan memotong rumput di setiap kotak yang dilewati. Tujuanmu: potong sebanyak mungkin rumput sebelum ronde berakhir!' },
  { title: '🎮 Kontrol', Illustration: IlluControls,
    body: 'Gunakan tombol panah atau WASD untuk mengubah arah gerak lawn mower. Mower bergerak terus-menerus — kamu hanya mengubah arahnya. Tekan SPACE (atau tombol power-up di layar mobile) untuk mengaktifkan power-up yang sedang kamu pegang.' },
  { title: '🔄 Sistem Ronde', Illustration: IlluRound,
    body: 'Game terdiri dari beberapa ronde. Satu ronde berakhir ketika semua rumput di grid habis dipotong, atau semua pemain mati/crash di ronde tersebut. Setelah ronde berakhir, pemain dengan rumput terpotong paling sedikit di ronde itu akan mendapat hukuman kuis.' },
  { title: '❓ Kuis Hukuman', Illustration: IlluQuiz,
    body: 'Pemain yang kena kuis punya 10 detik untuk menjawab pertanyaan pilihan ganda. Pemain lain menunggu. Jika jawaban salah atau waktu habis, nyawa berkurang 1. Setiap pemain punya 2 nyawa. Jika nyawa habis, pemain tersebut tersingkir dari game.' },
  { title: '⚡ Power-Up', Illustration: IlluPowerUp,
    body: 'Ada kemungkinan mendapat power-up saat memotong rumput. Jumlah maksimal power-up per ronde = 2× nomor ronde. Tiga jenis: Speed Boost (aktif otomatis, gerak lebih cepat 3 detik), Batu (taruh batu di belakangmu), dan Bom (lempar ke pemain terdekat — membuat mereka stun 2 detik).' },
  { title: '🗿 Batu Penghalang', Illustration: IlluRocks,
    body: 'Mulai ronde ke-4 (dan setiap 3 ronde berikutnya: 7, 10, 13...), batu penghalang baru muncul di grid. Jumlahnya bertambah: ronde 4 = +2 batu, ronde 7 = +4 batu, ronde 10 = +6 batu, dan seterusnya. Menabrak batu berarti crash dan mati di ronde itu.' },
  { title: '🏆 Cara Menang', Illustration: IlluWin,
    body: 'Game berakhir ketika hanya tersisa 1 pemain yang nyawanya belum habis — dialah pemenangnya. Papan peringkat akhir mengurutkan semua pemain berdasarkan jumlah ronde yang berhasil mereka bertahan, lalu total rumput yang dipotong sebagai tiebreaker.' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const HowToPlay = ({ onBack }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
    <BushBackground variant="messy" className="w-full max-w-3xl">
      <h1 className="font-black text-white text-center mb-6"
        style={{
          fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          textShadow: '3px 3px 0px #1a5c1a, -1px -1px 0px #32CD32, 4px 4px 8px rgba(0,0,0,0.5)',
          WebkitTextStroke: '1px #0d3d0d',
        }}>
        How to Play
      </h1>

      <div style={{
        borderRadius: 14, overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.12)',
        marginBottom: '1.5rem',
      }}>
        {SECTIONS.map((s, i) => (
          <Row key={i} index={i+1} title={s.title} body={s.body} Illustration={s.Illustration} />
        ))}
      </div>

      <div className="flex justify-center">
        <WoodenButton text="BACK" onClick={onBack} />
      </div>
    </BushBackground>
  </div>
);

export default HowToPlay;
