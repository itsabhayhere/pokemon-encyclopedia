import React, { useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ALL_POKEMON_TYPES, getTypeStyle } from '@/lib/colors';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalResults: number;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  totalResults,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or number (e.g. Pikachu, 25)..."
            className="w-full pl-11 pr-20 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all shadow-inner"
          />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            {searchTerm ? (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-800 rounded border border-slate-700 select-none">
                /
              </span>
            )}
          </div>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-44 pl-9 pr-8 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all cursor-pointer appearance-none"
            >
              <option value="id-asc">Lowest Number (#1 first)</option>
              <option value="id-desc">Highest Number (#1025 first)</option>
              <option value="name-asc">Name (A — Z)</option>
              <option value="name-desc">Name (Z — A)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <SlidersHorizontal className="w-3 h-3" />
          Type:
        </span>

        {ALL_POKEMON_TYPES.map((type) => {
          const isSelected = selectedType.toLowerCase() === type.toLowerCase();
          const typeStyle = getTypeStyle(type === 'all' ? 'normal' : type);

          return (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full transition-all duration-200 capitalize border ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20 scale-105'
                  : `${typeStyle.badge} hover:brightness-125`
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white font-semibold">{totalResults}</strong> Pokémon
          {selectedType !== 'all' && (
            <span>
              {' '}
              with type <span className="text-amber-400 capitalize font-medium">{selectedType}</span>
            </span>
          )}
          {searchTerm && (
            <span>
              {' '}
              matching &quot;<span className="text-amber-400 font-medium">{searchTerm}</span>&quot;
            </span>
          )}
        </span>

        {(searchTerm || selectedType !== 'all') && (
          <button
            onClick={() => {
              onSearchChange('');
              onTypeChange('all');
            }}
            className="text-amber-400 hover:text-amber-300 hover:underline font-medium"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
