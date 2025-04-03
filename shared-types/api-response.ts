export type PokemonListResult = {
  name: string;
  id: number;
  img: string;
};

export type PokemonDetailResult = {
  name: string;
  id: number;
  img: string;
  height: number;
  weight: number;
  flavorTexts: string[];
  stats: Stat[];
  types: Type[];
  evolutionChain: EvolutionChain;
};

export type Type = { id: number; name: string; icon: string };
export type Stat = { name: string; value: number };
export type EvolutionChain = {
  evolvesTo: EvolutionChain[];
  name: string;
  id: number;
  img: string;
};
