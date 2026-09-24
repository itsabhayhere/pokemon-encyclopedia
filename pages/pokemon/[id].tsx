import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import StatBar from '@/components/StatBar';
import AudioCryButton from '@/components/AudioCryButton';
import {
  getPokemonDetail,
  getPokemonSpecies,
  getEvolutionChain,
  formatPokemonName,
  formatPokemonId,
  getArtworkUrl,
} from '@/lib/pokeapi';
import { PokemonDetail, PokemonSpeciesData, EvolutionStage } from '@/types/pokemon';
import { getTypeStyle } from '@/lib/colors';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Weight,
  Ruler,
  Award,
  Zap,
  ShieldAlert,
  Swords,
  GitBranch,
} from 'lucide-react';

interface PokemonDetailPageProps {
  pokemon: PokemonDetail;
  species: PokemonSpeciesData | null;
  evolutionStages: EvolutionStage[];
  prevPokemon: { id: number; name: string } | null;
  nextPokemon: { id: number; name: string } | null;
}

export default function PokemonDetailPage({
  pokemon,
  species,
  evolutionStages,
  prevPokemon,
  nextPokemon,
}: PokemonDetailPageProps) {
  const router = useRouter();
  const [isShiny, setIsShiny] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'abilities' | 'evolution' | 'moves'>('stats');
  const [moveFilter, setMoveFilter] = useState<string>('all');

  if (router.isFallback) {
    return (
      <Layout title="Loading Pokémon...">
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Fetching Pokémon data from PokéAPI...</p>
        </div>
      </Layout>
    );
  }

  if (!pokemon) {
    return (
      <Layout title="Pokémon Not Found">
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
          <h2 className="text-2xl font-bold text-white">Pokémon Not Found</h2>
          <p className="text-slate-400 text-sm">We couldn&apos;t retrieve information for this Pokémon.</p>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-semibold text-xs hover:bg-amber-300"
          >
            Back to Pokédex
          </Link>
        </div>
      </Layout>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeStyle = getTypeStyle(primaryType);

  // Flavor text in English
  const flavorText =
    species?.flavor_text_entries?.find((entry) => entry.language.name === 'en')?.flavor_text.replace(/[\n\f]/g, ' ') ||
    'A fascinating Pokémon found across various regions.';

  // Genus (e.g. "Seed Pokémon")
  const genus = species?.genera?.find((g) => g.language.name === 'en')?.genus || 'Pokémon';

  // Stats calculation
  const totalBaseStats = pokemon.stats.reduce((acc, curr) => acc + curr.base_stat, 0);

  // Artwork selection (regular vs shiny)
  const artwork = isShiny
    ? pokemon.sprites.other?.['official-artwork']?.front_shiny ||
      pokemon.sprites.front_shiny ||
      getArtworkUrl(pokemon.id)
    : pokemon.sprites.other?.['official-artwork']?.front_default ||
      pokemon.sprites.front_default ||
      getArtworkUrl(pokemon.id);

  // Moves list with filter
  const filteredMoves = pokemon.moves.filter((m) => {
    if (moveFilter === 'all') return true;
    return m.version_group_details.some(
      (vg) => vg.move_learn_method.name.toLowerCase() === moveFilter.toLowerCase()
    );
  });

  return (
    <Layout
      title={`${formatPokemonName(pokemon.name)} ${formatPokemonId(pokemon.id)} — PokéExplorer`}
      description={`View base stats, abilities, moves, and evolutions for ${formatPokemonName(pokemon.name)}.`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Navigation Row: Back button & Prev/Next Quick Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900/80 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700 transition-colors backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pokédex</span>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            {prevPokemon && (
              <Link
                href={`/pokemon/${prevPokemon.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 text-slate-300 border border-slate-800 hover:text-amber-300 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono">{formatPokemonId(prevPokemon.id)}</span>
                <span className="capitalize">{prevPokemon.name}</span>
              </Link>
            )}

            {nextPokemon && (
              <Link
                href={`/pokemon/${nextPokemon.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 text-slate-300 border border-slate-800 hover:text-amber-300 transition-colors"
              >
                <span className="capitalize">{nextPokemon.name}</span>
                <span className="hidden sm:inline font-mono">{formatPokemonId(nextPokemon.id)}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Hero Card Container */}
        <div className="relative rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl p-6 sm:p-10 overflow-hidden shadow-2xl">
          {/* Ambient Lighting based on Pokémon Type */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-25 pointer-events-none"
            style={{ backgroundColor: typeStyle.glow }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Image, Badges, Shiny Toggle */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)]">
                <Image
                  src={artwork}
                  alt={pokemon.name}
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-contain transition-transform duration-500 hover:scale-105"
                  priority
                  unoptimized
                />
              </div>

              {/* Action Buttons: Shiny & Audio Cry */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsShiny((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md transition-all duration-200 ${
                    isShiny
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white'
                  }`}
                  title="Toggle Shiny artwork"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isShiny ? 'Shiny Form' : 'Regular'}</span>
                </button>

                <AudioCryButton
                  audioUrl={pokemon.cries?.latest || pokemon.cries?.legacy || undefined}
                  pokemonName={pokemon.name}
                />
              </div>
            </div>

            {/* Right Column: Key Details, Types, Physical Stats */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs sm:text-sm font-bold text-slate-400">
                    {formatPokemonId(pokemon.id)}
                  </span>
                  <span className="text-xs font-medium text-amber-400/90 tracking-wide uppercase">
                    {genus}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white capitalize tracking-tight mt-1">
                  {formatPokemonName(pokemon.name)}
                </h1>

                {/* Type Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {pokemon.types.map((item) => {
                    const badge = getTypeStyle(item.type.name);
                    return (
                      <span
                        key={item.type.name}
                        className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border backdrop-blur-sm shadow-sm ${badge.badge}`}
                      >
                        {item.type.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Flavor Text Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic border-l-2 border-slate-700 pl-4 py-1">
                &ldquo;{flavorText}&rdquo;
              </p>

              {/* Physical Attributes Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
                <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Height</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {(pokemon.height / 10).toFixed(1)} m
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ({((pokemon.height / 10) * 3.28084).toFixed(1)} ft)
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Weight className="w-3.5 h-3.5 text-amber-400" />
                    <span>Weight</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ({((pokemon.weight / 10) * 2.20462).toFixed(1)} lbs)
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Award className="w-3.5 h-3.5 text-rose-400" />
                    <span>Base Exp</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {pokemon.base_experience || 'N/A'}
                  </div>
                  <div className="text-[10px] text-slate-400">Points</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tabs Section: Stats, Abilities, Evolution, Moves */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'stats'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Base Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('abilities')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'abilities'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Abilities</span>
            </button>

            <button
              onClick={() => setActiveTab('evolution')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'evolution'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Evolution</span>
            </button>

            <button
              onClick={() => setActiveTab('moves')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'moves'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Moves ({pokemon.moves.length})</span>
            </button>
          </div>

          {/* TAB 1: BASE STATS */}
          {activeTab === 'stats' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Battle Base Statistics</h3>
                  <p className="text-xs text-slate-400">
                    Individual stat values compared against the maximum Pokémon benchmark (255).
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                    Stat Total
                  </span>
                  <span className="text-2xl font-black text-amber-400">{totalBaseStats}</span>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {pokemon.stats.map((stat) => (
                  <StatBar
                    key={stat.stat.name}
                    name={stat.stat.name}
                    value={stat.base_stat}
                    maxValue={255}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ABILITIES */}
          {activeTab === 'abilities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pokemon.abilities.map((item) => (
                <div
                  key={item.ability.name}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white capitalize">
                      {formatPokemonName(item.ability.name)}
                    </h4>
                    {item.is_hidden ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                        Hidden Ability
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">
                        Slot {item.slot}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.short_effect || 'Passive ability utilized during competitive Pokémon encounters.'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: EVOLUTION CHAIN */}
          {activeTab === 'evolution' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Evolution Pathway</h3>
                <p className="text-xs text-slate-400">
                  Evolutionary stages and trigger conditions for this species line.
                </p>
              </div>

              {evolutionStages.length > 0 ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-6 overflow-x-auto">
                  {evolutionStages.map((stage, idx) => {
                    const isCurrent = stage.id === pokemon.id;

                    return (
                      <React.Fragment key={stage.id}>
                        {idx > 0 && (
                          <div className="flex flex-col items-center text-slate-400 text-xs">
                            <span className="text-[11px] font-medium text-amber-400 mb-1">
                              {stage.min_level ? `Lvl ${stage.min_level}` : stage.item_name || stage.trigger_name || 'Evolves'}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                              <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:block" />
                              <span className="sm:hidden text-xs">↓</span>
                            </div>
                          </div>
                        )}

                        <Link
                          href={`/pokemon/${stage.id}`}
                          className={`group flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 ${
                            isCurrent
                              ? 'bg-amber-400/10 border-amber-400/60 shadow-lg shadow-amber-400/10 scale-105'
                              : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-500 hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="relative w-28 h-28">
                            <Image
                              src={stage.image}
                              alt={stage.name}
                              fill
                              sizes="112px"
                              className="object-contain group-hover:scale-110 transition-transform"
                              unoptimized
                            />
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 mt-2">
                            {formatPokemonId(stage.id)}
                          </span>
                          <span
                            className={`text-sm font-bold capitalize ${
                              isCurrent ? 'text-amber-300' : 'text-white'
                            }`}
                          >
                            {formatPokemonName(stage.name)}
                          </span>
                        </Link>
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Evolution details currently unavailable.</p>
              )}
            </div>
          )}

          {/* TAB 4: MOVES */}
          {activeTab === 'moves' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Learnable Moves</h3>
                  <p className="text-xs text-slate-400">
                    Showing {filteredMoves.length} moves learnable by {formatPokemonName(pokemon.name)}.
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                  {['all', 'level-up', 'machine', 'egg', 'tutor'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setMoveFilter(filter)}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors capitalize ${
                        moveFilter === filter
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                {filteredMoves.map((m) => {
                  const detail = m.version_group_details[0];
                  return (
                    <div
                      key={m.move.name}
                      className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-500 transition-colors"
                    >
                      <div className="text-xs font-bold text-white capitalize truncate">
                        {formatPokemonName(m.move.name)}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                        <span className="capitalize">{detail?.move_learn_method?.name.replace('-', ' ')}</span>
                        {detail?.level_learned_at > 0 && (
                          <span className="text-amber-400 font-bold">Lvl {detail.level_learned_at}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// SSG: Pre-generate first 48 Pokémon paths, on-demand fallback for the rest!
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const paths = Array.from({ length: 48 }, (_, i) => ({
      params: { id: (i + 1).toString() },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<PokemonDetailPageProps> = async ({ params }) => {
  const idOrName = params?.id as string;
  if (!idOrName) {
    return { notFound: true };
  }

  try {
    const pokemon = await getPokemonDetail(idOrName);
    if (!pokemon) {
      return { notFound: true };
    }

    const species = await getPokemonSpecies(pokemon.id);

    // Fetch evolution chain if available
    let evolutionStages: EvolutionStage[] = [];
    if (species?.evolution_chain?.url) {
      evolutionStages = await getEvolutionChain(species.evolution_chain.url);
    }

    // Previous and Next Pokemon metadata
    const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;
    const nextId = pokemon.id < 1025 ? pokemon.id + 1 : null;

    let prevPokemon = null;
    if (prevId) {
      prevPokemon = { id: prevId, name: `Pokemon #${prevId}` };
    }

    let nextPokemon = null;
    if (nextId) {
      nextPokemon = { id: nextId, name: `Pokemon #${nextId}` };
    }

    const sanitizedProps = JSON.parse(
      JSON.stringify({
        pokemon,
        species,
        evolutionStages,
        prevPokemon,
        nextPokemon,
      })
    );

    return {
      props: sanitizedProps,
      revalidate: 86400,
    };
  } catch (error) {
    console.error('Error in getStaticProps for pokemon:', error);
    return { notFound: true };
  }
};
