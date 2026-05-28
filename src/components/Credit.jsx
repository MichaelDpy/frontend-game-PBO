// components/Credit.jsx
import BushBackground from './BushBackground';
import WoodenButton from './WoodenButton';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57
      0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695
      -.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99
      .105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225
      -.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405
      c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225
      0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3
      0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const DEVELOPERS = [
  { name: 'Michael Alexius Depari', github: 'MichaelDpy(Agnes)', nim: '241401119', isLead: true },
  { name: 'Achmad Caesar Ramadhan', github: 'Ahmadmapple', nim: '241401011', isLead: false },
  { name: 'Wein Ilham Lutfi',        github: 'wein359',     nim: '241401101', isLead: false },
  { name: 'Naufal Khayril Lubis',    github: 'Fuad',        nim: '241401089', isLead: false },
];

const REPOS = [
  { label: 'Frontend',  url: 'https://github.com/placeholder/frontend'  },
  { label: 'Backend',   url: 'https://github.com/placeholder/backend'   },
];

const DevCard = ({ dev }) => (
  <div className={`flex items-center gap-4 rounded-xl p-4 border ${
    dev.isLead
      ? 'bg-yellow-400/10 border-yellow-400/50'
      : 'bg-green-800/40 border-green-600/40'
  }`}>
    {/* Avatar placeholder */}
    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-black border-2 ${
      dev.isLead ? 'bg-yellow-400/20 border-yellow-400' : 'bg-green-700/50 border-green-500'
    }`}>
      {dev.isLead ? '👑' : dev.name.charAt(0)}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className={`font-black text-base truncate ${dev.isLead ? 'text-yellow-300' : 'text-white'}`}>
          {dev.name}
        </p>
        {dev.isLead && (
          <span className="text-xs font-bold bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400/40 flex-shrink-0">
            Ketua Tim
          </span>
        )}
      </div>
      <p className="text-yellow-200 text-xs mt-0.5">NIM: {dev.nim}</p>
      <div className="flex items-center gap-1.5 mt-1 text-cyan-300">
        <GithubIcon />
        <span className="text-sm font-semibold">{dev.github}</span>
      </div>
    </div>
  </div>
);

const RepoLink = ({ label, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-800/50 border border-green-600/50
      hover:bg-green-700/60 hover:border-green-400/60 transition-all group"
  >
    <span className="text-green-300 group-hover:text-white transition-colors">
      <GithubIcon />
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-white font-bold text-sm">{label} Repository</p>
      <p className="text-white/40 text-xs truncate">{url}</p>
    </div>
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
      strokeWidth="2" className="text-white/40 group-hover:text-white/70 flex-shrink-0">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  </a>
);

const Credit = ({ onBack }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
    <BushBackground variant="messy" className="w-full max-w-xl">

      {/* Title */}
      <h1
        className="text-4xl md:text-5xl font-black text-white text-center mb-2"
        style={{
          fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
          textShadow: '3px 3px 0px #1a5c1a, -1px -1px 0px #32CD32, 4px 4px 8px rgba(0,0,0,0.5)',
          WebkitTextStroke: '1px #0d3d0d',
        }}
      >
        Credits
      </h1>
      <p className="text-white/60 text-sm text-center mb-6">LawnMower Quiz Game — Tim Pengembang</p>

      {/* Developer cards */}
      <div className="flex flex-col gap-3 mb-6">
        {DEVELOPERS.map(dev => <DevCard key={dev.github} dev={dev} />)}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-green-600/40" />
        <span className="text-white/40 text-xs font-semibold tracking-widest uppercase">Repositori</span>
        <div className="flex-1 h-px bg-green-600/40" />
      </div>

      {/* Repo links */}
      <div className="flex flex-col gap-2 mb-8">
        {REPOS.map(r => <RepoLink key={r.label} label={r.label} url={r.url} />)}
      </div>

      {/* Back */}
      <div className="flex justify-center">
        <WoodenButton text="BACK" onClick={onBack} />
      </div>

    </BushBackground>
  </div>
);

export default Credit;
