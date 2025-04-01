export type NamedAPIResource = {
  name: string;
  url: string;
};

export type ResultList = {
  count: number;
  next: string;
  previous: string;
  results: Array<{ name: string; url: string }>;
};

export type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  forms: NamedAPIResource[];
  game_indices: VersionGameIndex[];
  held_items: PokemonHeldItem[];
  location_area_encounters: string;
  moves: PokemonMove[];
  past_types: PokemonTypePast[];
  sprites: PokemonSprites;
  cries: PokemonCries;
  species: NamedAPIResource;
  stats: PokemonStat[];
  types: PokemonType[];
};

export type PokemonAbility = {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
};

export type PokemonType = {
  slot: number;
  type: NamedAPIResource;
};

export type PokemonFormType = {
  slot: number;
  type: NamedAPIResource;
};

export type PokemonTypePast = {
  generation: NamedAPIResource;
  types: PokemonType[];
};

export type PokemonHeldItem = {
  item: NamedAPIResource;
  version_details: PokemonHeldItemVersion[];
};

export type PokemonHeldItemVersion = {
  version: NamedAPIResource;
  rarity: number;
};

export type PokemonMove = {
  move: NamedAPIResource;
  version_group_details: PokemonMoveVersion[];
};

export type PokemonMoveVersion = {
  move_learn_method: NamedAPIResource;
  version_group: NamedAPIResource;
  level_learned_at: number;
};

export type PokemonStat = {
  stat: NamedAPIResource;
  effort: number;
  base_stat: number;
};

export type PokemonSprites = {
  front_default: string;
  front_shiny: string;
  front_female: string;
  front_shiny_female: string;
  back_default: string;
  back_shiny: string;
  back_female: string;
  back_shiny_female: string;
};

export type PokemonCries = {
  latest: string;
  legacy: string;
};

export type VersionGameIndex = {
  game_index: number;
  version: NamedAPIResource;
};

// Incomplete
export type PokemonSpecies = {
  flavor_text_entries: FlavorText[];
  evolution_chain: { url: string };
};

export type FlavorText = {
  flavor_text: string;
  language: { name: string; url: string };
};

export type EvolutionChainResult = {
  chain: PokemonEvolutionChain;
};

// Incomplete
export type PokemonEvolutionChain = {
  evolves_to: PokemonEvolutionChain[];
  species: { name: string; url: string };
};
