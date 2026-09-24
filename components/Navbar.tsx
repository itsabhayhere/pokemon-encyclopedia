import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sparkles, Dna } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();

  const handleRandomPokemon = () => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    router.push(`/pokemon/${randomId}`);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-b from-rose-500 via-rose-600 to-white flex items-center justify-center p-0.5 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full border border-slate-900 flex items-center justify-center relative overflow-hidden bg-slate-900">
                <div className="absolute top-0 inset-x-0 h-1/2 bg-red-500 border-b-2 border-slate-950" />
                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-slate-100" />
                <div className="absolute w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-white flex items-center justify-center z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
                PokéExplorer
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRandomPokemon}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 hover:scale-105 transition-all duration-200"
              title="Navigate to a random Pokémon"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Random</span>
            </button>

            <Link
              href="/"
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                router.pathname === '/' ? 'text-amber-400 bg-slate-800/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Pokédex
            </Link>

            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Dna className="w-3.5 h-3.5" />
              <span>API</span>
            </a>

            <a
              href="https://github.com/itsabhayhere"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title="GitHub Profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
