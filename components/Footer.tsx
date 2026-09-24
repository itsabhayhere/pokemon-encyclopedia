import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span>Data from </span>
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-amber-400 underline underline-offset-2 transition-colors"
          >
            PokéAPI
          </a>
          <span className="text-slate-500 ml-2">
            Pokémon is &copy; Nintendo, Game Freak, and Creatures.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Pokédex
          </Link>
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-amber-400 transition-colors"
          >
            <span>API Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/itsabhayhere"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-amber-400 transition-colors"
          >
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
