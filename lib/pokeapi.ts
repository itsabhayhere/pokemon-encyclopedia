import { PokemonDetail, PokemonListItem, PokemonSpeciesData, EvolutionStage } from '@/types/pokemon';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

export function getPokemonIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

export function getArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function formatPokemonName(name: string): string {
  if (!name) return '';
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(3, '0')}`;
}

export async function getPokemonList(limit: number = 48, offset: number = 0): Promise<{
  count: number;
  results: PokemonListItem[];
  next: string | null;
  previous: string | null;
}> {
  try {
    const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error('Failed to fetch pokemon list');
    const data = await res.json();

    const detailedList: PokemonListItem[] = await Promise.all(
      data.results.map(async (item: { name: string; url: string }) => {
        const id = getPokemonIdFromUrl(item.url);
        try {
          const detailRes = await fetch(`${POKEAPI_BASE}/pokemon/${id}`);
          if (detailRes.ok) {
            const detail = await detailRes.json();
            return {
              id,
              name: item.name,
              url: item.url,
              image: detail.sprites?.other?.['official-artwork']?.front_default || getArtworkUrl(id),
              types: detail.types.map((t: any) => t.type.name),
              stats: {
                hp: detail.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0,
                attack: detail.stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 0,
                defense: detail.stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 0,
                speed: detail.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 0,
              },
            };
          }
        } catch {
          // use artwork fallback if individual request fails
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

    return {
      count: data.count,
      results: detailedList,
      next: data.next,
      previous: data.previous,
    };
  } catch (error) {
    console.error('Error fetching pokemon list:', error);
    return { count: 0, results: [], next: null, previous: null };
  }
}

export async function getAllPokemonNames(): Promise<{ id: number; name: string }[]> {
  try {
    const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=1025&offset=0`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results.map((p: { name: string; url: string }) => ({
      id: getPokemonIdFromUrl(p.url),
      name: p.name,
    }));
  } catch {
    return [];
  }
}

export async function getPokemonDetail(idOrName: string | number): Promise<PokemonDetail | null> {
  try {
    const res = await fetch(`${POKEAPI_BASE}/pokemon/${String(idOrName).toLowerCase()}`);
    if (!res.ok) return null;
    const data = await res.json();

    const abilities = await Promise.all(
      data.abilities.map(async (item: any) => {
        try {
          const abRes = await fetch(item.ability.url);
          if (abRes.ok) {
            const abData = await abRes.json();
            const englishEntry = abData.effect_entries?.find((e: any) => e.language.name === 'en');
            return {
              is_hidden: item.is_hidden,
              slot: item.slot,
              ability: {
                name: item.ability.name,
                url: item.ability.url,
              },
              short_effect:
                englishEntry?.short_effect ||
                abData.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text ||
                '',
            };
          }
        } catch {
          // ignore ability fetch failure
        }
        return {
          is_hidden: item.is_hidden,
          slot: item.slot,
          ability: {
            name: item.ability.name,
            url: item.ability.url,
          },
        };
      })
    );

    // Keep only the most recent version details for each move to prevent oversized props
    const moves = data.moves.map((m: any) => {
      const latestVersion = m.version_group_details[m.version_group_details.length - 1];
      return {
        move: {
          name: m.move.name,
          url: m.move.url,
        },
        version_group_details: [
          {
            level_learned_at: latestVersion?.level_learned_at || 0,
            move_learn_method: {
              name: latestVersion?.move_learn_method?.name || 'level-up',
              url: latestVersion?.move_learn_method?.url || '',
            },
          },
        ],
      };
    });

    return {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      base_experience: data.base_experience || 0,
      types: data.types.map((t: any) => ({
        slot: t.slot,
        type: { name: t.type.name, url: t.type.url },
      })),
      stats: data.stats.map((s: any) => ({
        base_stat: s.base_stat,
        effort: s.effort,
        stat: { name: s.stat.name, url: s.stat.url },
      })),
      abilities,
      moves,
      sprites: {
        front_default: data.sprites.front_default || getArtworkUrl(data.id),
        front_shiny: data.sprites.front_shiny || null,
        other: {
          'official-artwork': {
            front_default: data.sprites.other?.['official-artwork']?.front_default || getArtworkUrl(data.id),
            front_shiny: data.sprites.other?.['official-artwork']?.front_shiny || null,
          },
        },
      },
      cries: {
        latest: data.cries?.latest || null,
        legacy: data.cries?.legacy || null,
      },
      species: {
        name: data.species.name,
        url: data.species.url,
      },
    };
  } catch (error) {
    console.error(`Error fetching detail for ${idOrName}:`, error);
    return null;
  }
}

export async function getPokemonSpecies(idOrName: string | number): Promise<PokemonSpeciesData | null> {
  try {
    const res = await fetch(`${POKEAPI_BASE}/pokemon-species/${String(idOrName).toLowerCase()}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      flavor_text_entries: (data.flavor_text_entries || []).filter((e: any) => e.language.name === 'en').slice(0, 3),
      genera: (data.genera || []).filter((g: any) => g.language.name === 'en'),
      color: data.color || { name: 'gray' },
      evolution_chain: data.evolution_chain || { url: '' },
    };
  } catch {
    return null;
  }
}

export async function getEvolutionChain(url: string): Promise<EvolutionStage[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();

    const stages: EvolutionStage[] = [];

    const traverseChain = (node: any) => {
      if (!node || !node.species) return;
      const id = getPokemonIdFromUrl(node.species.url);
      const evolutionDetail = node.evolution_details?.[0];

      stages.push({
        id,
        name: node.species.name,
        image: getArtworkUrl(id),
        min_level: evolutionDetail?.min_level ?? null,
        trigger_name: evolutionDetail?.trigger?.name ?? null,
        item_name: evolutionDetail?.item?.name ?? null,
      });

      if (node.evolves_to && node.evolves_to.length > 0) {
        node.evolves_to.forEach((child: any) => traverseChain(child));
      }
    };

    traverseChain(data.chain);
    return stages;
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    return [];
  }
}
