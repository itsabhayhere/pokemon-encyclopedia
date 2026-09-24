import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PokemonListItem } from '@/types/pokemon';
import { getTypeStyle } from '@/lib/colors';
import { formatPokemonName, formatPokemonId } from '@/lib/pokeapi';
import { ArrowUpRight } from 'lucide-react';

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const primaryType = pokemon.types[0] || 'normal';
  const typeStyle = getTypeStyle(primaryType);

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className="group relative flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-600/80 backdrop-blur-md p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden cursor-pointer"
      style={{
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-20 group-hover:opacity-45 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: typeStyle.glow }}
      />

      <div className="absolute top-2 right-2 text-white/[0.03] group-hover:text-white/[0.06] transition-colors pointer-events-none select-none">
        <svg className="w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 C22.4 0 0 22.4 0 50 C0 77.6 22.4 100 50 100 C77.6 100 100 77.6 100 50 C100 22.4 77.6 0 50 0 Z M50 10 C69.9 10 86.4 24.6 89.4 44 L64.8 44 C62.4 35.8 54.9 30 46 30 C37.1 30 29.6 35.8 27.2 44 L2.6 44 C5.6 24.6 22.1 10 50 10 Z M50 90 C30.1 90 13.6 75.4 10.6 56 L35.2 56 C37.6 64.2 45.1 70 54 70 C62.9 70 70.4 64.2 72.8 56 L97.4 56 C94.4 75.4 77.9 90 50 90 Z" />
        </svg>
      </div>

      <div className="flex items-center justify-between z-10">
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60">
          {formatPokemonId(pokemon.id)}
        </span>
        <div className="w-7 h-7 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-400 group-hover:text-amber-400 group-hover:bg-slate-700/80 transition-colors">
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      <div className="relative w-full h-44 my-2 flex items-center justify-center">
        <div className="relative w-36 h-36 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            sizes="(max-width: 768px) 150px, 180px"
            className="object-contain"
            priority={pokemon.id <= 12}
            unoptimized
          />
        </div>
      </div>

      <div className="mt-auto space-y-2.5 z-10">
        <h3 className="text-base font-bold text-white tracking-wide group-hover:text-amber-300 transition-colors capitalize">
          {formatPokemonName(pokemon.name)}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {pokemon.types.map((type) => {
            const badgeStyle = getTypeStyle(type);
            return (
              <span
                key={type}
                className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-sm ${badgeStyle.badge}`}
              >
                {type}
              </span>
            );
          })}
        </div>

        {pokemon.stats && (
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1 text-center">
            <div className="bg-slate-800/40 rounded px-1 py-0.5">
              <span className="block text-[9px] text-slate-400 uppercase">HP</span>
              <span className="text-xs font-semibold text-rose-300">{pokemon.stats.hp}</span>
            </div>
            <div className="bg-slate-800/40 rounded px-1 py-0.5">
              <span className="block text-[9px] text-slate-400 uppercase">ATK</span>
              <span className="text-xs font-semibold text-orange-300">{pokemon.stats.attack}</span>
            </div>
            <div className="bg-slate-800/40 rounded px-1 py-0.5">
              <span className="block text-[9px] text-slate-400 uppercase">SPD</span>
              <span className="text-xs font-semibold text-emerald-300">{pokemon.stats.speed}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
