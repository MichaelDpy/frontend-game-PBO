import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-between p-6 font-sans">
      
      {/* Section Utama / Center */}
      <section className="flex flex-col items-center text-center my-auto max-w-xl px-4">
        {/* Kontainer Hero dengan Posisi Relatif */}
        <div className="relative w-44 h-44 mb-8 flex items-center justify-center">
          <img 
            src={heroImg} 
            className="w-full h-full object-contain opacity-80" 
            alt="Hero Base" 
          />
          <img 
            src={reactLogo} 
            className="absolute bottom-2 right-2 w-12 h-12 animate-[spin_20s_linear_infinite]" 
            alt="React logo" 
          />
          <img 
            src={viteLogo} 
            className="absolute top-2 left-2 w-12 h-12 hover:scale-110 transition-transform duration-300" 
            alt="Vite logo" 
          />
        </div>

        <div className="space-y-3 mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            Get started
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Edit <code className="bg-slate-800 text-pink-400 px-1.5 py-0.5 rounded font-mono text-xs sm:text-sm">src/App.jsx</code> and save to test <code className="text-cyan-400 font-mono">HMR</code>
          </p>
        </div>

        {/* Tombol Counter */}
        <button
          type="button"
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
        >
          Count is {count}
        </button>
      </section>

      {/* Pembatas / Divider Line */}
      <div className="w-full max-w-4xl border-t border-slate-800 my-8"></div>

      {/* Section Navigasi Bawah */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* Kotak Dokumentasi */}
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <svg className="w-6 h-6 text-cyan-400" role="presentation" aria-hidden="true">
              <use href="/icons.svg#documentation-icon"></use>
            </svg>
            <h2 className="text-xl font-bold">Documentation</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">Your questions, answered</p>
          <ul className="space-y-2">
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-white group text-sm">
                <img className="w-4 h-4 transform group-hover:scale-110 transition-transform" src={viteLogo} alt="" />
                <span>Explore Vite</span>
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-white group text-sm">
                <img className="w-4 h-4 transform group-hover:scale-110 transition-transform" src={reactLogo} alt="" />
                <span>Learn more</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Kotak Media Sosial */}
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <svg className="w-6 h-6 text-violet-400" role="presentation" aria-hidden="true">
              <use href="/icons.svg#social-icon"></use>
            </svg>
            <h2 className="text-xl font-bold">Connect with us</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">Join the Vite community</p>
          <ul className="grid grid-cols-2 gap-3">
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-white group text-sm">
                <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-white transition-colors" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                <span>GitHub</span>
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-white group text-sm">
                <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-indigo-400 transition-colors" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                <span>Discord</span>
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-white group text-sm">
                <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-sky-400 transition-colors" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                <span>X.com</span>
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-slate-300 hover:text-white group text-sm">
                <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-blue-400 transition-colors" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                <span>Bluesky</span>
              </a>
            </li>
          </ul>
        </div>

      </section>
    </div>
  )
}

export default App