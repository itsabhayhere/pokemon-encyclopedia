export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
  short_effect?: string;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
  }[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  sprites: {
    front_default: string;
    back_default?: string | null;
    front_shiny?: string | null;
    other?: {
      'official-artwork'?: {
        front_default?: string | null;
        front_shiny?: string | null;
      };
      home?: {
        front_default?: string | null;
      };
      showdown?: {
        front_default?: string | null;
      };
    };
  };
  cries?: {
    latest?: string | null;
    legacy?: string | null;
  };
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
  image: string;
  types: string[];
  stats?: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}

export interface PokemonSpeciesData {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
  color: {
    name: string;
  };
  evolution_chain: {
    url: string;
  };
}

export interface EvolutionStage {
  id: number;
  name: string;
  image: string;
  min_level: number | null;
  trigger_name: string | null;
  item_name: string | null;
}
