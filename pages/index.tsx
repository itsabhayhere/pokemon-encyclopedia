import React, { useState, useMemo } from 'react';
import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import PokemonCard from '@/components/PokemonCard';
import { getPokemonList, getPokemonDetail, getArtworkUrl } from '@/lib/pokeapi';
import { PokemonListItem } from '@/types/pokemon';
import { Sparkles, Loader2, Compass, Layers, Zap } from 'lucide-react';

interface HomePageProps {
  initialPokemon: PokemonListItem[];
  totalCount: number;
}

export default function HomePage({ initialPokemon, totalCount }: HomePageProps) {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>(initialPokemon);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('id-asc');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(initialPokemon.length);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [directApiResult, setDirectApiResult] = useState<PokemonListItem | null>(null);

  // Filter and sort the loaded Pokémon
  const filteredPokemon = useMemo(() => {
    let list = [...pokemonList];

    // If direct search returned a pokemon not yet in current batch
    if (directApiResult && !list.some((p) => p.id === directApiResult.id)) {
      list = [directApiResult, ...list];
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.id.toString() === term.replace('#', '')
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      list = list.filter((p) =>
        p.types.map((t) => t.toLowerCase()).includes(selectedType.toLowerCase())
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'id-asc') return a.id - b.id;
      if (sortBy === 'id-desc') return b.id - a.id;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

    return list;
  }, [pokemonList, searchTerm, selectedType, sortBy, directApiResult]);

  // Handle Load More
  const handleLoadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=48&offset=${offset}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();

      const newItems: PokemonListItem[] = await Promise.all(
        data.results.map(async (item: { name: string; url: string }) => {
          const parts = item.url.split('/').filter(Boolean);
          const id = parseInt(parts[parts.length - 1], 10);
          try {
            const detailRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (detailRes.ok) {
              const detail = await detailRes.json();
              return {
                id,
                name: item.name,
                url: item.url,
                image: detail.sprites?.other?.['official-artwork']?.front_default || getArtworkUrl(id),
                types: detail.types.map((t: { type: { name: string } }) => t.type.name),
                stats: {
                  hp: detail.stats.find((s: { stat: { name: string } }) => s.stat.name === 'hp')?.base_stat || 0,
                  attack: detail.stats.find((s: { stat: { name: string } }) => s.stat.name === 'attack')?.base_stat || 0,
                  defense: detail.stats.find((s: { stat: { name: string } }) => s.stat.name === 'defense')?.base_stat || 0,
                  speed: detail.stats.find((s: { stat: { name: string } }) => s.stat.name === 'speed')?.base_stat || 0,
                },
              };
            }
          } catch {
            // fallback
          }
          return {
            id,
            name: item.name,
            url: item.url,
            image: getArtworkUrl(id),
            types: ['normal'],
          };
        })
      );

      setPokemonList((prev) => [...prev, ...newItems]);
      setOffset((prev) => prev + 48);
    } catch (err) {
      console.error('Error loading more pokemon:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // If user searches for a specific Pokemon not in the first 48, fetch from API directly
  const handleDirectSearch = async (term: string) => {
    setSearchTerm(term);
    const cleaned = term.trim().toLowerCase().replace('#', '');
    if (!cleaned) {
      setDirectApiResult(null);
      return;
    }

    // Check if already in list
    const exists = pokemonList.some(
      (p) => p.name.toLowerCase() === cleaned || p.id.toString() === cleaned
    );
    if (exists) return;

    // Search via PokeAPI directly
    try {
      setIsSearchingApi(true);
      const detail = await getPokemonDetail(cleaned);
      if (detail) {
        setDirectApiResult({
          id: detail.id,
          name: detail.name,
          url: `https://pokeapi.co/api/v2/pokemon/${detail.id}/`,
          image: detail.sprites.other?.['official-artwork']?.front_default || getArtworkUrl(detail.id),
          types: detail.types.map((t) => t.type.name),
          stats: {
            hp: detail.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0,
            attack: detail.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0,
            defense: detail.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0,
            speed: detail.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0,
          },
        });
      }
    } catch {
      // not found
    } finally {
      setIsSearchingApi(false);
    }
  };

  return (
    <Layout
      title="PokéExplorer — Discover Every Pokémon"
      description="Explore the world of Pokémon with real-time search, stats, abilities, and evolutions powered by Next.js and PokéAPI."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 border border-amber-400/30 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Pokédex • Powered by PokéAPI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Gotta Explore &apos;Em All
          </h1>

          <p className="text-sm sm:text-base text-slate-300">
            Search across all Pokémon, inspect deep battle stats, explore evolution trees, and uncover hidden abilities with zero latency.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-rose-400" />
              <span><strong className="text-white font-bold">{totalCount}</strong> Pokémon</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span><strong className="text-white font-bold">18</strong> Types</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span><strong className="text-white font-bold">9</strong> Generations</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl relative">
          {isSearchingApi && (
            <div className="absolute top-2 right-4 flex items-center gap-1 text-[11px] text-amber-400 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Searching PokéAPI...</span>
            </div>
          )}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleDirectSearch}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalResults={filteredPokemon.length}
          />
        </div>

        {/* Pokemon Grid */}
        {filteredPokemon.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPokemon.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Compass className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-white">No Pokémon found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t find any Pokémon matching your search or filters. Try adjusting your query or resetting filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setDirectApiResult(null);
              }}
              className="mt-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-lg"
            >
              Clear Search &amp; Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {selectedType === 'all' && !searchTerm && offset < totalCount && (
          <div className="text-center pt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:scale-105 active:scale-95"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Summoning more Pokémon...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Load More Pokémon ({totalCount - offset} remaining)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

// SSG: Pre-render first 48 Pokemon at build time for optimal performance
export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    const data = await getPokemonList(48, 0);
    return {
      props: {
        initialPokemon: data.results,
        totalCount: data.count,
      },
      revalidate: 86400, // Revalidate daily
    };
  } catch (error) {
    console.error('Failed to pre-fetch pokemon:', error);
    return {
      props: {
        initialPokemon: [],
        totalCount: 0,
      },
    };
  }
};
